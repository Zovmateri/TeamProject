module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('Пользователь', {
        'ID Пользователя': {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        Имя: {
          type: Sequelize.STRING,
        },
        Фамилия: {
          type: Sequelize.STRING,
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
          type: Sequelize.STRING,
        },
      }, {
        tableName: 'Пользователь',
        timestamps: false, // If your table doesn't have createdAt and updatedAt columns
      });
      return User
}