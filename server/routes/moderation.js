// paths to handle pub/sub communication

import express from 'express'
import { authenticate } from '../authentication/authentication.js'
import { createProduct, pullProduct } from '../pub-sub/moderation-methods.js'

const router = express()

// route to create a product, i.e. post a message to admin
router.post('/farmer/create', authenticate, createProduct)
// route to receive a product, i.e. pull message
router.post('/admin/pull', pullProduct)
// route to delete message, either was accepted or rejected


export default router;