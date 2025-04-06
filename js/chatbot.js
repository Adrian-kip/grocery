document.addEventListener('DOMContentLoaded', function() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendMessageBtn = document.getElementById('send-message');
    
    if (!chatbotMessages || !chatbotInput || !sendMessageBtn) return;
    
    // Sample responses for the chatbot
    const responses = {
        'hello': 'Hello there! How can I help you with your VegBuy experience today?',
        'hi': 'Hi! Welcome to VegBuy. What can I assist you with?',
        'delivery': 'We offer fast delivery within 24 hours in Nairobi and 48 hours nationwide. Where would you like your order delivered?',
        'payment': 'We accept M-Pesa, credit/debit cards, and cash on delivery. Which method would you prefer?',
        'products': 'We have a wide range of fresh organic vegetables, fruits, herbs, and pantry staples. Check out our Products page for the full selection!',
        'organic': 'All our produce is certified organic by the Kenya Organic Agriculture Network (KOAN), ensuring no harmful pesticides or chemicals are used.',
        'price': 'Our farm-direct prices are typically 20-30% cheaper than supermarkets. Check our Products page for current pricing.',
        'contact': 'You can reach us at +254 799 250 399 on WhatsApp or call us at the same number. Our email is info@vegbuyshop.com',
        'default': "I'm sorry, I didn't understand that. Could you rephrase or ask about delivery, products, payment, or contact info?"
    };
    
    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user-message');
        chatbotInput.value = '';
        
        // Process message and get response
        const response = getResponse(message.toLowerCase());
        
        // Add slight delay for "bot typing" effect
        setTimeout(() => {
            addMessage(response, 'chatbot-response');
        }, 500);
    }
    
    // Add message to chat
    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${className}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Get appropriate response
    function getResponse(message) {
        // Check for keywords in the message
        if (message.includes('hello') || message.includes('hi')) {
            return responses['hello'];
        } else if (message.includes('deliver') || message.includes('ship')) {
            return responses['delivery'];
        } else if (message.includes('pay') || message.includes('mpesa') || message.includes('cash')) {
            return responses['payment'];
        } else if (message.includes('product') || message.includes('item') || message.includes('vegetable') || message.includes('fruit')) {
            return responses['products'];
        } else if (message.includes('organic') || message.includes('quality')) {
            return responses['organic'];
        } else if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
            return responses['price'];
        } else if (message.includes('contact') || message.includes('call') || message.includes('whatsapp') || message.includes('email')) {
            return responses['contact'];
        } else {
            return responses['default'];
        }
    }
    
    // Event listeners
    sendMessageBtn.addEventListener('click', sendMessage);
    
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Initial greeting
    addMessage(responses['hello'], 'chatbot-response');
    
    // Train chatbot function (for admin to add new responses)
    window.trainChatbot = function(question, answer) {
        responses[question.toLowerCase()] = answer;
        console.log(`Chatbot trained with new response: ${question} => ${answer}`);
    };
});