const adminModel = require(`../models/index`).admin;
const Op = require(`sequelize`).Op;
const bcrypt = require("bcrypt");

exports.getAllAdmin = async (request, response) => {
  let admin = await adminModel.findAll();
  return response.json({
    succes: true,
    data: admin,
    message: `Data admin berhasil ditampilkan`,
  });
};
/**create function for filter */
exports.findAdmin = async (request, response) => {
  /**define keyword to find data */
  let keyword = request.body.keyword;

  /**call findAll() within clause and operation
   * to find data based on keyword
   */
  let admins = await adminModel.findAll({
    where: {
      [Op.or]: [
        { nama: { [Op.substring]: keyword } },
        { username: { [Op.substring]: keyword } },
        { alamat: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    succes: true,
    data: admins,
    message: `Data admin berhasil ditampilkan`,
  });
};
/**create function to add new admin */
exports.addAdmin = (request, response) => {
  let newAdmin = {
    nama: request.body.nama,
    alamat: request.body.alamat,
    username: request.body.username,
    password: bcrypt.hash(request.body.password, 10),
    nomor_hp: request.body.nomor_hp,
  };
  /**execute inserting data to admin's table */
  adminModel
    .create(newAdmin)
    .then((result) => {
      /**if insert process success */
      return response.json({
        succes: true,
        data: result,
        message: `Data admin berhasil ditambahkan`,
      });
    })
    .catch((error) => {
      return response.json({
        succes: false,
        message: error.message,
      });
    });
};
/**create function to update admin */
exports.updateAdmin = (request, response) => {
  let dataAdmin = {
    nama: request.body.nama,
    alamat: request.body.alamat,
    username: request.body.username,
    nomor_hp: request.body.nomor_hp,
  };
  /**define id admin that will be update */
  let idAdmin = request.params.id;

  /**execute update data based on defined id admin */
  adminModel
    .update(dataAdmin, { where: { id: idAdmin } })
    .then(() => {
      return response.json({
        succes: true,
        message: `Data admin berhasil di update`,
      });
    })
    .catch((error) => {
      return response.json({
        succes: false,
        message: error.message,
      });
    });
};
/**create function to delete data admin */
exports.deleteAdmin = (request, response) => {
  let idAdmin = request.params.id;

  adminModel
    .destroy({ where: { id: idAdmin } })
    .then(() => {
      return response.json({
        succes: true,
        message: `Data admin berhasil dihapus`,
      });
    })
    .catch((error) => {
      return response.json({
        succes: false,
        message: error.message,
      });
    });
};
