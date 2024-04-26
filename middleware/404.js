const notfound = (req, res) => {
  res.status(404).end("Route not found");
};

module.exports = notfound;
