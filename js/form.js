document.addEventListener('DOMContentLoaded', function() {
    const deliveryForm = document.getElementById('delivery-form');
    const orderConfirmationModal = document.querySelector('.order-confirmation-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const formStatus = document.getElementById('form-status');
    
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Generate unique order ID
            const orderId = 'VB' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
            document.getElementById('order-id').value = orderId;
            
            // Get cart items
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const deliveryFee = 150;
            const total = subtotal + deliveryFee;
            
            // Format order details
            const orderDetails = {
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total: (item.price * item.quantity).toFixed(2)
                })),
                subtotal: subtotal.toFixed(2),
                deliveryFee: deliveryFee.toFixed(2),
                total: total.toFixed(2)
            };
            
            // Set hidden fields
            document.getElementById('order-details').value = JSON.stringify(orderDetails);
            document.getElementById('reply-to-email').value = deliveryForm.email.value;
            document.querySelector('input[name="_subject"]').value = `New VegBuy Order #${orderId}`;
            
            // Show loading state
            formStatus.textContent = 'Processing your order...';
            formStatus.className = 'form-status processing';
            
            try {
                // Submit to Formspree
                const response = await fetch(deliveryForm.action, {
                    method: 'POST',
                    body: new FormData(deliveryForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    formStatus.textContent = 'Order submitted successfully!';
                    formStatus.className = 'form-status success';
                    
                    // Show order confirmation modal with details
                    showOrderConfirmation(orderId, orderDetails, new FormData(deliveryForm));
                    
                    // Reset form (without page reload)
                    setTimeout(() => {
                        deliveryForm.reset();
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 3000);
                    
                    // Clear cart
                    localStorage.removeItem('cart');
                    updateCartCount();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formStatus.textContent = 'Error submitting order. Please try again.';
                formStatus.className = 'form-status error';
            }
        });
    }
    
    function showOrderConfirmation(orderId, orderDetails, formData) {
        // Format delivery date
        const deliveryDate = new Date(formData.get('delivery-date'));
        const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Format delivery time
        let formattedTime = '';
        switch(formData.get('delivery-time')) {
            case '9am-12pm': formattedTime = '9:00 AM - 12:00 PM'; break;
            case '12pm-3pm': formattedTime = '12:00 PM - 3:00 PM'; break;
            case '3pm-6pm': formattedTime = '3:00 PM - 6:00 PM'; break;
            case '6pm-9pm': formattedTime = '6:00 PM - 9:00 PM'; break;
            default: formattedTime = formData.get('delivery-time');
        }
        
        // Update order details in modal
        document.querySelector('.order-details').innerHTML = `
            <div class="detail-row">
                <span>Order Number:</span>
                <span>${orderId}</span>
            </div>
            <div class="detail-row">
                <span>Delivery Date:</span>
                <span>${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span>Delivery Time:</span>
                <span>${formattedTime}</span>
            </div>
            <div class="detail-row">
                <span>Payment Method:</span>
                <span>${formData.get('payment-method')}</span>
            </div>
            <div class="order-items">
                <h4>Order Summary</h4>
                ${orderDetails.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>KSh ${item.total}</span>
                    </div>
                `).join('')}
                <div class="order-totals">
                    <div class="order-subtotal">
                        <span>Subtotal:</span>
                        <span>KSh ${orderDetails.subtotal}</span>
                    </div>
                    <div class="order-delivery">
                        <span>Delivery Fee:</span>
                        <span>KSh ${orderDetails.deliveryFee}</span>
                    </div>
                    <div class="order-total">
                        <span>Total:</span>
                        <span>KSh ${orderDetails.total}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        orderConfirmationModal.classList.add('active');
    }
    
    // Rest of your existing code...
});

// Add this to your CSS
const formStatusStyles = document.createElement('style');
formStatusStyles.textContent = `
    .form-status {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
    }
    .form-status.processing {
        background-color: #fff3cd;
        color: #856404;
    }
    .form-status.success {
        background-color: #d4edda;
        color: #155724;
    }
    .form-status.error {
        background-color: #f8d7da;
        color: #721c24;
    }
    .order-items {
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .order-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    .order-totals {
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .order-subtotal, .order-delivery {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    .order-total {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #ddd;
    }
`;
document.head.appendChild(formStatusStyles);
// Notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1001;
        transition: transform 0.3s ease;
    }
    
    .cart-notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .cart-notification i {
        font-size: 20px;
    }
`;
document.head.appendChild(notificationStyles);