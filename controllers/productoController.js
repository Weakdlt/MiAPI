const Producto = require('../models/Producto');

exports.listar = async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
};

exports.crear = async (req, res) => {
  const producto = await Producto.create(req.body);
  res.status(201).json(producto);
};

