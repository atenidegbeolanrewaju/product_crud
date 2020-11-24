const router = require('express').Router();
const productController = require('../controllers/product');

router.get('/allProducts', productController.fetchAll);

router.post('/create', productController.createProduct);

router.get('/:productId', productController.getProduct);

router.patch('/:productId', productController.updateProduct);

router.delete('/:productId', productController.deleteProduct)

module.exports = router;