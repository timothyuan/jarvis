var express = require('express');
var app = express();
var spotify = require('./routes/spotify.js');
var nest = require('./routes/nest.js');
var lights = require('./routes/light.js');
var classifier = require('./routes/classifier.js');
var category = require('./routes/category.js');
var say = require('say');
var url = require('url');
var classifier = new classifier();

classifier.train('raise increase temperature up', 'raise temp');
classifier.train('lower decrease temperature down', 'lower temp');
classifier.train('turn light lights on off', 'lights');
classifier.train('turn thermostat off', 'thermostat off');
classifier.train('change raise lower increase decrease volume level', 'volume');

app.use('/spotify', spotify);
app.use('/nest', nest);
app.use('/lights', lights);
app.use(express.static('public'));

app.get('/classify', function(req, res){
	var category = classifier.classify(req.query.q);
	var num = req.query.q.replace(/[^0-9]/g,'');
	console.log(category);
	//console.log(num);

	switch(category){
		case 'lights':
			res.redirect(url.format({
    			pathname:'/lights/switch'
     		}));
			break;

		case 'raise temp':
			res.redirect(url.format({
       		pathname:'/nest/set',
       		query: {
          		'mode': 'heat',
          		'temp': num
        	}
     		}));
			break;

		case 'lower temp':
			res.redirect(url.format({
       		pathname:'/nest/set',
       		query: {
          		'mode': 'cool',
          		'temp': num
        	}
     		}));
			break;

		case 'thermostat off':
			res.redirect(url.format({
       		pathname:'/nest/set',
       		query: {
          		'mode': 'off'
        	}
     		}));
			break;

		case 'volume':
			res.redirect(url.format({
       		pathname:'/spotify/volume',
       		query: {
          		'value': num
        	}
     		}));
			break;

	}
	res.end();
});

app.listen(3000);
