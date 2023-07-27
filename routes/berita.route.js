const express = require(`express`)
const app = express()
app.use(express.json())
const beritaController = require(`../controller/berita.controller`)

app.get("/", beritaController.getAllBerita)
app.post("/", beritaController.addBerita)
app.post("/find", beritaController.findBerita)
app.put("/:id",beritaController.updateBerita)
app.delete("/:id", beritaController.deleteBerita)
module.exports = app