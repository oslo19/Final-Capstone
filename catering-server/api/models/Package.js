const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
    }],
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;
