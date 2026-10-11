# Sync Raghd's Layla audio

This repository includes a manual GitHub Actions workflow that updates the existing 14 audio paths used by Raghd's I and P lessons. It does not edit lesson HTML, exercises, or styling.

## One-time setup

1. In ElevenLabs, create an API key with access to generated-audio history.
2. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.
3. Add the secret named `ELEVENLABS_API_KEY`. Never paste the key into chat or commit it to the repository.
4. Find Layla's exact voice ID in the ElevenLabs voice settings.

## Each time you want to sync

1. Open **Actions → Sync Raghd Layla audio → Run workflow**.
2. Enter Layla's voice ID and choose **TTS** or **Flows**, matching where the clips were generated.
3. Run the workflow. It downloads exact-text matches for the 14 expected clips, replaces the MP3 files at their current URLs, increments the service-worker cache version, and commits the update.
4. If any expected clip is missing, the workflow stops without replacing any files. If multiple exact matches exist, it selects the newest one.

The voice ID is an input to the workflow and is not stored as a repository secret. The API key stays in GitHub Actions secrets.
