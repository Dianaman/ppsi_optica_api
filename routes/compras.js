var express = require('express');
var router = express.Router();
const pool = require('../config');

/* GET users listing. */

router.get('/', (request, response) => {
  pool.query('SELECT * FROM pedidos', (error, result) => {
    if (error) throw error;

    console.log('compras', result);
    response.send(result);
  });
});


router.post('/add', (req, res) => {

  var sql = `INSERT INTO pedidos (Idusuario, estado, tipoEnvio, monto) VALUES ('${req.body.idusuario}','activo', '${req.body.tipoEnvio}', '${req.body.monto}')`;

  pool.query(sql, (error, result) => {
    if (error) throw error;

    const idPedido = result.insertId;
    let ind = 0;
    var val = (`('${idPedido}', '1', `)
    var sqldet = (`INSERT INTO detallePedidos ( idPedido, Iddetallefactura, idproducto, cantidad, precioUnitario)  VALUES `);


    req.body.idproductos && req.body.idproductos.map((item) => {
      console.log(req.body.idproductos[ind]);
      console.log(req.body.cantprod[ind]);
      if (ind === 0) sqldet = sqldet + val + `'${req.body.idproductos[ind]}'`+ ','+`'${req.body.cantprod[ind]}'`+ ','+`'${req.body.precioUnitario[ind]}')`;
      else sqldet = sqldet + ',' + val + `'${req.body.idproductos[ind]}'`+ ','+ `'${req.body.cantprod[ind]}'`+ ','+`'${req.body.precioUnitario[ind]}')`;
      ind++;
      console.log(sqldet);
    })

    pool.query(sqldet, (err, ress) => {
      if (err) throw err;

      res.send(result);
    });


  });


});

router.get('/:CP', (req, res) => {
  const CP = req.params.CP;
  console.log('cp api  ', CP)
  pool.query('SELECT Precio FROM envios WHERE codigoPostal = '+ CP , (error, result) => {
      if (error) throw error;
console.log(result[0]);
      res.send(result[0]);
  });
});

module.exports = router;
