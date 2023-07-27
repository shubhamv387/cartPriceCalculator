const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputPrice = document.getElementById("inputProductPrice");
  const inputName = document.getElementById("inputProductName");
  let showTotalPrice = document.getElementById("price");

  let totalPrice = Number(showTotalPrice.innerText) + Number(inputPrice.value);

  let productObj = {
    productName: inputName.value.trim(),
    productPrice: inputPrice.value,
  };

  axios
    .post(
      "https://crudcrud.com/api/061c925450594488937c9bdd62cb1150/productDatas",
      productObj
    )
    .then((response) => {
      //   console.log(response.data);
      showDataOnScreen(response.data);
      showTotalPrice.innerText = totalPrice;

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

  product.innerHTML = `<span><span class="fw-bold">Name: </span>${productObj.productName},<span class="fw-bold"> Price: </span> ${productObj.productPrice} INR</span>`;

  //   console.log(product);

  let delBtn = document.createElement("button");
  delBtn.className = "btn btn-danger btn-sm";

  delBtn.innerHTML = "DELETE";

  product.appendChild(delBtn);
  productList.appendChild(product);

  delBtn.addEventListener("click", () => {
    axios
      .delete(
        `https://crudcrud.com/api/061c925450594488937c9bdd62cb1150/productDatas/${productObj._id}`
      )
      .then((response) => {
        let totalPrice = 0;
        axios
          .get(
            "https://crudcrud.com/api/061c925450594488937c9bdd62cb1150/productDatas"
          )
          .then((response) => {
            for (let i = 0; i < response.data.length; i++) {
              // console.log(response.data[i]);
              totalPrice += Number(response.data[i].productPrice);
            }
            document.getElementById("price").innerText = totalPrice;
          })
          .catch((err) => console.log(err));

        productList.removeChild(product);
      })
      .catch((err) => console.log(err));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  let totalPrice = 0;
  axios
    .get(
      "https://crudcrud.com/api/061c925450594488937c9bdd62cb1150/productDatas"
    )
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        // console.log(response.data[i]);
        totalPrice += Number(response.data[i].productPrice);
        showDataOnScreen(response.data[i]);
      }
      document.getElementById("price").innerText = totalPrice;
    })
    .catch((err) => console.log(err));
});
