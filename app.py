import webbrowser
import threading
import os
import uuid  # For unique filenames
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import logging  # For debugging

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Set up logging
logging.basicConfig(level=logging.DEBUG)
app.logger.info("Starting Flask app...")

# Load the model
MODEL_PATH = "models/VGG19_model_FR.h5"
app.logger.info(f"Looking for model at: {MODEL_PATH}")
model = load_model(MODEL_PATH)
app.logger.info("✅ Model loaded successfully!")

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # Resize to match model input
    img_array = image.img_to_array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Route for homepage
@app.route("/")
def home():
    return render_template("index.html")

# Route for making predictions
@app.route("/predict", methods=["POST"])
def predict():
    app.logger.debug("Received POST request to /predict")
    app.logger.debug("Request files: %s", request.files)

    if "file" not in request.files:
        app.logger.debug("No 'file' key in request.files")
        return jsonify({"error": "No file uploaded!"}), 400

    file = request.files["file"]
    app.logger.debug("File object: %s, Filename: %s", file, file.filename)
    if file.filename == "":
        app.logger.debug("Empty filename")
        return jsonify({"error": "No selected file!"}), 400

    # Save the uploaded file with a unique name
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    img_path = os.path.join("static", filename)
    file.save(img_path)
    app.logger.debug("File saved at: %s", img_path)

    try:
        # Preprocess and make prediction
        img_array = preprocess_image(img_path)
        predictions = model.predict(img_array)
        predicted_class_idx = np.argmax(predictions, axis=1)[0]
        class_labels = ['Fake', 'Real']  # Same as reference code
        result = class_labels[predicted_class_idx]
        app.logger.debug("Prediction result: %s", result)

        return jsonify({"prediction": result})
    except Exception as e:
        app.logger.error("Prediction error: %s", str(e))
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

# Function to open the browser automatically (only once)
def open_browser():
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":  # Prevent double opening
        webbrowser.open_new("http://127.0.0.1:5000")

if __name__ == "__main__":
    threading.Timer(1.5, open_browser).start()  # Open browser after delay
    app.run(debug=True)