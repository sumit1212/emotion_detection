from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import tensorflow as tf
import base64

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pretrained emotion model
model = tf.keras.models.load_model("emotion_cnn_model.h5", compile=False)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

@app.post("/predict")
async def predict_emotion(file: UploadFile = File(...)):
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Convert to grayscale and detect face
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        return {"emotion": "No face detected", "image": None}

    # Use the first detected face
    x, y, w, h = faces[0]
    face = img[y:y+h, x:x+w]
    face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    face_resized = cv2.resize(face_gray, (64, 64))
    face_normalized = face_resized / 255.0
    face_input = face_normalized.reshape(1, 64, 64, 1)

    # Predict emotion
    prediction = model.predict(face_input)
    emotion_idx = np.argmax(prediction)
    emotion = emotion_labels[emotion_idx]

    # Convert processed face to JPEG and encode to base64
    _, buffer = cv2.imencode('.jpg', face)
    img_base64 = base64.b64encode(buffer).decode("utf-8")
    
    return {
        "emotion": emotion,
        "image": img_base64
    }
