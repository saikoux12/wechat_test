var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// 0: normal user
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
		if(err){
			console.log(err);
			return next();
		}
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				return next();
			}
			user.password = hash;
			console.log('hash');
			console.log(hash);
			next();
		})
	})
})

UserSchema.methods = {
	comparePassword: function(_password){
		var password = this.password;
		return function(cb){
			bcrypt.compare(_password,password,function(err,isMatch){
				cb(err,isMatch);
			})
		}
	}
}

UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById: function(id,cb){
		return this
			.findOne({_id: id})
			.exec(cb);
	}
}

module.exports = UserSchema;