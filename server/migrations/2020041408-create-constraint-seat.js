'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('constraintSeats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'plans',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      constraint_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'constraints',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      line: {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      cell: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('constraintSeats');
  }
};