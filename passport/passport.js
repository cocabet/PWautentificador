var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
	//serializar
	passport.serializeUser(function(user,done){
		done(null,user);
	});

	passport.deserializeUser(function(obj,done){
		done(null,obj);
	});

	passport.use(new LocalStrategy({
		passReqToCallback : true
	},function(req,email,password,done){
		
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		db.connect();
		
		db.query('SELECT u.id,u.first_name,u.last_name,u.email,u.gpassword,r.code FROM user u JOIN userrol ur ON u.id=ur.user_id JOIN rol r ON r.id=ur.rol_id WHERE u.email=?',
			[email,password],function(err,rows,fields){
		//db.query('SELECT * FROM user WHERE email = ?',email,function(err,rows,fields){
			if(err) throw err;
			db.end();

			if(rows.length > 0){
				var user = rows[0];
				console.log(user);
				//return;
				if(bcrypt.compareSync(password,user.gpassword)){
					return done(null,{
						id : user.id,
						nombre : user.first_name,
						email : user.email,
						code : user.code
					});
				}
			}
			return done(null,false,req.flash('authmessage','Email o Password incorrecto'));
		});
	}
	));
};