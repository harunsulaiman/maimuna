import os
import random

# We import the mini-programs you already wrote
from splitter import split_video
from face_cropper import crop_faces
from audio_processor import extract_audio_fingerprint
from judge import make_final_decision

def analyze_video(video_filename):
    print(f"--- STARTING SCAN ON: {video_filename} ---")
    
    # Step 1: Split the video into pictures and audio
    split_video(video_filename)
    
    # Step 2: Zoom in on the faces
    crop_faces()
    
    # Step 3: Extract the audio fingerprint
    # (Checking to make sure the audio file actually exists first)
    if os.path.exists("voice.wav"):
        extract_audio_fingerprint("voice.wav")
    
    print("\n--- AI GUARDS ARE THINKING ---")
    
    # Right now, because we haven't trained our massive AI models on thousands of videos yet,
    # we are going to simulate the guards giving us a score between 0.0 (Real) and 1.0 (Fake).
    # In Phase 2, we will swap these fake scores out for real AI predictions!
    
    simulated_visual_score = random.uniform(0.1, 0.9)
    simulated_audio_score = random.uniform(0.1, 0.9)
    
    print("\n--- HANDING SCORES TO THE JUDGE ---")
    
    # Step 4: The Judge makes the final call
    make_final_decision(simulated_visual_score, simulated_audio_score)

if __name__ == "__main__":
    # Make sure your sample.mp4 is still in the folder!
    analyze_video("sample.mp4")