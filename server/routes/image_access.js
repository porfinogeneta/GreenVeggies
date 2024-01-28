
import express from 'express'
import { listFiles } from '../images/accessImage.js'

const router = express()

// route to get all products
router.get('/images', listFiles)


export default router;


