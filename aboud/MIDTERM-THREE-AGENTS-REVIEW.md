# Aboud · Grade 2 English Mid-Term — Three Designer Challenge (2026-10-18)

## Active edition — 135 multiple-choice questions

**Live site entry:** [Aboud English Mid-Term: Three-Agent Challenge](./midterm-triple-challenge.html) (also linked from `aboud/index.html`).

This newer edition replaces the former three 40-question cards on the Aboud landing page. The previous 120-question version is retained as `midterm-three-challenges.html`, but is no longer the main entry.

### Exact source scope

- `Study Guide Grade 2 Mid-Term, Unit 2A`, p.1: 13 birthday/celebration vocabulary words and four adverbs of frequency (**always, usually, sometimes, never**) placed before the main verb.
- The same study guide, p.2: descriptive sentences following **The + noun + is + adjective**, with the specified pairs **big–huge**, **clean–tidy**, **beautiful–lovely**.
- `Activity Book`, pp.14–15: prepositions of place (**behind, between, in front of, next to**), locating neighborhood places and unscrambling **Where's / Where are** questions.
- `Activity Book`, pp.22–23: celebrations and birthday vocabulary, candle/balloon/piñata/wish/invite/give/light/open.
- `Activity Book`, pp.24–25: comparison stories and exercises (**Vick & Kira**, **Simon & Ryan**, **Nina & Alexa**).
- `Activity Book`, pp.26–27: the four frequency adverbs, correct sentence order and contexts.
- The separate Student's Book is available as supplementary teaching context, **not** a source for out-of-scope questions in this exam.

**Spelling editorial note:** The study guide appears to print *Ballon*, while the Activity Book uses *balloon(s)*. The quiz uses *balloon* following the illustrated workbook.

### Three design and mutual review roles

The word *agent* names three **editorial personas** in this production pass. It does **not** mean independent live language-model services are deployed in the browser or continuously rewriting tests.

| Form | Designer | Exam focus | Questions |
|---|---|---|---:|
| A | Agent Alpha, **المعلّم الدقيق** | clear definitions, word recognition, rule fundamentals | 45 |
| B | Agent Beta, **خبير تطبيقات الكتاب** | applying the workbook's locations, stories and sentence formats | 45 |
| C | Agent Gamma, **خبير تحديات الاختبار** | inference, similarities/differences and meaning-based choices | 45 |

Each form contains exactly: **12 vocabulary + 10 frequency grammar + 8 prepositions of place + 9 reading/comparison + 6 writing/synonyms = 45**.

#### Peer-review changes applied

1. Checked all three datasets for **135 uniquely phrased question stems**, four distinct choices, one indexed correct answer, and explanatory feedback.
2. Crosschecked each model's question source fields against the 10 allowed source-page references, and aligned the reading questions with the supplied children/balloons stories.
3. Changed nine repeated *generic* question prompts to precise grammatical prompts (for example, *Which sentence correctly places usually before reads?*).
4. Revised Model A's cupcake word-order question to ensure page **27** is represented in every model.
5. Randomized displayed question and answer choice order **per attempt**, so the indexed answer letter cannot be learned as an answer pattern. Correct-answer feedback stays hidden until the 45 questions are finished.
6. Integrated a browser-local score comparison and per-section weakness report. Previous attempts remain saved **only in the same browser**.

### Continuous automated quality gate

`node scripts/validate-aboud-midterm.js` is the structural reviewer. GitHub Actions runs it on relevant edits through `.github/workflows/validate-aboud-midterm.yml`.

This validator checks question count, distribution, option uniqueness, answer indices, explanatory text, exact-stem duplicates, allowed source-page links and landing-page integration. It **does not** independently evaluate pedagogy or replace careful human review of new material.

### Website behavior

- Select one of the three self-contained forms.
- One answer per question; **once chosen, it cannot be changed**.
- Answers are locked; scoring and correct-answer explanations reveal **only after all questions are answered and submitted**.
- Navigate and skip unanswered questions; progress is preserved using `localStorage`.
- Leaderboard uses the student's **best score** in each form (not an evaluation of autonomous agents).
- No AI API keys, paid voice dependency or server access are required.

**Limitation:** A multiple-choice test can check recognition of correct writing and synonyms, but does **not** test freehand copying or actual handwriting on English guidelines. Those need a separate writing exercise.

### Relevant files

- `aboud/midterm-triple-challenge.html` — main mobile-friendly interface
- `aboud/midterm-form-a.js`, `midterm-form-b.js`, `midterm-form-c.js` — question banks
- `aboud/midterm-challenge-app.js` — locked-answer test engine, storage and performance reports
- `scripts/validate-aboud-midterm.js` — structural quality assurance
- `.github/workflows/validate-aboud-midterm.yml` — recurring QA on changes

**Version:** upgraded 45-question edition, 18 October 2026.
