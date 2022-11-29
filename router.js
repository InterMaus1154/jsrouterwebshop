import {basketAction, contactAction, homeAction, productstAction,} from "./helper.js";
import {index} from "./index.js";
import {uniqueProductAction} from "./interface.js";

const nav = document.querySelector("#nav");
const anchrs = nav.querySelectorAll("a");

const pages = {
    home : "#home",
    products : "#products",
    contact : "#contact",
    basket : "#basket",
    productPage : "productPage",
    noProduct : "noProduct"
}


document.addEventListener("DOMContentLoaded", ()=>{
    if(window.location.hash.trim() == 0){
        window.location.hash = pages.home;
    }
    index();
    examineTarget(window.location.hash);
    
});

for(let i=0;i<anchrs.length;i++){

    anchrs[i].removeUnderline = () =>{
        anchrs[i].style.textDecoration = "none";
    }

    anchrs[i].addEventListener("click", event =>{
        event.preventDefault();
        window.location.hash = anchrs[i].hash;
        examineTarget(window.location.hash);
    });
}


let currentPage = 0;

export const contentContainer = document.querySelector("#container");

export function examineTarget(selectedOption){


    contentContainer.attach = (page, content, script) =>{
        highlightCurrentPage(page);
        contentContainer.innerHTML = content;
        if(script != null){
            script();
        }

    }

    switch(selectedOption){
        case pages.home:
            if(currentPage != pages.home){
                getInnerHTML("components/home.html").then((response)=>{
                    contentContainer.attach(pages.home,response,homeAction);
                });
                currentPage = pages.home;
            }
            break;
        case pages.products:
            if(currentPage != pages.products){
                getInnerHTML("components/products.html").then((response)=>{
                    contentContainer.attach(pages.products,response, productstAction);
                });
                currentPage = pages.products;
            }
            break;
        case pages.contact:
            if(currentPage != pages.contact){
                getInnerHTML("components/contact.html").then((response)=>{
                    contentContainer.attach(pages.contact,response, contactAction);
                });
                currentPage= pages.contact;
            }
            break;
        case pages.basket:
            if(currentPage != pages.basket){
                getInnerHTML("components/basket.html").then((response)=>{
                    contentContainer.attach(pages.basket,response, basketAction);
                });
                currentPage = pages.basket;
            }
            break;
        case pages.productPage:
            if(currentPage != pages.products){
                getInnerHTML("components/productpage.html").then(response =>{
                   contentContainer.attach(pages.products, response, uniqueProductAction);
                });
            }
            currentPage = pages.products;
            break;
        case pages.noProduct:
            getInnerHTML("components/404.html").then(response =>{
               contentContainer.attach("", response, null);
            });

            break;
        default:
            if(!(location.href.includes("products"))){
                getInnerHTML("components/404.html").then((response)=>{
                    contentContainer.attach("", response, null);
                });
            }else{
                examineTarget(pages.productPage);
            }

    }

    const basketBtn = document.querySelector(".basket-button");

    currentPage == pages.basket ? basketBtn.classList.add("not-visible") : basketBtn.classList.remove("not-visible");

}

export function getCurrentPage(){
    return currentPage;
}

function highlightCurrentPage(hash){
    for(let i=0;i<anchrs.length;i++){
        if(anchrs[i].hash != hash){
            anchrs[i].removeUnderline();
        }else{
            anchrs[i].style.textDecoration = "underline";
        }
        
    }
}


async function getInnerHTML(page){
    const response = await fetch(page);
    const data = await response.text();
    return data;
}