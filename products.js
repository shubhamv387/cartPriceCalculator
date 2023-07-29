let totalPrice = 0;

// Getting all the products and total price
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(
      "https://crudcrud.com/api/2f88ff83512a4552939fa714ccf8280e/productDatas"
    )
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        // console.log(response.data[i]);
        totalPrice += Number(response.data[i].productPrice);
        showDataOnScreen(response.data[i]);
      }
      document.getElementById("price").innerText = rupee.format(totalPrice);
    })
    .catch((err) => console.log(err));
});

// format number to Indian rupee
let rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
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
      "https://crudcrud.com/api/2f88ff83512a4552939fa714ccf8280e/productDatas",
      productObj
    )
    .then((response) => {
      //   console.log(response.data);
      showDataOnScreen(response.data);
      showTotalPrice.innerText = rupee.format(totalPrice);

      inputName.value = "";
      inputPrice.value = "";
    })
    .catch((err) => console.log(err));
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
        `https://crudcrud.com/api/2f88ff83512a4552939fa714ccf8280e/productDatas/${productObj._id}`
      )
      .then((response) => {
        totalPrice -= parseInt(productObj.productPrice);
        document.getElementById("price").innerText = rupee.format(totalPrice);
        productList.removeChild(product);
      })
      .catch((err) => console.log(err));
  });
}

// Ading a filter feature
const filter = document.getElementById("filter");

filter.addEventListener("keyup", (e) => {
  // console.log(filter.value.trim());
  const productList = document.getElementById("productList");
  const product = productList.getElementsByTagName("li");

  // convert text to lowercase
  var text = e.target.value.toLowerCase().trim();

  // Creating array from HTML Collections
  productArray = Array.from(product);

  productArray.forEach((e) => {
    if (
      e.childNodes[0].childNodes[1].textContent
        .trim()
        .toLowerCase()
        .indexOf(text) == -1
    ) {
      e.className = "d-none";
    } else {
      e.className =
        "d-flex justify-content-between list-group-item text-capitalize list-group-item-warning";
    }
  });
});
