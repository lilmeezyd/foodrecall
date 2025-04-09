const mongoose = require("mongoose")

const fdaSchema = mongoose.Schema({
    results: []
})

module.exports = mongoose.model('Fda', fdaSchema) 