var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var url = require('url');
var queryString=require('querystring');
var util = require('util');

module.exports = {
	//getSignUp : function(req, res, next){
		//return res.render('users/signup');
	//},

	postSignUp: function(req,res,next){
		console.log(req.body);

		var arr=[];
		
		if(req.body.a === 'on')
			arr.push(1)
		if(req.body.b === 'on')
			arr.push(2)
		if(req.body.c === 'on')
			arr.push(3)
		if(req.body.d === 'on')
			arr.push(4)
		console.log(arr.length);

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
		});
		
		var idUser;
		db.query('SELECT u.id FROM user u WHERE u.email=?',req.body.email,function(err,rows,fields){
			if(err) throw err;
			
			idUser=rows[0];
			console.log(idUser.id+' Estamos aqui adentro')
			var userid=idUser.id;
		
			var userrol = {
				rol_id : req.body.rol,
				user_id: userid,
			};
			
			db.query('INSERT INTO userrol SET ?',userrol,function(err,rows,fields){
				if(err) throw err;
			});	
			
			for(var i=0; i<arr.length; i++){
				var aservice = {
					user_id: userid,
					service_id: arr[i]
				};
			
			db.query('INSERT INTO useraservice SET ?',aservice,function(err,rows,fields){
				if(err) throw err;
			
				});
			}
			db.end();

		});
		

		req.flash('info','Se ha registrado correctamente, ya puede iniciar sesión');
		return res.redirect('/users/panel');
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

	getRol: function(req,res,next){
		var ruta = url.parse(decodeURI(req.url), true);
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
			db.connect();
		if(ruta.pathname === '/rol' && ruta.search === ''){
			db.query('SELECT * FROM rol',function(err,rows,fields){
				if(err) throw err;
				db.end();
				res.end(util.inspect(rows));	
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
				//console.log(rows);
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
//Cuando salga me debe regresar a la pagina principal
	logout : function(req,res,next){
		req.logout();
		res.redirect('/');
	},

	getUserPanel: function(req,res,next){
		res.render('users/panel',{
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}

};