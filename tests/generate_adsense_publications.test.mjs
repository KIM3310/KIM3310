import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  resolveWorkspaceRoot,
  verificationInventory,
} from "../scripts/generate_adsense_publications.mjs";

function runGit(root, ...args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function writeFixture(root, relativeFile, content = "test source\n") {
  const file = path.join(root, relativeFile);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function temporaryGitRepository(t) {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "adsense-publication-inventory-"),
  );
  t.after(() => fs.rmSync(root, { force: true, recursive: true }));
  runGit(root, "init", "--quiet");
  return root;
}

test("verification inventory is sorted and limited to tracked test sources", (t) => {
  const root = temporaryGitRepository(t);
  const testFiles = Array.from(
    { length: 25 },
    (_unused, index) => `tests/test_${String(24 - index).padStart(2, "0")}.py`,
  );
  for (const file of testFiles) writeFixture(root, file);
  writeFixture(root, "internal/worker_test.go");
  writeFixture(root, "src/WidgetTest.java");
  writeFixture(root, "src/widget.spec.ts");
  writeFixture(root, "src/application.ts");
  writeFixture(root, ".github/workflows/zeta.yml", "name: zeta\n");
  writeFixture(root, ".github/workflows/alpha.yaml", "name: alpha\n");
  writeFixture(
    root,
    "package.json",
    `${JSON.stringify({ scripts: { build: "build", test: "test" } })}\n`,
  );
  writeFixture(root, "Makefile", "verify:\n\t@true\n\nlint:\n\t@true\n");
  runGit(root, "add", "--all");

  const inventory = verificationInventory(root);
  const expectedTests = [
    ...testFiles,
    "internal/worker_test.go",
    "src/WidgetTest.java",
    "src/widget.spec.ts",
  ]
    .sort()
    .slice(0, 20);
  assert.deepEqual(inventory, {
    tests: expectedTests,
    workflows: [
      ".github/workflows/alpha.yaml",
      ".github/workflows/zeta.yml",
    ],
    commands: ["npm run test", "npm run build", "make verify", "make lint"],
  });
  assert.deepEqual(verificationInventory(root), inventory);
});

test("cache, bytecode, coverage, build, and venv files cannot affect inventory", (t) => {
  const root = temporaryGitRepository(t);
  writeFixture(root, "tests/test_tracked.py");
  writeFixture(root, "src/worker.test.ts");
  runGit(root, "add", "--all");
  const baseline = verificationInventory(root);

  const artifacts = [
    "tests/__pycache__/test_tracked.cpython-313.pyc",
    "tests/__pycache__/test_false_source.py",
    "tests/test_bytecode.pyc",
    ".pytest_cache/tests/test_cached.py",
    ".venv310/lib/python3.13/site-packages/vendor/tests/test_vendor.py",
    "venv-3.12/lib/python3.12/site-packages/vendor/tests/test_vendor.py",
    ".env-py313/lib/python3.13/site-packages/vendor/tests/test_vendor.py",
    ".virtual-env-3.11/lib/python3.11/site-packages/vendor/tests/test_vendor.py",
    "python-env-3.13/lib/python3.13/site-packages/vendor/tests/test_vendor.py",
    "coverage/tests/test_coverage_output.py",
    "build/tests/bundle.test.js",
  ];
  for (const file of artifacts) writeFixture(root, file);
  writeFixture(root, "tests/test_untracked.py");
  assert.deepEqual(verificationInventory(root), baseline);

  for (const file of artifacts) runGit(root, "add", "--force", "--", file);
  writeFixture(root, "named-sandbox/pyvenv.cfg", "home = /usr/bin\n");
  writeFixture(root, "named-sandbox/tests/test_from_environment.py");
  runGit(root, "add", "named-sandbox");
  assert.deepEqual(verificationInventory(root), baseline);
});

test("workspace discovery follows the primary checkout from a linked worktree", (t) => {
  const workspace = fs.mkdtempSync(
    path.join(os.tmpdir(), "adsense-publication-workspace-"),
  );
  t.after(() => fs.rmSync(workspace, { force: true, recursive: true }));
  const primary = path.join(workspace, "KIM3310");
  const linked = path.join(workspace, "_worktrees", "profile-generator");
  fs.mkdirSync(primary, { recursive: true });
  runGit(primary, "init", "--quiet");
  runGit(primary, "config", "user.email", "test@example.invalid");
  runGit(primary, "config", "user.name", "Inventory Test");
  runGit(primary, "config", "commit.gpgsign", "false");
  writeFixture(primary, "README.md", "fixture\n");
  runGit(primary, "add", "README.md");
  runGit(primary, "commit", "--quiet", "-m", "fixture");
  fs.mkdirSync(path.dirname(linked), { recursive: true });
  runGit(
    primary,
    "worktree",
    "add",
    "--quiet",
    "-b",
    "inventory-linked-test",
    linked,
  );

  const options = { args: [], environment: {} };
  assert.equal(
    fs.realpathSync(resolveWorkspaceRoot(primary, options)),
    fs.realpathSync(workspace),
  );
  assert.equal(
    fs.realpathSync(resolveWorkspaceRoot(linked, options)),
    fs.realpathSync(workspace),
  );
  assert.equal(
    resolveWorkspaceRoot(linked, {
      args: ["--workspace-root", path.join(workspace, "override")],
      environment: {},
    }),
    path.join(workspace, "override"),
  );
});
