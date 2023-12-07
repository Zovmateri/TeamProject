'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      'ID Пользователя': {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Имя: {
        type: Sequelize.STRING
      },
      Фамилия: {
        type: Sequelize.STRING
      },
      'режим Веган': {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      Статус: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      Фото: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};