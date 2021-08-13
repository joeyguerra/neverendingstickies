
import MakeKeyValueObservable from "../lib/MakeKeyValueObservable.mjs"
import MakeObservableList from "../lib/MakeObservableList.mjs"
import assert from "assert"

describe("Observable", ()=>{
  it("If an object without defined properties is passed as an argument, then a fatal error will be thrown.", () => {

    assert.throws(()=>{
      const actual = MakeKeyValueObservable({})
    }, Error, "Error out when this happens")

  })
  
  it("Must pass an object with defined properties in order to observe any of those attributes. I think of it as the objects 'schema'.", done => {
    const expected = "joey"
    const actual = MakeKeyValueObservable({name: "some other name"})
    actual.observe("name", {
      update(key, old, value){
        assert.strictEqual(value, expected, "Should be notified when the property is set")
        done()
      }
    })
    actual.name = "joey"
  })
  
  it("Stop observing an object.", () => {
    let count = 0
    const expected = "joey"
    const actual = MakeKeyValueObservable({name: "joeyg"})
    const observer = {
     update(key, old, value){
       assert.strictEqual(value, expected, "Should be notified")
       count++
     }
    }
    
    actual.observe("name", observer)
    actual.name = "joey"
    actual.stopObserving(observer)
    actual.name = "another name"
    assert.strictEqual(count, 1, "Should only have been notified once")
  })
  
  it("Be notified when an item gets pushed to the list.", () => {
    const actual = MakeObservableList()
    const expected = "joey"
    const pushObserver = {
      update(key, old, value){
        assert.strictEqual(value.name, expected, "Should be notified when an item was added")
      }
    }
    
    actual.observe("push", pushObserver)
    actual.observe("pop", {
      update(key, old, value){
       assert.strictEqual(old.name, expected + "2", "Old has the value that's popped") 
      }
    })
    actual.observe("shift", {
      update(key, old, value){
        assert.strictEqual(value.name, expected, "Should be the first item")
      }
    })
    
    actual.observe("unshift", {
      update(key, old, value){
        assert.strictEqual(actual[0].name, "Sue", "Should put 2 items in the front")
        assert.strictEqual(actual[1].name, "Aida", "Should put 2 items in the front")
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
  
})
