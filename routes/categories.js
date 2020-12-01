var express = require('express');
var router = express.Router();
const pool = require('../config');

router.get('/', (request, response) => {
  pool.query('SELECT * FROM categorias', (error, result) => {
      if (error) throw error;

      response.send(result);
  });
});

router.get('/:id', (request, response) => {
    const id = request.params.id;

    var query = 'SELECT p.*, pp1.* FROM productos p ';
    query += 'JOIN precioProducto pp1 ON (p.idProducto = pp1.idProducto) ';
    query += 'LEFT OUTER JOIN precioProducto pp2 ON ';
    query += '( p.idProducto = pp2.idProducto AND ';
    query += '(pp1.fechaVigencia < pp2.fechaVigencia OR ';
    query += '(pp1.fechaVigencia = pp2.fechaVigencia AND pp1.idPrecioProducto < pp2.idPrecioProducto)) )';
    query += 'WHERE p.estado = "alta" AND pp2.idPrecioProducto IS NULL AND idCategoria = ? ';
    query += 'ORDER BY p.idProducto ASC';

    const values = [id];

    pool.query(query, values, (error, result) => {
        if (error) throw error;
  
        response.send(result);
    });
  });
  

router.post('/', (req, res) => {
    const categoria = req.body.categoria;
    
    const values = [
        categoria.esProbable,
        categoria.descripcion,
    ];

    var sql = 'INSERT INTO categorias';
    sql += '(esProbable, descripcion)';
    sql += 'VALUES (?, ?)';

    pool.query(sql, values, (error, result) => {
    if (error) throw error;

    res.send(result);
    });
});

module.exports = router;
