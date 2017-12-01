var express = require('express');
var app = express();
var url = require('url');

var pg = require("pg"); // This is the postgres database connection module.
const connectionString = "postgres://my_user:my_pass@localhost:5432/gameData";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/createChar', function(request, response) {
	parseCharData(request, response);
});

app.get('/login', function (request, response) {
	var requestUrl = url.parse(request.url, true);
	console.log("Query parameters: " + JSON.stringify(requestUrl.query));
	var username = requestUrl.query.username;
	var password = requestUrl.query.pass;
  	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	client.query("SELECT username, password FROM user_account WHERE username='"+username+"'", function(err, result) {
      		done();
      		if (err) {
      			console.error(err); response.send("Error " + err);
      		} else {
      			console.log("Checking if user " + username + " exists.");
      			if (userExists(username, result.rows)) {
      				console.log("Username exists. Checking password.");
      				if (passCheck(username, password, result.rows)) {
      					console.log("Password matches, login success");
      				} else {
      					console.log("Password does not match, show error");
      					document.getElementById("passwordError").style.visibility = 'visible';
      				}
      			} else {
      				console.log("Username doesn't exist, go create user.");
      				pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  					client.query("INSERT INTO user_account(username, password, admin) VALUES ('"+username+"', '"+password+"', FALSE)", function(err, result) {
    				done();
      				if (err) {
      					console.error(err); response.send("Error " + err);
      				} else {
      					console.log("Created user account.")
      					var params = {results: result.rows, username: username}
      					response.render('pages/charCreate', params );
      				}
  					});
					});
      			}
      			//response.render('pages/db', {results: result.rows} );
      		}
    	});
  	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function parseCharData(request, response) {
	var requestUrl = url.parse(request.url, true);

	console.log("Query parameters: " + JSON.stringify(requestUrl.query));

	var username = requestUrl.query.username;
	var name = requestUrl.query.name;
	var hp = Number(requestUrl.query.hp);
	var str = Number(requestUrl.query.str);
	var def = Number(requestUrl.query.def);

	var params = {name: name, hp: hp, str: str, def: def};

    console.log("Creating character with desired stats.");
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  		client.query("INSERT INTO player(user_id, name, exp_points, next_lvl, max_hp, hp, strength, defense) SELECT u.id, '"+name+"', 0, 20, "+hp+", "+hp+", "+str+", "+def+" FROM user_account u WHERE u.username='"+username+"'", function(err, result) {
    	done();
    	if (err) {
    		console.error(err); response.send("Error " + err);
    	} else {
    		console.log("Created player")
    		response.render('pages/result', params );
    	}
  		});
	});
}

function userExists(username, results) {
	var found = false;
	results.forEach(function(r) { 
        if (username === r.username) {
        	found = true
        }
     });
	return found;
}

function passCheck(username, password, results) {
	var found = false;
	results.forEach(function(r) { 
        if (username === r.username) {
        	if (password === r.password) {
        		found = true;
        	}
        }
     });
	return found;
}