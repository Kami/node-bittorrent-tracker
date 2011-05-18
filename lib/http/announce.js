function announceHandler(req, res) {
  res.end('stub');
}

function register(server) {
    server.use('/announce', announceHandler);
}

exports.register = register;
