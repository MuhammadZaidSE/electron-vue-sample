const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://root:root@localhost:3306/testdb')

let product

export const makeConnection = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection successfully made.')
    })
    .catch(err => {
      console.error('Error connecting to database', err)
    })
}

export const createProductModel = () => {
  product = sequelize.define('product', {
    name: {
      type: Sequelize.STRING
    },
    quantity: {
      type: Sequelize.FLOAT
    },
    cost: {
      type: Sequelize.FLOAT
    },
    price: {
      type: Sequelize.FLOAT
    },
    unit: {
      type: Sequelize.STRING
    }
  })
}

export const createProductTable = () => {
  product.sync().then(() => {
    return product.create({
      name: 'Product 001',
      quantity: 10,
      cost: 100,
      price: 120,
      unit: 'kg'
    })
  })
}

export const listProducts = () => {
  product.findAll().then(products => {
    console.log(products)
  })
}
