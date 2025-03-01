src="https://cdn.emailjs.com/dist/email.min.js";
src="https://smtpjs.com/v3/smtp.js";

// Burger menu toggle
burger = document.querySelector('.burger');
navbar = document.querySelector('.navbar');
rightnav = document.querySelector('.right-nav');
navList = document.querySelector('.nav-list');

burger.addEventListener('click', () => {
   rightnav.classList.toggle('v-class-resp');
   navList.classList.toggle('v-class-resp');
   navbar.classList.toggle('h-nav-resp');
});

// Cart interactions
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let viewcart = document.getElementById('view-cart');
let closecart = document.querySelector('.close');
let viewbutton = document.getElementById('viewcartbutton');

closecart.addEventListener('click', () => {
   body.classList.toggle('showCart');
});

iconCart.addEventListener('click', () => {
   body.classList.toggle('showCart');
});

viewcart.addEventListener('click', (event) => {
   body.classList.toggle('showCart');
});
if(viewbutton){
   viewbutton.addEventListener('click', () => {
      body.classList.toggle('showCart');
   });
}
document.querySelector('.checkout').addEventListener('click', () => {
  // Check if the cart is empty
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length > 0) {
      // If the cart has items, redirect to checkout page
      window.location.href = 'checkoutpage.html';
  } else {
      // If the cart is empty, show an alert or message
      alert('Your cart is empty. Please add items to your cart before proceeding to checkout.');
  }
});



// Function to toggle cart and redirect
function toggleCartAndRedirect() {
   document.body.classList.toggle('showCart');
}
 

// Add products to HTML
let listProductHTML = document.querySelector('.listProduct');
let listProduct = [];

const addDataToHTML = () => {
  listProductHTML.innerHTML = ''; // Clear the HTML container before populating it
  if (listProduct.length > 0) {
      listProduct.forEach(products => {
          const price = products.price ? parseFloat(products.price).toFixed(2) : '0.00'; // Format price to 2 decimal places

          
          const newProduct = document.createElement('div');
          newProduct.classList.add('items'); // Add a class for styling

          // Populate the innerHTML with product data
          newProduct.innerHTML = `
              <img src="${products.image}" alt="${products.name}"> <!-- Display product image -->
              <h2>${products.name}</h2> <!-- Display product name -->
              <div class="price">$${price}</div> <!-- Display product price -->
              <button class="addCart">Add To Cart</button> <!-- Button to add product to cart -->
          `;

          // Append the product div to the product list container
          listProductHTML.appendChild(newProduct);
      });
  }
}




// Initialize Cart
// Initialize Cart
let cart = [];

// Function to update cart in local storage
const updateLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to retrieve cart data from local storage
const getCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
    renderCartItems();
  }
};

// Function to render cart items dynamically
const renderCartItems = () => {
  const listCart = document.querySelector('.listCart');
  if (!listCart) return; // Only proceed if listCart exists on the page

  listCart.innerHTML = ''; // Clear existing cart items
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('items');
    cartItem.innerHTML = `
      <div class="image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="name">${item.name}</div>
      <div class="totalPrice">$${(item.price * item.quantity).toFixed(2)}</div>
      <div class="quantity">
        <span class="minus" data-index="${index}">&lt;</span>
        <span>${item.quantity}</span>
        <span class="plus" data-index="${index}">&gt;</span>
      </div>
      <button class="remove" data-index="${index}">Remove</button>
    `;
    listCart.appendChild(cartItem);
  });

  updateCartCount();
};

// Function to update cart count in header
const updateCartCount = () => {
  const cartCount = document.querySelector('.icon-cart span');
  if (cartCount) {
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
  }
};

// Function to add item to the cart in both frontend and backend
const addToCart = (name, price, image) => {
  const existingItemIndex = cart.findIndex(item => item.name === name);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity++;
    updateCartInDatabase(cart[existingItemIndex], 'update');
  } else {
    const newItem = { name, price: parseFloat(price), image, quantity: 1 };
    cart.push(newItem);
    updateCartInDatabase(newItem, 'add');
  }

  updateLocalStorage();
  renderCartItems();
};


// Update cart in SQL database
const updateCartInDatabase = (item, action) => {
  fetch('update_cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: action,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        alert('Error updating cart in database');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve cart from local storage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const orderTotal = document.getElementById('order-total');

  let total = 0;

  // Populate cart items
  cartItemsContainer.innerHTML = ''; // Clear existing items
  cart.forEach((item) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
          <div class="name">${item.name}</div>
          <div class="quantity">Qty: ${item.quantity}</div>
          <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
      `;
      total += item.price * item.quantity;
      cartItemsContainer.appendChild(cartItem);
  });

  // Update total
  orderTotal.textContent = total.toFixed(2);
});



document.addEventListener('click', (event) => {
  if (event.target.classList.contains('addCart')) {
    const parent = event.target.closest('.items'); // Get the parent div
    const name = parent.querySelector('h2').textContent;
    const price = parent.querySelector('.price').textContent.replace('$', '');
    const image = parent.querySelector('img').src;

    addToCart(name, price, image); // Call your addToCart function
    alert(`${name} added to cart!`);
  }
});


// Event listener for adding items to cart
// Event listener for modifying cart item quantity or removing item
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('plus')) {
    const index = event.target.dataset.index;
    cart[index].quantity++;
    updateCartInDatabase(cart[index], 'update'); // Update cart in DB
    updateLocalStorage();
    renderCartItems();
  } else if (event.target.classList.contains('minus')) {
    const index = event.target.dataset.index;
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      updateCartInDatabase(cart[index], 'update'); // Update cart in DB
      updateLocalStorage();
      renderCartItems();
    }
  } else if (event.target.classList.contains('remove')) {
    const index = event.target.dataset.index;
    const item = cart.splice(index, 1)[0];
    updateCartInDatabase(item, 'remove'); // Remove item from DB
    updateLocalStorage();
    renderCartItems();
  }
});

// Initialize cart on any page with relevant structure
document.addEventListener('DOMContentLoaded', () => {
  getCartFromLocalStorage(); 
});

const initApp = () => {
  fetch('http://localhost/DBPROJECTWEBSITE/backend.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      listProduct = data;
      addDataToHTML(); // Dynamically renders products.
    })
    .catch(error => {
      
    });
};


// document.getElementById("checkout-form").addEventListener("submit", function (e) {
//   e.preventDefault();

//   // Collect form data
//   const data = {
//       email: document.getElementById("email").value,
//       newsletter: document.getElementById("newsletter").checked,
//       fname: document.getElementById("fname").value,
//       lname: document.getElementById("lname").value,
//       street: document.getElementById("street").value,
//       city: document.getElementById("city").value,
//       zip: document.getElementById("zip").value,
//       paymentMethod: document.getElementById("payment-method").value,
//   };

//   // Send data to server
//   fetch("http://localhost:3000/checkout", {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//   })
//       .then((response) => response.json())
//       .then((result) => {
//           alert("Order placed successfully!");
//           console.log(result);
//       })
//       .catch((error) => {
//           console.error("Error:", error);
//       });
// });



// App Start Point
initApp();


// Event listener for adding items to cart
// Event listener for adding items to the cart (event delegation)
// document.addEventListener('click', (event) => {
//    if (event.target.classList.contains('addCart')) {
//      const name = event.target.dataset.name;
//      const price = event.target.dataset.price;
//      const image = event.target.dataset.image;
 
//      addToCart(name, price, image);  // Add item to cart
//      alert(`${name} added to cart!`);
//    }
//  });
 

// Initialize app and fetch product data
// const initApp = () => {
//    fetch('prods.json')
//    .then(response => response.json())
//    .then(data => {
//       listProduct = data;
//       addDataToHTML();
//    })
//    .catch(error => {
//       console.error('Error fetching product data:', error);
//    });
// }

// initApp();
