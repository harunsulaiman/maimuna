import librosa
import numpy as np

def extract_audio_fingerprint(audio_file):
    print(f"Listening to {audio_file}...")
    
    try:
        # 1. Load the audio file
        # 'sr=None' tells the tool to keep the original quality of the recording
        speech_signal, sample_rate = librosa.load(audio_file, sr=None)
        
        # 2. Extract the MFCC fingerprint from short segments of the audio
        print("Extracting vocal characteristics...")
        mfcc_features = librosa.feature.mfcc(y=speech_signal, sr=sample_rate, n_mfcc=40)
        
        # 3. Average the numbers out so the AI can read them easily
        fingerprint = np.mean(mfcc_features.T, axis=0)
        
        print("Success! Extracted a digital audio fingerprint:")
        print(fingerprint) # This prints the actual numbers the AI will look at
        
    except Exception as e:
        print(f"Oops, something went wrong: {e}")

if __name__ == "__main__":
    # Tell the script to examine the voice file we saved earlier
    extract_audio_fingerprint("voice.wav")