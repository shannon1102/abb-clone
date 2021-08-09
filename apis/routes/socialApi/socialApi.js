'use strict'
const express = require('express')

const {checkRequiredFieldInBody} = require('../../middlewares')
const MysqlDB = require('../../../models/mysql/mysql')
const SocialService = require('../../../services/socialService/socialService')

const socialApi = express.Router()
const mysqlDb = new MysqlDB()
const socialService = new SocialService(mysqlDb)

socialApi.get('/',  (req, res, next) => {
    socialService
    .getSocials()
    .then(listSocials=>{
        return res.status(200).json(listSocials)
    })    
    .catch (error=>{
        return res.status(500).json({message: error})
        })
    }
)

socialApi.get('/:id',  (req, res, next) => {
        let {id} = req.params
        socialService
        .getSocialById(id)
        .then(socialFounded=>{
            return res.status(200).json(socialFounded)
        })
        .catch (error=>{
            return res.status(500).json({message: error})
    })
})
socialApi.get('/findByName/:socialName',  (req, res, next) => {
    let {socialName} = req.params
    socialService
    .getSocialByName(socialName)
    .then(socialFounded=>{
        return res.status(200).json(socialFounded)
    })
    .catch (error=>{
        return res.status(500).json({message: error})
})
})

socialApi.post('/',
    checkRequiredFieldInBody(['name','value']),
     (req, res, next) => {
        let {name,value} = req.body
        socialService
        .createSocial(name,value)
        .then(result=>{
            return res.status(200).json({message: 'create new Social successfully' })
        })
        .catch (error=> {
            return res.status(500).json({message: error})
        })
})

socialApi.put('/:id',
    checkRequiredFieldInBody(['name','value']),
     (req, res, next) => {
        let {id} = req.params
        let {name,value} = req.body
        socialService
        .updateSocial(id,name,value)
        .then(result=>{
            return res.status(200).json({message: 'updated Social successfully'})
        })
        .catch (error => {
            return res.status(500).json({message: error})
        })
    })

socialApi.delete('/:id',
     (req, res, next) => {
        let {id} = req.params
        socialService.deleteSocial(id)
        .then(result=>{ 
            return res.status(200).json({message: 'removed Social successfully'})
        }) 
        .catch (error => {
            return res.status(500).json({message: error})
        })
})

module.exports = socialApi