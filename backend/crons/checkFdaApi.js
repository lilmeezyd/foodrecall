const axios = require('axios')
const Fda = require('../models/fdaModel')
const User = require("../models/userModel");
const Recall = require("../models/recallModel");
const { sendNewsletter } = require('../utils/subscribers.js');
const asyncHandler = require("express-async-handler");

const checkFdaApi = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const users = await User.find({})
    const emails = users.map(x => x.email)

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
        url: `https://api.fda.gov/food/enforcement.json?search=report_date:[${yesterday}+TO+${yesterday}]&limit=1000`,
        headers: {},
    };

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
        const fda = await Fda.findOne({})
        for (let i = 0; i < newArray.length; i++) {
            fda.results.push(newArray[i]);
        }
        await fda.save()

        // Log recall into database
        newArray.forEach(async (entry) => {
            await Recall.create({
                id: entry.event_id,
                title: entry.reason_for_recall,
                website: "FDA",
                date: entry.report_date,
            });
        });

        const link = `https://foodrecall.vercel.app/`
        const welcomeSubject = "Recalls as reported by the FDA for the past 24 hours";
        const welcomeContent = newArray.map((entry) =>
            `<div><div>Reason: ${entry.reason_for_recall}</div>
            <div>Company: ${entry.recalling_firm}</div>
            <div>Date: ${entry?.report_date?.substring(0, 4) + '-'
            + entry?.report_date?.substring(4, 6) + '-'
            + entry?.report_date?.substring(6)}</div>
            <div>Area: ${entry.state}</div>
            <a href=${link}/recalls/fda/${entry.event_id}>view recall</a>
            </div>`
        )
        const newWelcome = welcomeContent.join(',').replace(',', '')
        sendNewsletter('denismoini09@gmail.com', welcomeSubject, newWelcome)
        res.status(200).json('Food recall notifications successfully sent!');
    } catch (error) {
        const welcomeSubject = "Recalls as reported by the FDA for the past 24 hours";
        const content = `<div>
        <h4>There were no recalls recorded in the past 24 hours</h4>
        </div>`
        sendNewsletter('denismoini09@gmail.com', welcomeSubject, content)
        console.log(error.status)
    }
})

module.exports = checkFdaApi