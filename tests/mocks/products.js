const { Product } = require('../../models/product');

const mockProducts = {
    baseProduct: (categoryId) => ({
        name: 'Test Product',
        description: 'Test description with minimum length',
        price: 99.99,
        stock: 10,
        category: {
            _id: categoryId,
            name: 'Test Category'
        },
        images: ['image1.jpg', 'image2.jpg']
    }),

    product1: (categoryId) => ({
        name: 'Product 1',
        description: 'Description 1 with minimum length required',
        price: 19.99,
        stock: 5,
        category: {
            _id: categoryId,
            name: 'Test Category'
        },
        images: ['img1.jpg']
    }),

    product2: (categoryId) => ({
        name: 'Product 2',
        description: 'Description 2 with minimum length required',
        price: 29.99,
        stock: 8,
        category: {
            _id: categoryId,
            name: 'Test Category'
        },
        images: ['img2.jpg']
    }),

    newProduct: (categoryId) => ({
        name: 'New Product',
        description: 'New description with minimum length required',
        price: 49.99,
        stock: 15,
        categoryId: categoryId,
        images: ['new1.jpg', 'new2.jpg']
    }),

    updatedProduct: (categoryId) => ({
        name: 'Updated Product',
        description: 'Updated description with minimum length required',
        price: 79.99,
        stock: 20,
        categoryId: categoryId,
        images: ['updated1.jpg', 'updated2.jpg']
    })
};

async function createMockProduct(categoryId) {
    const product = new Product(mockProducts.baseProduct(categoryId));
    await product.save();
    return product;
}

async function removeMockProducts() {
    await Product.deleteMany({});
}

module.exports = {
    mockProducts,
    createMockProduct,
    removeMockProducts
};