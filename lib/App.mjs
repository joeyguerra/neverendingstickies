import {MakeObservable, MakeObservableList} from "./MakeObservable.mjs"
import MakeDevice from "./MakeDevice.mjs"
import BreadCrumb from "./BreadCrumb.mjs"
import SearchField from "./SearchField.mjs"
import Sticky from "./Sticky.mjs"
import MakeRepo from "./MakeRepo.mjs"
import Note from "./Note.mjs"
<<<<<<< HEAD
const App = {
    open(win){
        this.win = win
        this.doc = win.document
        this.device = MakeDevice(win.document)
        this.repo = MakeRepo(win.localStorage, Note)
        this.model = MakeObservable({
            notes: MakeObservableList(),
            parentId: null,
            breadCrumbs: MakeObservableList(),
=======
const app = {
    open(win){
        this.win = win
        this.doc = this.win.document
        this.device = MakeDevice(this.doc)
        this.repo = MakeRepo(this.win.localStorage, Note)
        this.model = MakeObservable({
            notes: MakeObservableList(),
            parentId: null,
            breadCrumbs: MakeObservableList([]),
>>>>>>> some tests passing
            findTerm: ""
        })
        this.views = []
        this.model.notes.observe("push", this)
        this.model.notes.observe("remove", this)
        this.model.notes.observe("pop", this)
        this.addStickyButton = this.doc.getElementById("addStickyButton")
        this.addStickyButton.addEventListener(this.device.CLICK, e => {
            this.model.notes.push(MakeObservable(new Note()))
        })
        this.stickyTemplate = this.doc.getElementById("stickyTemplate").cloneNode(true)
        this.stickyTemplate.id = ""
        this.breadCrumb = new BreadCrumb(this.doc.getElementById("breadCrumb"), this.model.breadCrumbs, this)
        this.searchField = new SearchField(this.doc.getElementById("searchField"), this.model, this)
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
    },
    firstLoadBreadCrumbs(crumb){
        if(crumb){
            this.model.breadCrumbs.unshift(MakeObservable(crumb))
            let parent = this.repo.findOne(n=>n.id === crumb.parentId)
            this.firstLoadBreadCrumbs(parent)
        }
    },
    firstLoad(notes){
        if(notes && !this.model.parentId){
            notes = notes.filter(n=>!n.parentId)
            notes.forEach(n=>{
                this.model.notes.push(MakeObservable(n))
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
<<<<<<< HEAD
        if(key === "pop"){
            this.removeSticky(old)
        }
    },
    removeBreadCrumbsTo(parentId){
        for(let i = this.model.breadCrumbs.length - 1; i>= 0; i--){
            if(this.model.breadCrumbs[i].id === parentId){
=======
    },
    removeBreadCrumbsTo(parentId){
        for(let i = this.model.breadCrumbs.length - 1; i>= 0; i--){
            if(this.model.breadCrumbs.item(i).id === parentId){
>>>>>>> some tests passing
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
            this.model.notes.push(MakeObservable(n))
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
            this.model.notes.push(MakeObservable(n))
        })
    },
    remove(sticky){
<<<<<<< HEAD
        this.model.notes.removeMany(n => {
=======
        this.model.notes.removeMany((i, n)=>{
>>>>>>> some tests passing
            return n.parentId === sticky.model.id || n.id === sticky.model.id
        })
        if(this.model.breadCrumbs.some(c=>c.id === sticky.model.id)){
            this.removeBreadCrumbsTo(sticky.model.id)
<<<<<<< HEAD
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
=======
            if(this.model.breadCrumbs.last().id === sticky.model.id){
                this.model.breadCrumbs.pop()
            }
            this.model.parentId = this.model.breadCrumbs.last().id
        }
        this.model.notes.remove((i, n)=>{
>>>>>>> some tests passing
            return n.id === sticky.model.id
        })
        this.removeFromRepo(sticky.model)
    },
    save(sticky){
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

<<<<<<< HEAD
export default App
=======
export default app
>>>>>>> some tests passing
