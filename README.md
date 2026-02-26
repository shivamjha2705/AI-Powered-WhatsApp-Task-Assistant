# 🤖 AI-Powered WhatsApp Task Assistant (RAG Pipeline)

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://business.whatsapp.com/)

A customized intelligent WhatsApp proxy chatbot built with Node.js and the Express framework. It integrates the **WhatsApp Business Cloud API** and utilizes **Google Gemini 1.5** via a Retrieval-Augmented Generation (RAG) pipeline to securely query and manage a user's task tracker hosted on Google Sheets.

## ✨ Key Features
* **Natural Language Processing:** Understands context and answers questions like "What tasks are pending for today?" and "Summarize my completed tasks."
* **RAG Implementation:** Dynamically retrieves context from a live Google Sheet and injects it into the Gemini LLM prompt to heavily reduce hallucinations and personalize responses. 
* **Real-time Webhook:** Secure ingestion of incoming WhatsApp messages with automatic verification.
* **Intelligent Routing:** Pre-processes user intent before forwarding queries to the Language Model.

---

## 📸 Screenshots & Evidence

> **Note to Recruiters:** The screenshots and GIFs below demonstrate live interactions with the WhatsApp Bot, proving successful API integration, dynamic intent classification, and real-time generation.

### 1. Conversational Query & RAG Retrieval

<img width="1350" height="672" alt="Image" src="https://github.com/user-attachments/assets/11adc9d5-4b01-4994-a36b-f8be967a031e" />

<img width="1172" height="494" alt="Image" src="https://github.com/user-attachments/assets/5ed9c69d-c689-41e3-a418-19b19c65a273" />

### 2. Task Summarization

<img width="903" height="200" alt="Image" src="https://github.com/user-attachments/assets/d78a3112-b678-4ea0-aa48-40914db81040" />

### 3. Server Webhook Logging (Backend Proof)

<img width="1135" height="625" alt="Image" src="https://github.com/user-attachments/assets/f1b7cd9f-6eed-4613-8c07-4efea05aa7fd" />
'
### 🎥 Live Demo Video
[🔗 Watch the full 2-minute Loom/YouTube demo recording here](<YOUR_VIDEO_URL_HERE>)
'
---

## 🧠 Architecture Overview

The system acts as a middleware bridging the user's WhatsApp channel with their personal data and an LLM.

1. **User** sends a message on WhatsApp.
2. **WhatsApp Cloud API** triggers a Webhook push to our Node.js Server.
3. **Express.js Server** validates the payload and extracts the user's text.
4. **Google Sheets Service** fetches the raw task data from the user's tracker.
5. **Gemini Service** combines the user's prompt + the fetched Google Sheets data (RAG context).
6. **Gemini 1.5 Flash** generates a helpful, accurate text response based on the dataset.
7. **WhatsApp API** routes the newly generated text back to the User's chat interface.

---

## 🛠️ Technologies & Tools
- **Backend Core:** Node.js, Express.js
- **Artificial Intelligence:** `@google/generative-ai` (Gemini 1.5 Flash)
- **APIs:** WhatsApp Business Cloud API, Google Sheets API
- **HTTP Client:** Axios
- **Environment Management:** `dotenv`

---

## 🚀 Setup & Installation (Local Development)

### Prerequisites
- Node.js installed
- A Meta Developer Account (for WhatsApp API credentials)
- Google Cloud Console access (for Gemini API Key & Google Sheets API credentials)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-rag-whatsapp-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following:
   ```env
   # WhatsApp Webhook Setup
   WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_id
   WHATSAPP_ACCESS_TOKEN=your_temporary_or_permanent_token

   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Google Sheets API
   GOOGLE_SHEETS_DOCUMENT_ID=your_sheet_id
   # (Ensure you also have your service account JSON configured for the Google Sheets API)
   ```

4. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Or standard start
   npm start
   ```

---

