const axios = require('axios')
const Fda = require('../models/fdaModel')
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const checkFdaApi = asyncHandler(async (req, res) => {
    console.log('boy')
    const currentDate = new Date();
    const today = (
        currentDate.toJSON().slice(0, 8) + currentDate.toJSON().slice(8, 10)
      )
        .split("-")
        .join("");
      Date.prototype.subtractDay = function (days) {
        this.setTime(this.getTime() - days * 24 * 60 * 60 * 1000);
        return this;
      };
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.fda.gov/food/enforcement.json?search=report_date:[20250116+TO+20250126]&limit=1000`,
        headers: {},
      };
      console.log(config)

      try {
        const a = []
        const newArray = []
        const response = await axios.request(config)
        const data = await response.data
        console.log(data)
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
      } catch (error) {
        console.log(error.status)
      }
})

module.exports = checkFdaApi