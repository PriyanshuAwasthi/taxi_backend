const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');


var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        requied: true,
        trim: true,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        requied: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    rides: {
        type: Array,
        default: []
    }
},
{timestamps: true}
);


userSchema.virtual("password")
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
})
.get(function(){
    return this._password;
})


userSchema.methods = {
    authenticate: function(plainpass){
        console.log(this.securePassword(plainpass))
        console.log(this.encry_password)
        
        return this.securePassword(plainpass) == this.encry_password
    },
    securePassword: function(plainpass){
        if(!plainpass) return "";
        try{
            return crypto.createHmac("sha256", this.salt)
            .update(plainpass)
            .digest('hex');
        }catch(error){
            return "";
        }
    }
}


module.exports = mongoose.model("User", userSchema);