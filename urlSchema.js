const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Url', urlSchema)