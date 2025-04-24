from flask import Flask, request, jsonify, render_template, redirect, make_response
from flask_socketio import SocketIO
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'  # Keep your secret key safe in production

# Enable CORS for the React frontend running on localhost
CORS(app, origins=["http://localhost:5173"])  # React frontend origin

# Initialize SocketIO with CORS configuration for the frontend
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])

# Load ResNet50 model
num_classes = 23
model = models.resnet50(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load('models/skin_disease_model.pth', map_location=torch.device('cpu')))
model.eval()

# Define image transform for pre-processing
transform = transforms.Compose([
    transforms.Resize((150, 150)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Class labels (you can modify these according to your model)
class_labels = {
    0: 'Acne and Rosacea',
    1: 'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions',
    2: 'Atopic Dermatitis',
    3: 'Bullous Disease',
    4: 'Cellulitis Impetigo and other Bacterial Infections',
    5: 'Eczema',
    6: 'Exanthems and Drug Eruptions',
    7: 'Hair Loss Alopecia and other Hair Diseases',
    8: 'Herpes HPV and other STDs',
    9: 'Light Diseases and Disorders of Pigmentation',
    10: 'Lupus and other Connective Tissue diseases',
    11: 'Melanoma Skin Cancer Nevi and Moles',
    12: 'Nail Fungus and other Nail Disease',
    13: 'Poison Ivy and other Contact Dermatitis',
    14: 'Psoriasis Lichen Planus and related diseases',
    15: 'Scabies Lyme Disease and other Infestations and Bites',
    16: 'Seborrheic Keratoses and other Benign Tumors',
    17: 'Systemic Disease',
    18: 'Tinea Ringworm Candidiasis and other Fungal Infections',
    19: 'Urticaria Hives',
    20: 'Vascular Tumors',
    21: 'Vasculitis',
    22: 'Warts Molluscum and other Viral Infections'
}

# Prediction helper function
def predict_skin_disease(image_path):
    try:
        img = Image.open(image_path).convert('RGB')
        img = transform(img).unsqueeze(0)
        with torch.no_grad():
            outputs = model(img)
            _, predicted = torch.max(outputs, 1)
        return class_labels[predicted.item()]
    except Exception as e:
        return f"Error processing image: {str(e)}"

# React API route to handle image upload and analysis
@app.route('/api/submit', methods=['POST'])
def submit_from_react():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    # Validate image
    if not file or not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return jsonify({'error': 'Invalid image format. Use .png, .jpg, or .jpeg'}), 400

    skin_issues = request.form.get('skinIssues', '')  # Match React's field name
    # Note: skinType is not sent from React, so we won't use it here

    # Save the uploaded image
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    filepath = os.path.join('uploads', file.filename)
    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({'error': f'Failed to save image: {str(e)}'}), 400

    # Predict skin disease
    prediction = predict_skin_disease(filepath)
    if 'Error' in prediction:
        return jsonify({'error': prediction}), 400

    disease_message = f"Our analysis suggests you may have {prediction}"
    if skin_issues:
        disease_message += f" and issues ({skin_issues})."

    return jsonify({
        'message': 'Analysis complete.',
        'disease': disease_message  # Use 'disease' to match React's setDisease
    })

# Optional browser test route for file upload (non-API endpoint)
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file:
            file_path = os.path.join('uploads', file.filename)
            file.save(file_path)
            prediction = predict_skin_disease(file_path)
            return render_template('result.html', prediction=prediction)
    return render_template('upload.html')

# Handle favicon to suppress 404
@app.route('/favicon.ico')
def favicon():
    return make_response('', 204)

# SocketIO events (real-time functionality, optional for now)
@socketio.on('connect')
def handle_connect():
    print('🔌 Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('❌ Client disconnected')

# Run the app
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    socketio.run(app, debug=True, port=5003)