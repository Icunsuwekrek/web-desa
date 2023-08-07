const express = require(`express`)
const app = express()
app.use(express.json())
const AdminController = require(`../controller/admin.controller`)
const { authorize } = require(`../controller/auth.controller`)
const { validateAdmin } = require("../middlewares/admin-validation")

app.get("/", [authorize],  AdminController.getAllAdmin)
app.post("/", [authorize], AdminController.addAdmin)
app.post("/find", AdminController.findAdmin)
app.put("/:id", [authorize], AdminController.updateAdmin)
app.delete("/:id", [authorize], AdminController.deleteAdmin)
module.exports = app