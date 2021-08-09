'use strict'
const mysql =require('mysql')
const {orderTypeSetting} = require('../../config/index')
const logger = require('../../logger')
const {to} = require('../../helper/to')
const { resolve } = require('app-root-path')

class ProductService{
    constructor(mysqlDb){
        this.mysqlDb = mysqlDb
    }
    getProducts(productsPerPage,pageNumber,orderType,search) {
        return new Promise(async (resolve,reject)=>{
            let offsetDb = 0 , orderByDb
            orderType = orderType ? orderType : 2 
            pageNumber = pageNumber ? pageNumber : 1
            productsPerPage = productsPerPage ? productsPerPage : 10
            offsetDb = productsPerPage * (pageNumber - 1)
            search = search ? search : ''
            if (orderType == orderTypeSetting.ASC) {
                orderByDb = 'ASC'
            } else {
                orderByDb = 'DESC'
            }
            const query =  
                `SELECT p.* FROM products as p 
                WHERE p.title LIKE ${mysql.escape('%'+search+'%')}
                OR p.description LIKE ${mysql.escape('%'+search+'%')}
                ORDER BY p.created_at ${orderByDb} 
                LIMIT ${productsPerPage}
                OFFSET ${mysql.escape(offsetDb)}`
            console.log(query)
            let [err,listProducts] = await to(this.mysqlDb.poolQuery(query))
            if(err) {
                logger.error(`[productService][getProducts] errors : `,err)
                return reject(err)
            } else {
                 return resolve(listProducts)
            }
    
        })
    }

    getProductById(id) {
        return new Promise(async (resolve, reject) => {
            const query = `
            SELECT * FROM components AS c
            WHERE c.product_id = ${mysql.escape(id)}`
            const [err, componentResult] = await to(this.mysqlDb.poolQuery(query))
            let componentObject = Object.assign(componentResult)
            const query1 = `
                SELECT p.* FROM products AS p
                WHERE p.id = ${mysql.escape(id)}
            `
            const [err1, productResult] = await to(this.mysqlDb.poolQuery(query1))
            if (err1) {
                logger.error(`[productService][getProductById] errors: `, err)
                return reject(err)
            }
            if (!productResult.length) {
                return reject(`product with id ${id} not found`)
            }
            productResult[0].components = componentObject
            return resolve(productResult[0])
        })
    }
    createProduct(title,content,description,image_url){
         return new Promise(async (resolve,reject)=>{
            const query = `INSERT INTO products(title,content,image_url,description) 
            VALUES (${mysql.escape(title)},${mysql.escape(content)},${mysql.escape(image_url)},${mysql.escape(description)})`

            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[productService][createProduct] errors: `, err)
                return reject(err)
            }
            return resolve(result)

         })
    }
    updateProduct(id,title,content,description,image_url){
            return new Promise(async (resolve,reject)=>{
               const query = `UPDATE products
               SET title = ${mysql.escape(title)},
               content = ${mysql.escape(content)},
               description = ${mysql.escape(description)},
               image_url= ${mysql.escape(image_url)}
               WHERE id = ${mysql.escape(id)}
               `
               const [err, result] = await to(this.mysqlDb.poolQuery(query))
               if (err) {
                   logger.error(`[productService][updateProduct] errors: `, err)
                   return reject(err)
               }
               return resolve(result)
            })
    }
    deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            let query = ``
            try {
                await this.mysqlDb.beginTransaction()
                query = `SELECT COUNT(*) AS numProduct FROM products WHERE id = ${mysql.escape(id)}`
                let result1 = await this.mysqlDb.poolQuery(query)
                if (!result1[0].numProduct) {
                    return reject(`Product with id ${id} not found`)
                }
                query = `
                DELETE FROM components
                WHERE  product_id = ${mysql.escape(id)}
                `
                let result2 = await this.mysqlDb.poolQuery(query)
                query = `
                DELETE FROM products
                WHERE id = ${mysql.escape(id)}
                `
                let result3 = await this.mysqlDb.poolQuery(query)

                if (result3.affectedRows === 0) {
                    return reject(`Delete product with id ${id} not sucessfully`)
                }
                await this.mysqlDb.commit()
                return resolve(`Delete product with id ${id} ucessfully`)
            } catch (err) {
                logger.error(`[productService][deleteProduct] errors: `, err)
                await this.mysqlDb.rollback()
                return reject(err.sqlMessage)
            }
        })
    }
}


module.exports = ProductService