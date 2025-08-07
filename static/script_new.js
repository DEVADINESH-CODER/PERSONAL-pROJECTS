// DOM Elements
const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const languageSelector = document.getElementById('language');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const loginContainer = document.getElementById('loginContainer');
const chatContainer = document.getElementById('chatContainer');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    messageDiv.appendChild(paragraph);
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Add subtle animation
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

// Show loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = '<p>Thinking<span class="loading">...</span></p>';
    chatHistory.appendChild(loadingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Hide loading indicator
function hideLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Send message to backend
async function sendMessage() {
    const message = userInput.value.trim();
    const language = languageSelector.value;
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Show loading indicator
    showLoading();
    
    try {
        // Send request to backend
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                language: language
            })
        });
        
        const data = await response.json();
        
        // Hide loading indicator
        hideLoading();
        
        if (response.ok) {
            // Add bot response to chat
            addMessage(data.response);
        } else {
            addMessage(`Sorry, I encountered an error: ${data.error}`);
        }
    } catch (error) {
        // Hide loading indicator
        hideLoading();
        addMessage(`Sorry, I encountered an error: ${error.message}`);
    }
}

// Clear chat history
function clearChat() {
    chatHistory.innerHTML = '';
    
    // Add welcome message based on selected language
    const welcomeMessages = {
        'hi': 'नमस्ते! मैं आपका कृषि सहायक हूँ। कृपया अपना प्रश्न दर्ज करें।',
        'ta': 'ஹலோ! நான் உங்கள் விவசாய உதவியாளர். உங்கள் கேள்வியை உள்ளிடவும்.',
        'te': 'హలో! నేను మీ వ్యవసాయ సహాయకుడిని. మీ ప్రశ్నను పంపండి.'
    };
    
    const currentLanguage = languageSelector.value;
    chatHistory.innerHTML = `<div class="message bot-message"><p>${welcomeMessages[currentLanguage]}</p></div>`;
    
    // Update other text elements to match the selected language
    updateWelcomeMessage();
}

// Show chat interface
function showChat() {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
}

// Show login interface
function showLogin() {
    chatContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
}

// Handle login
async function handleLogin(email, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showChat();
        } else {
            loginError.textContent = data.error;
        }
    } catch (error) {
        loginError.textContent = 'An error occurred during login.';
    }
}

// Handle logout
async function handleLogout() {
    try {
        await fetch('/logout', { method: 'POST' });
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Check login status
async function checkLoginStatus() {
    try {
        const response = await fetch('/check-login');
        const data = await response.json();
        
        if (data.logged_in) {
            showChat();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        showLogin();
    }
}

// Update welcome message and other text elements when language changes
function updateWelcomeMessage() {
    const currentLanguage = languageSelector.value;
    
    // Update welcome messages based on language
    const welcomeMessages = {
        'en': 'Hello! I am your agricultural assistant. Please enter your question.',
        'hi': 'नमस्ते! मैं आपका कृषि सहायक हूँ। कृपया अपना प्रश्न दर्ज करें।',
        'ta': 'ஹலோ! நான் உங்கள் விவசாய உதவியாளர். உங்கள் கேள்வியை உள்ளிடவும்.',
        'te': 'హలో! నేను మీ వ్యవసాయ సహాయకుడిని. మీ ప్రశ్నను పంపండి.',
        'bn': 'হ্যালো! আমি আপনার কৃষি সহায়ক। আপনার প্রশ্ন লিখুন।'
    };
    
    // Update initial welcome message based on language
    const initialWelcomeMessages = {
        'en': 'Hello! I am your agricultural assistant. I can help you with crops, soil, weather, and pests.',
        'hi': 'नमस्ते! मैं आपका कृषि सहायक हूँ। मैं फसलों, मिट्टी, मौसम और कीटों के बारे में आपकी मदद कर सकता हूँ।',
        'ta': 'ஹலோ! நான் உங்கள் விவசாய உதவியாளர். நான் பயள், மண், வானிலை மற்றும் பூச்சிகள் பற்றி உங்களுக்கு உதவ முடியும்.',
        'te': 'హలో! నేను మీ వ్యవసాయ సహాయకుడిని. నేను పంటలు, నేల, వాతావరణం మరియు కీటకాల గురించి మిమ్మల్ని సహాయం చేయగలను.',
        'bn': 'হ্যালো! আমি আপনার কৃষি সহায়ক। আমি ফসল, মাটি, আবহাওয়া এবং পোকামাকড় সম্পর্কে আপনাকে সাহায্য করতে পারি।'
    };
    
    // Update AI expert text based on language
    const aiExpertTexts = {
        'en': 'AI Agricultural Expert',
        'hi': 'AI कृषि विशेषज्ञ',
        'ta': 'AI விவசாய நிபுணர்',
        'te': 'AI వ్యవసాయ నిపుణుడు',
        'bn': 'AI কৃষি বিশেষজ্ঞ'
    };
    
    // Update quick tags based on language
    const quickTags = {
        'en': ['🌾 Crop', '☁️ Weather', '🐛 Pest'],
        'hi': ['🌾 फसल', '☁️ मौसम', '🐛 कीट'],
        'ta': ['🌾 பயள்', '☁️ வானிலை', '🐛 பூச்சி'],
        'te': ['🌾 పంట', '☁️ వాతావరణం', '🐛 కీటకం'],
        'bn': ['🌾 ফসল', '☁️ আবহাওয়া', '🐛 পোকা']
    };
    
    // Update header subtitle based on language
    const headerSubtitles = {
        'en': '🤖 AI Agricultural Expert | 🌍 Multi-Language Support',
        'hi': '🤖 AI कृषि विशेषज्ञ | 🌍 बहुभाषा समर्थन',
        'ta': '🤖 AI விவசாய நிபுணர் | 🌍 பல மொழி ஆதரவு',
        'te': '🤖 AI వ్యవసాయ నిపుణుడు | 🌍 బహుభాషా మద్దతు',
        'bn': '🤖 AI কৃষি বিশেষজ্ঞ | 🌍 বহুভাষিক সমর্থন'
    };
    
    // Update placeholder texts based on language
    const inputPlaceholders = {
        'en': '🌾 Type your agricultural question here... (English/Hindi/Tamil/Telugu/Bengali)',
        'hi': '🌾 अपना कृषि प्रश्न यहाँ टाइप करें... (हिंदी/तमिल/तेलुगु में)',
        'ta': '🌾 உங்கள் விவசாய கேள்வியை இங்கே தட்டச்சு செய்க... (ஹிந்தி/தமிழ்/தெலுங்கு)',
        'te': '🌾 మీ వ్యవసాయ ప్రశ్నను ఇక్కడ టైప్ చేయండి... (హిందీ/తమిళం/తెలుగు)',
        'bn': '🌾 এখানে আপনার কৃষি প্রশ্ন টাইপ করুন... (ইংরেজি/হিন্দি/তামিল/তেলেগু/বাংলা)'
    };
    
    // Update quick suggestion button texts based on language
    const quickSuggestions = {
        'en': [
            '🌾 Crop Problem',
            '☁️ Weather',
            '🌱 Soil',
            '🐛 Pest Control'
        ],
        'hi': [
            '🌾 फसल की समस्या',
            '☁️ मौसम',
            '🌱 मिट्टी',
            '🐛 कीट नियंत्रण'
        ],
        'ta': [
            '🌾 பயள் சிக்கல்',
            '☁️ வானிலை',
            '🌱 மண்',
            '🐛 பூச்சி கட்டுப்பாடு'
        ],
        'te': [
            '🌾 పంట సమస్య',
            '☁️ వాతావరణం',
            '🌱 నేల',
            '🐛 కీటకాల నియంత్రణ'
        ],
        'bn': [
            '🌾 ফসল সমস্যা',
            '☁️ আবহাওয়া',
            '🌱 মাটি',
            '🐛 পোকা দমন'
        ]
    };
    
    // Update footer text based on language
    const footerTexts = {
        'en': '🌾 Kisan Mitra is here to help with your farming | Verify important information',
        'hi': '🌾 Kisan Mitra आपके खेतों की मदद करने के लिए यहाँ है | महत्वपूर्ण जानकारी की पुष्टि करें',
        'ta': '🌾 Kisan Mitra உங்கள் விவசாயத்திற்கு உதவ இங்கே உள்ளது | முக்கியமான தகவல்களை சரிபார்க்கவும்',
        'te': '🌾 Kisan Mitra మీ వ్యవసాయానికి సహాయం చేయడానికి ఇక్కడ ఉంది | ముఖ్యమైన సమాచారాన్ని ధృవీకరించండి',
        'bn': '🌾 Kisan Mitra আপনার কৃষিকাজে সাহায্য করতে এখানে উপস্থিত | গুরুত্বপূর্ণ তথ্য যাচাই করুন'
    };
    
    // Update logout button text based on language
    const logoutTexts = {
        'en': 'Logout',
        'hi': 'लॉगआउट',
        'ta': 'வெளியேறு',
        'te': 'లాగ్అవుట్',
        'bn': 'লগ আউট'
    };
    
    // Update the welcome message in chat
    if (chatContainer.style.display === 'flex') {
        const firstMessage = chatHistory.querySelector('.bot-message');
        if (firstMessage) {
            firstMessage.innerHTML = `<p>${welcomeMessages[currentLanguage]}</p>`;
        }
    }
    
    // Update initial welcome message in HTML
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = initialWelcomeMessages[currentLanguage];
    }
    
    // Update AI expert text
    const aiExpertTextElement = document.getElementById('aiExpertText');
    if (aiExpertTextElement) {
        aiExpertTextElement.textContent = aiExpertTexts[currentLanguage];
    }
    
    // Update quick tags
    const cropTagElement = document.getElementById('cropTag');
    const weatherTagElement = document.getElementById('weatherTag');
    const pestTagElement = document.getElementById('pestTag');
    
    if (cropTagElement && weatherTagElement && pestTagElement) {
        const tags = quickTags[currentLanguage];
        cropTagElement.textContent = tags[0];
        weatherTagElement.textContent = tags[1];
        pestTagElement.textContent = tags[2];
    }
    
    // Update header subtitle
    const headerSubtitleElement = document.getElementById('headerSubtitle');
    if (headerSubtitleElement) {
        headerSubtitleElement.textContent = headerSubtitles[currentLanguage];
    }
    
    // Update input placeholder
    if (userInput) {
        userInput.setAttribute('lang', currentLanguage);
        userInput.placeholder = inputPlaceholders[currentLanguage];
    }
    
    // Update quick suggestion buttons
    const suggestionButtons = document.querySelectorAll('footer .flex-wrap button');
    if (suggestionButtons.length > 0) {
        const suggestions = quickSuggestions[currentLanguage];
        suggestionButtons.forEach((button, index) => {
            if (suggestions[index]) {
                button.innerHTML = suggestions[index];
            }
        });
    }
    
    // Update footer text
    const footerTextElement = document.querySelector('footer .text-center');
    if (footerTextElement) {
        footerTextElement.innerHTML = `<i class="fas fa-shield-alt mr-1"></i> ${footerTexts[currentLanguage]}`;
    }
    
    // Update logout button text
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.innerHTML = `<i class="fas fa-sign-out-alt mr-2"></i>${logoutTexts[currentLanguage]}`;
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event Listeners
    if (submitBtn) {
        submitBtn.addEventListener('click', sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey && chatContainer && chatContainer.style.display === 'flex') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearChat);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();
            
            if (email && password) {
                await handleLogin(email, password);
            } else {
                if (loginError) {
                    loginError.textContent = 'Please enter both email and password.';
                }
            }
        });
    }
    
    if (languageSelector) {
        languageSelector.addEventListener('change', updateWelcomeMessage);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add event listeners for quick suggestion buttons
    const quickSuggestionsContainer = document.getElementById('quickSuggestions');
    if (quickSuggestionsContainer) {
        quickSuggestionsContainer.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                handleQuickSuggestion(e.target);
            }
        });
    }
    
    // Initialize
    checkLoginStatus();
    updateWelcomeMessage();
});

// Add ripple effect to buttons
if (submitBtn) submitBtn.addEventListener('click', addRippleEffect);
if (clearBtn) clearBtn.addEventListener('click', addRippleEffect);
if (logoutBtn) logoutBtn.addEventListener('click', addRippleEffect);

// Handle quick suggestion button clicks
function handleQuickSuggestion(button) {
    const suggestionType = button.getAttribute('data-suggestion');
    const currentLanguage = languageSelector.value;
    
    // Define suggestion texts for each language and type
    const suggestionTexts = {
        'en': {
            'crop': 'Why are the leaves on my crop turning yellow?',
            'weather': 'What is today\'s weather like?',
            'soil': 'How to test the soil?',
            'pest': 'How to protect from pests?'
        },
        'hi': {
            'crop': 'मेरी फसल में पीले पत्ते आ रहे हैं',
            'weather': 'आज का मौसम कैसा है?',
            'soil': 'मिट्टी की जांच कैसे करें?',
            'pest': 'कीटों से कैसे बचाव?'
        },
        'ta': {
            'crop': 'எனது பயற்றில் மஞ்சள் இலைகள் ஏன் வருகின்றன?',
            'weather': 'இன்று வானிலை எப்படி?',
            'soil': 'மண்ணை எவ்வாறு சோதிப்பது?',
            'pest': 'பூச்சிகளிடமிருந்து எவ்வாறு பாதுகாப்பது?'
        },
        'te': {
            'crop': 'నా పంటలో పసుపు ఆకులు ఎందుకు వస్తున్నాయి?',
            'weather': 'ఈ రోజు వాతావరణం ఎలా ఉంది?',
            'soil': 'నేల పరీక్ష ఎలా చేయాలి?',
            'pest': 'కీటకాల నుండి ఎలా రక్షించుకోవాలి?'
        },
        'bn': {
            'crop': 'আমার ফসলের পাতা কেন হলুদ হয়ে যাচ্ছে?',
            'weather': 'আজকের আবহাওয়া কেমন?',
            'soil': 'মাটি পরীক্ষা কিভাবে করবেন?',
            'pest': 'পোকা থেকে কিভাবে সুরক্ষা পাবেন?'
        }
    };
    
    // Set the input value based on the selected language and suggestion type
    if (userInput && suggestionTexts[currentLanguage] && suggestionTexts[currentLanguage][suggestionType]) {
        userInput.value = suggestionTexts[currentLanguage][suggestionType];
        userInput.focus();
        
        // Add message to chat
        addMessage(suggestionTexts[currentLanguage][suggestionType], true);
        
        // Send message automatically
        sendMessage();
    }
}

// Add ripple effect function
function addRippleEffect(e) {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}
