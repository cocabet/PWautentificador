var express = require('express');
var router = express.Router();
var passport = require('passport');
var Ctrls = require('.././controllers');
var AuthMiddleware = require('.././middleware/auth');

router.get('/',Ctrls.HomeCtrl.index);

//Rutas de usuario
router.get('/user',Ctrls.UserCtrl.getUser);
router.get('/service',Ctrls.UserCtrl.getService);
router.get('/auth/signup',Ctrls.UserCtrl.getSignUp);
router.post('/auth/signup',Ctrls.UserCtrl.postSignUp);
router.get('/auth/signin',Ctrls.UserCtrl.getSignIn);

router.post('/auth/signin',passport.authenticate('local',{
	successRedirect : '/users/panel',
	failureRedirect : '/auth/signin',
	failureFlash : true
}));

router.get('/auth/logout',Ctrls.UserCtrl.logout);
router.get('/users/panel',AuthMiddleware.isLogged,Ctrls.UserCtrl.getUserPanel);

module.exports = router;
 