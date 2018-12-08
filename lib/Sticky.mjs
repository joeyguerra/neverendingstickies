import Mover from "./Mover.mjs"

let mylatesttap
function doubletap() {
    let now = new Date().getTime()
    let timesince = now - mylatesttap
    if((timesince < 600) && (timesince > 0)){
        fireDoubleTapEvent()
    }else{
    // too much time to be a doubletap
    }
    mylatesttap = new Date().getTime();
}
class Sticky {
    constructor(container, model, delegate){
        this.model = model
        this.container = container
        this.delegate = delegate
        this.container.id = this.model.id
        this.mover = new Mover(this.container, this.model, this)
        this.closeButton = this.container.querySelector(".closeButton")
        this.overlay = this.container.querySelector(".overlay")
        this.closeButton.addEventListener(this.delegate.device.CLICK, e => {
            this.close(e)
        }, {once: true}, true)
        this.header = this.container.querySelector("header")
        this.textarea = this.container.querySelector("textarea")
        this.textarea.addEventListener(this.delegate.device.KEYUP, e => {
            this.model.text = e.target.value
            this.save()
        }, false)
        this.header.addEventListener(this.delegate.device.DOUBLECLICK, e => {
            this.delegate.diveIn(this)
        }, {once: true}, true)
        this.header.addEventListener(this.delegate.device.MOUSEDOWN, e => {
            this.mover.dragStart(e)
        }, false)
        this.container.addEventListener(this.delegate.device.CLICK, e => {
            this.delegate.makeActive(this)
        }, true)
        this.model.observe("text", this)
        this.model.observe("top", this)
        this.model.observe("left", this)
        this.model.observe("z", this)
        this.textarea.value = this.model.text
        this.container.style.top = this.model.top + "px"
        this.container.style.left = this.model.left + "px"
        this.container.style.zIndex = this.model.z
    }
    update(key, old, v, m){
        if(key === "text") this.textarea.value = v
        if(key === "top") this.container.style.top = v + "px"
        if(key === "left") this.container.style.left = v + "px"
        if(key === "z") this.container.style.zIndex = v
    }
    release(){

    }
    get device(){
        return this.delegate.device
    }
    get win(){
        return this.delegate.win
    }
    close(e){
        this.release()
        this.delegate.remove(this)
    }
    makeActive(){
        this.delegate.makeActive(this)
    }
    dropped(){
        this.delegate.dropped(this)
    }
    save(){
        this.delegate.save(this)
    }
}
export default Sticky