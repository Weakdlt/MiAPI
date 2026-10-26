const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultvalue: 0
    }

}, {
    timestamps: true
});

module.exports = Producto;
