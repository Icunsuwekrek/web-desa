const express = require(`express`)
const app = express()
app.use(express.json())
const AdminController = require(`../controller/admin.controller`)
// const {authorize} = require(`../controller/auth.controller`)
const {validateAdmin} = require("../middlewares/admin-validation")

app.get("/", AdminController.getAllAdmin)
app.post("/", AdminController.addAdmin)
app.post("/find", AdminController.findAdmin)
app.put("/:id",[validateAdmin], AdminController.updateAdmin)
app.delete("/:id", AdminController.deleteAdmin)
module.exports = app