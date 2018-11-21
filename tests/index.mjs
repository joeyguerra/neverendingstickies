import tape from "tape"
import {JSDOM, VirtualConsole} from "jsdom"
import fs from "fs"
import path from "path"
import App from "../lib/App.mjs"
import devToolsFormatter from "jsdom-devtools-formatter"

const file = fs.promises
tape("Main app test suite", async t => {
    let data = null
    let c = new VirtualConsole()
    c.sendTo(console)
    devToolsFormatter.install()

    try {
        data = await file.readFile(path.join(__dirname, "../public/index.html"), {encoding: "utf-8"})
    } catch(e) {
        console.error(e)
    }
    let dom = new JSDOM(data, {
        url: "https://example.org/",
        referrer: "https://example.com/",
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000,
        pretendToBeVisual: true
    })
    App.open(dom.window)
    App.addStickyButton.click()
    t.equals(App.views.length, 1, "Should have a sticky.")
    App.model.notes[0].text = "Just adding some text"
    t.equal(App.views[0].textarea.value, App.model.notes[0].text, "Setting text should show in the view textarea.")
    dom.window.close()
    t.end()
})
