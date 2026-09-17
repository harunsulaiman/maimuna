import cv2
import os
from moviepy.editor import VideoFileClip

def split_video(video_name):
    # 1. Create a folder to hold our extracted pictures
    if not os.path.exists("pictures"):
        os.makedirs("pictures")

    print("Extracting the audio track...")
    
    # 2. Pull out the audio and save it as 'voice.wav'
    try:
        video = VideoFileClip(video_name)
        if video.audio is not None:
            video.audio.write_audiofile("voice.wav", verbose=False, logger=None)
            print("Audio saved successfully!")
        else:
            print("No audio found in this video.")
    except Exception as e:
        print(f"Could not extract audio: {e}")

    print("Extracting the pictures...")

    # 3. Read the silent video and save pictures one by one
    cam = cv2.VideoCapture(video_name)
    count = 0
    saved_count = 0

    while True:
        success, image = cam.read()
        if not success:
            break
            
        # We don't need every single tiny movement, so we save 1 picture every 15 frames 
        if count % 60 == 0:
            cv2.imwrite(f"pictures/frame_{saved_count}.jpg", image)
            saved_count += 1
            
        count += 1

    cam.release()
    print(f"Done! Saved {saved_count} pictures into the 'pictures' folder.")

# Start the process using our sample video
if __name__ == "__main__":
    split_video("sample.mp4")