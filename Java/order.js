document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.querySelector('.order-form');
    const orderItemsContainer = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('total-price');
    const addFavoritesBtn = document.getElementById('add-favorites-btn');
    const applyFavoritesBtn = document.getElementById('apply-favorites-btn');
    const buyNowBtn = document.querySelector('.btn1');

    orderForm.addEventListener('change', updateOrderSummary);
    addFavoritesBtn.addEventListener('click', addToFavorites);
    applyFavoritesBtn.addEventListener('click', applyFavorites);
    buyNowBtn.addEventListener('click', navigateToCheckout);

    function updateOrderSummary() {
        const products = document.querySelectorAll('.product');
        let totalPrice = 0;
        orderItemsContainer.innerHTML = '';
        let orderItems = [];

        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            const quantity = parseFloat(quantityInput.value);
            if (quantity > 0) {
                const productName = product.querySelector('h3').innerText;
                const productPrice = parseFloat(product.querySelector('.price').innerText.replace('Rs.', ''));
                const itemPrice = quantity * productPrice;

                const orderRow = createOrderRow(product, productName, quantity, itemPrice);
                orderItemsContainer.appendChild(orderRow);

                orderItems.push({ productName, quantity, itemPrice, imgSrc: product.querySelector('img').src });
                totalPrice += itemPrice;
            }
        });

        localStorage.setItem('orderItems', JSON.stringify(orderItems));
        totalPriceElement.innerText = `Rs. ${totalPrice.toFixed(2)}`;
    }

    function createOrderRow(product, productName, quantity, itemPrice) {
        const orderRow = document.createElement('tr');

        const itemCell = document.createElement('td');
        itemCell.classList.add('item');
        const img = document.createElement('img');
        img.src = product.querySelector('img').src;
        img.alt = productName;
        itemCell.appendChild(img);

        const quantityCell = document.createElement('td');
        quantityCell.classList.add('quantity');
        quantityCell.innerText = determineQuantityDisplay(productName, quantity);

        const priceCell = document.createElement('td');
        priceCell.classList.add('price');
        priceCell.innerText = `Rs. ${itemPrice.toFixed(2)}`;

        const actionsCell = document.createElement('td');
        actionsCell.classList.add('actions');
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fa fa-window-close" aria-hidden="true"></i>';
        removeBtn.addEventListener('click', () => removeItem(productName));
        actionsCell.appendChild(removeBtn);

        orderRow.appendChild(itemCell);
        orderRow.appendChild(quantityCell);
        orderRow.appendChild(priceCell);
        orderRow.appendChild(actionsCell);

        return orderRow;
    }

    function determineQuantityDisplay(productName, quantity) {
        const quantityUnits = ['Icing Sugar', 'Brown Sugar', 'Wheat Flour', 'Vinegar', 'Sauce', 'Salt',
            'Kothmale Milk', 'Kothmale Cheese', 'Kothmale Yoghurt', 'Milk Powder',
            'Astra Butter', 'Richlife Curd', 'Richlife KiriPani', 'Magic Ice Cream',
            'Milkmaid'];
        return quantityUnits.some(name => productName.includes(name)) ? `${quantity} pcs` : `${quantity} kg`;
    }

    function addToFavorites() {
        const favorites = collectFavorites();
        if (Object.keys(favorites).length > 0) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Favorites saved!');
        } else {
            alert('No items selected to save as favorites!');
        }
    }

    function collectFavorites() {
        const products = document.querySelectorAll('.product');
        const favorites = {};

        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            const quantity = parseFloat(quantityInput.value);
            if (quantity > 0) {
                const productId = quantityInput.id;
                favorites[productId] = quantity;
            }
        });

        return favorites;
    }

    function applyFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites'));

        if (favorites && Object.keys(favorites).length > 0) {
            populateFormWithFavorites(favorites);
            updateOrderSummary();
            alert('Favorites applied!');
        } else {
            alert('No favorites found!');
        }
    }

    function populateFormWithFavorites(favorites) {
        const products = document.querySelectorAll('.product');

        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            const productId = quantityInput.id;
            quantityInput.value = favorites[productId] !== undefined ? favorites[productId] : 0;
        });
    }

    function navigateToCheckout() {
        const orderSummary = collectOrderSummary();
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
        localStorage.setItem('totalPrice', totalPriceElement.innerText);
        window.location.href = 'checkout.html';
    }

    function collectOrderSummary() {
        const orderSummary = [];
        const orderRows = orderItemsContainer.querySelectorAll('tr');

        orderRows.forEach(row => {
            const itemName = row.querySelector('.item img').alt;
            const itemQuantity = row.querySelector('.quantity').innerText;
            const itemPrice = row.querySelector('.price').innerText;

            orderSummary.push({ itemName, itemQuantity, itemPrice });
        });

        return orderSummary;
    }

    function removeItem(productName) {
        let products = JSON.parse(localStorage.getItem('orderItems')) || [];
        const updatedProducts = products.filter(item => item.productName !== productName);
        localStorage.setItem('orderItems', JSON.stringify(updatedProducts));
        loadOrderSummary();
    }

    function loadOrderSummary() {
        const storedItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        let totalPrice = 0;
        orderItemsContainer.innerHTML = '';

        storedItems.forEach(item => {
            const { productName, quantity, itemPrice, imgSrc } = item;
            const orderRow = document.createElement('tr');

            const itemCell = document.createElement('td');
            itemCell.classList.add('item');
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = productName;
            itemCell.appendChild(img);

            const quantityCell = document.createElement('td');
            quantityCell.classList.add('quantity');
            quantityCell.innerText = determineQuantityDisplay(productName, quantity);

            const priceCell = document.createElement('td');
            priceCell.classList.add('price');
            priceCell.innerText = `Rs. ${itemPrice.toFixed(2)}`;

            const actionsCell = document.createElement('td');
            actionsCell.classList.add('actions');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fa fa-window-close" aria-hidden="true"></i>';
            removeBtn.addEventListener('click', () => removeItem(productName));
            actionsCell.appendChild(removeBtn);

            orderRow.appendChild(itemCell);
            orderRow.appendChild(quantityCell);
            orderRow.appendChild(priceCell);
            orderRow.appendChild(actionsCell);

            orderItemsContainer.appendChild(orderRow);
            totalPrice += itemPrice;
        });

        totalPriceElement.innerText = `Rs. ${totalPrice.toFixed(2)}`;
    }

    loadOrderSummary();
});
