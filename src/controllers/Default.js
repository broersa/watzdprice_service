'use strict';

var watzdprice = require('../bll/watzdprice.js');

module.exports.updateproductPUT = function updateproductPUT (req, res, next) {
  watzdprice.updateProduct({
    name: req.swagger.params.product.value.name,
    shop: req.swagger.params.product.value.shop,
    ean: req.swagger.params.product.value.eancode,
    category: req.swagger.params.product.value.category,
    datetime: req.swagger.params.product.value.datetime,
    price: req.swagger.params.product.value.price,
    description: req.swagger.params.product.value.description,
    url: req.swagger.params.product.value.url,
    image: req.swagger.params.product.value.image,
  }, function (err) {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.end();
  });
};
