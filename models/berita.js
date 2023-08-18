'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class berita extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  berita.init(
    {
      judul: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      thumbnail_id: DataTypes.STRING,
      slug: DataTypes.STRING,
      body: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "berita",
    }
  );
  return berita;
};