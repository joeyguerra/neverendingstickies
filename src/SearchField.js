class SearchField {
  constructor(container, model, delegate){
    this.container = container
    this.model = model
    this.delegate = delegate
    this.model.observe("findTerm", this)
    this.container.addEventListener(this.delegate.device.INPUT, e => {
      this.model.findTerm = e.target.value
    })
    this.container.addEventListener(this.delegate.device.SEARCH, e => {
      console.log("searched for")
    })
    this.container.addEventListener(this.delegate.device.BLUR, e => {
      if(this.model.findTerm.length === 0) this.stopFinding(this.model.findTerm)
    })
  }
  update(key, old, v, m){
    if(key === "findTerm"){
      this.startFinding(v)
    }
  }
  startFinding(term){
    let notes = null
    if(term.length > 0){
      notes = this.delegate.repo.find(n =>{
        return n.text.indexOf(term) > -1
      })
    }
    this.delegate.noteWasFound(notes)
  }
  stopFinding(term){
    this.delegate.doneFinding()
  }
}

export default SearchField