
import GetProducts from "./fetchJSON.js";
import {MAX_COUNTDOWN_TIME as MAX_TIME,
    getArrayOfRandomNumbers,
getTimeForCaching as time,
appendElements,
checkEventSource,
Product,
popupStates,
createElement,
goToProductPage} from "./interface.js";
import {setProductEventListener} from "./index.js";


basketArray = [];



export function homeAction(){
    shareResponse();
    progressBar();
    dropdownSection();
}

function shareResponse(){
    GetProducts().then(response =>{
        loadProductsIntoLatestBar(response.products);
    })
}


const basketBtn = document.querySelector(".basket-button");
const basketElement = document.querySelector(".basket");
const closeBasketBtn = document.querySelector(".close-basket-button");

const basketEmptyText = document.createElement("p");
basketEmptyText.classList.add("basket-empty-text");
basketEmptyText.innerText = "Basket is empty!";



basketBtn.onclick = () =>{
    basketBtn.classList.toggle("not-visible");
    basketElement.classList.toggle("visible-menu");

    checkIfBasketIsEmpty();
}

closeBasketBtn.onclick = () =>{
    basketBtn.classList.toggle("not-visible");
    basketElement.classList.toggle("visible-menu");
}

export function addToBasket(event){
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

       popup(popupStates["non-existing"])
       updateBasket();
       setLocalStorage();
   }



    checkIfBasketIsEmpty();


}

let popupBarCount = 0;

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

function flush(){

    const popupBoxes = document.querySelectorAll(".popup-bar");

    popupBoxes.forEach(box => box.remove());

    popupBarCount = 0;
}

const basketProducts = document.querySelector(".basket-products");

function updateBasket(){
    checkIfBasketIsEmpty();

    basketProducts.innerHTML = "";

    for(let i=0;i<basketArray.length;i++){
        const renderedCode =
            `<div class="basket-product grid" data-name="${basketArray[i].jsonObject.name}" title="${basketArray[i].jsonObject.name}">
                        <div class="product-image">
                            <img src="${basketArray[i].imageFolder}${basketArray[i].jsonObject.image_id}.jpg" alt="">
                        </div>
                        <div class="product-misc" data-index="${i}">
                            <div class="product-title">${basketArray[i].jsonObject.name}  $${basketArray[i].jsonObject.price}</div>
                            <div class="interaction-bar">
                                <div class="product-qty">
                                    <label for="product-quantity" style="margin-right: 10px">Qty</label>
                                    <input id="product-quantity" class="prod-qty" value=${basketArray[i].qty} type="number" autocomplete="off" min="1" max="10">
                                    <div class="remove-item-from-basket"><img src="pics/icons/close.png" title="Remove item from basket" alt="remove item"></div>
                                </div>
                            </div>
                            <div class="alert-bar"></div>
                        </div>
                    </div>`;
        basketProducts.innerHTML += renderedCode;
    }

    setProductEventListener();
    updateBigBasket();
    calculateTotalPrice();
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

    if(!(checkIfBasketIsEmpty())){
        for(let i=0;i<basketArray.length;i++){
            const renderedCode =
                `<div class="basket-product grid"  data-name="${basketArray[i].jsonObject.name}" title="${basketArray[i].jsonObject.name}">
                        <div class="product-image">
                            <img src="${basketArray[i].imageFolder}${basketArray[i].jsonObject.image_id}.jpg" alt="">
                        </div>
                        <div class="product-misc" data-index="${i}">
                            <div class="product-title">${basketArray[i].jsonObject.name}  $${basketArray[i].jsonObject.price}</div>
                            <div class="interaction-bar">
                                <div class="product-qty">
                                    <label for="product-quantity" style="margin-right: 10px">Qty</label>
                                    <input id="product-quantity" class="prod-qty" value=${basketArray[i].qty} type="number" autocomplete="off" min="1" max="10">
                                    <div class="remove-item-from-basket"><img src="pics/icons/close.png" title="Remove item from basket" alt="remove item"></div>
                                </div>
                            </div>
                            <div class="alert-bar"></div>
                        </div>
                    </div>`;
            basketProducts.innerHTML += renderedCode;
        }
    }

    setProductEventListener();
    setLocalStorage();
    updateBigBasket();
    calculateTotalPrice();
    popup(popupStates["removed"]);

}


document.addEventListener("click", (event)=>{
  if(event.target.parentNode.classList.contains("remove-item-from-basket")){
      reRenderBasket(event.target.parentNode.parentNode.parentNode.parentNode);
  }
});

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

            const allQtyInput = document.querySelectorAll(".prod-qty");
            for(let i=0;i<allQtyInput.length;i++){
                let parent_ = allQtyInput[i].parentNode.parentNode.parentNode;
                let index_ = parent_.getAttribute("data-index");
                if(index_ == index){
                    allQtyInput[i].value = basketArray[index].qty;
                }

            }


            calculateTotalPrice();
            setLocalStorage();
        }

   }
});

function checkIfBasketIsEmpty(){
    if(basketArray.length == 0){
        basketEmptyText.classList.add("visible-menu");
        basketElement.append(basketEmptyText);
    }else{
        basketEmptyText.classList.remove("visible-menu");
    }

    return basketArray.length == 0;
}

let isNull = false;

function progressBar(){
    const bar = document.querySelector(".my-bar");
    bar.style.setProperty("--fill-bar-duration", (MAX_TIME - 1).toString() + "s");

    const progressInterval = setInterval(timer, 1000);

    let index = MAX_TIME;
    //in {MAX_TIME}(defined in the external module) seconds the newest products bar will be reloaded,
    // and new products will be rendered randomly
    function timer(){
        if(index == MAX_TIME){
            bar.classList.add("anim");
        }
        index--;
        if(index == 0){
            if(isNull){
                clearInterval(progressInterval);
                console.log("Not home");
                return;
            }
            shareResponse();
            index = MAX_TIME;
            bar.classList.remove("anim");
        }
    }

}


function loadProductsIntoLatestBar(products){
    const addBasketBtn = document.createElement("button");
    addBasketBtn.classList.add("add-to-basket-button");
    addBasketBtn.innerText = "Add to basket";

    const latestProductsContainer = document.querySelector(".latest-products-container");

    if(latestProductsContainer == undefined){
        isNull = true;
        return;
    }else{
        isNull = false;
    }
    latestProductsContainer.innerHTML = "";

    const latestProductBox = document.createElement("div");
    latestProductBox.style.setProperty("--delay-time", MAX_TIME - 1 + "s");
    latestProductBox.classList.add("latest-product-box");

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

function dropdownSection(){
    /**Interaction for responsive dropdown section*/
    const openSectionBtn = document.querySelector(".open-section");
            const arrowImage = openSectionBtn.querySelector("img");
            const descBoxesContainer = document.querySelector(".description-boxes");


            openSectionBtn.addEventListener("click", () => {
                arrowImage.classList.toggle("rotated");
                descBoxesContainer.classList.toggle("visible-menu");
            });
}

export function productstAction(){

}

export function contactAction(){

    const form = document.querySelector("form");
    const input_labels = form.querySelectorAll("label");

    for(let i=0;i<input_labels.length;i++){
        input_labels[i].addEventListener("click", e=>{
            e.target.childNodes.forEach(element => {
                if(element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA") element.focus();
            });
        });
    }

    const MAX_CHAR = 300;

    const textarea = document.querySelector("#form-text-details");
    const submit_btn = document.querySelector("#submit");
    const char_span = document.querySelector("#form-left-char");
    char_span.innerText = MAX_CHAR;
    const textarea_warning = document.querySelector(".textarea-warning");
    const form_warning_msg = document.querySelector("#form-warning-message");



    textarea.setAttribute("maxlength", MAX_CHAR.toString());

    textarea.addEventListener("keydown", ()=> setCharSpan());
    textarea.addEventListener("keyup", ()=> setCharSpan());

    function setCharSpan(){
        char_span.innerText = (MAX_CHAR - textarea.value.length);
        checkTextAreaLength();
    }

    function checkTextAreaLength(){
        if(textarea.value.length === MAX_CHAR){
            textarea.classList.add("textarea-border-warning");
            char_span.classList.add("textarea-charspan-warning");
            textarea_warning.classList.add("visible-menu");
        }else{
            textarea.classList.remove("textarea-border-warning");
            char_span.classList.remove("textarea-charspan-warning");
            textarea_warning.classList.remove("visible-menu");
        }
    }


    const contact_cont = document.querySelector(".contact-pre-form");


    submit_btn.addEventListener("click", e=>{
        e.preventDefault();

        if(formIsValid()){
            form_warning_msg.classList.remove("visible-menu");
            contact_cont.innerHTML = "<h1>Thank you for your request!</h1>";
        }else{
            form_warning_msg.classList.add("visible-menu");
        }

    })


    function formIsValid(){
        const required_fields = document.querySelectorAll(".req_field");

        let isValid = true;

        required_fields.forEach(element =>{
            if(element.value.trim() == 0){
                element.classList.add("textarea-border-warning");
                isValid = false;
            }else{
                element.classList.remove("textarea-border-warning");
            }
        });

        const email_field = document.querySelector("#form-email");

        if(!(validateEmail(email_field.value))){
            isValid = false;
            email_field.classList.add("textarea-border-warning");
        }

        return isValid;
    }

    function validateEmail(email){
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

}

export function basketAction(){
    updateBigBasket();
    calculateTotalPrice();

}

function updateBigBasket(){


    const productsInBasket = document.querySelector(".products-in-basket");

    if(productsInBasket == null){
        return;
    }
    productsInBasket.innerHTML = "";
    for(let i=0;i<basketArray.length;i++){
       const renderedCode =  `<div class="basket-product grid" data-name="${basketArray[i].jsonObject.name}" title="${basketArray[i].jsonObject.name}">
            <div class="product-image">
                <img src="${basketArray[i].imageFolder}${basketArray[i].jsonObject.image_id}.jpg" alt="">
            </div>
            <div class="product-misc" data-index="${i}">
                <div class="product-title" >${basketArray[i].jsonObject.name}  $${basketArray[i].jsonObject.price}</div>
                <div class="interaction-bar">
                    <div class="product-qty">
                        <label for="product-quantity" style="margin-right: 10px">Qty</label>
                        <input id="product-quantity" class="prod-qty" value=${basketArray[i].qty} type="number" autocomplete="off" min="1" max="10">
                            <div class="remove-item-from-basket"><img src="pics/icons/close.png" title="Remove item from basket" alt="remove item"></div>
                    </div>
                </div>
                <div class="alert-bar"></div>
            </div>
        </div>`;
            productsInBasket.innerHTML += renderedCode;
    }
    setProductEventListener();



}

document.addEventListener("DOMContentLoaded", ()=>{
   basketArray = JSON.parse(window.localStorage.getItem("products-in-array"));
    updateBasket();
});


function setLocalStorage(){
    window.localStorage.setItem("products-in-array", JSON.stringify(basketArray));
}


function calculateTotalPrice(){

    const totalPriceElement = document.querySelectorAll(".total");

    let totalPrice = 0;

    for(let i=0;i<basketArray.length;i++){
        let currentPrice = parseInt(basketArray[i].jsonObject.price) * basketArray[i].qty;
        totalPrice += currentPrice;
    }

   for(let i=0;i<totalPriceElement.length;i++){
       totalPriceElement[i].innerText = totalPrice;
   }

}

