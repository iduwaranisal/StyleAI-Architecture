import os
import math
import numpy as np
import urllib.request
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# 1. Download the Face Landmarker Model automatically
model_path = "face_landmarker.task"
if not os.path.exists(model_path):
    print("Downloading MediaPipe Face Landmarker Model...")
    url = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
    urllib.request.urlretrieve(url, model_path)
    print("Download Complete!")

# 2. Initialize FastAPI app
app = FastAPI(title="Haircut Recommender API (MediaPipe v1.0+)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup MediaPipe Face Landmarker (New Tasks API)
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False,
    num_faces=1
)
detector = vision.FaceLandmarker.create_from_options(options)

# 4. Recommendation Logic
haircut_recommendations = {
    "Heart": [
        {"name": "Textured Fringe", "image": "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400", "reason": "Reduces the appearance of a wide forehead and balances the lower face."},
        {"name": "Side Part", "image": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400", "reason": "Provides a classic, well-balanced look that complements the facial structure."}
    ],
    "Oblong": [
        {"name": "Buzz Cut", "image": "https://images.unsplash.com/photo-1588771960251-82559a68d0af?w=400", "reason": "Keeps the profile tight and prevents the face from appearing any longer."},
        {"name": "Crew Cut", "image": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400", "reason": "Offers a clean, professional appearance without adding unnecessary volume on top."}
    ],
    "Oval": [
        {"name": "Pompadour", "image": "https://images.unsplash.com/photo-1506804886640-3af7b8022bbd?w=400", "reason": "Highlights the balanced proportions of a highly versatile face shape."},
        {"name": "Quiff", "image": "https://images.unsplash.com/photo-1520155707862-5b328153d109?w=400", "reason": "Adds stylish volume to the front while maintaining a neat, modern look."}
    ],
    "Round": [
        {"name": "High Skin Fade", "image": "https://images.unsplash.com/photo-1512803874677-6f021e1e97d1?w=400", "reason": "Short sides create the illusion of a narrower, more elongated face."},
        {"name": "Faux Hawk", "image": "https://images.unsplash.com/photo-1607519967262-67803a609d94?w=400", "reason": "Adds height to the top, minimizing the roundness of the facial features."}
    ],
    "Square": [
        {"name": "Classic Side Part", "image": "https://images.unsplash.com/photo-1593702295094-aea22597af65?w=400", "reason": "Softens the sharp, angular jawline for a refined look."},
        {"name": "French Crop", "image": "https://images.unsplash.com/photo-1623547146441-3b8e78eefd2e?w=400", "reason": "Frames the face perfectly with a modern, textured finish."}
    ]
}

# Helper function to calculate distance between two points
def calculate_distance(point1, point2):
    return math.hypot(point1.x - point2.x, point1.y - point2.y)

# 5. Geometric Classification Algorithm
def determine_face_shape(landmarks):
    top_of_head = landmarks[10]
    bottom_of_chin = landmarks[152]
    left_cheek = landmarks[234]
    right_cheek = landmarks[454]
    left_jaw = landmarks[132]
    right_jaw = landmarks[361]
    left_forehead = landmarks[103]
    right_forehead = landmarks[332]

    face_length = calculate_distance(top_of_head, bottom_of_chin)
    cheek_width = calculate_distance(left_cheek, right_cheek)
    jaw_width = calculate_distance(left_jaw, right_jaw)
    forehead_width = calculate_distance(left_forehead, right_forehead)

    length_to_width_ratio = face_length / cheek_width
    jaw_to_cheek_ratio = jaw_width / cheek_width
    forehead_to_cheek_ratio = forehead_width / cheek_width

    if length_to_width_ratio > 1.35:
        return "Oblong"
    if jaw_to_cheek_ratio > 0.85:
        return "Square"
    if forehead_to_cheek_ratio > 0.80 and jaw_to_cheek_ratio < 0.70:
        return "Heart"
    if length_to_width_ratio > 1.2 and jaw_to_cheek_ratio < 0.85:
        return "Oval"
    
    return "Round"

# 6. API Endpoint
@app.post("/predict")
async def predict_haircut(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        pil_image = Image.open(io.BytesIO(image_data)).convert('RGB')
        numpy_image = np.array(pil_image)
        
        # Create MediaPipe Image object
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=numpy_image)
        
        # Detect landmarks
        detection_result = detector.detect(mp_image)
        
        if not detection_result.face_landmarks:
            raise HTTPException(status_code=400, detail="No face detected in the image. Please upload a clear portrait.")
            
        # Get the first face's landmarks
        face_landmarks = detection_result.face_landmarks[0]
        predicted_shape = determine_face_shape(face_landmarks)
        
        return {
            "success": True,
            "face_shape": predicted_shape,
            "recommendations": haircut_recommendations.get(predicted_shape, [])
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}