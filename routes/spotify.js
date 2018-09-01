var express = require('express');
var request = require('request');
var router = express.Router();
var say = require('say');
var config = require('./config.js');
var auth_code;
var access_token;
var refresh_token;
var authorize_time;
var tracks =  "\"spotify:track:1bBKhfRq4skr64uvEuOOVH\"";
var name = "";

router.get('/callback', function(req, res){
	auth_code = req.query.code;
	//console.log(auth_code);
	res.end();
});

router.get('/volume', function(req,res){
	say.speak("setting volume to "+req.query.value);
	if((Date.now()-authorize_time)>3600000||authorize_time==null){
		request({
			url: 'http://localhost:3000/spotify/authorize',
			method: 'GET'
		}, function(err, response, body){
			request({
				url: 'https://api.spotify.com/v1/me/player/volume',
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+ access_token
				},
				qs:{
					'volume_percent': req.query.value
				}
			}, function(err, response, body){
			//res.write("It works");
			//console.log("works");
			res.end();
		});
		});
	}else{
		request({
			url: 'https://api.spotify.com/v1/me/player/volume',
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ access_token
			},
			qs:{
				'volume_percent': req.query.value
			}
		}, function(err, response, body){
			//res.write("It works");
			//console.log("works");
			res.end();
		});
	}
})

router.get('/play', function(req, res){
	say.speak("playing "+ name);
	if((Date.now()-authorize_time)>3600000||authorize_time==null){
		request({
			url: 'http://localhost:3000/spotify/authorize',
			method: 'GET'
		}, function(err, response, body){
			request({
				url: 'https://api.spotify.com/v1/me/player/play',
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+ access_token
				},
				qs:{
					'device_id': config.spotify_device_id
				},
				body: "{\"uris\": ["+tracks+"]}"
			}, function(err, response, body){
				//res.write("It works");
				//console.log("works");
				res.end();
			});
		});
	}else{
		request({
			url: 'https://api.spotify.com/v1/me/player/play',
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ access_token
			},
			qs:{
				'device_id': config.spotify_device_id
			},
			body: "{\"uris\": ["+tracks+"]}"
		}, function(err, response, body){
			//res.write("It works");
			//console.log("works");
			res.end();
		});
	}
});

router.get('/pause', function(req, res){
	say.speak("pausing music");
	if((Date.now()-authorize_time)>3600000||authorize_time==null){
		request({
			url: 'http://localhost:3000/spotify/authorize',
			method: 'GET'
		}, function(err, response, body){
			request({
				url: 'https://api.spotify.com/v1/me/player/pause',
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+ access_token
				},
				qs:{
					'device_id': config.spotify_device_id
				}
			}, function(err, response, body){
			//res.write("It works");
			//console.log("works");
			res.end();
		});
		});
	}else{
		request({
			url: 'https://api.spotify.com/v1/me/player/pause',
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ access_token
			},
			qs:{
				'device_id': config.spotify_device_id
			}
		}, function(err, response, body){
			//res.write("It works");
			//console.log("works");
			res.end();
		});
	}
});

router.get('/search', function(req, res){
	//console.log(req.query);
	if((Date.now()-authorize_time)>3600000||authorize_time==null){
		request({
			url: 'http://localhost:3000/spotify/authorize',
			method: 'GET'
		}, function(err, response, body){
			request({
				url: 'https://api.spotify.com/v1/search',
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+ access_token
				},
				qs:{
					'q': req.query.q,
					'type': 'track'
				}
			}, function(err, response, body){
				var data = JSON.parse(response.body);
				if(data.tracks.items[0]==null){
					res.status(404);
					say.speak("track not found");
					res.end();
				}else{
					//tracks += ",\""+data.tracks.items[0].uri+"\"";
					tracks = "\""+data.tracks.items[0].uri+"\"";
					name = data.tracks.items[0].name;
					res.end();
				}
			});
		});
	}else{
		request({
			url: 'https://api.spotify.com/v1/search',
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ access_token
			},
			qs:{
				'q': req.query.q,
				'type': 'track'
			}
		}, function(err, response, body){
			var data = JSON.parse(response.body);
			if(data.tracks.items[0]==null){
				res.status(404);
				say.speak("track not found");
				res.end();
		}else{
			//tracks += ",\""+data.tracks.items[0].uri+"\"";
			tracks = "\""+data.tracks.items[0].uri+"\"";
			name = data.tracks.items[0].name;
			res.end();
		}
	});
	}
});

router.get('/authorize', function(req, res){
	//console.log("authorize");
	if(access_token==null&&auth_code!=null){
		authorize_time = Date.now();
		request({
			url: 'https://accounts.spotify.com/api/token',
			method: 'POST',
			form: {
				'grant_type':'authorization_code',
				'code': auth_code,
				'redirect_uri':'http://192.168.1.129:3000/spotify/callback',
				'client_id': config.spotify_client_id,
				'client_secret': config.spotify_client_secret
			}}, function(err, response, body){
				var data = JSON.parse(response.body);
				access_token = data.access_token;
				refresh_token = data.refresh_token;
		console.log(access_token);
		res.write(response.body);
		res.end();
	});
	}else if(access_token!=null&&auth_code!=null){
		authorize_time = Date.now();
		request({
			url: 'https://accounts.spotify.com/api/token',
			method: 'POST',
			form: {
				'grant_type':'refresh_token',
				'refresh_token': refresh_token,
				'client_id': config.spotify_client_id,
				'client_secret': config.spotify_client_secret
			}}, function(err, response, body){
				var data = JSON.parse(response.body);
				access_token = data.access_token;
		//console.log(access_token);
		res.write(response.body);
		res.end();
	});
	}else{
		res.end();
	}
});

module.exports = router;
