const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.listar);
router.post('/', productoController.crear);

module.exports = router;