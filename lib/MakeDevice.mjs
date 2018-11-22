const MakeDevice = document => {
<<<<<<< HEAD
    let canTouch = ("createTouch" in document)
    return {
        CANTOUCH: canTouch,
        MOUSEDOWN: canTouch ? "touchstart" : "mousedown",
        MOUSEMOVE: canTouch ? "touchmove" : "mousemove",
        MOUSEUP: canTouch ? "touchend" : "mouseup",
=======
    return{
        CANTOUCH: ("createTouch" in document),
        MOUSEDOWN: this.CANTOUCH ? "touchstart" : "mousedown",
        MOUSEMOVE: this.CANTOUCH ? "touchmove" : "mousemove",
        MOUSEUP: this.CANTOUCH ? "touchend" : "mouseup",
>>>>>>> some tests passing
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