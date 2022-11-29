
import {getCurrentPage} from "./router.js";
import {goToProductPage} from "./interface.js";

export function index(){
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

    if (("onhashchange" in window)){
        window.onhashchange = function () {
            location.reload();
            console.log(getCurrentPage());
        }
    }


    setProductEventListener()

}


export function setProductEventListener(){

    const basketBody = document.querySelector(".basket-body");
    const product_all_1 = basketBody.querySelectorAll(".basket-product");

    const prodsInBasket = document.querySelector(".basket-page");
    if(prodsInBasket != null){
        const product_all_2 = prodsInBasket.querySelectorAll(".basket-product");
        product_all_2.forEach(e =>forEachCallBack(e));
    }


    product_all_1.forEach(e =>forEachCallBack(e));


}

function forEachCallBack(e){
    e.addEventListener("click", (event)=>{
        if(!(event.target.parentNode.classList.contains("remove-item-from-basket")) && event.target.tagName != "BUTTON" && event.target.tagName != "INPUT" && event.target.tagName != "LABEL"){
            const obj = e.getAttribute("data-name");
            goToProductPage(obj);
        }

    });
}

