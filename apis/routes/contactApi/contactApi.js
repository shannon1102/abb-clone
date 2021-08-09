'use strict'
const express = require('express')

const {checkRequiredFieldInBody} = require('../../middlewares')
const MysqlDB = require('../../../models/mysql/mysql')
const ContactService = require('../../../services/contactService/contactService')

const contactApi = express.Router()
const mysqlDb = new MysqlDB()
const contactService = new ContactService(mysqlDb)

contactApi.get('/',  (req, res, next) => {

    let {contactsPerPage, pageNumber} = req.query
    contactService
    .getContacts(contactsPerPage, pageNumber)
    .then(listContacts=>{
        return res.status(200).json(listContacts)
    })    
    .catch (error=>{
        return res.status(500).json({message: error})
        })
    }
)

contactApi.get('/:id',  (req, res, next) => {
        let {id} = req.params
        contactService
        .getContactById(id)
        .then(contactFounded=>{
            return res.status(200).json(contactFounded)
        })
        .catch (error=>{
            return res.status(500).json({message: error})
    })
})

contactApi.post('/',
    checkRequiredFieldInBody(['representative']),
     (req, res, next) => {
        let {representative,address,phone_number,image_url} = req.body
        contactService
        .createContact(representative,address,phone_number,image_url)
        .then(result=>{
            return res.status(200).json({message: 'create new contact successfully' })
        })
        .catch (error=> {
            return res.status(500).json({message: error})
        })
})

contactApi.put('/:id',
    checkRequiredFieldInBody(['representative']),
     (req, res, next) => {
        let {id} = req.params
        let {representative,address,phone_number,image_url} = req.body
        contactService
        .updateContact(id,representative,address,phone_number,image_url)
        .then(result=>{
            return res.status(200).json({message: 'updated contact successfully'})
        })
        .catch (error => {
            return res.status(500).json({message: error})
        })
    })

contactApi.delete('/:id',
     (req, res, next) => {
        let {id} = req.params
        contactService.deleteContact(id)
        .then(result=>{ 
            return res.status(200).json({message: 'removed contact successfully'})
        }) 
        .catch (error => {
            return res.status(500).json({message: error})
        })
})

module.exports = contactApi