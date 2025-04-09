const axios = require("axios");
const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const connectDB = require("./config/db");
//const port = process.env.PORT|| 8000
const port = 8000;
const cors = require("cors");
const cron = require("node-cron");
const moment = require("moment-timezone");
const timezone = "Africa/Kampala";
const sendEmail = require("./utils/sendEmail");
const Recall = require("./models/recallModel");
const checkFdaApi = require("./crons/checkFdaApi")
const Fda = require('./models/fdaModel')
const User = require("./models/userModel");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/fda", require("./routes/fdaRoutes"));
app.use("/api/usda", require("./routes/usdaRoutes"));
app.use('/api/getFda', require("./routes/getFdaRoutes"))
app.use('/api/checkFdaApi', checkFdaApi)



app.listen(port, console.log(`Server running at port: ${port}`));
//module.exports = app
