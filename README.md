# 🧠 MedGenius – The AI Health Assistant

**MedGenius** is an AI-powered health assistant designed to help users understand their health better through intuitive features like symptom checking, medication insights, and smart medical report analysis. This project was developed as part of a health-tech hackathon to revolutionize digital health support for everyday users.

---

## 🚀 Features

### 🩺 1. Checkup Buddy
An AI-driven chat assistant that helps users identify potential health issues based on their symptoms.

- User enters symptoms in natural language.
- AI suggests possible conditions and gives actionable advice.
- Promotes awareness and encourages early doctor visits.

### 💊 2. MedInfo
Provides detailed information about medicines using AI.

- Get dosage guidelines, side effects, interactions, and more.
- Search by medicine name or category.
- Designed to help users make safe decisions with their prescriptions.

### 📄 3. Report Scanner
A smart document scanner that understands lab reports using OCR and AI.

- Upload a PDF/image of a lab report.
- Extracts key metrics and explains them in layman's terms.
- Supports various formats (CBC, lipid profile, etc.).

---

## 🧑‍💻 Tech Stack

| Frontend     | Backend         | AI & NLP Tools     | Others            |
|--------------|------------------|--------------------|-------------------|
| React.js     | Node.js / Express| OpenAI API         | Tailwind CSS      |
|              | MongoDB          | Custom NLP models  | Firebase (optional)|
|              |                  | OCR (Tesseract.js) | Cloudinary (if using image uploads) |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/medgenius.git
cd medgenius

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Run the app
npm run dev
