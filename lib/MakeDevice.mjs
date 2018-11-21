const MakeDevice = document => {
    return{
        CANTOUCH: ("createTouch" in document),
        MOUSEDOWN: this.CANTOUCH ? "touchstart" : "mousedown",
        MOUSEMOVE: this.CANTOUCH ? "touchmove" : "mousemove",
        MOUSEUP: this.CANTOUCH ? "touchend" : "mouseup",
        CLICK: "click",
        DOUBLECLICK: "dblclick",
        KEYUP: "keyup",
        SEARCH: "search",
        INPUT: "input",
        BLUR: "blur",
        UNLOAD: "unload",
        HASHCHANGE: "hashchange"
    }
}

export default MakeDevice