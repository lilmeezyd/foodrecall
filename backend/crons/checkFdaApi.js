const axios = require("axios");
const Fda = require("../models/fdaModel");
const User = require("../models/userModel");
const FdaRecall = require("../models/fdaRecallModel");
const Recall = require("../models/recallModel");
const { sendNewsletter } = require("../utils/subscribers.js");
const asyncHandler = require("express-async-handler");
const { sendEmail, sendEmails } = require("../utils/sendEmail");

const checkFdaApi = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const users = await User.find({});
  const emails = users.map((x) => {
    return { email: x.email, _id: x._id };
  });
  const fdaRecalls = await Fda.find({});
  const newRecalls = fdaRecalls.map((x) => x.results).flat();
  const lastRecall = newRecalls.sort((x, y) =>
    x.report_date > y.report_date ? -1 : 1
  )[0].report_date;
  const lastDayOflastRecall = new Date(
    lastRecall.slice(0, 4) +
      "-" +
      lastRecall.slice(4, 6) +
      "-" +
      lastRecall.slice(6)
  );
  Date.prototype.addDay = function (days) {
    this.setTime(this.getTime() + days * 24 * 60 * 60 * 1000);
    return this;
  };
  const tomorrowDate = lastDayOflastRecall.addDay(1);
  const dateStringForm = (
    tomorrowDate.toJSON().slice(0, 8) + tomorrowDate.toJSON().slice(8, 10)
  )
    .split("-")
    .join("");
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
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.fda.gov/food/enforcement.json?search=report_date:[${dateStringForm}+TO+${yesterday}]&limit=1000`,
    headers: {},
  };

  try {
    const response = await axios.request(config);
    const data = await response.data;
    const { results } = data;
    const newFda = new Fda({ results });
    await newFda.save();
    /*  try {
          await FdaRecall.insertMany(results, { ordered: false });
        } catch (error) {
          if (error.name === 'BulkWriteError') {
            console.log('Some duplicates were skipped.');
          } else {
            throw error;
          }
        }*/

    const welcomeSubject = "New FDA Food Recall Alert";

    /*const car = [
      "ryawa80@gmail.com",
      "wilbertwina@gmail.com",
      "davedash244@gmail.com",
      "denismoini09@gmail.com",
    ];*/
    await sendEmails({
      recipients: emails,
      subject: welcomeSubject,
      results: results,
    });
    /* await Promise.all(
      car.map((email) => sendEmail({to: email, subject: welcomeSubject, html: newWelcome}))
    );*/
    res.status(200).json("Food recall notifications successfully sent!");
  } catch (error) {
    const welcomeSubject = "Recalls as reported by the FDA";
    const content = `<div>
        <h4>There were no recalls recorded by FDA</h4>
        </div>`;
    await sendEmail({
      recipients: ["denismoini09@gmail.com" ],
      subject: welcomeSubject,
      html: content,
    });
    res.status(200).json({ message: "No new recalls recorded by FDA" });
  }
});

module.exports = checkFdaApi;
