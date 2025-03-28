This project focuses on counterfeit currency detection using deep learning, specifically leveraging the VGG19 model for image classification. The model is trained on a dataset consisting of 1200 real and 1300 fake ₹500 currency notes, enabling it to accurately differentiate between genuine and counterfeit notes.

Features Deep Learning-Based Detection:
Uses the VGG19 convolutional neural network for feature extraction and classification.


Dataset: A custom dataset with labeled real and fake currency images.


Pretrained Model:
Utilizes transfer learning with VGG19 for improved accuracy.


Web Application: 
A user-friendly web interface where users can upload a currency image for real-time detection.


Pickle Model Integration: 
The trained model is saved as "ensemble_learning.pkl" for easy deployment.


Technologies Used:
Python (TensorFlow, Keras, OpenCV, NumPy, Pandas)

Flask (for web app integration)

VGG19 Model (pretrained on ImageNet)

Usage
Clone the repository

Install dependencies (pip install -r requirements.txt)

Run the Flask app (python app.py)

Upload an image to check if the note is real or fake

