'use strict'
const express = require('express')

const {checkRequiredFieldInBody} = require('../../middlewares')
const MysqlDB = require('../../../models/mysql/mysql')
const PostService = require('../../../services/postService/postService')

const postApi = express.Router()
const mysqlDb = new MysqlDB()
const postService = new PostService(mysqlDb)

postApi.get('/', async (req, res, next) => {
    try {
        let {postsPerPage, pageNumber, orderType} = req.query
        const postsFounded = await postService.getPosts(postsPerPage, pageNumber, orderType)

        return res.status(200).json(postsFounded)
    } catch (error) {
        return res.status(500).json({message: error})
    }
})

postApi.get('/:id', async (req, res, next) => {
    try {
        let {id} = req.params
        const postFounded = await postService.getPostById(id)

        return res.status(200).json(postFounded)
    } catch (error) {
        return res.status(500).json({message: error})
    }
})

postApi.post('/',
    checkRequiredFieldInBody(['title', 'content']),
    async (req, res, next) => {
        try {
            let {title, description, content} = req.body
            const insertedId = await postService.createPost(title, description, content)

            return res.status(200).json({message: 'create new post successfully', insertedId})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    })

postApi.put('/:id',
    checkRequiredFieldInBody(['title', 'content']),
    async (req, res, next) => {
        let {id} = req.params
        try {
            let {title, description, content} = req.body
            await postService.updatePost(id, title, description, content)

            return res.status(200).json({message: 'updated post successfully'})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    })

postApi.delete('/:id',
    async (req, res, next) => {
        let {id} = req.params
        try {
            await postService.deletePost(id)

            return res.status(200).json({message: 'removed post successfully'})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    })

module.exports = postApi