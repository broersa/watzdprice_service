'use strict';

var watzdprice = require('../bll/watzdprice.js');

module.exports.updateproductPUT = function updateproductPUT (req, res, next) {
  watzdprice.updateProduct({
    name: req.swagger.params.product.value.name,
    shop: req.swagger.params.product.value.shop,
    brand: req.swagger.params.product.value.brand,
    ean: req.swagger.params.product.value.eancode,
    category: req.swagger.params.product.value.category,
    datetime: req.swagger.params.product.value.datetime,
    price: req.swagger.params.product.value.price,
    description: req.swagger.params.product.value.description,
    url: req.swagger.params.product.value.url,
    image: req.swagger.params.product.value.image
  }, function (err, result) {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.statusCode = 200;
    res.end(JSON.stringify({operation: result}));
  });
};

module.exports.addshoploadstatsPOST = function addshoploadstatsPOST (req, res, next) {
  watzdprice.addShopLoadStats({
    shop: req.swagger.params.shoploadstats.value.shop,
    start: req.swagger.params.shoploadstats.value.start,
    end: req.swagger.params.shoploadstats.value.end,
    added: req.swagger.params.shoploadstats.value.added,
    updated: req.swagger.params.shoploadstats.value.updated
  }, function (err) {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.statusCode = 204;
    res.end();
  });
};
