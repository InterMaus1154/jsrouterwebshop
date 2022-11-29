import {getTimeForCaching as getTime} from "./interface.js";

const json_url = "./products.json?v="+getTime;


/**Use then->Response when getting data */
export default async function GetProducts(){
    const response = await fetch(json_url);
    return await response.json();
}