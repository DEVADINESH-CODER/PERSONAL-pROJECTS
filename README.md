# AI Agricultural Assistant (Kisan Mitra)

A multilingual AI-powered agricultural assistant that helps farmers with crop management, soil testing, weather information, and pest control.

## Features







- **Multilingual Support**: Available in English, Hindi, Tamil, Telugu, and Bengali
- **AI-Powered Assistance**: Powered by Google's Gemini API
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Secure login system
- **Chat Interface**: ChatGPT-style interface for easy interaction

## Technologies Used

- **Frontend**: HTML, Tailwind CSS, JavaScript
- **Backend**: Python Flask
- **AI**: Google Gemini API
- **Authentication**: Session-based login

## Local Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file with your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   FLASK_SECRET_KEY=your_secret_key
   ```
4. Run the application: `python app.py`

## Deployment to Render

1. Fork this repository to your GitHub account
2. Create a new web service on Render
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `FLASK_SECRET_KEY`: Your Flask secret key
5. Deploy!

The application will automatically configure itself for Render's environment using the `render.yaml` file.

## Supported Languages

- English
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)

## Usage

1. Log in with any of the demo credentials
2. Select your preferred language from the dropdown
3. Ask questions about agriculture, crops, soil, weather, or pests
4. Get instant AI-powered advice in your selected language

## Demo Credentials

- Email: `0602wcp@sbcsrbox.com`, Password: `IBMskillsbuild@1234#`
- Email: `scp03834@sbcsrbox.com`, Password: `PBL@4248`
- Email: `scp00026@sbcsrbox.com`, Password: `Csrbox@1259`
- Email: `l287wcp@sbcsrbox.com`, Password: `IBMskillsbuild@1234#`
