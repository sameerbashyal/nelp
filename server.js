var http= require('http');
var app= require('/app');
var port=process.env.PORT || 3100;
var server= http.createServer(app);
server.listen(port);