import tape from "tape"
import {JSDOM, VirtualConsole} from "jsdom"
import fs from "fs"
import path from "path"
import App from "../src/index.js"
const file = fs.promises
const MakeDom = data => {
    let c = new VirtualConsole()
    c.sendTo(console)
    return new JSDOM(data, {
        url: "https://example.org/",
        referrer: "https://example.com/",
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000,
        pretendToBeVisual: true
    })
}

tape("Adding a sticky", async t => {
    let data = null
    try {
        data = await file.readFile(path.join(__dirname, "../views/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = MakeDom(data)
    App.open(dom.window)
    App.addStickyButton.click()
    t.equals(App.views.length, 1, "Clicking the Add Sticky button should add a sticky.")
    App.model.notes[0].text = "Just adding some text"
    t.equal(App.views[0].textarea.value, App.model.notes[0].text, "Updating the note in memory should be reflected in the Stikcy Text Area.")
    dom.window.close()
    t.end()
})

tape("Move a sticky", async t => {
    let data = null
    try {
        data = await file.readFile(path.join(__dirname, "../views/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = MakeDom(data)
    App.open(dom.window)
    App.addStickyButton.click()
    App.model.notes[0].top = 100
    App.model.notes[0].left = 300
    t.equal(App.views[0].container.style.top, "100px", "Sticky should move 100 px from the top.")
    t.equal(App.views[0].container.style.left, "300px", "Sticky should move 300 px from the left.")
    dom.window.close()
    t.end()
})

tape("Close a sticky", async t => {
    let data = null
    try {
        data = await file.readFile(path.join(__dirname, "../views/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = MakeDom(data)
    App.open(dom.window)
    App.addStickyButton.click()
    App.views[0].closeButton.click()
    t.equal(App.views.length, 0, "Closing a sticky should remove it from the board.")
    dom.window.close()
    t.end()
})


tape("Bread Crumbs", async t => {
    let data = null
    try {
        data = await file.readFile(path.join(__dirname, "../views/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = MakeDom(data)
    App.open(dom.window)
    App.addStickyButton.click()
    App.addStickyButton.click()
    let event = new dom.window.Event("HTMLEvents")
    event.initEvent("dblclick", true, false)
    App.views[0].header.dispatchEvent(event)
    t.equal(App.views.length, 1, "Double clicking on the header of a sticky should create a new board, drill down so to speak.")
    t.equal(App.model.notes[0].id, App.views[0].model.id, "The only note on the board should be the same.")
    t.equal(App.model.breadCrumbs[0].id, App.model.notes[0].id, "The bread crumbs should include the parent sticky.")
    dom.window.close()
    t.end()
})

tape("Traversing Bread Crumbs", async t => {
    let data = null
    try {
        data = await file.readFile(path.join(__dirname, "../views/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = MakeDom(data)
    App.open(dom.window)
    App.addStickyButton.click()
    let event = new dom.window.Event("HTMLEvents")
    event.initEvent("dblclick", true, false)
    App.views[0].header.dispatchEvent(event)
    App.addStickyButton.click()
    App.addStickyButton.click()
    t.equal(App.views.length, 3, "Should be 3 stickies on this board.")
    App.views[0].closeButton.click()
    t.equal(App.views.length, 0, "Closing the board sticky should remove all stickies.")
    dom.window.close()
    t.end()
})


tape("Bread Crumbs", async t => {
    let data = null
    try {
        data = await file.readFile(path.join(__dirname, "../views/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = MakeDom(data)
    App.open(dom.window)
    App.addStickyButton.click()
    App.addStickyButton.click()
    let event = new dom.window.Event("HTMLEvents")
    event.initEvent("dblclick", true, false)
    App.views[0].header.dispatchEvent(event)
    t.equal(App.views.length, 1, "Double clicking on the header of a sticky should create a new board, drill down so to speak.")
    t.equal(App.model.notes[0].id, App.views[0].model.id, "The only note on the board should be the same.")
    t.equal(App.model.breadCrumbs[0].id, App.model.notes[0].id, "The bread crumbs should include the parent sticky.")
    dom.window.close()
    t.end()
})


