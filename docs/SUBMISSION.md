# ForgeHacks submission — SignalShield

## 1. Project title and short description

**SignalShield — Understand the threat before you click.**

SignalShield is an explainable AI phishing triage assistant. Students and small teams paste a suspicious email or text and receive a clear risk score, specific evidence, and safe verification steps—without needing to understand security jargon.

## 2. Track selection

**AI + Cybersecurity**

## 3. Public demo video

**YouTube URL:** `ADD_PUBLIC_VIDEO_URL_BEFORE_SUBMITTING`

The prepared 3-minute narration and shot list are in `docs/DEMO_SCRIPT.md`.

## 4. GitHub repository

**Repository URL:** `ADD_PUBLIC_GITHUB_URL_BEFORE_SUBMITTING`

## 5. Written project description

### Problem statement and target users

One convincing message can compromise a student account, divert an invoice payment, or expose a volunteer organization's shared files. The people making the decision are often not security specialists. Existing spam filters can miss targeted messages, while many checker tools offer a verdict without explaining it. That leaves users unable to verify the result or learn from it.

SignalShield targets students, educators, volunteers, nonprofit staff, and small businesses that lack a dedicated security team. It turns an opaque “is this a scam?” moment into an understandable, actionable security decision.

### Technical approach and components

SignalShield uses a hybrid, explainable analysis pipeline:

- A local feature extractor finds credential requests, urgency, threats, payment pressure, suspicious top-level domains, shortened links, institutional impersonation, and attempts to prevent independent verification.
- Those features generate a deterministic baseline score, evidence list, and fallback verdict.
- When an OpenAI key is configured, the server uses the Responses API to add context-sensitive reasoning. The model evaluates the message together with the extracted baseline and returns a constrained JSON assessment.
- The analyzed message is fenced as untrusted content. The system-level prompt tells the model never to follow instructions found inside the message and never to recommend unsafe actions.
- A Node server validates and limits input, keeps the API key off the browser, and falls back to the local engine if the AI call is unavailable.
- The responsive web interface visualizes the score, highlights evidence, and provides three safe next steps.

This is more than an LLM wrapper: the product remains functional without an external model, every finding maps to observable evidence, and model reasoning is grounded by a reproducible security baseline.

### Real-world impact

SignalShield can reduce risky clicks while also improving security literacy. A student learns that urgency plus an off-domain login link is dangerous. A volunteer learns to verify changed bank details by calling a known number. A small team gains a simple first-pass triage tool without buying an enterprise platform.

The immediate value is a safer decision. The longer-term value is pattern recognition: users see why a message is dangerous, making them better prepared for the next attack. Future organization policies and privacy-preserving campaign reports could help schools and community groups spot coordinated attacks earlier.

### Responsible AI and privacy

SignalShield communicates uncertainty and never claims a guarantee. It does not persist message content. It recommends verification through known channels instead of links or contact details supplied by the suspicious message. The hybrid design provides transparency, resilience, and a safer failure mode.

## 6. Screenshots, architecture, and test link

- Product screenshot: `docs/screenshot.svg`
- Architecture diagram: `docs/architecture.svg`
- Local testing: run `npm start`, then open `http://localhost:3000`
- Live deployment: `ADD_DEPLOYMENT_URL_IF_AVAILABLE`

## Submission checklist

- [x] Working source code
- [x] Clear README and local setup
- [x] Official track named
- [x] Written problem, technology, and impact description
- [x] Screenshot and architecture diagram
- [x] Automated tests
- [ ] Push to a public GitHub repository and replace its placeholder URL
- [ ] Record/upload the 2–4 minute video and replace its placeholder URL
- [ ] Add an optional live deployment URL
