import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Import your processing functions here (once fully integrated)
# from splitter import split_video
# from face_cropper import crop_faces
# from audio_processor import extract_audio_fingerprint

app = Flask(__name__)
# Allow your Vercel frontend to communicate with this backend
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/detect', methods=['POST'])
def detect_deepfake():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
        
    file = request.files['video']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # --- YOUR AI PIPELINE GOES HERE ---
        # 1. split_video(filepath)
        # 2. crop_faces()
        # 3. audio_features = extract_audio_fingerprint("voice.wav")
        # 4. run models and calculate fusion score
        
        # Simulated response to test the connection immediately
        mock_response = {
            "name": filename,
            "visual": 82,
            "audio": 88,
            "fused": 85,
            "isFake": True
        }
        
        return jsonify(mock_response), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)