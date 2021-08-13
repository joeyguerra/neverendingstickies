
import express from "express"
import path from "path"
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

const app = express()
express.static.mime.define({"text/javascript": ["mjs"]})
app.use("/neverendingstickies", express.static(path.join(__dirname, "./docs")))
app.use("/neverendingstickies/src", express.static(path.join(__dirname, "./src")))
app.use("/neverendingstickies/lib", express.static(path.join(__dirname, "./lib")))

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port http://localhost:${listener.address().port}`)
})

