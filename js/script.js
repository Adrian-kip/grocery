document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbar) navbar.classList.remove('active');
            }
        });
    });
    
    // Initialize cart count
    updateCartCount();
    
    // Chatbot toggle
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.querySelector('.close-chatbot');
    
    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.classList.toggle('active');
        });
    }
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function() {
            if (chatbotContainer) chatbotContainer.classList.remove('active');
        });
    }
    
    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (chatbotContainer && !chatbotContainer.contains(e.target)) {
            if (e.target !== chatbotToggle) {
                chatbotContainer.classList.remove('active');
            }
        }
    });
    
    // Initialize testimonial slider if it exists
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        initTestimonialSlider();
    }
});

// Update cart count in header
function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
        document.querySelectorAll('#cart-count').forEach(el => {
            if (el) el.textContent = totalItems;
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!slider || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Clone first and last slides for infinite effect
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slideCount - 1].cloneNode(true);
    
    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';
    
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);
    
    // Set initial position
    slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
    
    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
        updateDots();
    }
    
    // Next slide
    function nextSlide() {
        if (currentIndex >= slideCount - 1) {
            // Jump to first slide (not the clone) without animation
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = 0;
                slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
            }, 500);
        }
        currentIndex++;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
        updateDots();
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex <= 0) {
            // Jump to last slide (not the clone) without animation
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = slideCount - 1;
                slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
            }, 500);
        }
        currentIndex--;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
        updateDots();
    }
    
    // Handle transition end for infinite loop
    slider.addEventListener('transitionend', () => {
        if (currentIndex >= slideCount) {
            slider.style.transition = 'none';
            currentIndex = 0;
            slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
        }
        
        if (currentIndex < 0) {
            slider.style.transition = 'none';
            currentIndex = slideCount - 1;
            slider.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
        }
    });
    
    // Button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const sliderWrapper = document.querySelector('.testimonial-slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderWrapper.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Update dots initially
    updateDots();
}

// Make this function available globally
window.updateCartCount = updateCartCount;