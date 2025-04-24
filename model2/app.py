from flask import Flask, request, render_template_string, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Ensure 'test.csv' and 'model.pkl' are in the same directory as this file
df = pd.read_csv('test.csv')

with open('model.pkl', 'rb') as f:
    model, le_concern, le_skin, le_product = pickle.load(f)

@app.route('/options', methods=['GET'])
def get_options():
    concerns = sorted(df['Skin Concern'].dropna().unique())
    skin_types = sorted(df['Skin Type'].dropna().unique())
    return jsonify({
        'concerns': concerns,
        'skin_types': skin_types
    })

@app.route('/', methods=['GET', 'POST'])
def index():
    concerns = sorted(df['Skin Concern'].dropna().unique())
    skin_types = sorted(df['Skin Type'].dropna().unique())
    recommendation = {}

    if request.method == 'POST':
        concern = request.form['concern']
        skin_type = request.form['skin_type']

        input_df = pd.DataFrame([[
            le_concern.transform([concern])[0],
            le_skin.transform([skin_type])[0]
        ]], columns=['Skin Concern', 'Skin Type'])

        pred_index = model.predict(input_df)[0]
        product_name = le_product.inverse_transform([pred_index])[0]

        row = df[df['Product Recommendation'] == product_name].iloc[0]

        recommendation = {
            'product_name': product_name,
            'ingredients': row['Ingredients'],
            'how_to_use': row['How to Use'],
            'tips': row['Tips']
        }

        return jsonify(recommendation)

    return render_template_string("""
    <html>
      <head><title>Skin Product Recommender</title></head>
      <body>
        <h2>Get a Skin Product Recommendation</h2>
        <form method="POST">
          <label>Skin Concern:</label>
          <select name="concern" required>
            <option value="">Select</option>
            {% for c in concerns %}
              <option value="{{ c }}">{{ c }}</option>
            {% endfor %}
          </select><br><br>
          
          <label>Skin Type:</label>
          <select name="skin_type" required>
            <option value="">Select</option>
            {% for s in skin_types %}
              <option value="{{ s }}">{{ s }}</option>
            {% endfor %}
          </select><br><br>
          
          <button type="submit">Recommend</button>
        </form>
        
        {% if recommendation %}
          <hr>
          <h3>Recommendation</h3>
          <p><strong>Product:</strong> {{ recommendation.product_name }}</p>
          <p><strong>Ingredients:</strong> {{ recommendation.ingredients }}</p>
          <p><strong>How to Use:</strong> {{ recommendation.how_to_use }}</p>
          <p><strong>Tips:</strong> {{ recommendation.tips }}</p>
        {% endif %}
      </body>
    </html>
    """, concerns=concerns, skin_types=skin_types, recommendation=recommendation)

if __name__ == '__main__':
    app.run(debug=True, port=5004)