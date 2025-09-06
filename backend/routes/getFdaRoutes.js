const express = require('express')
const router = express.Router()
const { getFdaRecalls, getOldFdaRecalls } = require('../controllers/fdaController')

router.get('/', getFdaRecalls)
router.get('/old', getOldFdaRecalls)
module.exports = router