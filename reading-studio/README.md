# Kids Reading Studio — Approved Reading Lesson Standard (v1)

Use this standard for ALL future reading lessons for Aboud, Sakinah and Raghd. Source of truth: this repository; do not recreate the UI from scratch.

## Workflow
1. Transcribe the supplied reading passage EXACTLY and confirm page/source coverage. Do not silently omit or paraphrase.
2. Split into complete sentences (or short meaningful units), preserving punctuation, and assign a stable ID to each sentence.
3. Create original cohesive child-friendly cartoon illustrations with consistent characters. One relevant scene per sentence when practical. No emoji-only substitute. Avoid text embedded in artwork (editable lesson text stays HTML).
4. Crop/export individual illustrations to WebP, preferably >= 800px wide for zoom. Name deterministically: scene-01.webp, scene-02.webp, etc. Produce a contact sheet and ZIP suitable for Files app on iPhone. If the GitHub connector cannot upload binaries, be transparent and provide the ZIP with concise upload instructions. Never claim upload before verifying GitHub files.
5. Put images in the SAME lesson folder as index.html or a documented images/ folder. Check all image paths on GitHub before announcing completion.
6. Reuse reading-studio/lesson-template.html (copy to each child's section) and change the STORY config; do not rebuild navigation or progress logic.
7. Reader view: click image or Zoom => large image + exact sentence + Previous + Read + Next + Close, page count. Preserve position, swipe gestures and arrow keys, and handle boundaries.
8. Every sentence has Listen/Read, Zoom, I Practiced, and Needs Practice. Persist progress with localStorage using a unique lesson ID, support mistakes review, and never mark completion just for opening.
9. Voice: prefer actual free Kokoro recordings, with verified available voices and slow/normal/fast playback. No ElevenLabs paid service; no automatic browser TTS fallback. Missing MP3 should show an honest unavailable status. Voice controls should not claim to work without uploaded recordings.
10. Responsive, English LTR for English text, tablet-friendly, accessible focus/buttons, no intrusive extra text, and offline-friendly assets where possible.
11. Publish in the OLD repo Anesthesiologist20/kids-learning unless explicitly asked for Kids Learn 2. Add the page to the correct child's index, verify deployed links, image URLs, audio files, and interaction.
12. Provide exact live URL, what was actually published, and what remains incomplete.

## Additional approved improvements
- Focus mode in Zoom, swipe left/right, keyboard navigation.
- Read-all sequential playback only when all audio clips exist.
- Replay the same sentence, progress counter, Review Needed queue.
- Optional comprehension questions and rewards AFTER the reading.
- Preserve original reading text and all illustrations when revising unless user specifically requests deletion.

## Template contract
Copy `reading-studio/lesson-template.html` to a new lesson URL. Set `LESSON.id`, `LESSON.title`, `LESSON.scenes` (each {text,image,audio?}), and `LESSON.voices` (verified only). Images are relative to the lesson HTML. Audio URLs may use {voice} placeholder. A sentence with no audio displays an explicit unavailable notice. The sample is a DEMO; never treat its placeholder assets as uploaded.
