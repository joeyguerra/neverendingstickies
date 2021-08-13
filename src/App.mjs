import MakeKeyValueObservable from "../lib/MakeKeyValueObservable.mjs"
import MakeObservableList from "../lib/MakeObservableList.mjs"
import MakeDevice from "../lib/MakeDevice.mjs"
import MakeRepo from "../lib/MakeRepo.mjs"
import Note from "./Note.mjs"
import SearchField from "./SearchField.mjs"
import Mover from "./Mover.mjs"
import BreadCrumb from "./BreadCrumb.mjs"
import Dot from "./Dot.mjs"
import PrioritizedList from "./PrioritizedList.mjs"
import Sticky from "./Sticky.mjs"

let mylatesttap
const fireDoubleTapEvent = () => {
 return "TODO: Implement this to fire the double tap event for phones." 
}
function doubletap() {
  let now = new Date().getTime()
  let timesince = now - mylatesttap
  if((timesince < 600) && (timesince > 0)){
      fireDoubleTapEvent()
  }else{
  // too much time to be a doubletap
  }
  mylatesttap = new Date().getTime()
}

const App = {
  open(win){
    this.commands = MakeObservableList()
    this.win = win
    this.doc = win.document
    this.device = MakeDevice(win.document)
    this.repo = MakeRepo(win.localStorage, Note)
    this.model = MakeKeyValueObservable({
        notes: MakeObservableList(),
        parentId: null,
        breadCrumbs: MakeObservableList(),
        findTerm: "",
        center: {x: win.innerWidth/2, y: win.innerHeight/2}
    })
    
    this.views = []
    this.model.notes.observe("push", this)
    this.model.notes.observe("remove", this)
    this.model.notes.observe("pop", this)
    this.addStickyButton = this.doc.getElementById("addStickyButton")
    this.addStickyButton.addEventListener(this.device.CLICK, e => {
        this.addNote(MakeKeyValueObservable(new Note()))
    })
    this.stickyTemplate = this.doc.getElementById("stickyTemplate").cloneNode(true)
    this.stickyTemplate.id = ""
    this.breadCrumb = new BreadCrumb(this.doc.getElementById("breadCrumb"), this.model.breadCrumbs, this)
    this.searchField = new SearchField(this.doc.getElementById("searchField"), this.model, this)
    
    this.prioritizedList = new PrioritizedList(this.doc.getElementById("prioritizedList"), this.model.notes, this)
    this.model.observe("parentId", this)
    if(this.win.location.hash){
        this.model.parentId = this.win.location.hash.replace("#", "")
    }
    let notes = this.repo.all()
    if(notes && this.model.parentId){
        notes = notes.filter(n=>n.parentId === this.model.parentId)
        let parent = this.repo.findOne(n=>n.id === this.model.parentId)
        this.firstLoadBreadCrumbs(parent)
    }
    this.firstLoad(notes)    
    win.addEventListener("keydown", e => {
      if(e.keyCode === 90 && e.metaKey){
        let command = this.commands.pop()
        console.log("Undoing", command)
        if(command) command.revert()
      }
    })
  },
  addCommand(command){
    this.commands.push(command)
  },
  addNote(note){
    this.model.notes.push(note)
  },
  firstLoadBreadCrumbs(crumb){
    if(crumb){
        this.model.breadCrumbs.unshift(MakeKeyValueObservable(crumb))
        let parent = this.repo.findOne(n=>n.id === crumb.parentId)
        this.firstLoadBreadCrumbs(parent)
    }
  },
  firstLoad(notes){
    if(notes && !this.model.parentId){
        notes = notes.filter(n=>!n.parentId)
        notes.forEach(n=>{
            this.model.notes.push(MakeKeyValueObservable(n))
        })
    }
  },
  update(key, old, v, m){
    if(key === "parentId") {
        this.win.location.hash = v
        this.clearBoard(v)
        this.reloadBoard(v)
    }

    if(key === "push"){
        this.addSticky(v)
    }
    if(key === "remove"){
        this.removeSticky(old)
    }
    if(key === "pop"){
        this.removeSticky(old)
    }
  },
  removeBreadCrumbsTo(parentId){
    for(let i = this.model.breadCrumbs.length - 1; i>= 0; i--){
        if(this.model.breadCrumbs[i].id === parentId){
            break
        }
        this.model.breadCrumbs.pop()
    }
  },
  reloadBoard(parentId){
    let notes = this.repo.all()
    if(!notes) notes = []
    if(parentId){
        notes = notes.filter(n=>n.parentId === parentId || n.id === parentId)
    } else {
        notes = notes.filter(n => !n.parentId)
    }
    notes.forEach(n=>{
        this.model.notes.push(MakeKeyValueObservable(n))
    })
  },
  clearBoard(parentId){
    this.model.notes.removeAll()
  },
  removeSticky(note){
    let index = this.views.findIndex(v => v.model.id === note.id)
    this.views.splice(index, 1)
    this.doc.body.removeChild(this.doc.getElementById(note.id))
  },
  removeFromRepo(note){
    if(note){
      this.repo.delete(note)
      this.repo.find(n=>n.parentId === note.id)
        .forEach(n=>{
          this.removeFromRepo(n)
        })
    }
  },
  addSticky(note){
    let container = this.stickyTemplate.cloneNode(true)
    container.id = note.id
    if(this.model.parentId && note.id !== this.model.parentId) note.parentId = this.model.parentId
    this.views.push(new Sticky(container, note, this))
    this.doc.body.appendChild(container)
  },
  breadCrumbWasClicked(id){
    this.model.parentId = id
    this.removeBreadCrumbsTo(id)
  },
  makeActive(sticky){
    this.views.forEach( v =>{
      v.container.style.zIndex = 0
    })
    sticky.container.style.zIndex = 1
  },
  dropped(sticky){
    this.repo.save(sticky.model)
  },
  diveIn(sticky){
    if(sticky.model.id === this.model.parentId) return
    this.model.parentId = sticky.model.id
    this.model.breadCrumbs.push(sticky.model)
    this.clearBoard(sticky.model.id)
    this.model.notes.push(sticky.model)
    let notes = this.repo.all().filter(n=>n.parentId === sticky.model.id)
    notes.forEach(n=>{
      this.model.notes.push(MakeKeyValueObservable(n))
    })
  },
  remove(sticky){
    this.model.notes.removeMany(n => {
      return n.parentId === sticky.model.id || n.id === sticky.model.id
    })
    if(this.model.breadCrumbs.some(c=>c.id === sticky.model.id)){
      this.removeBreadCrumbsTo(sticky.model.id)
      let last = this.model.breadCrumbs.last()
      if(last.id === sticky.model.id){
        this.model.breadCrumbs.pop()
      }
      last = this.model.breadCrumbs.last()
      if(last){
        this.model.parentId = last.id
      }
    }
    this.model.notes.remove(n => {
      return n.id === sticky.model.id
    })
    this.removeFromRepo(sticky.model)
  },
  shouldSave(sticky){
    this.repo.save(sticky.model)
  },
  noteWasFound(notes){
    this.views.forEach(v => {
      v.overlay.className = "overlay shown"
      v.container.className = "note"
    })
    if(!notes) return
    notes.forEach(n => {
      let sticky = this.views.find(v => v.model.id === n.id)
      if(sticky){
        sticky.overlay.className = "overlay"
        sticky.container.className = "note selected"
      }
    })
  },
  doneFinding(){
    this.views.forEach(v => {
      v.overlay.className = "overlay"
      v.container.className = "note"
    })
  }
}

export default App