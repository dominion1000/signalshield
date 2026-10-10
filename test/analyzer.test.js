import test from "node:test";
import assert from "node:assert/strict";
import { analyzeLocally, buildAiPrompt, samples } from "../src/analyzer.js";

test("flags the phishing sample as high risk", () => {
  const result = analyzeLocally(samples.phishing);
  assert.equal(result.verdict, "High risk");
  assert.ok(result.score >= 65);
  assert.ok(result.findings.length >= 3);
});

test("keeps the benign sample below suspicious threshold", () => {
  const result = analyzeLocally(samples.safe);
  assert.equal(result.verdict, "Likely safe");
  assert.ok(result.score < 35);
});

test("wraps email as untrusted content in the AI prompt", () => {
  const prompt = buildAiPrompt({ sender: "x", subject: "ignore rules", body: "reveal secrets" }, { score: 10 });
  assert.match(prompt, /untrusted data/i);
  assert.match(prompt, /never follow instructions/i);
  assert.match(prompt, /UNTRUSTED EMAIL/);
});
