var express = require('express.io'),
	swig = require('swig')
	_ = require('underscore');

var RedisStore = require('connect-redis')(express);
var http = require('http');
var server = express();
server.http().io();

var users = [];
var dataRestF = {};

// Configuracion para renderizar vistas
server.engine('html', swig.renderFile);
server.set('view engine','html');
server.set('views', '/WP-PYTHON/todojs/app/views');

// Carga de archivos estaticos
server.use(express.static('./public'));


// Agregamos post, cookie y sessiones
server.configure(function() {
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());

	server.use(express.session({
		secret : "lolcatzdsam"
		//store  : new RedisStore({})
	}));
});

var isntLoggedIn = function (req, res, next) {
	if(!req.session.user){		
		res.redirect('/');
		return;
	}

	next();
};

var inLoggedIn = function (req, res, next) {
	if(req.session.user){
		res.redirect('/app');
		return;
	}	

	next();
};

// Aqui es donde se cargan los datos del api en Django

var getDatos = function (req, res, next){
	var optionsget = {
	    host : 'localhost',
	    port : 8000,
	    path : '/api/tasks/' + req.body.idtask, // url with parameters
	    method : 'GET',
	    auth: 'dsambo:admin'	    
	};	
    
    // HTTP GET request
    var reqGet = http.request(optionsget, function(response) {    	 
    	while (!http.ServerResponse){
    		setTimeout(1000);
    	} 
        
        response.on('data', function(data) {         	
        	dataRestF = JSON.parse(data);             	       	
        });    	
    });   
    
    reqGet.end();   
    
    req.on('error', function(e) {
	  console.error(e);
	});
    debugger;
    next();
};


server.get('/', inLoggedIn, function (req, res) {
	res.render('home');
});

server.get('/app', isntLoggedIn, function (req, res){
	res.render('app', {
		user: req.session.user, 
		title: dataRestF.title,
		id: dataRestF.id,
		desc: dataRestF.description,
		owner: dataRestF.owner,
		users : users
	});
});

server.post('/log-in',getDatos, function (req, res){		
	users.push(req.body.username);	
	req.session.user = req.body.username;
	server.io.broadcast('log-in', {username: req.session.user, datos: dataRestF });	
	res.redirect('/app');
});

server.get('/log-out', function (req, res){
	users = _.without(users, req.session.user);
	server.io.broadcast('log-out', {username: req.session.user});
	req.session.destroy();
	res.redirect('/');
});

server.io.route('hello?', function(req){
	req.io.emit('saludo', {
		message: 'serverReady'
	});
});

server.listen(3000);