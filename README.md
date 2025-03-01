# Vue 3 + Vite + Vuetify + Firebase Cloud Functions

This project is a Vue 3 application built with Vite and Vuetify for the frontend, and Firebase Cloud Functions for the backend. It integrates OpenAI's chat functionality to recognize domain names entered by users and then fetches domain information using the [WhoisXML API](https://www.whoisxmlapi.com/whoisserver/WhoisService). The project uses Firebase Firestore as the database.

## Features

-   Users can enter a domain name via a chat interface powered by OpenAI.
-   The application intelligently detects and extracts the domain name from the user's input.
-   The application stores the chat history in Firebase Firestore, ensuring data persistence.
-   The backend queries the WhoisXML API for comprehensive domain details.
-   Results are neatly displayed in the frontend for user review.

## Tech Stack

### Frontend

-   Vue 3
-   Vite
-   Vuetify
-   OpenAI API (for domain name recognition and chat interaction)

### Backend

-   Firebase Cloud Functions
-   Firebase Firestore
-   OpenAI API
-   Axios (for HTTP requests)
-   WhoisXML API (for domain lookup)

## Setup Instructions

### Prerequisites

-   Node.js (>= 16)
-   Firebase CLI
-   Vue CLI
-   A WhoisXML API key (you'll need to create an account and obtain this)
-   An OpenAI API key (you'll need to create an account and obtain this)
-   A Google Cloud Project with Firebase enabled.
-  Google Cloud SDK

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/deepfaith/vue-openai-dns-lookup.git
    cd vue-openai-dns-lookup
    ```

2.  **Install frontend dependencies:**

    ```sh
    yarn install
    ```

3.  **Install backend dependencies:**

    ```sh
    cd backend
    yarn install
    ```

### Environment Variables and Google Secret Manager Setup

1.  **Frontend Environment Variables:**
    Create a `.env` file in the `frontend` directory and add the following, replacing the values with your actual Firebase project details.
    ```env
      VITE_FIREBASE_API_KEY=your_firebase_api_key
      VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
      VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
      VITE_FIREBASE_SENDER_ID=your_firebase_sender_id
      VITE_FIREBASE_APP_ID=your_firebase_app_id
      VITE_OPENAI_API_KEY=your_openai_api_key
      VITE_WHOIS_API_KEY=your_whois_api_key
    ```
    **IMPORTANT:** The `VITE_WHOIS_API_KEY` is just for testing locally. In production, you must store it in Google Secret Manager.

2.  **Backend API Key Setup (Google Secret Manager):**
    The application uses Google Secret Manager to securely store the OpenAI and WhoisXML API keys. You need to set these up in your Google Cloud project:

   - **Login in google cloud:**
    ```sh
     gcloud auth application-default login
    ```
   - **Install Beta components:**
    ```sh
      gcloud components install beta
    ```

   -   **Create Secrets:** Use the `gcloud` command-line tool to create the secrets.

       ```bash
       gcloud secrets create OPENAI_API_KEY --replication-policy="automatic"
       gcloud secrets create WHOIS_API_KEY --replication-policy="automatic"
       ```

   -   **Add API Keys to Secrets:** Add your actual API keys to the newly created secrets.

       ```bash
       gcloud secrets versions add OPENAI_API_KEY --data-file=<path_to_your_openai_key_file>
       gcloud secrets versions add WHOIS_API_KEY --data-file=<path_to_your_whois_key_file>
       ```

       **Note:** Create a new file that will contain your respective api keys.
   - Or you can add the keys directly with:

        ```bash
       gcloud secrets versions add OPENAI_API_KEY --data="your_openai_api_key_here"
       gcloud secrets versions add WHOIS_API_KEY --data="your_whois_api_key_here"
       ```

     Replace `"your_openai_api_key_here"` and `"your_whois_api_key_here"` with your actual keys.

3.  **Grant access:**
   - You need to enable the service account with the permission to access the secrets.
   - Run the following command:
     ```
      gcloud projects add-iam-policy-binding <your_project_id> --member="serviceAccount:<your_project_id>@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
     ```

4. **IMPORTANT**: once you do this, remove the WHOIS_API_KEY from the frontend env file

### Running the Application

1.  **Start Firebase emulators (optional, for local testing):**

    ```sh
    firebase emulators:start
    ```

2.  **Deploy Firebase Cloud Functions:**

    ```sh
    firebase deploy --only functions
    ```

3.  **Start the frontend:**

    ```sh
    yarn vite
    ```

### Firebase Setup

1.  **Initialize Firebase:**

   -   If you haven't already, initialize Firebase in your project:

       ```sh
       firebase init
       ```

   -   Select "Firestore" and "Functions" during the initialization process.

2.  **Enable Firestore:**

   -   Go to the Firebase console and enable Firestore in your project.

## API Endpoints

### Cloud Functions

**Endpoints:**

-   `converseWithOpenAI`: Interact with the OpenAI API.
-   `domainLookUpWhoIs`: Perform domain lookups using the WhoisXML API.

## License

This project is licensed under the MIT License.

## Contributors

-   Alan Padiernos
