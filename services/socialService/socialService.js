'use strict'

const mysql = require('mysql')

const logger = require('../../logger')
const {to} = require('../../helper/to')

class SocialService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }

    getSocials() {
        return new Promise(async (resolve, reject) => { 
            const query = `
                SELECT * FROM social
                ORDER BY name
            `
            console.log(query);
            let [err, listSocials] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[SocialService][getSocials] errors: `, err)
                return reject(err)
            } else {
                return resolve(listSocials)
            }

        })
    }
    getSocialById(id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM social WHERE id = ${mysql.escape(id)}`
            const [err, socialResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[SocialService][getSocialById] errors: `, err)
                return reject(err)
            }
            if (!socialResult.length) {
                return reject(`Social with id ${id} not found`)
            }
            return resolve(socialResult[0])
        })
    }
    getSocialByName(name) {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT * FROM social WHERE name LIKE ${mysql.escape('%'+name+'%')}`
            console.log(query)
            const [err, socialResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[SocialService][getSocialById] errors: `, err)
                return reject(err)
            }
            if (!socialResult.length) {
                return reject(`Social with name ${name} not found`)
            }
            return resolve(socialResult[0])
        })
    }
    createSocial(name,value) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO social(name,value)
                VALUES(${mysql.escape(name)},${mysql.escape(value)})
            `
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[SocialService][createSocial] errors: `, err)
                return reject(err)
            }
            return resolve(result)
        })
    }
    updateSocial(id,name,value) {
        return new Promise(async (resolve, reject) => {
            const query = `
                UPDATE social SET 
                name = ${mysql.escape(name)},
                value = ${mysql.escape(value)}
                WHERE id = ${id}`
            console.log(query)
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[SocialService][updateSocial] errors: `, err)
                return reject(err)
            }
            if (result.affectedRows === 0) {
                return reject(`Social with id ${id} not found`)
            }

            return resolve(result)
        })
    }
    deleteSocial(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                    DELETE FROM social
                    WHERE id = ${mysql.escape(id)}
                `
                let result = await this.mysqlDb.poolQuery(query)
                if (result.affectedRows === 0) {
                    return reject(`Social with id ${id} not found`)
                }
                return resolve()
            } catch (err) {
                logger.error(`[SocialService][deleteSocial] errors: `, err)
                return reject(err)
            }
        })
    }

}

module.exports = SocialService