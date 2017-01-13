'use strict';

module.exports = {
  getProduct: function (client, productid, callback) {
    client.query('select prokey, proid, proname, proshop, proean, procategory, procreated, prolastupdate, proprice, prodescription, prourl, proimage from product where proid=$1 for update', [productid], function (err, result) {
      if (err) {
        return callback(err);
      }
      if (result.rowCount !== 1) {
        return callback(null, null);
      }
      callback(null, {
        prokey: parseInt(result.rows[0].prokey),
        proid: result.rows[0].proid,
        proname: result.rows[0].proname,
        proprice: parseFloat(result.rows[0].proprice)
      });
    });
  },
  addProduct: function (client, product, callback) {
    client.query('insert into product (proid, proname, proshop, proean, procategory, procreated, prolastupdate, proprice, prodescription, prourl, proimage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING prokey', [
      product.proid,
      product.proname,
      product.proshop,
      product.proean,
      product.procategory,
      product.procreated,
      product.prolastupdate,
      product.proprice,
      product.prodescription,
      product.prourl,
      product.proimage], function (err, result) {
        if (err) {
          return callback(err);
        }
        if (result.rowCount !== 1) {
          return callback(null, null);
        }
        callback(null, result.rows[0].prokey);
      });
  },
  updateProduct: function (client, product, callback) {
    client.query('update product set proean=$1, procategory=$2, prolastupdate=$3, proprice=$4, prodescription=$5, proimage=$6 WHERE proid=$7', [
      product.proean,
      product.procategory,
      product.prolastupdate,
      product.proprice,
      product.prodescription,
      product.proimage,
      product.proid], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  },
  addHistory: function (client, history, callback) {
    client.query('insert into history (hisproduct, hisupdate, hisprice) VALUES ($1, $2, $3) RETURNING hiskey', [
      history.hisproduct,
      history.hisupdate,
      history.hisprice], function (err, result) {
        if (err) {
          return callback(err);
        }
        if (result.rowCount !== 1) {
          return callback(null, null);
        }
        callback(null, result.rows[0].hiskey);
      });

  }
}
