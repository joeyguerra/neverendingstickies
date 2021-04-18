class Command {
  constructor(target, fn, undo){
    this.fn = fn
    this.undo = undo
    this.target = target
  }
  execute(){
    console.log("totally exeucting this")
    this.fn.call(this.target)
  }
  revert(){
    this.undo.call(this.target)
  }
}

export default Command