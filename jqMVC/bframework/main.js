const bMVC = $.fn.bMVC = (selector)=>{
    return document.getElementsByTagName(`${selector}`);
}

bMVC.prototype.sayHi = ()=>{
    return "selam";
}