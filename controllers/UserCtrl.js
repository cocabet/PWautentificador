var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var url = require('url');
var queryString=require('querystring');
var util = require('util');

module.exports = {
	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},

	postSignUp: function(req,res,next){
		
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.password,salt);

		var user = {
			first_name : req.body.nombre,
			last_name: req.body.apellidos,
			email : req.body.email,
			gpassword : password
		};

		var config = require('.././database/config');

		var db = mysql.createConnection(config);

		db.connect();

		db.query('INSERT INTO user SET ?',user,function(err,rows,fields){
			if(err) throw err;

			db.end();
		});
		req.flash('info','Se ha registrado correctamente, ya puede iniciar sesión');
		return res.redirect('/auth/signin');
	},

	getService: function(req,res,next){
		var ruta = url.parse(decodeURI(req.url), true);

		var config = require('.././database/config');
		var db = mysql.createConnection(config);
			db.connect();
			
		if(ruta.pathname === '/service' && ruta.search === ''){
			db.query('SELECT * FROM service',function(err,rows,fields){
				if(err) throw err;
				
				db.end();
				res.end(util.inspect(rows));	
				//res.writeHead(200,{'Content-Type':'application/json'});
				//res.json(200,rows);
				//res.end(rows);
			});
		}
	},
	
	getUser: function(req,res,next){
		var ruta = url.parse(decodeURI(req.url), true);

		var config = require('.././database/config');
		var db = mysql.createConnection(config);
			db.connect();
			
		if(ruta.pathname === '/user' && ruta.search === ''){
			db.query('SELECT * FROM user',function(err,rows,fields){
				if(err) throw err;
				db.end();

				if(rows.length > 0){
					res.end(util.inspect(rows));
				}
				else{
					res.writeHead(404,{'Content-Type':'text/html'});
					res.end('<html><body><h2>No hay usuarios que mostrar </h2></body></html>');
		
				}
			});
		}

		if(ruta.pathname === '/user' && ruta.search !== ''){
			var correo =ruta.query.email;
			
			if(correo !== undefined){
				db.query('SELECT * FROM user WHERE email=?',correo,function(err,rows,fields){
				if(err) throw err;
				db.end();
				console.log(rows);
				if(rows.length > 0){
					res.end(util.inspect(rows));
					//res.writeHead(200,{'Content-Type':'application/json'});
					//res.end(rows);
				}
				else{
					res.writeHead(404,{'Content-Type':'text/html'});
					res.end('<html><body><h2>Error: Pagina no encontrada </h2></body></html>');
				}
				});
			}
			else{
				res.writeHead(404,{'Content-Type':'text/html'});
				res.end('<html><body><h2>Error: Pagina no encontrada </h2></body></html>');
			}
		
		}
		
	},

	getSignIn: function(req, res, next){
		return res.render('users/signin',{message: req.flash('info'),authmessage: req.flash('authmessage')});
	},

	logout : function(req,res,next){
		req.logout();
		res.redirect('/auth/signin');
	},

	getUserPanel: function(req,res,next){
		res.render('users/panel',{
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}

};