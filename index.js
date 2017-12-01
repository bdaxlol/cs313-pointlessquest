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

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM user_account', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function parseCharData(request, response) {
	var requestUrl = url.parse(request.url, true);

	console.log("Query parameters: " + JSON.stringify(requestUrl.query));

	var name = requestUrl.query.name;
	var hp = Number(requestUrl.query.hp);
	var str = Number(requestUrl.query.str);
	var def = Number(requestUrl.query.def);

	var params = {name: name, hp: hp, str: str, def: def};

	response.render('pages/result', params);
}