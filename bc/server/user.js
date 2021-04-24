const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Schema.Types.String,
    },
    username: {
        type: Schema.Types.String,
        required: [true, 'username is required'],
    },
    pass: {
        type: Schema.Types.String,
        minlength: [8, 'The password length must be 8 or more'],
        required: [true, 'password is required'],
    },
})



userSchema.pre('save', function(next) {
    this.id = this._id;
    bcrypt.hash(this.pass, 10).then(hasdpass => {
        this.pass = hasdpass;
        next();
    })
});

userSchema.methods.validatePassword = function validatePassword(data) {
    return bcrypt.compareSync(data, this.pass);
};


const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;