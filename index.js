document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    
    mobileMenuToggle.addEventListener('click', function () {
        primaryNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
      
        // Animate hamburger icon
        const hamburgerLines = document.querySelectorAll('.hamburger-line');
        if (primaryNav.classList.contains('active')) {
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            hamburgerLines.forEach(line => {
                line.style.transform = 'rotate(0) translate(0)';
                line.style.opacity = '1';
            });
        }
    });
  
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (primaryNav.classList.contains('active')) {
                primaryNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const hamburgerLines = document.querySelectorAll('.hamburger-line');
                hamburgerLines.forEach(line => {
                    line.style.transform = 'rotate(0) translate(0)';
                    line.style.opacity = '1';
                });
            }
        });
    });
});
  
   
  
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
      });
    }
   // Testimonial Carousel
   const carouselTrack = document.querySelector('.testimonial-track');
   const carouselCards = document.querySelectorAll('.testimonial-card');
   const carouselDots = document.querySelectorAll('.carousel-dot');
   const prevBtn = document.querySelector('.carousel-prev');
   const nextBtn = document.querySelector('.carousel-next');
   
   let currentIndex = 0;
   const cardWidth = 100; // Percentage
   
   function updateCarousel() {
     carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
     
     // Update dots
     carouselDots.forEach((dot, index) => {
       dot.classList.toggle('active', index === currentIndex);
     });
   }
   
   // Next button
   nextBtn.addEventListener('click', function() {
     currentIndex = (currentIndex + 1) % carouselCards.length;
     updateCarousel();
   });
   
   // Previous button
   prevBtn.addEventListener('click', function() {
     currentIndex = (currentIndex - 1 + carouselCards.length) % carouselCards.length;
     updateCarousel();
   });
   
   // Dot navigation
   carouselDots.forEach((dot, index) => {
     dot.addEventListener('click', function() {
       currentIndex = index;
       updateCarousel();
     });
   });
   
   // Auto-advance carousel
   setInterval(function() {
     currentIndex = (currentIndex + 1) % carouselCards.length;
     updateCarousel();
   }, 5000);
   // Product Filtering
   const sortSelect = document.getElementById('sort-by');
   const priceRangeSelect = document.getElementById('price-range');
   const searchInput = document.getElementById('search-input');
   const searchBtn = document.getElementById('search-btn');
   const tabBtns = document.querySelectorAll('.tab-btn');
   const productCards = document.querySelectorAll('.product-card');
   
   function filterProducts() {
     const searchTerm = searchInput.value.toLowerCase();
     const priceRange = priceRangeSelect.value;
     const sortValue = sortSelect.value;
     const activeTab = document.querySelector('.tab-btn.active').dataset.category;
     
     productCards.forEach(card => {
       const name = card.dataset.name.toLowerCase();
       const keywords = card.dataset.keywords.toLowerCase();
       const price = parseFloat(card.dataset.price);
       const category = card.dataset.category;
       
       // Filter by search term
       const matchesSearch = searchTerm === '' || 
         name.includes(searchTerm) || 
         keywords.includes(searchTerm);
       
       // Filter by price range
       let matchesPrice = true;
       if (priceRange !== 'all') {
         const [min, max] = priceRange.split('-').map(Number);
         if (priceRange.endsWith('+')) {
           matchesPrice = price >= parseInt(priceRange);
         } else {
           matchesPrice = price >= min && price <= max;
         }
       }
       
       // Filter by category
       const matchesCategory = activeTab === 'all' || category === activeTab;
       
       // Show/hide based on filters
       if (matchesSearch && matchesPrice && matchesCategory) {
         card.style.display = 'block';
       } else {
         card.style.display = 'none';
       }
     });
     
     // Sort products
     const visibleProducts = Array.from(productCards).filter(card => card.style.display !== 'none');
     
     visibleProducts.sort((a, b) => {
       const aPrice = parseFloat(a.dataset.price);
       const bPrice = parseFloat(b.dataset.price);
       const aName = a.dataset.name.toLowerCase();
       const bName = b.dataset.name.toLowerCase();
       
       switch(sortValue) {
         case 'price-low':
           return aPrice - bPrice;
         case 'price-high':
           return bPrice - aPrice;
         case 'name':
           return aName.localeCompare(bName);
         default: // popular
           const aBadge = a.querySelector('.product-badge') ? 1 : 0;
           const bBadge = b.querySelector('.product-badge') ? 1 : 0;
           return bBadge - aBadge;
       }
     });
     
     // Reorder in DOM
     const productGrid = document.querySelector('.product-grid');
     visibleProducts.forEach(product => {
       productGrid.appendChild(product);
     });
   }
   
   // Event listeners for filtering
   sortSelect.addEventListener('change', filterProducts);
   priceRangeSelect.addEventListener('change', filterProducts);
   searchInput.addEventListener('input', filterProducts);
   searchBtn.addEventListener('click', filterProducts);
   
   // Tab switching
   tabBtns.forEach(btn => {
     btn.addEventListener('click', function() {
       tabBtns.forEach(b => b.classList.remove('active'));
       this.classList.add('active');
       filterProducts();
     });
   });
 
   // Quantity Selector
   document.querySelectorAll('.quantity-plus').forEach(button => {
     button.addEventListener('click', function() {
       const input = this.parentElement.querySelector('.quantity-input');
       input.value = parseInt(input.value) + 1;
     });
   });
   
   document.querySelectorAll('.quantity-minus').forEach(button => {
     button.addEventListener('click', function() {
       const input = this.parentElement.querySelector('.quantity-input');
       if (parseInt(input.value) > 1) {
         input.value = parseInt(input.value) - 1;
       }
     });
   });
 
   // Add to Cart
   document.querySelectorAll('.add-to-cart').forEach(button => {
     button.addEventListener('click', function() {
       const productCard = this.closest('.product-card');
       const productName = productCard.querySelector('h3').textContent;
       const productPrice = productCard.querySelector('.product-price').textContent;
       const quantity = productCard.querySelector('.quantity-input') ? 
         productCard.querySelector('.quantity-input').value : 1;
       
       // In a real app, you would add to a cart object or send to server
       alert(`Added ${quantity} x ${productName} (${productPrice}) to cart`);
       
       // Visual feedback
       const originalText = this.textContent;
       this.textContent = 'Added!';
       this.style.backgroundColor = 'var(--success-color)';
       
       setTimeout(() => {
         this.textContent = originalText;
         this.style.backgroundColor = 'var(--primary-color)';
       }, 2000);
     });
   });
 
   // FAQ Accordion
   const faqQuestions = document.querySelectorAll('.faq-question');
   
   faqQuestions.forEach(question => {
     question.addEventListener('click', function() {
       this.classList.toggle('active');
       const answer = this.nextElementSibling;
       
       if (this.classList.contains('active')) {
         answer.style.maxHeight = answer.scrollHeight + 'px';
       } else {
         answer.style.maxHeight = '0';
       }
     });
   });

    // Order Help Tooltip
    const orderHelpBtn = document.getElementById('order-help-btn');
    const orderHelpTooltip = document.getElementById('order-help-tooltip');
    
    orderHelpBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      orderHelpTooltip.style.display = orderHelpTooltip.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close tooltip when clicking elsewhere
    document.addEventListener('click', function() {
      orderHelpTooltip.style.display = 'none';
    });
  
    // Form Submission
    const orderForm = document.getElementById('order-form');
    const formStatus = document.getElementById('form-status');
    
    if (orderForm) {
      orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        formStatus.textContent = 'Sending your order...';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
        
        setTimeout(() => {
          formStatus.textContent = 'Order received successfully! We will contact you shortly to confirm.';
          formStatus.className = 'form-status success';
          orderForm.reset();
        }, 1500);
      });
    }
  
    // Chatbot Functionality
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const quickReplies = document.querySelectorAll('.quick-reply');
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
      chatbotWindow.classList.toggle('active');
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.remove('active');
    });
    
    // Send message
    function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
        addMessage(message, 'user-message');
        chatbotInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
          const botResponse = getBotResponse(message);
          addMessage(botResponse, 'bot-message');
        }, 1000);
      }
    }
    
    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Quick replies
    quickReplies.forEach(reply => {
      reply.addEventListener('click', function() {
        const message = this.textContent;
        addMessage(message, 'user-message');
        
        setTimeout(() => {
          const botResponse = getBotResponse(message);
          addMessage(botResponse, 'bot-message');
        }, 1000);
      });
    });
    
    // Add message to chat
    function addMessage(text, className) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${className}`;
      
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${text}</p>
          <p class="message-time">${timeString}</p>
        </div>
      `;
      
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Generate bot response
    function getBotResponse(message) {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
        return "We offer same-day delivery for orders placed before 2PM within Nairobi, Mombasa and Kisumu. Delivery fee is Ksh 150 for orders under Ksh 2,000, and free for orders above that amount.";
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('discount')) {
        return "We have weekly specials on fresh produce! Check our 'Specials' tab on the products page. Also, first-time customers get 10% off their first order with code WELCOME10.";
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        return "We accept M-Pesa (Paybill: 123456), cash on delivery (Nairobi only), credit/debit cards, and bank transfers. You'll receive payment details when we confirm your order.";
      } else if (lowerMessage.includes('time') || lowerMessage.includes('hour')) {
        return "Our delivery hours are from 8AM to 8PM daily. You can select your preferred delivery time when placing the order.";
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello there! 😊 How can I assist you with your grocery order today?";
      } else {
        return "I can help you with information about delivery options, current offers, payment methods, and store hours. What would you like to know?";
      }
    }
  
    // Set minimum date for delivery date input to today
    const deliveryDateInput = document.getElementById('preferred-date');
    if (deliveryDateInput) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const minDate = yyyy + '-' + mm + '-' + dd;
      
      deliveryDateInput.min = minDate;
    }
  
    // Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
          
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
})