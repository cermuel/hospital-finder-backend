const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const UserRoutes = require("./routes/User.routes");
const connect = require("./db/connect");
const authHandler = require("./middleware/authHandler");
const notfound = require("./middleware/404");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.json({ message: "AMAKA SERVER RUNNING" });
});

app.post("/", authHandler, async (req, res) => {
  try {
    const { latitude, longitude, key } = req.body;
    const places = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&type=hospital&key=${key}`
    );
    res.json({ success: true, data: places.data.results });
    // console.log(places.data.results);
  } catch (error) {
    console.log(error);
  }
});

app.use("/auth", UserRoutes);

app.use(notfound);

app.listen(PORT, async () => {
  try {
    await connect(process.env.MONGODB_CONNECTION_URI);
    console.log(`Server listening on ${PORT}`);
  } catch (error) {
    console.log(`Error connecting to DB`);
    console.log(error);
  }
});
