const Product = require('../models/product');
const mongoose = require('mongoose');

exports.fetchAll = (req, res) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const allProdResponse = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/product/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(allProdResponse);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.createProduct = (req, res) => {
    const product = new Product ({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        });

    // try {
    //     const savedUser = await product.save()
    //     res.send(savedUser)
    // } catch (error) {
    //     res.status(400).send(error)
    // }

    // product.save( function (err) {
    //     if (err) {
    //         return (err)
    //     }
    //     res.send('product created successfully')
    // });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product created successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        description:'The url below will get the created product for you',
                        url: 'http://localhost:4000/product/' + result._id
                    }
                }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        })
    });
};

exports.getProduct = (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type : 'GET',
                        description: 'The url below gives the whole product created',
                        url : 'http://localhost:4000/product/allProducts' 
                    }
                });
            } else {
                res.status(404).json({
                    message : 'No valid entry found for provided id'
                })
            }   
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
};

exports.updateProduct = (req, res) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id}, {$set : updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                type: 'GET',
                description: 'the url below shows the updated product info',
                url : 'http://localhost:4000/product/' + id
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
};

exports.deleteProduct = (req, res) => {
    const id = req.params.productId;
    Product.remove({_id : id})
        .exec()
        .then(result => {
            res.status(200).json({
              message : 'Product deleted successfully',
              request : {
                  type : 'POST',
                  description: 'The url below gives you an idea of creating another product',
                  url : 'http://localhost:4000/product/create',
                  data: {
                      name: 'String', price: 'Number'
                  }
              }
              
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};