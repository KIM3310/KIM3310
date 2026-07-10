# Business Operations Plan

This checklist translates the repository's current product and operating docs into concrete launch tasks. It is planning guidance, not legal, tax, or financial advice.

## Commercial position

- Commercial role: **product portfolio front door**
- Monetization path: **lead-gen portfolio front door**
- Secondary path: **public product demonstration**
- Repository visibility: **public**

## Deployment lane: artifact-or-api-demo

- Treat as package/notebook/API demo until a deployable service boundary is documented.
- Publish docs, screenshots, and sample outputs first; deploy APIs only after auth, rate-limit, and privacy review.

## Payment lane: lead-capture-no-direct-checkout

- Use booking/contact CTA first; route buyers to specific offers rather than charging from the portfolio index.
- Track qualified leads manually until a CRM/contact pipeline is approved.

## Privacy and data lane: privacy-standard-minimize-data

- Inventory personal data, customer data, logs, analytics identifiers, uploaded files, and model prompts before launch.
- Collect the minimum data needed; define retention, deletion, access control, incident response, and data export/deletion request handling.
- Publish a plain-language privacy policy before collecting contact, analytics, payment, or uploaded-file data; this draft is not legal advice.

## Customer support lane: pilot-support-sla

- Create one support inbox/alias and a private customer tracker before paid pilot starts.
- Promise only a conservative SLA: paid pilot first response within 1 business day; free/demo best effort.
- Use GitHub Issues for public bugs only; keep customer data out of public issues.

## Launch blockers that must stay explicit

- Activate payment only after account ownership, KYC, tax, refund, and support terms are confirmed.
- Privacy policy/terms/refund language requires owner/legal review before customer data or money collection.
- Assign an owner for production deployment, domain/DNS, analytics, and support-channel changes before launch.

## Pre-launch checklist

- [ ] Run the repo-specific verification command before release.
- [ ] Run a redacted secret scan before release and resolve or document any findings.
- [ ] Public copy avoids revenue guarantees and unsupported legal/medical/financial/security claims.
- [ ] Privacy policy, terms/refund policy, and support scope are approved by the owner before publication.
- [ ] Payment account/KYC/tax configuration is complete before accepting money.
- [ ] Support inbox, escalation owner, response window, and customer-data handling are ready.
- [ ] Production deployment, custom domain/DNS, analytics, and email capture have named owners and rollback plans.

## Support macros

- **Bug intake:** ask for environment, reproduction steps, expected/actual result, logs with secrets removed, and impact level.
- **Paid pilot intake:** capture buyer, use case, data sensitivity, success metric, deadline, access constraints, and decision owner.
- **Refund/escalation:** acknowledge within the promised support window, preserve the order/customer reference privately, and escalate policy exceptions to the owner.
- **Data request:** verify requester identity through the approved support channel, avoid public issue threads, and log deletion/export actions.

## Sources checked

- Stripe Payment Links: https://docs.stripe.com/payment-links
- Stripe create payment link: https://docs.stripe.com/payment-links/create
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Cloudflare Pages Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- FTC Privacy and Security: https://www.ftc.gov/business-guidance/privacy-security
- FTC Protecting Personal Information: https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business
