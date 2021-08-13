class PrioritizedList {
  constructor(container, model, delegate){
    this.container = container
    this.template = this.container.querySelector("li").cloneNode(true)
    this.container.removeChild(this.container.querySelector("li"))
    this.model = model
    this.delegate = delegate
    this.model.observe("push", this)
    this.model.observe("remove", this)
    this.model.observe("clear", this)
    this.model.observe("sort", this)
    this.model.forEach( i => {
      i.observe("priority", this)
    })
  }
  update(key, old, value, m){
    if(this[key]) this[key](old, value, m)
  }
  text(old, value, m){
    let li = this.container.querySelector(`#todoList_${m.id}`)
    let truncatedText = ""
    if(value && value.text) truncatedText = value.text.substr(0, 25)
    li.innerHTML = truncatedText
  }
  priority(old, value, m){
    let li = this.container.querySelector(`#todoList_${m.id}`)
    li.setAttribute("data-priority", value)
    this.sort()
  }
  push(old, value){
    value.observe("priority", this)
    let li = this.template.cloneNode()
    let truncatedText = ""
    if(value && value.text) truncatedText = value.text.substr(0, 25)
    li.innerHTML = truncatedText
    li.id = "todoList_" + value.id
    li.setAttribute("data-priority", value.priority)
    this.container.appendChild(li)
  }
  remove(old, value){
    old.stopObserving("priority")
    let li = this.container.querySelector(`#todoList_${old.id}`)
    if(!li) return
    this.container.removeChild(li)
  }
  sort(){
    let lis = Array.from(this.container.querySelectorAll("li"))
    this.container.innerHTML = ""
    lis.sort((a, b)=>{
      if(a.getAttribute("data-priority") === b.getAttribute("data-priority")) return 0
      return a.getAttribute("data-priority") > b.getAttribute("data-priority") ? 1 : -1
    }).forEach( li => {
      this.container.appendChild(li)
    })
  }
}

export default PrioritizedList