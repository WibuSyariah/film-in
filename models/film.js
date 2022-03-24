'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "UserId" })
    }

    get formatRating() {
      let count = this.rating
      let star = "★"
      let emptyStar = "☆"

      return `${star.repeat(this.rating)}${emptyStar.repeat(5 - this.rating)}`
    }

    static createDate() {
      return new Date()
    }

  }
  Film.init({
    title: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    rating: DataTypes.NUMBER,
    premierDate: DataTypes.DATE,
    genre: DataTypes.STRING
  }, {
    sequelize,
    hooks: {
      beforeCreate(att, options) {
        att.rating = 0
      } 
    },
    modelName: 'Film',
  });
  return Film;
};