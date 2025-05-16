
const pingHandler = (req, res) => {
  res.status(200).send("Server is alive");
}

module.exports = { pingHandler };