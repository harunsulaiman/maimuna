import os
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import the master checker script you wrote earlier
from master_checker import analyze_video 

app = Flask(__name__)
# CORS allows your Next.js frontend (port 3000) to talk to this Python server (port 5000)
CORS(app) 

@app.route("/api/detect", methods=["POST"])
def detect_deepfake():
    # 1. Check if a video was actually sent
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
        
    video_file = request.files["video"]
    
    if video_file:
        # 2. Save the video temporarily
        filepath = "uploaded_video.mp4"
        video_file.save(filepath)
        
        print("\n--- NEW VIDEO RECEIVED FROM FRONTEND ---")
        
        # 3. Trigger your ML pipeline (demultiplex, face crop, MFCC extraction)
        analyze_video(filepath)
        
        # 4. Generate the probability scores
        # (These are simulated until you train your final CNN-LSTM and MFCC models)
        visual_score = random.uniform(0.1, 0.9)
        audio_score = random.uniform(0.1, 0.9)
        fused_score = (0.5 * visual_score) + (0.5 * audio_score)
        
        # 5. Send the exact data structure your frontend is expecting back
        return jsonify({
            "visual": round(visual_score * 100, 1),
            "audio": round(audio_score * 100, 1),
            "fused": round(fused_score * 100, 1),
            "isFake": fused_score >= 0.50
        })

if __name__ == "__main__":
    print("Python ML API is running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)