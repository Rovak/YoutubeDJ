var config = require('nconf');

/**
 * Frontend Controller
 *
 * When a person arrives in the root '/' route then a room will be generated
 * based on a random number and the user will be redirected to the new room
 *
 * @class Server.controller.Frontend
 */
module.exports = function(app) {

  var socket_server = config.get("socketio:hostname") + ":" + config.get("socketio:port");

  app.get('/', function(req, res) {
    res.redirect('/screen/' + Math.floor((Math.random() * 9999) + 1));
  });

  app.get('/screen/:id', function(req, res) {
    res.render('server/screen', {
      room: req.params.id,
      host: req.headers.host,
      socket_server: socket_server
    });
  });

  app.get('/room/:id', function(req, res) {
    res.render('client/mobile', {
      room: req.params.id,
      host: req.headers.host,
      socket_server: socket_server
    });
  });
};