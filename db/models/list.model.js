const { Model, DataTypes, Sequelize } = require("sequelize");

const LIST_TABLE = "lists";

const ListSchema = {
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
  description: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  date: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  completed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  userId: {
    allowNull: false,
    field: "user_id",
    type: DataTypes.INTEGER,
    references: { model: 'users', key: "id" },
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

class List extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
    this.hasMany(models.Task, {
      as: 'tasks',
      foreignKey: 'listId',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: LIST_TABLE,
      modelName: "List",
      timestamps: false,
    };
  }
}

module.exports = { LIST_TABLE, ListSchema, List };
