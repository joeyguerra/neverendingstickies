import MakeObservableList from "../lib/MakeObservableList.js"

const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16);
    })
}

class Note {
    constructor(args){
      if(!args){
          args = {}
      }
      this.id = args.id || uuid()
      if(args && args.timestamp){
          args.timestamp = new Date(args.timestamp)
      }
      this.timestamp = new Date()
      // Make sure to set the fields with existing values in order to actually persist it.
      this.text = args.text || null
      this.top = args.top || 0
      this.left = args.left || 0
      this.z = args.z || 0
      this.status = args.status || 0
      this.parentId = args.parentId || null
      this.priority = args.priority || 0
      this.notes = MakeObservableList([])
    }
}

export default Note