#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "docs/ad-data-pivot-manifest.json"), "utf8"),
);
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS must point to a service-account JSON file.");
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
if (
  credentials.project_id !== manifest.firebase.project_id ||
  typeof credentials.client_email !== "string" ||
  typeof credentials.private_key !== "string"
) {
  throw new Error("Service-account credentials do not match the configured Firebase project.");
}

function base64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

const privateKeyHeader = ["-----BEGIN", "PRIVATE KEY-----"].join(" ");
const privateKeyFooter = ["-----END", "PRIVATE KEY-----"].join(" ");

async function accessToken() {
  const now = Math.floor(Date.now() / 1_000);
  const unsigned = [
    base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" })),
    base64Url(JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3_000,
    })),
  ].join(".");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(
      credentials.private_key
        .replaceAll(privateKeyHeader, "")
        .replaceAll(privateKeyFooter, "")
        .replace(/\s/gu, ""),
      "base64",
    ),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${base64Url(Buffer.from(signature))}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`OAuth exchange failed with status ${response.status}.`);
  }
  const body = await response.json();
  if (!body.access_token) throw new Error("OAuth exchange returned no access token.");
  return body.access_token;
}

function stringValue(value) {
  return { stringValue: value };
}

const projectId = manifest.firebase.project_id;
const database = `projects/${projectId}/databases/(default)`;
const writes = manifest.repositories.map(entry => ({
  update: {
    name: `${database}/documents/publicAggregates/${entry.repo}`,
    fields: {
      repo: stringValue(entry.repo),
      positioning: stringValue(entry.positioning),
      audience: stringValue(entry.audience),
      resourceUrl: stringValue(entry.central_resource_url),
      liveDemoUrl: stringValue(entry.live_demo_url),
      dataAsset: stringValue(entry.data_asset),
      sensitivityClass: stringValue(entry.sensitivity_class),
      updatedAt: { timestampValue: new Date().toISOString() },
    },
  },
  updateMask: {
    fieldPaths: [
      "repo",
      "positioning",
      "audience",
      "resourceUrl",
      "liveDemoUrl",
      "dataAsset",
      "sensitivityClass",
      "updatedAt",
    ],
  },
}));

const response = await fetch(
  `https://firestore.googleapis.com/v1/${database}/documents:commit`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ writes }),
  },
);
if (!response.ok) {
  throw new Error(`Firestore seed commit failed with status ${response.status}.`);
}

console.log(`Firebase aggregate catalog seeded: project=${projectId} documents=${writes.length}`);
