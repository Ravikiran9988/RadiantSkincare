import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle

df = pd.read_csv('test.csv')
df = df.dropna(subset=['Skin Concern', 'Skin Type', 'Product Recommendation'])

le_concern = LabelEncoder()
le_skin = LabelEncoder()
le_product = LabelEncoder()

X = pd.DataFrame({
    'Skin Concern': le_concern.fit_transform(df['Skin Concern']),
    'Skin Type': le_skin.fit_transform(df['Skin Type'])
})
y = le_product.fit_transform(df['Product Recommendation'])

model = RandomForestClassifier()
model.fit(X, y)

with open('model.pkl', 'wb') as f:
    pickle.dump((model, le_concern, le_skin, le_product), f)

print("✅ Model trained and saved.")
