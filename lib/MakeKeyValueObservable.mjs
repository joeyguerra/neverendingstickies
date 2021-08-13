const MakeKeyValueObservable = obj => {
  if(Object.keys(obj).length === 0) throw new Error("This design assumes that the passed in object has defined properties already.")
  let observers = {}
  let observable = {
    observe(key, observer){
      if(!observers[key]) observers[key] = []
      observers[key].push(observer)
    },
    stopObserving(observer){
      for(let key in observers){
        let i = 0
        const ubounds = observers[key].length;			
        for(i; i < ubounds; i++){
          if(observers[key][i] === observer){
            observers[key].splice(i, 1)
            if(observers[key].length === 0) delete observers[key]
            break
          }
        }
      }
    },
    changed(key, old, value, me){
      if(!observers[key]) return
      observers[key].forEach( o => {
        o.update(key, old, value, me)
      })
    }
  }

  let keys = Object.keys(obj)
  let ubounds = keys.length
  for(let i = 0; i < ubounds; i++){
    (() => {
      let prop = keys[i]
      Reflect.defineProperty(observable, prop, {
        get(){
          return obj[prop]
        },
        set(v){
          let old = obj[prop]
          obj[prop] = v
          observable.changed(prop, old, v, observable)
        },
        enumerable: true
      })
    })()
  }
  return observable
}

export default MakeKeyValueObservable