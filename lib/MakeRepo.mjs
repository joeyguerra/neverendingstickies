const MakeRepo = (localStorage, Note) => {
    const get = () => {
<<<<<<< HEAD
        if(localStorage.notes === undefined) return []
        let notes = JSON.parse(localStorage.notes)
        if(notes === null) return []
=======
        if(localStorage.notes === undefined) return null
        let notes = JSON.parse(localStorage.notes)
        if(notes === null) return null
>>>>>>> some tests passing
        return notes.map( note => {
            return new Note(note)
        })
    }
    const set = notes => {
        localStorage.clear()
        localStorage.notes = JSON.stringify(notes)
    }
    return {
        save(note){
            let notes = get()
            let i = 0
            let saved = false
            note.timestamp = new Date()
            if(notes !== null){
                let ubounds = notes.length
                for(i=0;i<ubounds;i++){
                    if(notes[i].id === note.id){
                        notes[i] = note
                        saved = true
                        break
                    }
                }			
            } else {
                notes = []
            }
            if(!saved) notes.push(note)
            set(notes)
        },
        delete(note){
            let i = 0
            let notes = get()
<<<<<<< HEAD
            if(!notes) return i
=======
>>>>>>> some tests passing
            let ubounds = notes.length
            for(i = 0; i < ubounds; i++){
                if(notes[i].id == note.id){
                    notes.splice(i, 1)
                    break
                }
            }
            set(notes)
            return i
        },
        all(){
            return get()
        },
        findOne(delegate){
            let found = this.find(delegate)
            if(found !== null) return found[0]
        },
        find(delegate){
            let notes = get()
            if(!notes) return []
            let i = 0
            let ubounds = notes.length
            let found = []
            for(i = 0; i < ubounds; i++){
                if(delegate(notes[i])) found.push(notes[i])
            }
            return found.length > 0 ? found : []
        }
    }
}

export default MakeRepo