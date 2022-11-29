
import {addToBasket} from "./helper.js";
import {examineTarget} from "./router.js";
import GetProducts from "./fetchJSON.js";

/*This file is a complete mess, NEVER ask about it*/
/*It is not that messy though, I just store everything here which can be used externally*/
export function appendElements(parent, children){
    for(let i=0;i<children.length;i++){
        parent.append(children[i])
    }
}

export const counter_element = document.querySelector(".counter");

const nav = document.querySelector("nav");

export const listItems = document.querySelectorAll("li");

export class Product{
    constructor(jsonObject, imageFolder, qty) {
        this.jsonObject = jsonObject;
        this.imageFolder = imageFolder;
        this.qty = qty;
    }
}

export const getTimeForCaching = new Date().getTime();

export const pageIDHome = "home";
export const pageIDProducts = "products";
export const pageIDBasket = "basket";

export const MAX_COUNTDOWN_TIME = 10;

const numbersNeeded = 4;
let arrayOfRandoms = [];
function generateRandomNumbers(size){
    const set = new Set();
    for(let i=0;i<numbersNeeded;i++){
        set.add(
            Math.floor(Math.random()*size)
        );
    }
    if(set.size != numbersNeeded){
        generateRandomNumbers();

    }else{
        arrayOfRandoms = Array.from(set);
    }
}


export const getArrayOfRandomNumbers = size =>{
    let numbers = [];
    for(let i=0;i<size;i++){
        numbers[i]=i;
    }

    return shuffle(numbers);
}

function shuffle(o) {
    for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

export function checkEventSource(event){


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




export function goToProductPage(element){
    if(element == undefined){
        return;
    }
    if(typeof element === 'string'){
        window.location.hash = "#products/"+element;
    }else{
        let prodName = element.name;
        window.location.hash = "#products/"+prodName;
    }


    let url = location.href;
    let urlArray = url.split("/");
    for(let i=0;i<urlArray.length;i++){
        if(urlArray[i].includes("products")){
            examineTarget("productPage");
        }
    }

}

export function uniqueProductAction(){


    let url = location.href;
    let urlArray = url.split("/");
    let currentProductName = urlArray[urlArray.length-1];

    GetProducts().then(response =>{
        searchProduct(currentProductName, response.products);
    });

}


function searchProduct(currentProductName, products){

    let index = 0;
    currentProductName = currentProductName.replaceAll("%20", ' ');

    while(index < products.length && products[index].name != currentProductName){
        index++;
    }
    if(index == products.length){
        examineTarget("noProduct");
        return;
    }

    displayProduct(products[index]);
}


function displayProduct(productObject){
    const prodHolder = document.querySelector(".product-holder");

    const productTitle = prodHolder.querySelector(".product-title");

    const productDetails = prodHolder.querySelector(".product-details");
    const productDetailTitle = prodHolder.querySelector(".detail-title");
    const productDetailContent = prodHolder.querySelector(".detail-content");

    productTitle.innerText = productObject.name;

    const title = document.createElement("h1");
    const content = document.createElement("h1");

    prodHolder.append(productTitle);

    for(let [key, value] of Object.entries(productObject)){
        if(key != "image_id" && key != "type" && key != "price" && key != "name"){

            title.innerText = key+": ";
            const tc = title.cloneNode(true);
            productDetailTitle.append(tc);

            content.innerText = value;
            const cc = content.cloneNode(true);
            productDetailContent.append(cc);

            productDetails.append(productDetailTitle);
            productDetails.append(productDetailContent);

            prodHolder.append(productDetails);

        }
    }



}

export const popupStates = {
    "non-existing":"An item has been added to the basket",
    "existing":"This item is already in your basket",
    "removed":"Item has been removed from the basket"
}



export function createElement(tagName, classList, innerText){
    const element = document.createElement(tagName);
    classList.forEach(e => element.classList.add(e));
    element.innerText = innerText;

    return element;
}