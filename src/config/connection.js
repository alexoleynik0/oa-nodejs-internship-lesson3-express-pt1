class Connection {
  static init(app, port) {
    app.listen(port, () => {
      console.log(`app is running at http://localhost:${port}`);
    });
  }
}

module.exports = Connection;
