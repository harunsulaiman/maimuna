def make_final_decision(visual_score, audio_score):
    print(f"Visual AI Score: {visual_score * 100}% fake")
    print(f"Audio AI Score: {audio_score * 100}% fake")
    
    # We give equal importance (50/50) to both the face and the voice
    visual_weight = 0.5
    audio_weight = 0.5
    
    # Calculate the final combined score
    fused_score = (visual_weight * visual_score) + (audio_weight * audio_score)
    
    print(f"\nFinal Fused Score: {fused_score * 100}%")
    
    # If the combined score is 50% or higher, it's a deepfake
    if fused_score >= 0.50:
        print("FINAL VERDICT: FAKE VIDEO DETECTED 🚨")
    else:
        print("FINAL VERDICT: REAL VIDEO ✅")

if __name__ == "__main__":
    # Let's test it with a scenario where the face looks real, but the voice is cloned
    print("--- Test Scenario: Real Face, Cloned Voice ---")
    make_final_decision(visual_score=0.20, audio_score=0.79)