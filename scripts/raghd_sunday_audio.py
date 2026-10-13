#!/usr/bin/env python3
"""Raghd Sunday Voice Studio: verified English Amy + Layla, full sentence recordings."""
import json
import os
import pathlib
import time
import urllib.error
import urllib.request

# Intentionally NOT Amy Cartwright, the earlier disliked voice.
VOICES = {
    "amy": "OZxMHsGaBmV5pjMIDIn0",      # Amy — Natural and Sweet, American English
    "layla": "WQhVGGVQ8EhNpBYHFE8c",    # Layla — Buttery smooth, American English
}
CLIPS = {
    "intro": "Hello, Raghd! Welcome to your Sunday Star Adventure! Today we will learn the letter N, living and non-living things, and numbers one to six. Let's have fun!",
    "letter-name": "Look! This is capital N, and this is small n. Say it with me. N! Small n!",
    "letter-sound": "The letter N makes the nnn sound. Nnn, nnn, nest. Your turn!",
    "word-nest": "Nest. N is for nest. Say the whole word: nest.",
    "word-nose": "Nose. N is for nose. Say the whole word: nose.",
    "word-net": "Net. N is for net. Say the whole word: net.",
    "word-nurse": "Nurse. N is for nurse. Say the whole word: nurse.",
    "word-nut": "Nut. N is for nut. Say the whole word: nut.",
    "word-nine": "Nine. N is for nine. Say the whole word: nine.",
    "living": "Living things are alive! A cat and a tree are living things.",
    "nonliving": "Non-living things are not alive. A chair and a car are non-living things.",
    "can-move": "Living things can move. Say it with me. Living things can move.",
    "can-grow": "Living things can grow. Say it with me. Living things can grow.",
    "can-eat": "Living things can eat and drink. Say it with me. Living things can eat and drink.",
    "can-breathe": "Living things can breathe. Say it with me. Living things can breathe.",
    "can-feel": "Living things can feel. Say it with me. Living things can feel.",
    "can-babies": "Animals can give birth or lay eggs. Say it with me. Animals can give birth or lay eggs.",
    "need-food": "Living things need food. Food gives us energy. Say: food!",
    "need-water": "Living things need water. Say: water!",
    "need-home": "Living things need a home. Say: home!",
    "number-1": "One. One! This is number one.",
    "number-2": "Two. Two! This is number two.",
    "number-3": "Three. Three! This is number three.",
    "number-4": "Four. Four! This is number four.",
    "number-5": "Five. Five! This is number five.",
    "number-6": "Six. Six! This is number six.",
    "question-living": "Look carefully at the picture. Is it a living thing, or a non-living thing? Say your answer!",
    "question-letters": "Look at the letters. Which one is N? Look carefully and choose!",
    "question-count": "Look carefully! Count all the pictures. How many do you see? Say the number!",
    "say-first": "First, look at the picture. Think about your answer. Now say the whole sentence, then reveal the answer.",
    "great": "Excellent work, Raghd! Your practice is making you stronger!",
    "try-again": "Good try, Raghd. Look carefully and try once more.",
    "finish": "Amazing job, Raghd! You finished your Sunday Star Adventure. I'm proud of your hard work!",
    "oral-question": "Look at this picture. Tell me one thing that living things can do. Use a full sentence.",
    "oral-needs": "Look at this picture. What do living things need? Tell me in a full sentence.",
    "oral-ready": "Are you ready, Raghd? Look at the picture. Tell your answer out loud. Then press Show Answer.",
    "number-write": "Look at the number. Say its name. Now write the number neatly with your finger.",
    "n-spot": "Find the capital N and the small n. Tap only the correct letters!",
    "quiz-ready": "Time for your Star Test! Listen carefully. Choose the correct answer. You can mark a question and come back later.",
    "reveal": "Now check your answer. Listen again, and repeat the complete sentence!",
    # Exact school-presentation wording, in its original page order.
    "slide-01": "Living and non living things.",
    "slide-02": "Living things can move.",
    "slide-03": "Living things can grow.",
    "slide-04": "Living things can eat and drink.",
    "slide-05": "Living things can breathe.",
    "slide-06": "Living things can give birth or lay eggs.",
    "slide-07": "Living things can feel.",
    "slide-08": "Living things need food.",
    "slide-09": "Living things need air.",
    "slide-10": "Living things need home.",
    "need-air": "Living things need air. Air helps living things breathe.",
}
# Every final-quiz Listen button now speaks its ACTUAL question, not a generic prompt.
QUESTIONS = [
    "Which one is capital N?",
    "Which one is small n?",
    "What word starts with the letter N? Look at the nest.",
    "What word starts with the letter N? Look at the nose.",
    "Which letter does the word nut begin with?",
    "Look at the dog. Is a dog living or non-living?",
    "Look at the car. Is a car living or non-living?",
    "Look at the tree. Is a tree living or non-living?",
    "Look at the chair. Is a chair living or non-living?",
    "Look at the butterfly. Is a butterfly living or non-living?",
    "Look at the rock. Is a rock living or non-living?",
    "Living things can do something. Can they move?",
    "Living things can do something. Can they grow?",
    "Living things need to eat and drink. What can they do?",
    "Living things can breathe. Which sentence is correct?",
    "Living things can feel. Which sentence is correct?",
    "Some animals give birth or lay eggs. Which sentence is correct?",
    "Which thing do living things need? Look at the food.",
    "Which thing do living things need? Look at the water.",
    "Which thing do living things need? Look at the home.",
    "How many stars can you count?",
    "How many apples can you count?",
    "How many flowers can you count?",
    "How many fish can you count?",
    "How many butterflies can you count?",
    "How many strawberries can you count?",
]
for index, question in enumerate(QUESTIONS, 1):
    CLIPS["quiz-%02d" % index] = question

OUTPUT = pathlib.Path("raghd/audio")

def generate(voice_name, voice_id, name, phrase, api_key):
    path = OUTPUT / ("sunday-" + voice_name + "-" + name + ".mp3")
    if path.exists() and path.stat().st_size > 700:
        print("Already recorded", voice_name, name, flush=True)
        return
    # Recreate the complete set for a new style, but do not generate an incomplete single clip.
    data = json.dumps({
        "text": phrase,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.62,
            "similarity_boost": 0.8,
            "style": 0.08,
            "speed": 0.87,
            "use_speaker_boost": True,
        }
    }).encode("utf-8")
    url = ("https://api.elevenlabs.io/v1/text-to-speech/"
           + voice_id + "?output_format=mp3_44100_128")
    for attempt in range(4):
        request = urllib.request.Request(
            url, data=data,
            headers={"xi-api-key": api_key, "Content-Type": "application/json",
                     "Accept": "audio/mpeg"}, method="POST")
        try:
            with urllib.request.urlopen(request, timeout=95) as reply:
                recording = reply.read()
            valid = len(recording) > 700 and (
                recording.startswith(b"ID3") or
                (len(recording) > 2 and recording[0] == 255 and
                 recording[1] & 224 == 224))
            if not valid:
                raise RuntimeError("Returned content is not a valid MP3")
            path.write_bytes(recording)
            print("Created", voice_name, name, len(recording), flush=True)
            return
        except (urllib.error.URLError, RuntimeError) as error:
            if attempt == 3:
                raise RuntimeError(
                    "Failed rendering %s / %s: %s" % (voice_name, name, error)) from error
            time.sleep(3 + attempt * 4)

def main():
    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("Missing ELEVENLABS_API_KEY Actions secret.")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    print("Rendering "+str(len(CLIPS))+" full-sentence clips in both Amy and Layla voices.", flush=True)
    for voice_name, voice_id in VOICES.items():
        for name, phrase in CLIPS.items():
            generate(voice_name, voice_id, name, phrase, api_key)
    print("Successfully rendered", len(VOICES)*len(CLIPS),
          "full ElevenLabs recordings.", flush=True)

if __name__ == "__main__":
    main()
