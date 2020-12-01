var express = require('express');
var router = express.Router();
const pool = require('../config');

/* GET users listing. */
router.get('/', (request, response) => {

    var query = 'SELECT p.*, pp1.* FROM productos p ';
    query += 'JOIN precioProducto pp1 ON (p.idProducto = pp1.idProducto) ';
    query += 'LEFT OUTER JOIN precioProducto pp2 ON ';
    query += '( p.idProducto = pp2.idProducto AND ';
    query += '(pp1.fechaVigencia < pp2.fechaVigencia OR ';
    query += '(pp1.fechaVigencia = pp2.fechaVigencia AND pp1.idPrecioProducto < pp2.idPrecioProducto)) )';
    query += 'WHERE p.estado = "alta" AND pp2.idPrecioProducto IS NULL ';
    query += 'ORDER BY p.idProducto ASC';
        
    pool.query(query, (error, result) => {
        if (error) throw error;

        response.send(result);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM productos WHERE idProducto = '+ id , (error, result) => {
        if (error) throw error;
  
        res.send(result);
    });
});

router.put('/change-stock', (req, res) => {
    const data = req.body;
    const values = [data.stock, data.id];

    var sql = 'UPDATE productos ';
    sql += 'SET stock = ? ';
    sql += 'WHERE idProducto = ? ';

    pool.query(sql, values, (err, result) => {
        if (err) throw err;

        res.send(result);
    });
});


router.post('/change-price', (req, res) => {
    const data = req.body;

    const idProducto = data.id;
    const fecha = new Date();
    const precio = data.price;

    const valPrecio = [idProducto, fecha, precio];

    var sqlPrecio = 'INSERT INTO precioProducto';
    sqlPrecio += '(idProducto, fechaVigencia, precio)';
    sqlPrecio += 'VALUES (?, ?, ?)';

    pool.query(sqlPrecio, valPrecio, (err, result) => {
        if (err) throw err;

        res.send(result);
    });
});

router.post('/', (req, res) => {
    const producto = req.body.producto;
    const imageUrl = req.body.imageUrl;
    
    const values = [
        producto.idCategoria,
        producto.articulo,
        producto.descripcion,
        producto.stock,
        producto.puntoDeReposicion,
        imageUrl,
        producto.modelo,
        producto.marca
    ];

    var sql = 'INSERT INTO productos';
    sql += '(idCategoria, nombre, descripcion, stock, puntoDeReposicion, pathImagen, modelo, marca)';
    sql += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    pool.query(sql, values, (error, result) => {
        if (error) throw error;

        const idProducto = result.insertId;
        const fecha = new Date();
        const precio = producto.precio;

        const valPrecio = [idProducto, fecha, precio];

        var sqlPrecio = 'INSERT INTO precioProducto';
        sqlPrecio += '(idProducto, fechaVigencia, precio)';
        sqlPrecio += 'VALUES (?, ?, ?)';

        pool.query(sqlPrecio, valPrecio, (err, ress) => {
            if (err) throw err;

            res.send(result);
        });

    });
});

module.exports = router;
