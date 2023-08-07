const express = require(`express`)
const app = express()
app.use(express.json())
const { authorize } = require(`../controller/auth.controller`)
const beritaController = require(`../controller/berita.controller`)

app.get("/", [authorize], beritaController.getAllBerita)
app.post("/", [authorize], beritaController.addBerita)
app.post("/find", beritaController.findBerita)
app.put("/:id",beritaController.updateBerita)
app.delete("/:id", [authorize], beritaController.deleteBerita)
module.exports = app