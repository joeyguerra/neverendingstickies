import {JSDOM, VirtualConsole} from "jsdom"
import fs from "fs"
import path from "path"
import App from "../src/App.mjs"
import assert from "assert"

const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);
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

describe('NeverEndingStickies', ()=>{

    it("Adding a sticky", async () => {
        let data = null
        try {
            data = await file.readFile(path.join(__dirname, "../docs/index.html"), {encoding: "utf-8"})
        } catch(e) {
            console.error(e)
        }
        let dom = MakeDom(data)
        App.open(dom.window)
        App.addStickyButton.click()
        assert.strictEqual(App.views.length, 1, "Clicking the Add Sticky button should add a sticky.")
        App.model.notes[0].text = "Just adding some text"
        assert.strictEqual(App.views[0].textarea.value, App.model.notes[0].text, "Updating the note in memory should be reflected in the Stikcy Text Area.")
        dom.window.close()
    })
    
    it("Move a sticky", async () => {
        let data = null
        try {
            data = await file.readFile(path.join(__dirname, "../docs/index.html"), {encoding: "utf-8"})
        } catch(e) {
            console.error(e)
        }
        let dom = MakeDom(data)
        App.open(dom.window)
        App.addStickyButton.click()
        App.model.notes[0].top = 100
        App.model.notes[0].left = 300
        assert.strictEqual(App.views[0].container.style.top, "100px", "Sticky should move 100 px from the top.")
        assert.strictEqual(App.views[0].container.style.left, "300px", "Sticky should move 300 px from the left.")
        dom.window.close()
    })
    
    it("Close a sticky", async () => {
        let data = null
        try {
            data = await file.readFile(path.join(__dirname, "../docs/index.html"), {encoding: "utf-8"})
        } catch(e) {
            console.error(e)
        }
        let dom = MakeDom(data)
        App.open(dom.window)
        App.addStickyButton.click()
        App.views[0].closeButton.click()
        assert.strictEqual(App.views.length, 0, "Closing a sticky should remove it from the board.")
        dom.window.close()
    })
    
    
    it("Bread Crumbs", async () => {
        let data = null
        try {
            data = await file.readFile(path.join(__dirname, "../docs/index.html"), {encoding: "utf-8"})
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
        assert.strictEqual(App.views.length, 1, "Double clicking on the header of a sticky should create a new board, drill down so to speak.")
        assert.strictEqual(App.model.notes[0].id, App.views[0].model.id, "The only note on the board should be the same.")
        assert.strictEqual(App.model.breadCrumbs[0].id, App.model.notes[0].id, "The bread crumbs should include the parent sticky.")
        dom.window.close()
    })
    
    it("Traversing Bread Crumbs", async () => {
        let data = null
        try {
            data = await file.readFile(path.join(__dirname, "../docs/index.html"), {encoding: "utf-8"})
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
        assert.strictEqual(App.views.length, 3, "Should be 3 stickies on this board.")
        App.views[0].closeButton.click()
        assert.strictEqual(App.views.length, 0, "Closing the board sticky should remove all stickies.")
        dom.window.close()
    })
    
    
    it("Bread Crumbs", async () => {
        let data = null
        try {
            data = await file.readFile(path.join(__dirname, "../docs/index.html"), {encoding: "utf-8"})
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
        assert.strictEqual(App.views.length, 1, "Double clicking on the header of a sticky should create a new board, drill down so to speak.")
        assert.strictEqual(App.model.notes[0].id, App.views[0].model.id, "The only note on the board should be the same.")
        assert.strictEqual(App.model.breadCrumbs[0].id, App.model.notes[0].id, "The bread crumbs should include the parent sticky.")
        dom.window.close()
    })
    
})
