class BreadCrumb {
    constructor(container, model, delegate){
        this.container = container
        this.model = model
        this.delegate = delegate
        this.model.observe("push", this)
        this.model.observe("unshift", this)
        this.model.observe("remove", this)
        this.model.observe("pop", this)
        this.template = this.container.querySelector("li").cloneNode(true)
        this.container.addEventListener(this.delegate.device.CLICK, e => {
            if(e.target.tagName !== "A") return
            let id = e.target.href.split("#")[1]
            if(id.length === 0) id = null
            this.delegate.breadCrumbWasClicked(id)
        })
    }
    update(key, old, v, m){
        if(key === "push") this.add(v)
        if(key === "unshift") this.addToFront(v)
        if(key === "remove") this.remove(v)
        if(key === "pop") this.remove(old)
    }
    addToFront(notes){
        if(!notes) return
        let note = notes[0]
        let li = this.template.cloneNode(true)
        li.id = "breadCrumb_" + note.id
        let a = li.querySelector("a")
        a.href = "#" + note.id
        a.title = note.text || "No text"
        a.innerText = note.text ? note.text.substring(0, 20) : "No text"
        if(this.container.querySelector("li").length === 1){
            this.container.appendChild(li)
        } else {
            this.container.insertBefore(li, this.container.querySelector("li:first-child").nextSibling)
        }
    }
    add(note){
        if(!note) return
        let li = this.template.cloneNode(true)
        li.id = "breadCrumb_" + note.id
        let a = li.querySelector("a")
        a.href = "#" + note.id
        a.title = note.text || "No text"
        a.innerText = note.text ? note.text.substring(0, 20) : "No text"
        this.container.appendChild(li)
    }
    remove(note){
        if(!note) return
        this.container.removeChild(this.container.querySelector("#breadCrumb_" + note.id))
    }
}

export default BreadCrumb