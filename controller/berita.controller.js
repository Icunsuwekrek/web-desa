const beritaModel = require(`../models/index`).berita;
const { Op } = require("sequelize");
const {
  handleImageUpload,
  handleDeleteImage,
} = require(`./upload-tumbnail.controller`);
const Joi = require("joi");

const createSlug = (document) => {
  const slug = document
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return slug;
};

const validateBerita = (input) => {
  let rules = Joi.object().keys({
    judul: Joi.string().required(),
    body: Joi.string().required(),
  });

  let { error } = rules.validate(input);
  if (error) {
    let message = error.details.map((item) => item.message).join(`,`);

    return {
      status: false,
      message: message,
    };
  }

  return {
    status: true,
  };
};

exports.getAllBerita = async (_request, response) => {
  let berita = await beritaModel.findAll();

  return response.json({
    succes: true,
    data: berita,
    message: `Berita berhasil ditampilkan`,
  });
};

exports.findBerita = async (request, response) => {
  /**define keyword to find data */
  let keyword = request.body.keyword;

  let news = await beritaModel.findAll({
    where: {
      [Op.or]: [
        { isi_artikel: { [Op.substring]: keyword } },
        { judul: { [Op.substring]: keyword } },
      ],
    },
  });

  return response.json({
    succes: true,
    data: news,
    message: `Berita berhasil ditampilkan`,
  });
};

exports.addBerita = async (request, response) => {
  const { judul, body } = request.body;

  try {
    if (!request.file) {
      return response.json({
        status: false,
        message: "Tidak ada file yang di upload",
      });
    }

    const resultValidation = validateBerita(request.body);
    if (!resultValidation.status) {
      return response.json({
        status: false,
        message: resultValidation.message,
      });
    }

    // Upload image to ImageKit using handleImageUpload
    handleImageUpload(request.file, "berita", async (err, imageUrl) => {
      if (err) {
        return response.json({
          status: false,
          message: err,
        });
      }

      const data = {
        judul,
        thumbnail: imageUrl.url,
        thumbnail_id: imageUrl.fileId,
        slug: createSlug(judul),
        body,
      };

      // Create news article using your beritaModel
      await beritaModel.create(data);

      return response.json({
        status: true,
        message: "Data berita telah ditambahkan",
      });
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateBerita = async (request, response) => {
  let id = request.params.id;
  let berita = {
    isi_artikel: request.body.isi_artikel,
    judul: request.body.judul,
  };

  try {
    if (request.file) {
      // Delete old image from ImageKit if it exists
      const selectedBerita = await beritaModel.findOne({
        where: { id: id },
      });
      if (selectedBerita.thumbnail_id) {
        handleDeleteImage(selectedBerita.thumbnail_id, async (err) => {
          if (err) {
            return response.json({
              status: false,
              message: err,
            });
          }
          // Upload new image to ImageKit
          handleImageUpload(
            request.file,
            "berita",
            async (uploadErr, imageUrl) => {
              if (uploadErr) {
                return response.json({
                  status: false,
                  message: uploadErr,
                });
              }
              berita.thumbnail = imageUrl.url;
              berita.thumbnail_id = imageUrl.fileId;

              // Update data based on defined id berita
              try {
                await beritaModel.update(berita, { where: { id: id } });
                return response.json({
                  success: true,
                  message: "Data berita berhasil diupdate",
                });
              } catch (error) {
                return response.json({
                  status: false,
                  message: error.message,
                });
              }
            }
          );
        });
      }
    } else {
      // Update data without image upload
      beritaModel
        .update(berita, { where: { id: id } })
        .then((result) => {
          return response.json({
            success: true,
            message: "Data berita berhasil diupdate",
          });
        })
        .catch((error) => {
          return response.json({
            status: false,
            message: error.message,
          });
        });
    }
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.deleteBerita = async (request, response) => {
  const id = request.params.id;
  try {
    const berita = await beritaModel.findOne({ where: { id: id } });
    if (berita.thumbnail_id) {
      handleDeleteImage(berita.thumbnail_id, (err) => {
        if (err) {
          console.log("Error deleting image from ImageKit:", err);
        }

        // Delete data from beritaModel after image deletion (if any)
        beritaModel
          .destroy({ where: { id: id } })
          .then((result) => {
            return response.json({
              success: true,
              message: "Berita berhasil dihapus",
            });
          })
          .catch((error) => {
            return response.json({
              success: false,
              message: error.message,
            });
          });
      });
    }
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
