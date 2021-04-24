const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bicycleSchema = new Schema({
    name: {
        type: Schema.Types.String,
    },
    addr: {
        type: Schema.Types.String
    },
    store: {
        type: Schema.Types.String,
    },
    link: {
        type: Schema.Types.String
    },
    price: {
        type: Schema.Types.String,
    },
    image: {
        type: Schema.Types.String,
    }
})


const BicycleModel = mongoose.model('Bicycle', bicycleSchema);
module.exports = BicycleModel;