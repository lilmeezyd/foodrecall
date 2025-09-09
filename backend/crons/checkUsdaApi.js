const axios = require('axios')
const Usda = require('../models/usdaModel')
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { sendEmail } = require ('../utils/sendEmail');

const checkUsdaApi = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const users = await User.find({})
    const emails = users.map(x => x.email)
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://www.fsis.usda.gov/fsis/api/recall/v/1`,
        headers: {},
    };
   /* try {*/
        const response = await axios.get(`https://www.fsis.usda.gov/fsis/api/recall/v/1`)
        const data = await response.data
        
  /*  const results =    data.sort((a, b) => new Date(b.field_recall_date) - new Date(a.field_recall_date))
          .slice(0, 3);
        console.log(results);*/
     /*       const link = `https://foodrecall.xyz/`;
              const welcomeSubject = "Recalls report by the USDA";

              const newWelcome = results
                .map((entry) => {
                  const formattedDate = `${entry?.report_date?.substring(0, 4)}-${entry?.report_date?.substring(4, 6)}-${entry?.report_date?.substring(6)}`;
                  return `
                    <div style="margin-bottom: 10px;">
                      <div><strong>Reason:</strong> ${entry.reason_for_recall}</div>
                      <div><strong>Company:</strong> ${entry.recalling_firm}</div>
                      <div><strong>Date:</strong> ${formattedDate}</div>
                      <div><strong>Area:</strong> ${entry.state}</div>
                      <a href="${link}/recalls/fda/${entry.recall_number}">View Recall</a>
                    </div>`;
                })
                .join('');
        const car = ['ryawa80@gmail.com',
   'wilbertwina@gmail.com',       'davedash244@gmail.com','denismoini09@gmail.com',]
        await sendEmail({ recipients: car, subject: welcomeSubject, html: newWelcome });*/
        /*res.status(200).json('Food recall notifications successfully sent!');*/
        res.json(data)
   /* } catch (error) {
        const welcomeSubject = "Recalls as reported by the USDA";
        const content = `<div>
        <h4>There were no recalls recorded by USDA</h4>
        </div>`
        await sendEmail({recipients: ['denismoini09@gmail.com'], subject: welcomeSubject, html: content})
            res.status(200).json({ message: 'No new recalls recorded by USDA'})
        
    }*/
})

module.exports = checkUsdaApi