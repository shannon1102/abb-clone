'use strict'
const mysql =require('mysql')
const {orderTypeSetting} = require('../../config/index')
const logger = require('../../logger')
const {to} = require('../../helper/to')
const { resolve } = require('app-root-path')

class ComponentService{
    constructor(mysqlDb){
        this.mysqlDb = mysqlDb
    }
    getComponents(componentsPerPage,pageNumber,orderType) {
        return new Promise(async (resolve,reject)=>{
            console.log(orderTypeSetting[1])
            let offsetDb = 0 , orderByDb
            orderType = orderType ? orderType : 2 
            pageNumber = pageNumber ? pageNumber : 1
            componentsPerPage = componentsPerPage ? componentsPerPage : 10
            offsetDb = componentsPerPage * (pageNumber - 1)
            if (orderType == orderTypeSetting.ASE) {
                orderByDb = 'ASC'
            } else {
                orderByDb ='DESC'
            }
         
            const query =
                `SELECT * FROM components AS c
                ORDER BY c.created_at ${mysql.escape(orderByDb).split(`'`)[1]} 
                LIMIT ${componentsPerPage}
                OFFSET ${mysql.escape(offsetDb)} `
            
            console.log(query)
            let [err,listcomponents] = await to(this.mysqlDb.poolQuery(query))
            if(err) {
                logger.error(`[componentService][getcomponents] errors : `,err)
                return reject(err)
            } else {
                 return resolve(listcomponents)
            }
    
        })
    }
    getComponentsByProductId(id) {
        return new Promise(async (resolve,reject)=>{
            const query =
                `SELECT * FROM components AS c
                WHERE c.product_id = ${id}
                ORDER BY c.name
                `
            let [err,listcomponents] = await to(this.mysqlDb.poolQuery(query))
            if(err) {
                logger.error(`[componentService][getcomponents] errors : `,err)
                return reject(err)
            } else {
                 return resolve(listcomponents)
            }
    
        })
    }

    getComponentById(id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * from components AS c
                WHERE c.id = ${mysql.escape(id)}
            `
            const [err, componentResult] = await to(this.mysqlDb.poolQuery(query))
            console.log(componentResult)
            if (err) {
                logger.error(`[componentService][getcomponentById] errors: `, err)
                return reject(err)
            }
            if (!componentResult.length) {
                return reject(`component with id ${id} not found`)
            }
            
            return resolve(componentResult)
        })
    }
    createComponent(name,content,image_url,product_id){
         return new Promise(async (resolve,reject)=>{
            const query = `INSERT INTO components(name,content,image_url,product_id) 
            VALUES (${mysql.escape(name)},${mysql.escape(content)},${mysql.escape(image_url)},${mysql.escape(product_id)})`

            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[componentService][createcomponent] errors: `, err)
                return reject(err)
            }
            return resolve(result)

         })
    }
    updateComponent(id,name,content,image_url,product_id){
            return new Promise(async (resolve,reject)=>{
               const query = `UPDATE components
               SET name = ${mysql.escape(name)},
               content = ${mysql.escape(content)},
               image_url= ${mysql.escape(image_url)},
               product_id= ${mysql.escape(product_id)}
               WHERE id = ${mysql.escape(id)}
               `
               const [err, result] = await to(this.mysqlDb.poolQuery(query))
               if (err) {
                   logger.error(`[componentService][updatecomponent] errors: `, err)
                   return reject(err)
               }
               return resolve(result)
            })
    }
    deleteComponent(id) {
        return new Promise(async (resolve, reject) => {
            let query = ``
            try {
                await this.mysqlDb.beginTransaction()
                query = `SELECT COUNT(*) AS numcomponent FROM components WHERE id = ${mysql.escape(id)}`
                let result1 = await this.mysqlDb.poolQuery(query)
                if (!result1[0].numcomponent) {
                    return reject(`component with id ${id} not found`)
                }
                query = `
                DELETE FROM components
                WHERE  id = ${mysql.escape(id)}
                `
                let result = await this.mysqlDb.poolQuery(query)

                if (result.affectedRows === 0) {
                    return reject(`Delete component with id ${id} not sucessfully`)
                }
                await this.mysqlDb.commit()
                return resolve(`Delete component with id ${id} sucessfully`)
            } catch (err) {
                logger.error(`[componentService][deletecomponent] errors: `, err)
                await this.mysqlDb.rollback()
                return reject(err.sqlMessage)
            }
        })
    }
}


module.exports = ComponentService