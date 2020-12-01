var express = require('express');
var router = express.Router();
const pool = require('../config');


router.get('/', (request, response) => {
    let query = 'SELECT *, u.email, p.idPedido as idPedido, ';
    query += 'p.monto as monto, f.monto as montoTotal, ';
    query += 'p.estado as estado, f.estado as estadoFactura ';
    query += 'FROM pedidos as p ';
    query += 'LEFT JOIN users as u ON p.idUsuario = u.id ';
    query += 'LEFT JOIN facturas as f ON f.idPedido = f.idPedido ';

    pool.query(query, (error, result) => {
        if (error) throw error;

        response.send(result);
    });
});

router.get('/:id', (request, response) => {
    const id = request.params.id;

    let query = 'SELECT dp.*, p.*, df.* FROM detallePedidos as dp ';
    query += 'LEFT JOIN detalleFactura as df ON dp.idDetalleFactura = df.idDetalleFactura ';
    query += 'LEFT JOIN productos as p ON dp.idProducto = p.idProducto ';
    query += 'WHERE dp.idPedido = '+ id;

    pool.query(query, (error, result) => {
        if (error) throw error;
  
        response.send(result);
    });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const estado = req.body.estado;
    
    const values = [
        estado,
        id
    ];

    var sql = 'UPDATE pedidos ';
    sql += 'SET estado = ? ';
    sql += 'WHERE idPedido = ? ';

    pool.query(sql, values, (error, result) => {
        if (error) throw error;

        res.send(result);
    });
});

module.exports = router;
