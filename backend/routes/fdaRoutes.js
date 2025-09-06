const express = require('express')
const router = express.Router()
const { getRecalls, migrateFdaData } = require('../controllers/fdaController')

router.get('/', getRecalls)
router.get('/migrate', migrateFdaData)

module.exports = router