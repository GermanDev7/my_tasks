const { Model, DataTypes, Sequelize } = require("sequelize");

const TASK_TABLE = "tasks";

const TaskSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  tema: {
    type: DataTypes.STRING,
  },
  initialDate: {
    allowNull: false,
    field: "initial_date",
    type: DataTypes.DATE,
  },
  finalDate: {
    allowNull: false,
    field: "final_date",
    type: DataTypes.DATE,
  },
  complete: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  listId: {
    allowNull: false,
    field: "list_id",
    type: DataTypes.INTEGER,
    references: { model: 'lists', key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  CreatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
  UpdatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "updated_at",
    defaultValue: Sequelize.NOW,
  },
};

class Task extends Model {
  static associate(models) {
    this.belongsTo(models.List, {
        as: 'list',
        foreignKey: 'listId',
      });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: TASK_TABLE,
      modelName: "Task",
      timestamps: false,
    };
  }
}

module.exports = { TASK_TABLE, TaskSchema, Task };
