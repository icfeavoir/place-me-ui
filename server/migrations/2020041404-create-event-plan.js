'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('eventPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'events',
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
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
    return queryInterface.dropTable('eventPlans');
  }
};