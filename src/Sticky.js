import Mover from "./Mover.js"
import Command from "../lib/Command.js"
import Dot from "./Dot.js"

class Sticky {
  constructor(container, model, delegate){
    this.model = model
    this.container = container
    this.delegate = delegate
    this.container.id = this.model.id
    this.mover = new Mover(this.container, this.model, this)
    this.closeButton = this.container.querySelector(".closeButton")
    this.label = this.container.querySelector("header label")
    this.dot = new Dot(this.container.querySelector("header svg"), this.model, this)
    this.overlay = this.container.querySelector(".overlay")
    this.closeButton.addEventListener(this.delegate.device.CLICK, e => {
      let command = new Command(this, () => {
        this.close(e)
      }, () => {
        this.delegate.addNote(this.model)
      })
      command.execute()
      this.delegate.addCommand(command)
    }, {once: true}, true)
    this.header = this.container.querySelector("header")
    this.textarea = this.container.querySelector("textarea")
    this.textarea.addEventListener(this.delegate.device.KEYUP, e => {
      this.model.text = e.target.value
      this.shouldSave()
    }, false)
    this.header.addEventListener(this.delegate.device.DOUBLECLICK, e => {
      this.delegate.diveIn(this)
    }, {once: true}, true)
    this.container.addEventListener(this.delegate.device.MOUSEDOWN, e => {
      this.textarea.focus()
      this.delegate.makeActive(this)
      this.mover.dragStart(e)
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
    if(key === "top"){
      this.container.style.top = v + "px"
    }
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
  moving(pos){
    let xDiff = pos.x - this.delegate.model.center.x
    let yDiff = -1 * (pos.y - this.delegate.model.center.y - 111)
    let pytha = Math.floor(Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)))
    let angle = Math.floor((Math.atan2(this.delegate.model.center.y - pos.y, this.delegate.model.center.x - pos.x) * 180 / Math.PI) + 180)
    this.label.innerText = `${pos.y}`
    this.model.priority = pos.y
  }
  dropped(){
    this.delegate.dropped(this)
  }
  shouldSave(){
    this.delegate.shouldSave(this)
  }
  shouldAddCommand(command){
     this.delegate.addCommand(command) 
  }
}

export default Sticky