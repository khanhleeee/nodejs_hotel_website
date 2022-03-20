const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let User = new Schema({
    email: { type: String, maxLength: 255 },
    password: { type: String, maxLength: 255 },
    avatar: { type: String, default: "https://res.cloudinary.com/nguyenle23/image/upload/v1647679022/ecommerce/avatar_kx04jf.png" },
    role: { type: String, maxLength: 255 },
    // passwordConf: { type: String, maxLength: 255 },
    // name: { type: String, maxLength: 255 },
    // address: { type: String, maxLength: 255 },
    // token: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Users', User);