'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('group_seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      group_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'groups',
          key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      event_plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'event_plans',
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
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('group_seats');
  },
};
