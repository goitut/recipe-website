
const products = [
    {
        id: 1,
        name: 'Wireless Ergonomic Mouse',
        price: 29.99,
        image: 'https://placehold.co/400x300/e2e8f0/4a5568?text=Mouse'
    },
    {
        id: 2,
        name: 'Mechanical Keyboard',
        price: 89.9977677888,
        image: 'https://placehold.co/400x300/e2e8f0/4a5568?text=Keyboard'
    },
    { 
        id: 3, 
        name: '4K Ultra-HD Monitor', 
        price: 349.99, 
        image: 'https://placehold.co/400x300/e2e8f0/4a5568?text=Monitor' 
    },
    { 
        id: 4, 
        name: 'Noise-Cancelling Headphones', 
        price: 199.99, 
        image: 'https://placehold.co/400x300/e2e8f0/4a5568?text=Headphones' 
    },
    { 
        id: 5, 
        name: 'Webcam with Ring Light', 
        price: 59.99, 
        image: 'https://placehold.co/400x300/e2e8f0/4a5568?text=Webcam' 
    },
    { 
        id: 6, 
        name: 'Large Desk Mat', 
        price: 24.99, 
        image: 'https://placehold.co/400x300/e2e8f0/4a5568?text=Desk+Mat' 
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsList = document.getElementById("products-list");
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartEmptyMsgEl = document.getElementById('cart-empty-msg');
const clearCartBtn = document.getElementById('clear-cart');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function createElement(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    if (text) {
        el.textContent = text;
    }
    return el;
}

function renderProducts() {
    productsList.innerHTML = ''; 
    products.forEach(product => {
        const prod = createElement("div", "product-card bg-white rounded-lg shadow-md overflow-hidden");
        const img = createElement("img", "w-full h-48 object-cover");
        img.src = product.image;
        img.alt = product.name;

        const infoDiv = createElement("div", "p-4");
        const nameH3 = createElement('h3', 'text-lg font-semibold text-gray-800', product.name)
        const priceP = createElement('p', 'text-gray-600 mt-1', `$${product.price.toFixed(2)}`);
        const button = createElement('button', 'add-to-cart-btn mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 ', 'Add to Cart');
        button.dataset.id = product.id;

        infoDiv.append(nameH3, priceP, button);
        prod.append(img, infoDiv);
        productsList.appendChild(prod);
    })
}

function renderCart() {
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyMsgEl.style.display = 'block';
        clearCartBtn.disabled = true;
    } else {
        cartEmptyMsgEl.style.display = 'none';
        clearCartBtn.disabled = false;
        cart.forEach(item => {
            const cartItemEl = createElement('div', 'cart-item flex justify-between items-center py-3');
            const leftDiv = createElement('div');
            const nameP = createElement('p', 'font-semibold text-gray-800', item.name);
            const quantityP = createElement('p', 'text-sm text-gray-600', `$${(item.price.toFixed(2))} x ${item.quantity}`);
            leftDiv.append(nameP, quantityP);

            const rightDiv = createElement('div', 'flex items-center gap-2');
            const totalP = createElement('p', 'font-bold text-gray-800', `$${(item.price * item.quantity).toFixed(2)}`);
            const removeButton = createElement('button', 'remove-from-cart-btn text-red-500 hover:text-red-700');
            removeButton.dataset.id = item.id;
            removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>`;
            rightDiv.append(totalP, removeButton);

            cartItemEl.append(leftDiv, rightDiv);
            cartItemsEl.appendChild(cartItemEl);
        });


    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1});
    }

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    if (cartItemIndex > -1) {
        const item = cart[cartItemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(cartItemIndex, 1);
        }
    }

    saveCart();
    renderCart();
}

productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
    }
});

cartItemsEl.addEventListener('click', (e) => {
    const removeButton = e.target.closest('.remove-from-cart-btn');
    if (removeButton) {
        const productId = parseInt(removeButton.dataset.id);
        removeFromCart(productId);
    }
    
});

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

clearCartBtn.addEventListener('click', clearCart);


renderProducts();
renderCart()