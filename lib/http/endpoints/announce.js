/**
 * Based on specs at: http://wiki.theory.org/BitTorrent_Tracker_Protocol
 */

function announceHandler(req, res) {
  console.log(req);
  res.end('stub');
}

function register(server) {
    server.get('/announce', announceHandler);
}

exports.register = register;
