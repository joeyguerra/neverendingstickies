import Command from "../lib/Command.mjs"

class Dot {
  constructor(container, model, delegate){
    this.model = model
    this.container = container
    this.delegate = delegate
    this.circle = this.container.querySelector("circle")
    this.model.observe("status", this)
    const changeStatus = e => {
      let previous = this.model.status
      let command = new Command(this, () => {
         if(this.model.status === 2) this.model.status = 0
         else this.model.status++
      }, () => {
        this.model.status = previous
      })
      command.execute()
      this.delegate.shouldAddCommand(command)
    }
    
    this.circle.addEventListener(this.delegate.device.MOUSEUP, changeStatus, true)
    this.setCircleColor(this.model.status)
  }
  setCircleColor(value){
    switch(value){
        case(0):
          this.circle.style.fill = "gray"
          this.container.style.left = "3px"
          break
        case(1):
          this.circle.style.fill = "green"
          this.container.style.left = "23px"
          break
        case(2):
          this.circle.style.fill = "red"
          this.container.style.left = "43px"
          break
        default:
          this.circle.style.fill = "gray"
          this.container.style.left = "3px"
          break
    }
  }
  update(key, old, value, m){
    this.setCircleColor(value)
    this.delegate.shouldSave()
  }
}

export default Dot