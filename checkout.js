document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutForm = document.getElementById('checkout-form');
    const completeButton = document.getElementById('complete-button'); // Get the Complete button

    // Populate the cart display
    const cartContainer = document.querySelector('.cart-items');
    const orderTotal = document.getElementById('order-total');
    let totalPrice = 0;

    // Loop through cart items to display them
    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>Quantity: ${item.quantity}</span>
            <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
        `;
        totalPrice += item.price * item.quantity;
        cartContainer.appendChild(itemDiv);
    });

    orderTotal.textContent = totalPrice.toFixed(2);

    if (checkoutForm) {
        // If the form exists, add a submit event listener for traditional form submission (optional)
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            alert('Happy Shopping! Order Placed!');
    
            // Clear the cart after placing the order
            localStorage.removeItem('cart');

            // Redirect to home.html after a short delay to show the message
            setTimeout(() => {
                window.location.href = 'home.html'; // Redirect to home page
            }, 2000);
        });
    }

    if (completeButton) {
        // Handle the "Complete" button click to place the order
        completeButton.addEventListener('click', async () => {
            // Validate if the cart is empty
            if (!cartItems || cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const formData = {
                email: document.getElementById('email').value.trim(),
                newsletter: document.getElementById('newsletter').checked,
                fname: document.getElementById('fname').value.trim(),
                lname: document.getElementById('lname').value.trim(),
                street: document.getElementById('street').value.trim(),
                city: document.getElementById('city').value.trim(),
                zip: document.getElementById('zip').value.trim(),
                paymentMethod: document.getElementById('payment-method').value.trim(),
                cart: cartItems,
            };

            // Validate that required fields are filled
            if (!formData.email || !formData.fname || !formData.lname || !formData.street || !formData.city || !formData.zip || !formData.paymentMethod) {
                alert('Please complete all required fields and ensure your cart is not empty.');
                return;
            }

            try {
                // Send order data to the server
                const response = await fetch('http://localhost/checkout.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                // Check if response is OK
                if (!response.ok) {
                    const errorDetails = await response.text();
                    throw new Error(`Network response was not ok: ${errorDetails}`);
                }

                const result = await response.json();
                if (result.success) {
                    alert('Order placed successfully!');
                    localStorage.removeItem('cart'); // Clear the cart after placing the order
                    window.location.href = 'thankyou.html'; // Redirect to the Thank You page
                } else {
                    throw new Error(result.message || 'Order failed.');
                }
            } catch (error) {
                console.error('Checkout Error:', error);
                alert('There was an error processing your order. Please try again later.');
            }
        });
    }
});
