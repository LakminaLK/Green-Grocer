document.addEventListener('DOMContentLoaded', function () {
    // Load order summary from local storage
    loadOrderSummary();

    // Add event listener for the proceed to checkout button
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            displayThankYouMessage();
        }
    });
});

// Load order summary from local storage
function loadOrderSummary() {
    const orderSummaryBody = document.getElementById('order-summary-body');
    const totalPriceElement = document.getElementById('order-summary-total');
    const storedItems = JSON.parse(localStorage.getItem('orderSummary')) || [];
    const totalPrice = localStorage.getItem('totalPrice') || 0;

    orderSummaryBody.innerHTML = '';

    storedItems.forEach(item => {
        const { itemName, itemQuantity, itemPrice } = item;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${itemName}</td>
            <td>${itemQuantity}</td>
            <td>${itemPrice}</td>
        `;
        orderSummaryBody.appendChild(row);
    });

    totalPriceElement.innerText = `Rs. ${parseFloat(totalPrice.replace('Rs. ', '')).toFixed(2)}`;
}

// Validate checkout form
function validateForm() {
    const inputs = document.querySelectorAll('input[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return valid;
}

// Display thank you message
function displayThankYouMessage() {
    const thankYouMessage = document.getElementById('thank-you-message');
    const deliveryDateElement = document.getElementById('delivery-date');
    deliveryDateElement.innerText = getDeliveryDate();
    thankYouMessage.style.display = 'flex';

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', function () {
        thankYouMessage.style.display = 'none';
    });
}

// Calculate delivery date (2 days from now)
function getDeliveryDate() {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2);

    return deliveryDate.toDateString();
}
