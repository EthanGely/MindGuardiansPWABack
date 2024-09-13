import { Sequelize, DataTypes } from 'sequelize';
const Role = require('./role');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: Role,
    allowNull: false
  },
  lang: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "FR"
  },
  fontSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  birthDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  sex: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
});

module.exports = User;