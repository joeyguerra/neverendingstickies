const MakeDevice = document => {
    let canTouch = ("createTouch" in document)
    return {
        CANTOUCH: canTouch,
        MOUSEDOWN: canTouch ? "touchstart" : "mousedown",
        MOUSEMOVE: canTouch ? "touchmove" : "mousemove",
        MOUSEUP: canTouch ? "touchend" : "mouseup",
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