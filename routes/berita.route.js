const express = require("express");
const router = express.Router();

const { authorize } = require(`../controller/auth.controller`);
const beritaController = require(`../controller/berita.controller`);
const { upload } = require("../controller/upload-tumbnail.controller");

router.get("/", beritaController.getAllBerita);

router.post("/", [upload.single("thumbnail")], beritaController.addBerita);

router.post("/find", beritaController.findBerita);

router.put("/:id", [upload.single("thumbnail")], beritaController.updateBerita);

router.delete("/:id", beritaController.deleteBerita);

module.exports = router;
