'use strict'
const express = require('express')

const {checkRequiredFieldInBody} =  require('../../middlewares')
const MysqlDB = require('../../../models/mysql/mysql')
const ProductService = require('../../../services/productService/productService')

const productApi = express.Router()
const mysqlDb = new MysqlDB()
const productService = new ProductService(mysqlDb)

productApi.get('/',(req,res,next)=>{
    let {productsPerPage,pageNumber,orderType,search} = req.query
    productService
    .getProducts(productsPerPage,pageNumber,orderType,search)
    .then(listProducts=>{
        res.status(200).json(listProducts)
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })
        
})
productApi.get('/:id',(req,res,next)=>{
    let {id} = req.params
    console.log(id)
    productService
    .getProductById(id)
    .then(product=>{
        res.status(200).json(product)
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})
productApi.post('/',checkRequiredFieldInBody(['title','image_url','content']), (req,res,next)=>{
    let {title,content,description,image_url} = req.body
    productService
    .createProduct(title,content,description,image_url)
    .then(result => { 
        res.status(200).json({
            message: 'Post new Product successfully'
        })
    })
    .catch(err => {
        return res.status(500).json({message : err})
    })  
})
productApi.put('/:id',checkRequiredFieldInBody(['title','content']), (req,res,next)=>{
    let {id} = req.params
    let {title,content,description,image_url} = req.body
    console.log(description)
    productService
    .updateProduct(id,title,content,description,image_url)
    .then(result=>{
        res.status(200).json({
            message: 'Update product sucessfully',
            product: result
            })
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})
productApi.delete('/:id', (req,res,next)=>{
    let {id} = req.params
    productService
    .deleteProduct(id)
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})

module.exports = productApi
