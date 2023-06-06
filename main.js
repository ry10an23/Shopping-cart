"use strict";

// Variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-centre");

// Cart
let cart = [];
// buttons
let buttonsDOM = [];

//  Getting the Products
class Products {
  async getProducts() {
    // Async, await are alawys be togehther.
    try {
      let result = await fetch("products.json");
      let data = await result.json();

      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// Display Products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      // Displaying products dynamically
      result += `
      <!-- SINGLE PRODUCT -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"> add to bag </i>
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
      <!-- End of Products -->
      `;
    });
    productsDom.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;

        // Get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        // Add products to the cart
        cart = [...cart, cartItem];

        // Save cart in local storage
        // Set cart values
        // Display cart item
        // Show the cart
      });
    });
  }
}

// Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // Get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});

// DOMContentLoaded : Event fired when the HTML page has finished loading and the DOM tree construction is complete.
// JSON.stringify() :  convert a given JS object or value into a JSON string
