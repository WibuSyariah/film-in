'use strict';
const {Model} = require('sequelize'); 
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Film)
      this.hasOne(models.Profile)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username cannot be empty' 
        },
        len: {
          args: [4, 15],
          msg: 'Username must be between 4 and 15 characters'
        }
      },
      unique: {
        msg: 'Username already exist'
      }, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Email cannot be empty'
        },
        notNull: {
          msg: 'Email cannot be empty'
        },
      },
    }, 
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 15],
          msg: 'Password must be between 8 characters and 15 characters'
        }
      } 
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(att, options) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(att.password, salt)
        att.password = hash
        att.role = "user"
      } 
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};