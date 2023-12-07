'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    'ID Пользователя': DataTypes.INTEGER,
    Имя: DataTypes.STRING,
    Фамилия: DataTypes.STRING,
    'режим Веган': DataTypes.INTEGER,
    Статус: DataTypes.INTEGER,
    Фото: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Пользователь',
  });
  return Users;
};