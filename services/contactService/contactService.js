'use strict'

const mysql = require('mysql')

const logger = require('../../logger')
const {to} = require('../../helper/to')

class ContactService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }

    getContacts(contactsPerPage, pageNumber) {
        return new Promise(async (resolve, reject) => {  
            let offsetDb = 0          
            if (!contactsPerPage) {
                contactsPerPage = 10
            }if(!pageNumber) {
                pageNumber = 1
            } else {
                offsetDb = contactsPerPage * (pageNumber - 1)
            }
            const query = `
                SELECT * FROM contacts
                ORDER BY representative
                LIMIT ${contactsPerPage}
                OFFSET ${mysql.escape(offsetDb)}
            `
            console.log(query);
            let [err, contactsResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[contactService][getContacts] errors: `, err)
                return reject(err)
            } else {
                return resolve(contactsResult)
            }

        })
    }
    getContactById(id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM contacts WHERE id = ${mysql.escape(id)}`
            const [err, contactResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[contactService][getContactById] errors: `, err)
                return reject(err)
            }
            if (!contactResult.length) {
                return reject(`contact with id ${id} not found`)
            }
            return resolve(contactResult[0])
        })
    }
    getcontactByRepresentative(representative) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM contacts WHERE representative = ${mysql.escape(Representative)}
            `
            const [err, contactResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[contactService][getContactByRepresentative] errors: `, err)
                return reject(err)
            }
            return resolve(contactResult)
        })
    }
    createContact(representative,address,phone_number,image_url) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO contacts(representative,address,phone_number,image_url)
                VALUES(${mysql.escape(representative)},${mysql.escape(address)},${mysql.escape(phone_number)},${mysql.escape(image_url)})
            `
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[contactService][createContact] errors: `, err)
                return reject(err)
            }
            return resolve(result)
        })
    }
    updateContact(id,representative,address,phone_number,image_url) {
        return new Promise(async (resolve, reject) => {
            const query = `
                UPDATE contacts SET 
                representative = ${mysql.escape(representative)},
                address = ${mysql.escape(address)},
                phone_number = ${mysql.escape(phone_number)},
                image_url =  ${mysql.escape(image_url)}
                WHERE id = ${mysql.escape(id)}
            `
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[contactService][updatecontact] errors: `, err)
                return reject(err)
            }
            if (result.affectedRows === 0) {
                return reject(`contact with id ${id} not found`)
            }

            return resolve(result)
        })
    }
    deleteContact(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                    DELETE FROM contacts
                    WHERE id = ${mysql.escape(id)}
                `
                let result = await this.mysqlDb.poolQuery(query)
                if (result.affectedRows === 0) {
                    return reject(`contact with id ${id} not found`)
                }
                return resolve()
            } catch (err) {
                logger.error(`[contactService][deleteContact] errors: `, err)
                return reject(err)
            }
        })
    }

}

module.exports = ContactService