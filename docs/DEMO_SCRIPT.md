# SignalShield — 3-minute demo script

Target length: **2:45–3:15**. Record the browser at 1080p. Keep the pointer visible and zoom at 100%.

## 0:00–0:25 — The problem

**On screen:** SignalShield hero.

“Phishing does not only target large companies. One urgent message can steal a student's account or redirect a small organization's payment. The person deciding whether to click usually has no security training, and a red warning badge does not explain enough. We built SignalShield to make that decision understandable.”

## 0:25–0:45 — The solution

**On screen:** Scroll slightly to show the analyzer and the three trust labels.

“SignalShield is an explainable AI phishing triage assistant in the AI plus Cybersecurity track. You paste a suspicious email or text. It gives you a risk score, shows the evidence, and tells you how to verify safely. There is no sign-up, and messages are not stored.”

## 0:45–1:30 — High-risk demo

**On screen:** Click **Phishing alert**, then **Analyze message**.

“Here is a common campus phishing message. It impersonates IT, threatens account suspension, asks for a password, creates a two-hour deadline, and hides its destination with a short link. SignalShield scores it as high risk. More importantly, it explains every signal and recommends that I avoid the link, use a known university website or phone number, and report the message.”

## 1:30–1:55 — Contrast with a safe message

**On screen:** Click **Clear**, **Safe reminder**, and **Analyze message**.

“A useful security tool also needs restraint. This library reminder does not pressure the user or provide a suspicious link, so it stays in the likely-safe range while still reminding us to verify unexpected requests.”

## 1:55–2:35 — How the AI works

**On screen:** Scroll to “More than a black-box verdict,” then briefly show `docs/architecture.svg` or the README diagram.

“Under the hood, a local model extracts explainable signals from language, links, sender identity, and coercion patterns. With an OpenAI key enabled, a language model adds a context-aware second opinion using a constrained JSON response. The message is explicitly treated as untrusted data, which helps defend against prompt injection. If the AI service is unavailable, the local analyzer keeps working, so this is not just a thin chatbot wrapper.”

## 2:35–3:00 — Impact and close

**On screen:** Return to the result and safe actions.

“The immediate impact is fewer risky clicks. The longer-term impact is security literacy: users learn the pattern behind the warning and are better prepared next time. SignalShield gives schools, nonprofits, and small teams a practical first line of defense. Understand the threat before you click.”

## Before uploading

- Replace placeholder repository and video links in `docs/SUBMISSION.md`.
- Keep the final video under 4 minutes.
- Upload as public or unlisted, then test the URL in a private browser window.
- Avoid showing an API key, terminal environment variables, notifications, or personal bookmarks.
