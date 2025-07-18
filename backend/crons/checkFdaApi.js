const axios = require('axios')
const Fda = require('../models/fdaModel')
const User = require("../models/userModel");
const Recall = require("../models/recallModel");
const { sendNewsletter } = require('../utils/subscribers.js');
const asyncHandler = require("express-async-handler");
const { sendEmail } = require ('../utils/sendEmail');

const checkFdaApi = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const users = await User.find({})
    const emails = users.map(x => x.email)
    const fdaRecalls = await Fda.find({})
    const newRecalls = fdaRecalls.map(x => x.results).flat()
    const lastRecall = newRecalls.sort((x, y) => x.report_date > y.report_date ? -1 : 1)[0].report_date
    const lastDayOflastRecall = new Date(lastRecall.slice(0, 4) + '-' + lastRecall.slice(4, 6) + '-' + lastRecall.slice(6))
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
    console.log(config.url)

    try {
        const response = await axios.request(config)
        const data = await response.data
        const { results } = data
        const newFda = new Fda({ results })
        await newFda.save()

        // Log recall into database
     /*   results.forEach(async (entry) => {
            await Recall.create({
                id: entry.recall_number,
                title: entry.reason_for_recall,
                website: "FDA",
                date: entry.report_date,
            });
        });*/

        const link = `https://foodrecall.vercel.app/`
        const welcomeSubject = "Recalls as reported by the FDA";
        const welcomeContent = results.map((entry) =>
            `<div><div>Reason: ${entry.reason_for_recall}</div>
            <div>Company: ${entry.recalling_firm}</div>
            <div>Date: ${entry?.report_date?.substring(0, 4) + '-'
            + entry?.report_date?.substring(4, 6) + '-'
            + entry?.report_date?.substring(6)}</div>
            <div>Area: ${entry.state}</div>
            <a href=${link}/recalls/fda/${entry.recall_number}>view recall</a>
            </div>`
        )
        const newWelcome = welcomeContent.join(',').replace(',', '')
  /* await Promise.all(
      emails.map((email) => sendNewsletter(email, welcomeSubject, newWelcome))
    );   */  await sendEmail({to:'denismoini09@gmail.com', subject: welcomeSubject, html: newWelcome})
        res.status(200).json('Food recall notifications successfully sent!');
    } catch (error) {
        const welcomeSubject = "Recalls as reported by the FDA";
        const content = `<div>
        <h4>There were no recalls recorded by FDA</h4>
        </div>`
        await sendEmail({to: 'denismoini09@gmail.com', subject: welcomeSubject, html: content})
    }
    res.status(200).json({ message: "No Emails sent"})
})

module.exports = checkFdaApi