'use strict'
const express = require('express')

const {checkRequiredFieldInBody} =  require('../../middlewares')
const MysqlDB = require('../../../models/mysql/mysql')
const ComponentService = require('../../../services/componentService/componentService')

const componentApi = express.Router()
const mysqlDb = new MysqlDB()
const componentService = new ComponentService(mysqlDb)

componentApi.get('/', (req,res,next)=>{
    let {componentsPerPage,pageNumber,orderType} = req.query
    componentService
    .getComponents(componentsPerPage,pageNumber,orderType)
    .then(listcomponents=>{
        res.status(200).json(listcomponents)
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })
        
})
componentApi.get('/:id', (req,res,next)=>{
    let {id} = req.params
    console.log(id)
    componentService
    .getComponentById(id)
    .then(component=>{
        res.status(200).json(component)
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})
componentApi.get('/byProductId/:id', (req,res,next)=>{
    let {id} = req.params
    console.log(id)
    componentService
    .getComponentsByProductId(id)
    .then(components=>{
        res.status(200).json(components)
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})
componentApi.post('/',checkRequiredFieldInBody(['name','product_id']), (req,res,next)=>{
    let {name,content,image_url,product_id} = req.body
    componentService
    .createComponent(name,content,image_url,product_id)
    .then(result => { 
        res.status(200).json({
            message: 'Post new component successfully'
        })
    })
    .catch(err => {
        return res.status(500).json({message : err})
    })  
})
componentApi.put('/:id',checkRequiredFieldInBody(['name','product_id']), (req,res,next)=>{
    let {id} = req.params
    let {name,content,image_url,product_id} = req.body
    componentService
    .updateComponent(id,name,content,image_url,product_id)
    .then(result=>{
        res.status(200).json({
            message: 'Update component sucessfully',
            component: result
            })
        })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})
componentApi.delete('/:id', (req,res,next)=>{
    let {id} = req.params
    componentService
    .deleteComponent(id)
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        return res.status(500).json({message : err})
    })  
})

module.exports = componentApi
