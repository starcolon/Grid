/*
 * The MIT License
 * 
 *  Copyright (c) 2015 Tao P.R. (StarColon Projects)
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 * 
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

 /**
  * [grid-sim.js] exhibits the simple way to make use of [grid.js] library.
  * This can be run through a simple node way, that's it.
  *
  * To run offline mode:
  * node grid-sim.js offline
  *
  * @author Tao PR
  */


/**
 * App dependencies
 */
var app = require('express')();
var colors = require('colors');
var bodyParser = require('body-parser');
var promise = require('promise');
var _ = require('underscore');
var prettyjson = require('prettyjson');

/**
 * Configurations of the app
 */
var configuration = {
	appName: 'grid-sim',
	portNo: 6001,
	allowListen: true,
	dbName: 'test',
	dbCollectionName: 'test-grid-sim'
};

/**
 * Node arguments wrapper
 */
var args = (function(arr){
	return arr.slice(2,0xFF); // Typical elements: [0] = node [1] = planetbot.js
})(process.argv);


/**
 * Main event loop
 */
(function loop(config){

	// For reference to the loop object
	var self = this;

	// Whether the service is running offline (locally)?
	var runLocally = args.indexOf('offline')>=0;

	// Initialize the mentor object
	var done = function(){
		console.log('Database successfully loaded'.yellow);

		// TAOTODO: Prepare some data after database has been connected

		// If the bot is asked to run offline, monkey patch the service endpoints
		if (runLocally) {
			
			// TAOTODO: Initialize offline connectivity
		}
	}

	var error = function(){
		// Error initializing a connection to the database
		console.error('Database failed to initialize!'.red);
		
		// If the bot is asked to run offline, monkey patch the service endpoints
		if (runLocally) {
			
			// TAOTODO: Initialize offline connectivity
		}
	}

	// Initialize the server model
	configServer.call(self,app,bodyParser);

	// TAOTODO: Initialize a connection to the database here


	// Run the server listen loop (if configured)
	if (config.allowListen){
		var server = app.listen(config.portNo, function(){
			console.log(('Starting up '+config.appName).toString().cyan);
			var host = server.address().address;
			var port = server.address().port;
			serviceUrl = 'http://'+host+':'+port+'/';

			console.log('****************************************************'.cyan);
			console.log(('     @'+config.appName+' starts!').toString().cyan );
			console.log('      listening carefully at:'.cyan + (host + ':' + port).toString().green );
			console.log('****************************************************'.cyan);
			console.log('');


		}).on('error',function(err){
			// In case error occurs upon startup!
			console.log(('@'+config.appName + ' unable to start').toString().red);
			if (typeof(err)!='undefined'){
				console.log(err.toString().red);	
			}
		});
	}
})(configuration);


/**
 * Configure the Express server
 * This also configure the appropriate sets of HTTP verbs.
 * @param {Express server} app - The app to configure
 * @param {BodyParser} bodyParser
 */
function configServer(app,bodyParser){

	// Map self
	var self = this;

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	// Allow cross-origin XHR accesses
	app.all('*', function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	  res.header('Access-Control-Allow-Headers', 'Content-Type');
	  return next();
	});

	// Map REST parameters
	configParams(app,['id','do','key']);

	// Map other REST verbs or parameters here
	app.get('/',function(req,resp,next){
		console.log('/{root}');
		respondOK(resp,'welcome to @'+configuration.appName);
		return next();
	});
}

/**
 * HTTP parameter registration
 * @param {Express server} app - Specify the Express server app
 * @param {Array} params - Specify a list of the parameters to be registered
 * @returns {None}
 */
function configParams(app,params){
	if (params.length==0)
		return;
	params.forEach(function(param){
		// Map the parameter
		app.param(param,function(req,resp,next,v){
			v = v || 0;
			req[param] = v;
			return next();
		});
	});
}