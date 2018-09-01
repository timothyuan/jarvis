var express = require('express');
var request = require('request');
var router = express.Router();
//var gpio = require('onoff').Gpio;
//var LED = new gpio(8, 'in');

router.get('/switch', function(req, res){
/*	if (LED.direction() == 'in') {
    	LED.setDirection('out');
	} else {
    	LED.setDirection('in');
	}*/
	console.log('lights');
	res.end();
});

module.exports = router;


