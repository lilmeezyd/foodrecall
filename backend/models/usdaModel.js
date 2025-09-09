const mongoose = require("mongoose")

const fdaSchema = mongoose.Schema({
    lastDate: {
        type: String
    }
})

module.exports = mongoose.model('Usda', fdaSchema) 