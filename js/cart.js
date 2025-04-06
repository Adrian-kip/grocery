document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
    
    // DOM Elements
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary-details');
    
    // Only proceed if on the orders page
    if (!cartItemsContainer && !cartSummary) return;
    
    // Render cart items
    function renderCart() {
        if (!cartItemsContainer) return;
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        // Add header for desktop view
        if (window.innerWidth > 768) {
            const header = document.createElement('div');
            header.className = 'cart-header';
            header.innerHTML = `
                <div class="header-item">Product</div>
                <div class="header-item">Price</div>
                <div class="header-item">Quantity</div>
                <div class="header-item">Total</div>
                <div class="header-item">Remove</div>
            `;
            cartItemsContainer.appendChild(header);
        }
        
        if (cart.length === 0) {
            const emptyCart = document.createElement('div');
            emptyCart.className = 'empty-cart';
            emptyCart.innerHTML = `
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            `;
            cartItemsContainer.appendChild(emptyCart);
            updateCartSummary();
            return;
        }
        
        // Add each cart item
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            if (window.innerWidth > 768) {
                // Desktop view
                cartItem.innerHTML = `
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="product-info">
                            <h4>${item.name}</h4>
                            <p>${item.size}</p>
                        </div>
                    </div>
                    <div class="cart-price">KSh ${item.price.toFixed(2)}</div>
                    <div class="cart-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <div class="cart-total">KSh ${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-remove">
                        <button class="remove-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            } else {
                // Mobile view
                cartItem.innerHTML = `
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="product-info">
                            <h4>${item.name}</h4>
                            <p>${item.size}</p>
                            <div class="mobile-cart-price">KSh ${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="mobile-cart-controls">
                        <div class="cart-quantity">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <div class="mobile-cart-total">
                            <span>Total: KSh ${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
                        </div>
                    </div>
                `;
            }
            
            // Add event listeners for quantity buttons
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const removeBtn = cartItem.querySelector('.remove-btn');
            const quantityEl = cartItem.querySelector('.quantity');
            
            minusBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantityEl.textContent = item.quantity;
                    updateCartItem(index, item);
                }
            });
            
            plusBtn.addEventListener('click', () => {
                item.quantity++;
                quantityEl.textContent = item.quantity;
                updateCartItem(index, item);
            });
            
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                renderCart();
                saveCart();
            });
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        updateCartSummary();
    }
    
    // Update cart summary
    function updateCartSummary() {
        if (!cartSummary) return;
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = 150; // Fixed delivery fee
        const discount = 0; // Could be calculated based on coupons
        const total = subtotal + deliveryFee - discount;
        
        cartSummary.innerHTML = `
            <h3>Order Total</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>KSh ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Fee</span>
                <span>KSh ${deliveryFee.toFixed(2)}</span>
            </div>
            <div class="summary-row discount">
                <span>Discount</span>
                <span>-KSh ${discount.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>KSh ${total.toFixed(2)}</span>
            </div>
            <div class="coupon-box">
                <input type="text" placeholder="Enter coupon code" class="form-input">
                <button class="apply-coupon btn btn-secondary">Apply</button>
            </div>
            <a href="#delivery-form" class="btn btn-primary checkout-btn">Proceed to Checkout</a>
            <a href="products.html" class="continue-shopping">Continue Shopping</a>
        `;
        
        // Add event listener for coupon button
        const applyCouponBtn = cartSummary.querySelector('.apply-coupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', applyCoupon);
        }
    }
    
    // Update cart item
    function updateCartItem(index, item) {
        cart[index] = item;
        saveCart();
        renderCart();
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Apply coupon
    function applyCoupon() {
        // In a real app, this would validate the coupon with a server
        alert('Coupon applied!');
    }
    
    // Initialize cart rendering
    renderCart();
    
    // Handle window resize for responsive cart
    window.addEventListener('resize', function() {
        renderCart();
    });
});

// Add to cart function (used in products.js)
function addToCart(product) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.size || '1kg',
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show added to cart notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${product.name} has been added to your cart!</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Make this function available globally
window.addToCart = addToCart;