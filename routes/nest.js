var express = require('express');
var request = require('request');
var router = express.Router();
var say = require('say');
var config = require('./config.js');
var auth_code;
var access_token;
var temp;
var mode;

router.get('/callback', function(req, res){
	auth_code = req.query.code;
//console.log(auth_code);
res.end();
});

router.get('/authorize', function(req, res){
	authorize_time = Date.now();
	request({
		url: 'https://api.home.nest.com/oauth2/access_token',
		method: 'POST',
		form: {
			'grant_type':'authorization_code',
			'code': auth_code,
			'client_id':config.nest_client_id,
			'client_secret':config.nest_client_secret
		}}, function(err, response, body){
			var data = JSON.parse(response.body);
			access_token = data.access_token;
		//console.log(access_token);
		//console.log(response.statusCode);
		res.end();
	});
});

router.get('/check', function(req, res){
//console.log(access_token);
request({
	url: 'https://developer-api.nest.com/devices',
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer '+ access_token
	}}, function(err, response, body){
		//console.log(response.statusCode);
		console.log(body);
		//say.speak("Hello, my friend");
		res.end();
	});
});

router.get('/set', function(req, res){
//console.log(access_token);
if(access_token==null){
	request({
		url: 'http://localhost:3000/nest/authorize',
		method: 'GET'
	}, function(err, response, body){
		request({
			url: 'https://developer-api.nest.com/devices/thermostats/CLmDOE9LSo9Wg3mkslWY_vxo3lNyMHZ5',
			method: 'PUT',
			followAllRedirects: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ access_token
			},
			body: {
				hvac_mode: req.query.mode
			},
			json: true },  function(err, response, body){
				console.log(body);
				if(req.query.mode=='off'){
					say.speak("turning thermostat off");
					res.end();
				}else{
					request({
						url: 'https://developer-api.nest.com/devices/thermostats/CLmDOE9LSo9Wg3mkslWY_vxo3lNyMHZ5',
						method: 'PUT',
						followAllRedirects: true,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer '+ access_token
						},
						body: {
							target_temperature_f: JSON.parse(req.query.temp)
						},
						json: true }, function(err, response, body){
							console.log(body);
							say.speak(req.query.mode+" to "+req.query.temp+" degrees");
							res.end();
						});
				}
			});
	})
}else{
	request({
		url: 'https://developer-api.nest.com/devices/thermostats/CLmDOE9LSo9Wg3mkslWY_vxo3lNyMHZ5',
		method: 'PUT',
		followAllRedirects: true,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+ access_token
		},
		body: {
			hvac_mode: req.query.mode
		},
		json: true },  function(err, response, body){
			console.log(body);
			if(req.query.mode=='off'){
				say.speak("turning thermostat off");
				res.end();
			}else{
				request({
					url: 'https://developer-api.nest.com/devices/thermostats/CLmDOE9LSo9Wg3mkslWY_vxo3lNyMHZ5',
					method: 'PUT',
					followAllRedirects: true,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+ access_token
					},
					body: {
						target_temperature_f: JSON.parse(req.query.temp)
					},
					json: true }, function(err, response, body){
						console.log(body);
						say.speak(req.query.mode+" to "+req.query.temp+" degrees");
						res.end();
					});
			}
		});
}
});

module.exports = router;
