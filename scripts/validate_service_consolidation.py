#!/usr/bin/env python3
"""Validate commercial service consolidation coverage and safety boundaries."""
from __future__ import annotations
import json
from pathlib import Path
from typing import NoReturn
ROOT=Path(__file__).resolve().parents[1]
TRIAGE=ROOT/'docs/revenue-triage-2026-06-25.json'
MANIFEST=ROOT/'docs/service-consolidation-2026-06-25.json'
DOC=ROOT/'docs/service-consolidation-2026-06-25.md'
README=ROOT/'README.md'
FINAL_SUMMARY=ROOT/'docs/final-upgrade-polish-verification-2026-06-25.md'

def fail(msg:str)->NoReturn:
    raise SystemExit(f'service consolidation validation failed: {msg}')

def main()->None:
    triage=json.loads(TRIAGE.read_text())['repositories']
    data=json.loads(MANIFEST.read_text())
    if len(data.get('commercial_lanes',[])) < 4:
        fail('expected at least four commercial lanes')
    lane_ids={lane['id'] for lane in data['commercial_lanes']}
    decisions=data.get('repository_decisions',[])
    if len(decisions)!=len(triage):
        fail(f'expected {len(triage)} repository decisions, found {len(decisions)}')
    triage_repos=[r['repo'] for r in triage]
    decision_repos=[d['repo'] for d in decisions]
    if decision_repos!=triage_repos:
        fail('repository decisions must match triage order')
    primary=[d for d in decisions if d['exposure_state']=='primary-commercial']
    if len(primary) < 12:
        fail('not enough primary commercial repos')
    for d in decisions:
        lane=d.get('commercial_lane')
        if lane is not None and lane not in lane_ids:
            fail(f"unknown lane {lane} for {d['repo']}")
        if d['status']=='archived' and not (d['exposure_state'].startswith('archived') or d['exposure_state'].startswith('guarded')):
            fail(f"archived repo {d['repo']} must remain archived/guarded")
    text=DOC.read_text()
    for token in ['AIX Governance Sprint','StagePilot Reliability Lab','AegisOps Response Room','Nexus Data Contract Lab','Do not hard-delete code']:
        if token not in text:
            fail(f'missing doc token: {token}')
    summary=FINAL_SUMMARY.read_text()
    for token in ['Final Upgrade', 'npm audit --audit-level=high', '158 tests', 'Clean commit-message plan', 'Real payout/bank-account linking']:
        if token not in summary:
            fail(f'missing final summary token: {token}')
    readme=README.read_text()
    for rel in ['docs/service-consolidation-2026-06-25.md','docs/service-consolidation-2026-06-25.json','docs/final-upgrade-polish-verification-2026-06-25.md']:
        if rel not in readme:
            fail(f'README must link {rel}')
    print('service consolidation validation ok')
if __name__=='__main__':
    main()
