'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
      },
      color: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '#000000'
      },
      event_plan_id: {
          type: Sequelize.INTEGER,
          references: {
              model: 'eventPlans',
              key: 'id',
          },
          onDelete: 'SET NULL',
          allowNull: true,
      },
      constraint_id: {
          type: Sequelize.INTEGER,
          references: {
              model: 'constraints',
              key: 'id',
          },
          allowNull: true,
          defaultValue: null,
      },
      constraint_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
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
    return queryInterface.dropTable('groups');
  }
};