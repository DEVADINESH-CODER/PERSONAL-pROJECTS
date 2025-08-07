from flask import Flask, request, jsonify, send_from_directory, session, render_template
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev_secret_key')  # For session management

# Configure Gemini API with better error handling
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key from environment: {api_key}")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please check your .env file.")

try:
    genai.configure(api_key=api_key)
    # Use a supported model instead of the experimental one
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
    print("Gemini API configured successfully")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    # Fallback to a simpler model if the above fails
    try:
        model = genai.GenerativeModel('gemini-pro')
        print("Gemini API configured with fallback model")
    except Exception as e2:
        print(f"Error configuring fallback Gemini API: {e2}")
        raise

# Demo credential store (email: password)
user_credentials = {
    '0602wcp@sbcsrbox.com': 'IBMskillsbuild@1234#',
    'scp03834@sbcsrbox.com': 'PBL@4248',
    'scp00026@sbcsrbox.com': 'Csrbox@1259',
    'l287wcp@sbcsrbox.com': 'IBMskillsbuild@1234#',
}

# Language mapping
language_map = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali'
}

@app.route('/')
def index():
    return render_template('index_chatgpt.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    if email in user_credentials and user_credentials[email] == password:
        session['user'] = email
        return jsonify({'success': True, 'email': email})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'success': True})

@app.route('/check-login')
def check_login():
    if 'user' in session:
        return jsonify({'logged_in': True, 'email': session['user']})
    else:
        return jsonify({'logged_in': False})

@app.route('/ask', methods=['POST'])
def ask():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        data = request.json
        message = data.get('message', '')
        language_code = data.get('language', 'en')
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        language = language_map.get(language_code, 'English')
        prompt = f"""You are an agricultural expert assistant who responds ONLY in {language} language. Do not include any English translation.
        
For the question: {message}

Provide a detailed, helpful response in {language} only, following this EXACT structure with clear section headers:

**TOPIC IDENTIFICATION**
Identify the main agricultural topic (crop, soil, weather, pest, etc.) in exactly one sentence.

**STEP-BY-STEP GUIDANCE**
Provide specific, actionable advice using EXACTLY this format:
1. [First step with specific details]
2. [Second step with specific details]
3. [Continue with numbered steps as needed]

**KEY CONSIDERATIONS**
Include any relevant warnings, precautions, or important factors using EXACTLY this format:
• [First consideration]
• [Second consideration]
• [Continue with bullet points as needed]

**ADDITIONAL RESOURCES**
Suggest additional resources or next steps using EXACTLY this format:
• [First resource or next step]
• [Second resource or next step]
• [Continue with bullet points as needed]

CRITICAL FORMATTING RULES:
- Use ONLY the section headers shown above in ALL CAPS
- Use numbered lists for steps and bullet points for considerations/resources
- Keep each section header on its own line
- Keep your response concise but informative, suitable for farmers with varying levels of education
- Respond ONLY in {language} - do not include any English words or translations
- Avoid overly technical jargon. Use simple, clear language that farmers can easily understand
- Do not include any markdown formatting symbols like asterisks or underscores except for the section headers shown"""
        response = model.generate_content(prompt)
        return jsonify({
            'response': response.text
        })
    except Exception as e:
        print(f"Error in /ask endpoint: {e}")
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Current working directory: {os.getcwd()}")
    print(f".env file exists: {os.path.exists('.env')}")
    app.run(debug=True)
