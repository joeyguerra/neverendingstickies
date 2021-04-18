import MakeKeyValueObservable from "./MakeKeyValueObservable.js"

class ObservableList extends Array {
    constructor(...args) {
        let delegate = args.pop()
        super(...args)
        this.delegate = delegate
    }
    pop(){
        let last = super.pop()
        this.delegate.changed("pop", last, null)
        return last
    }
    push(item){
        super.push(item)
        this.delegate.changed("push", null, item)
    }
    shift(){
        let first = super.shift()
        this.delegate.changed("shift", null, first)
        return first
    }
    unshift(...items){
        super.unshift(...items)
        this.delegate.changed("unshift", null, items)
        return items.length
    }
    remove(d){
        let i = 0
        let ubounds = this.length
        let deleted = []
        for(i; i<ubounds;i++){
          if(d(this[i], i)){
            deleted = this.splice(i, 1)
            this.delegate.changed("remove", deleted[0], i)
            break
          }
        }
        return deleted[0]
    }
    removeMany(d){
        let i = this.length-1
        let deleted = []
        for(i; i >= 0;i--){
            if(d(this[i], i)){
                deleted.push(this.splice(i, 1)[0])
                this.delegate.changed("remove", deleted[deleted.length-1], i)
            }
        }
        return deleted
    }
    removeAll(){
        this.clear()
    }
    clear(){
        while(this.length > 0) this.pop()
    }
    observe(key, observer){
        this.delegate.observe(key, observer)
    }
    stopObserving(observer){
        this.delegate.stopObserving(observer)
    }
    last(){
        if(this.length === 0) return undefined
        return this[this.length - 1]
    }
}

const MakeObservableList = (...args) => {
    let observable = MakeKeyValueObservable({noop: null})
    args.push(observable)
    if(!args){
        args = [observable]
    }
    let list = new ObservableList(...args)
    return list
}

export default MakeObservableList