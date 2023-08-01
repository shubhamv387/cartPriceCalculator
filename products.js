// format number to Indian rupee
let rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

let totalPrice = 0;

// Getting all the products and total price
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(
      "https://crudcrud.com/api/c0f004edf76f441f9a2b3837f101d568/productDatas"
    )
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        // console.log(response.data[i]);
        totalPrice += Number(response.data[i].productPrice);
        showDataOnScreen(response.data[i]);
      }
      document.getElementById("price").innerText = rupee.format(totalPrice);
    })
    .catch((err) => {
      document.getElementById("price").innerText = rupee.format(totalPrice);
      console.log(err.message);
    });
});

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputPrice = document.getElementById("inputProductPrice");
  const inputName = document.getElementById("inputProductName");
  let showTotalPrice = document.getElementById("price");

  totalPrice += parseInt(inputPrice.value);

  let productObj = {
    productName: inputName.value.trim(),
    productPrice: inputPrice.value,
  };

  axios
    .post(
      "https://crudcrud.com/api/c0f004edf76f441f9a2b3837f101d568/productDatas",
      productObj
    )
    .then((response) => {
      //   console.log(response.data);
      showDataOnScreen(response.data);
      showTotalPrice.innerText = rupee.format(totalPrice);

      inputName.value = "";
      inputPrice.value = "";
    })
    .catch((err) => console.log(err.message));
});

function showDataOnScreen(productObj) {
  const productList = document.getElementById("productList");
  const product = document.createElement("li");
  product.className =
    "d-flex justify-content-between list-group-item text-capitalize list-group-item-warning";

  product.innerHTML = `<span><span class="fw-bold">Name: </span>${
    productObj.productName
  }<span class="fw-bold">, Price: </span> ${rupee.format(
    productObj.productPrice
  )}</span>`;

  //   console.log(product);

  let delBtn = document.createElement("button");
  delBtn.className = "btn btn-danger btn-sm";
  delBtn.style.height = "fit-content";

  delBtn.innerHTML = "DELETE";

  product.appendChild(delBtn);
  productList.appendChild(product);

  delBtn.addEventListener("click", () => {
    axios
      .delete(
        `https://crudcrud.com/api/c0f004edf76f441f9a2b3837f101d568/productDatas/${productObj._id}`
      )
      .then((response) => {
        totalPrice -= parseInt(productObj.productPrice);
        document.getElementById("price").innerText = rupee.format(totalPrice);
        productList.removeChild(product);
      })
      .catch((err) => console.log(err.message));
  });
}

// Ading a filter feature
const filter = document.getElementById("filter");

filter.addEventListener("keyup", async (e) => {
  // console.log(filter.value.trim());
  const productList = document.getElementById("productList");
  const productListPopUp = document.getElementById("productListPopUp");
  productListPopUp.innerHTML = "";

  // convert text to lowercase
  var text = e.target.value.toLowerCase().trim();

  //Filtering from crudcrud backend data directly
  if (!text) productListPopUp.className = "d-none";
  else productListPopUp.className = "list-group shadow";

  await axios
    .get(
      `https://crudcrud.com/api/c0f004edf76f441f9a2b3837f101d568/productDatas`
    )
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        if (
          res.data[i].productName.trim().toLowerCase().indexOf(text) !== -1 ||
          res.data[i].productPrice.trim().toLowerCase().indexOf(text) !== -1
        ) {
          const product = document.createElement("li");
          product.className =
            "d-flex fs-5 justify-content-between list-group-item text-capitalize list-group-item-warning";

          product.innerHTML = `<span><span class="fw-bold">Name: </span>${
            res.data[i].productName
          }<span class="fw-bold">, Price: </span> ${rupee.format(
            res.data[i].productPrice
          )}</span>`;
          productListPopUp.appendChild(product);
        }
      }
    })
    .catch((err) => console.log(err.message));

  // Filtering from onscreen data
  const product = productList.getElementsByTagName("li");

  // Creating array from HTML Collections
  productArray = Array.from(product);

  productArray.forEach((e) => {
    if (
      e.childNodes[0].childNodes[1].textContent
        .trim()
        .toLowerCase()
        .indexOf(text) === -1 &&
      e.childNodes[0].childNodes[3].textContent.trim().indexOf(text) === -1
    ) {
      e.className = "d-none";
    } else {
      e.className =
        "d-flex justify-content-between list-group-item text-capitalize list-group-item-warning";
    }
  });
});
