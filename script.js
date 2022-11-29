
import {
    getArrayOfRandomNumbers,
    appendElements,
    Product,
    listItems,
    getTimeForCaching as time,
    pageIDProducts as products,
    pageIDBasket as basket,
    pageIDHome as home,
    MAX_COUNTDOWN_TIME as MAX_TIME
} from "./module.js";


/**I add time to the end of time filename, so the browser will refresh it every time it reloads */
const json_location = "products.json?v="+time;

/**Load data from a separated JSON file, where I store all info of the products*/
async function getData(documentID){

    const response = await fetch(json_location);
    const data = await response.json();

    checkDocumentID(documentID, data);
}


const onLoadEvents = (event) =>{
    const currentDocument = event.target.querySelector("html");
    const currentDocumentID = currentDocument.getAttribute("data-page-id")

    console.log(currentDocumentID);
    getData(currentDocumentID);

}

/** When the page is loaded, it will call the onLoadEvents function which reads the JSON,
 * and check which subpage is it currently on*/
window.onload = onLoadEvents;

/*This function checks which page is it currently on, and then pass the appropriate arguments*/
function checkDocumentID(documentID, jsonData){
    switch(documentID){
        case home:
            for(let i=0;i<listItems.length;i++){
                if(listItems[i].querySelector("a").innerText.toLowerCase() == home.toLowerCase()){
                    listItems[i].style.textDecoration = "underline";
                }
            }
            useDataOnHome(jsonData);
            break;
        case products:
            break;
        case basket:
            for(let i=0;i<listItems.length;i++){
                if(listItems[i].querySelector("a").innerText.toLowerCase() == basket.toLowerCase()){
                    listItems[i].style.textDecoration = "underline";
                }
            }
            break;
    }
}

/**
* Settings for the "Add to basket" button
* */
const addBasketBtn = document.createElement("button");
addBasketBtn.classList.add("add-to-basket-button");
addBasketBtn.innerText = "Add to basket";

/**/


function useDataOnHome(jsonData){

    const bar = document.querySelector(".my-bar");

    loadProductsIntoLatestBar(jsonData);

    bar.style.setProperty("--fill-bar-duration", (MAX_TIME - 1).toString() + "s");

    setInterval(timer, 1000);

    let index = MAX_TIME;
    //in {MAX_TIME}(defined in the external module) seconds the newest products bar will be reloaded,
    // and new products will be rendered randomly
    function timer(){
        if(index == MAX_TIME){
            bar.classList.add("anim");
        }
        index--;
        if(index == 0){
            loadProductsIntoLatestBar(jsonData);
            index = MAX_TIME;
            bar.classList.remove("anim");
        }
    }
}

/**Load the newest products bar */
function loadProductsIntoLatestBar(jsonData){
    const latestProductsContainer = document.querySelector(".latest-products-container");
    latestProductsContainer.innerHTML = "";

    const latestProductBox = document.createElement("div");
    latestProductBox.style.setProperty("--delay-time", MAX_TIME - 1 + "s");
    latestProductBox.classList.add("latest-product-box");

    const products = jsonData.products;

    const productImage = document.createElement("img");

    const arrayOfRandoms = getArrayOfRandomNumbers(products.length);

    const imagePath = "pics/products/";

    for(let i=0;i<4;i++){

        const productImgID = products[arrayOfRandoms[i]].image_id;

        productImage.src = imagePath + productImgID + ".jpg?v=" + time;

        latestProductBox.setAttribute("data-content-value", products[arrayOfRandoms[i]].name)

        appendElements(latestProductBox, [productImage, addBasketBtn])

        const ltbClone = latestProductBox.cloneNode(true);
        ltbClone.jsonObject = products[arrayOfRandoms[i]];
        ltbClone.imageFolder = imagePath;
        ltbClone.addEventListener("click", checkEventSource);


        latestProductsContainer.append(ltbClone);
    }
}

//in this function the source of the event is checked, whether it is the container div or the image
function checkEventSource(event){


    const target = event.target;

    //check if it is the container element
    //by checking if it has children or not; only the box container element has children{img, btn}
    if(target.hasChildNodes()){
        goToProductPage(target.jsonObject);
    }
    //if the img is clicked, the same event will be triggered
    if(target.tagName == "IMG"){
        goToProductPage(target.parentNode.jsonObject)
    }else if(target.tagName == "BUTTON"){
        addToBasket(event);
    }



}

//open the page of product
function goToProductPage(object){

}

//an array containing the elements of basket
let basketArray = [];


const popupStates = {
    "non-existing":"An item has been added to the basket",
    "existing":"This item is already in your basket",
    "removed":"Item has been removed from the basket"
}

/*A function which adds products to the basket*/
function addToBasket(event){
    const jsonObject = event.target.parentNode.jsonObject;
    const imageFolder = event.target.parentNode.imageFolder;

   let index = 0;
   while(index < basketArray.length &&
       basketArray[index].jsonObject.name != jsonObject.name){
       index++;
   }

   if(index<basketArray.length){
        //item already exits in the array
       popup(popupStates["existing"])
   }else{
       //new item added
       basketArray.push(
           new Product(jsonObject, imageFolder, 1)
       );
       setLocalStorage();
       popup(popupStates["non-existing"])
       updateBasket();
   }



    checkIfBasketIsEmpty();


}

let popupBarCount = 0;

//popup for successfully adding an item to the basket, or a message if it already exists there
function popup(popupState){
    const popupTextContainer = document.createElement("div");
    popupTextContainer.classList.add("popup-text");

    const popupBar = document.createElement("div");
    popupBar.classList.add("popup-bar");
    popupBar.classList.add("anim-popup");

    popupTextContainer.innerText = popupState;

    popupBar.append(popupTextContainer);

    const pbClone = popupBar.cloneNode(true);
    document.body.append(pbClone);

    popupBarCount++;


    if(popupBarCount == 5){
        setTimeout(()=>{
            flush();
        }, 2650)

    }


}

//clear unused popup elements from the body
function flush(){

    const popupBoxes = document.querySelectorAll(".popup-bar");

    popupBoxes.forEach(box => box.remove());

    popupBarCount = 0;
}



/*** */


/***Interaction for responsive navigation */
const toggleMenuBtn = document.querySelector(".toggle-menu");

const navBar = document.querySelector("nav");
const navBarClassList = navBar.classList;

const toggleMenuBtnImage = toggleMenuBtn.querySelector("img");

toggleMenuBtn.addEventListener("click", () => {
    navBarClassList.toggle("visible-menu");
    if(navBarClassList.contains("visible-menu")) toggleMenuBtnImage.src = "pics/icons/close.png";
    else toggleMenuBtnImage.src = "pics/icons/menu.png";
});
/** */


/** Basket script*/

const basketBtn = document.querySelector(".basket-button");
const basketElement = document.querySelector(".basket");
const closeBasketBtn = document.querySelector(".close-basket-button");

const basketEmptyText = document.createElement("p");
basketEmptyText.classList.add("basket-empty-text");
basketEmptyText.innerText = "Basket is empty!";

function checkIfBasketIsEmpty(){
    if(basketArray.length == 0){
        basketEmptyText.classList.add("visible-menu");
        basketElement.append(basketEmptyText);
    }else{
        basketEmptyText.classList.remove("visible-menu");
    }

    return basketArray.length == 0;
}

basketBtn.onclick = () =>{
    basketBtn.classList.toggle("not-visible");
    basketElement.classList.toggle("visible-menu");

    checkIfBasketIsEmpty();
}

closeBasketBtn.onclick = () =>{
    basketBtn.classList.toggle("not-visible");
    basketElement.classList.toggle("visible-menu");
}



const basketProducts = document.querySelector(".basket-products");

function updateBasket(){
    checkIfBasketIsEmpty();
    const renderedCode =
        `<div class="basket-product grid">
                        <div class="product-image">
                            <img src="${basketArray[basketArray.length-1].imageFolder}${basketArray[basketArray.length-1].jsonObject.image_id}.jpg" alt="">
                        </div>
                        <div class="product-misc" data-index="${basketArray.length-1}">
                            <div class="product-title">${basketArray[basketArray.length-1].jsonObject.name}  $${basketArray[basketArray.length-1].jsonObject.price}</div>
                            <div class="interaction-bar">
                                <div class="product-qty">
                                    <label for="product-quantity" style="margin-right: 10px">Qty</label>
                                    <input id="product-quantity" value=${basketArray[basketArray.length-1].qty} type="number" autocomplete="off" min="1" max="10">
                                    <div class="remove-item-from-basket"><img src="pics/icons/close.png" title="Remove item from basket" alt="remove item"></div>
                                </div>
                            </div>
                            <div class="alert-bar"></div>
                        </div>
                    </div>`;
    basketProducts.innerHTML += renderedCode;



}



function reRenderBasket(parent){
    basketProducts.innerHTML = "";

    const indexInTheArray = parent.getAttribute("data-index");

    let tempArray = [];

    basketArray[indexInTheArray] = undefined;

    for(let elem of basketArray){
        if(elem != undefined){
            tempArray.push(elem);
        }
    }

    basketArray = tempArray;

    setLocalStorage();

    if(!(checkIfBasketIsEmpty())){
        for(let i=0;i<basketArray.length;i++){
            const renderedCode =
                `<div class="basket-product grid">
                        <div class="product-image">
                            <img src="${basketArray[i].imageFolder}${basketArray[i].jsonObject.image_id}.jpg" alt="">
                        </div>
                        <div class="product-misc" data-index="${i}">
                            <div class="product-title">${basketArray[i].jsonObject.name}  $${basketArray[i].jsonObject.price}</div>
                            <div class="interaction-bar">
                                <div class="product-qty">
                                    <label for="product-quantity" style="margin-right: 10px">Qty</label>
                                    <input id="product-quantity" value=${basketArray[i].qty} type="number" autocomplete="off" min="1" max="10">
                                    <div class="remove-item-from-basket"><img src="pics/icons/close.png" title="Remove item from basket" alt="remove item"></div>
                                </div>
                            </div>
                            <div class="alert-bar"></div>
                        </div>
                    </div>`;
            basketProducts.innerHTML += renderedCode;
        }
    }

    popup(popupStates["removed"]);

}


document.addEventListener("click", (event)=>{
  if(event.target.parentNode.classList.contains("remove-item-from-basket")){
      reRenderBasket(event.target.parentNode.parentNode.parentNode.parentNode);
  }
});


//check if the number entered for the amount of product is correct or not
document.addEventListener("change", (event)=>{

    if(event.target.id == "product-quantity"){

        const inputObject = event.target;

        const parent = inputObject.parentNode.parentNode.parentNode;

        const index = parent.getAttribute("data-index");

        const alertBar = parent.querySelector(".alert-bar");

        const MIN = parseInt(inputObject.getAttribute("min"));
        const MAX = parseInt(inputObject.getAttribute("max"));

        alertBar.innerText = `Give a number between ${MIN} and ${MAX}`;

        const value = parseInt(inputObject.value);

        if(value < MIN || value > MAX || value == NaN){
            inputObject.style.setProperty("--border-color", "#f3702e");
            alertBar.classList.add("visible-menu");
        }else{
            inputObject.style.setProperty("--border-color", "gray");
            alertBar.classList.remove("visible-menu");
            basketArray[index].qty = value;
        }

   }
});

function setLocalStorage(){

    localStorage.setItem("array", JSON.stringify(basketArray));
}