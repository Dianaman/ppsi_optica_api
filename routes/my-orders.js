var express = require('express');
var router = express.Router();
const pool = require('../config');


router.get('/:userId', (request, response) => {
    const userId = request.params.userId;

    let query = 'SELECT * FROM pedidos as p ';
    query += 'WHERE idUsuario = ' + userId;

    pool.query(query, (error, result) => {
        if (error) throw error;

        response.send(result);
    });
});

router.get('/:userId/:orderId', (request, response) => {
    const userId = request.params.userId;
    const orderId = request.params.orderId;

    let query = 'SELECT dp.*, p.*, df.* FROM detallePedidos as dp ';
    query += 'LEFT JOIN detalleFactura as df ON dp.idDetalleFactura = df.idDetalleFactura ';
    query += 'LEFT JOIN productos as p ON dp.idProducto = p.idProducto ';
    query += 'WHERE dp.idPedido = '+ orderId;

    pool.query(query, (error, result) => {
        if (error) throw error;
  
        response.send(result);
    });
});

router.put('/:userId/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const userId = req.params.userId;
    const estado = req.body.estado;
    
    const values = [
        estado,
        orderId
    ];

    var sql = 'UPDATE pedidos ';
    sql += 'SET estado = ? ';
    sql += 'WHERE idPedido = ?';

    pool.query(sql, values, (error, result) => {
        if (error) throw error;

        res.send(result);
    });
});

module.exports = router;
