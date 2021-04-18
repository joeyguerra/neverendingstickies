import tape from "tape"

import MakeKeyValueObservable from "../lib/MakeKeyValueObservable.js"
import MakeObservableList from "../lib/MakeObservableList.js"


tape("If an object without defined properties is passed as an argument, then a fatal error will be thrown.", t => {
  t.plan(1)
  t.throws(()=>{
    const actual = MakeKeyValueObservable({})
  }, Error, "Error out when this happens")
})

tape("Must pass an object with defined properties in order to observe any of those attributes. I think of it as the objects 'schema'.", t => {
  const expected = "joey"
  const actual = MakeKeyValueObservable({name: "some other name"})
  actual.observe("name", {
    update(key, old, value){
      t.equal(value, expected, "Should be notified when the property is set")
      t.end()
    }
  })
  actual.name = "joey"
})

tape("Stop observing an object.", t => {
  t.plan(2)
  let count = 0
  const expected = "joey"
  const actual = MakeKeyValueObservable({name: "joeyg"})
  const observer = {
   update(key, old, value){
     t.equal(value, expected, "Should be notified")
     count++
   }
  }
  
  actual.observe("name", observer)
  actual.name = "joey"
  actual.stopObserving(observer)
  actual.name = "another name"
  t.equal(count, 1, "Should only have been notified once")
})

tape("Be notified when an item gets pushed to the list.", t => {
  t.plan(5)
  const actual = MakeObservableList()
  const expected = "joey"
  const pushObserver = {
    update(key, old, value){
      t.equal(value.name, expected, "Should be notified when an item was added")
    }
  }
  
  actual.observe("push", pushObserver)
  actual.observe("pop", {
    update(key, old, value){
     t.equal(old.name, expected + "2", "Old has the value that's popped") 
    }
  })
  actual.observe("shift", {
    update(key, old, value){
      t.equal(value.name, expected, "Should be the first item")
    }
  })
  
  actual.observe("unshift", {
    update(key, old, value){
      t.equal(actual[0].name, "Sue", "Should put 2 items in the front")
      t.equal(actual[1].name, "Aida", "Should put 2 items in the front")
    }
  })
  
  actual.push({name: "joey"})
  actual.stopObserving(pushObserver)
  actual.push({name: "joey2"})
  actual.pop()
  actual.push({name: "joey2"})
  actual.shift()
  actual.unshift({name: "Sue"}, {name: "Aida"})
})
