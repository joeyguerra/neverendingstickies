import tape from "tape"
import {MakeObservable, MakeObservableList} from "../lib/MakeObservable.mjs"

tape("Observing a property on an object", t => {
    const actual = "Fred"
    const o = MakeObservable({
        name: "Joey Guerra",
        age: 23
    })

    const observer = {
        update(key, old, value){
            t.equals(old, "Joey Guerra", "Old should have the previous value")
            t.equals(value, "Fred", "Passed value should be Fred")
            t.equals(key, "name", "Key should be name")
            t.equals(o.name, "Fred", "Should be notified when a property is changed")
            t.end()
        }
    }
    o.observe("name", observer)
    o.name = actual
})


tape("Observing a list", t => {
    const l = MakeObservableList({name: "joey", age: 23})
    const observer = {
        update(key, old, value){
            t.equals(key, "push", "Should be able to be notified when an item is added to the list")
            t.end()
        }
    }
    l.observe("push", observer)
    l.push({name: "fred", age: 47})
    t.equals(l.length, 2, "Should have 2 items.")
})
tape("push - add an item to the end of the list.", t => {
    const l = MakeObservableList()
    l.push({name: "fred", age: 47})
    t.equal(l[0].name, "fred", "Name should be 'fred'.")
    t.end()
})
tape("pop - remove an item off the end of the list.", t => {
    const list = MakeObservableList()
    list.push({name: "me"})
    let last = list.pop()
    t.equal(list.length, 0, "Length should be 0 after popping")
    t.end()    
})

tape("shift - remove item from the beginning of the list.", t => {
    const list = MakeObservableList()
    list.push({id: 1})
    list.push({id: 2})
    t.equal(list.shift().id, 1, "should be 1")
    t.end()
})
tape("unshift - adds an array of item(s) to the beginning of the list.", t => {
    const list = MakeObservableList()
    list.push({id: 1})
    list.unshift({id: 2})
    t.equal(list[0].id, 2, "should be 2")
    t.end()
})
tape("remove - remove an item given a delegate.", t => {
    const list = MakeObservableList()
    list.push({id: 1})
    list.push({id: 2})
    list.push({id: 3})
    let item = list.remove( i => i.id === 2)
    t.equal(item.id, 2, "Should return the removed item.")
    t.equal(list.length, 2, "Should reduce the length of the list.")
    t.equal(list.find(i => i.id === 2), undefined, "Should return null when looking for the item.")
    t.end()
})

tape("clear - clear out the list.", t => {
    const list = MakeObservableList()
    list.push({id: 1})
    list.push({id: 2})
    list.push({id: 3})
    list.clear()
    t.equal(list.length, 0, "Length should be zero after calling clear.")
    t.end()
})

tape("Properties", t => {
    const l = MakeObservableList()
    t.equals(l.length, 0, "Length should be 0")
    l.push({})
    t.equals(l.length, 1, "Length should be 1")
    t.end()
})