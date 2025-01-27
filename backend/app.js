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
// Check for new recalls from the usda website
app.use("/api/usda", require("./routes/usdaRoutes"));
app.use('/api/getFda', require("./routes/getFdaRoutes")) 

// Check for new recalls from the fda website
cron.schedule(
  "24 18 * * *",
  async (req, res) => {
    const now = moment().tz(timezone);
    const currentDate = new Date();

    // Select users to receive updates from the FDA website
    const users = await User.find({
      $or: [
        { notifications: { fda: true, usda: false } },
        { notifications: { fda: true, usda: true } },
      ],
    });
    const today = (
      currentDate.toJSON().slice(0, 8) + currentDate.toJSON().slice(8, 10)
    )
      .split("-")
      .join("");
    Date.prototype.subtractDay = function (days) {
      this.setTime(this.getTime() - days * 24 * 60 * 60 * 1000);
      return this;
    };
    const yesterdayDate = currentDate.subtractDay(1);
    const yesterday = (
      yesterdayDate.toJSON().slice(0, 8) + yesterdayDate.toJSON().slice(8, 10)
    )
      .split("-")
      .join("");
    if (now.hour() === 18 && now.minute() === 24) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.fda.gov/food/enforcement.json?search=report_date:[20250102+TO+20250125]&limit=1000`,
        //url: `https://api.fda.gov/food/enforcement.json?search=report_date:[${yesterday}+TO+${today}]&limit=1000`,
        //url: `https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[${yesterday}+TO+${today}]&limit=1000`,
        headers: {},
      };
      //const link = `http://localhost:3000/`;
      try {
        const a = []
        const newArray = []
        const response = await axios.request(config)
        const data = await response.data
        const { results } = data
        for (let i = 0; i < results.length; i++) {
          if (a.includes(results[i].event_id)) continue;
          a.push(results[i].event_id)
          newArray.push(results[i])
        }
        console.log(newArray)
        const fda = await Fda.findOne({})
        for (let i = 0; i < newArray.length; i++) {
          fda.results.push(newArray[i]);
        }
        await fda.save()
      } catch (error) {
        console.log(error)
      }
      /*
            try {
              const response = await axios.request(config);
              const data = await response.data.results;
      
              // Log recall into database
              data.forEach(async (entry) => {
                const recall = await Recall.create({
                  id: entry.event_id,
                  title: entry.reason_for_recall,
                  website: "FDA",
                  date: entry.report_date,
                });
              });
              sendEmail(
                "denismoini09@gmail.com",
                "Recalls as reported by the FDA for the past 24 hours",
                { data: data, link: link },
                "./templates/fdaRecalls.handlebars"
              );
              res.status(200).json(data);
            } catch (error) {
              const recall = await Recall.create({
                id: 0,
                title: `No Recalls`,
                website: "FDA",
                date: `N/A`,
              });
              sendEmail(
                "denismoini09@gmail.com",
                "Recalls as reported by the FDA for the past 24 hours",
                { data: "No Recalls Today!", link: link },
                "./templates/noRecalls.handlebars"
              );
              console.log(error.response.status);
              console.log(error.response.statusText);
            }*/
    }
  },
  {
    timezone,
  }
);

// Check for new recalls from the usda website
cron.schedule(
  "07 14 * * *",
  async (req, res) => {
    const now = moment().tz(timezone);
    const currentDate = new Date();

    // Select users to receive updates from the FDA website
    const users = await User.find({
      $or: [
        { notifications: { fda: false, usda: true } },
        { notifications: { fda: true, usda: true } },
      ],
    });/*
    const today = (
      currentDate.toJSON().slice(0, 8) + currentDate.toJSON().slice(8, 10)
    )
      .split("-")
      .join("");
    Date.prototype.subtractDay = function (days) {
      this.setTime(this.getTime() - days * 24 * 60 * 60 * 1000);
      return this;
    };
    const yesterdayDate = currentDate.subtractDay(1);
    const yesterday = (
      yesterdayDate.toJSON().slice(0, 8) + yesterdayDate.toJSON().slice(8, 10)
    )
      .split("-")
      .join("");*/
    if (now.hour() === 14 && now.minute() === 7) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        //url: `https://api.fda.gov/food/enforcement.json?search=report_date:[20240326+TO+20240327]&limit=5`,
        url: `https://api.fda.gov/food/enforcement.json?search=report_date:[${yesterday}+TO+${today}]&limit=1000`,
        headers: {},
      };
      const link = `http://localhost:3000/`;

      try {
        const response = await axios.request(config);
        const data = await response.data.results;

        // Log recall into database
        data.forEach(async (entry) => {
          const recall = await Recall.create({
            id: entry.event_id,
            title: entry.reason_for_recall,
            website: "FDA",
            date: entry.report_date,
          });
        });
        sendEmail(
          "denismoini09@gmail.com",
          "Recalls as reported by the FDA for the past 24 hours",
          { data: data, link: link },
          "./templates/fdaRecalls.handlebars"
        );
        res.status(200).json(data);
      } catch (error) {
        const recall = await Recall.create({
          id: 0,
          title: `No Recalls`,
          website: "FDA",
          date: `N/A`,
        });
        sendEmail(
          "denismoini09@gmail.com",
          "Recalls as reported by the FDA for the past 24 hours",
          { data: "No Recalls Today!", link: link },
          "./templates/noRecalls.handlebars"
        );
        console.log(error.response.status);
        console.log(error.response.statusText);
      }
    }
  },
  {
    timezone,
  }
);



app.listen(port, console.log(`Server running at port: ${port}`));
//module.exports = app
