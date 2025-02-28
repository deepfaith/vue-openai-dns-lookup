# Vue 3 + Vite + Vuetify + Firebase Cloud Functions

This project is a Vue 3 application using Vite and Vuetify for the frontend and Firebase Cloud Functions for the backend. It integrates OpenAI's chat functionality to recognize domain names entered by users, then fetches domain information using the [WhoisXML API](https://www.whoisxmlapi.com/whoisserver/WhoisService). The project uses Firebase Firestore as the database.

## Features
- Users can enter a domain name via chat with OpenAI.
- The application detects and extracts the domain name.
- The application stores the chat history in Firebase Firestore.
- The backend queries the WhoisXML API for domain details.
- Results are displayed in the frontend.

## Tech Stack
### Frontend
- Vue 3
- Vite
- Vuetify
- OpenAI API (for domain name recognition)

### Backend
- Firebase Cloud Functions
- Firebase Firestore
- OpenAI API
- Express.js
- WhoisXML API (for domain lookup)

## Setup Instructions
### Prerequisites
- Node.js (>= 16)
- Firebase CLI
- Vue CLI
- A WhoisXML API key
- An OpenAI API key

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/deepfaith/vue-openai-dns-lookup.git
   cd vue-openai-dns-lookup
   ```
2. **Install frontend dependencies:**
   ```sh
   yarn install
   ```
3. **Install backend dependencies:**
   ```sh
   cd ../backend
   yarn install
   ```

### Environment Variables
Create a `.env` file in the `frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_WHOIS_API_KEY=your_whois_api_key
```
## IMPORTANT
Please use the .env below as the APIs are hosted  on my cloud functions since I need to encrypt the openAI key.
I've set the firestore rule expiry date to access the firestore database until April 2025
```env
  VITE_FIREBASE_API_KEY=AIzaSyDd-Xy5zqteDDX9PGBqz4L7NJvB5lWeZBM
  VITE_FIREBASE_PROJECT_ID=manuscriptr-dev
  VITE_FIREBASE_STORAGE_BUCKET=manuscriptr-dev.appspot.com
  VITE_FIREBASE_SENDER_ID=127339513256
  VITE_FIREBASE_APP_ID=1:127339513256:web:19fd0bbd2c94b28eaac99d
  VITE_WHOIS_API_KEY=at_9lJSRGKAUsRxramy7h0pXsm8AnOJ9
```

### Running the Application
1. **Start Firebase emulators (optional, for local testing):**
   ```sh
   firebase emulators:start
   ```
2. **Deploy Firebase Cloud Functions:**
   ```sh
   firebase deploy --only functions
   ```
3. **Start the frontend:**
   ```sh
   yarn vite
   ```

### Firebase Setup
1. **Initialize Firebase:**
   - If you haven't already, initialize Firebase in your project:
     ```sh
     firebase init
     ```
   - Select "Firestore" and "Functions" during the initialization process.
2. **Enable Firestore:**
   - Go to the Firebase console and enable Firestore in your project.

## API Endpoints
### Cloud Function (Domain Lookup)
**Endpoints:**
- converseWithOpenAI
- domainLookUpWhoIs

## License
This project is licensed under the MIT License.

## Contributors
- Alan Padiernos

