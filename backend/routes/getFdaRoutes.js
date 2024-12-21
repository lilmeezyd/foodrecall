const express = require('express')
const router = express.Router()
const { getFdaRecalls } = require('../controllers/fdaController')

router.get('/', getFdaRecalls)

module.exports = router