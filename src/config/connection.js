class Connection {
  static init(app, port) {
    const server = app.listen(port, () => {
      console.log(`app is running at http://localhost:${port}`);

      // Graceful Start (pm2)
      if (typeof process.send === 'function') {
        process.send('ready');
      }
    });

    // Graceful Shutdown (pm2, cmd+c)
    const gracefulShutdown = (signal) => () => {
      console.log(`${signal} signal received: closing HTTP server`);
      server.close(() => {
        console.log('HTTP server closed');
      });
    };
    process.on('SIGINT', gracefulShutdown('SIGINT'));
    process.on('SIGTERM', gracefulShutdown('SIGTERM'));
  }
}

module.exports = Connection;
