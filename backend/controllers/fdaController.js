const axios = require('axios')
const asyncHandler = require('express-async-handler')
const Fda = require('../models/fdaModel')
const { findOne } = require('../models/tokenModel')

//@desc Get all fda recalls
//@route GETT /api/fda
//@access Public
const getRecalls = asyncHandler(async (req, res) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20241211+TO+20250107]&limit=1000",
        headers: {}
    }

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
        res.status(200).json(newArray)
    } catch (error) {
        console.log(error)
    }

    /*const createFda = async (fdas) => {
        const newFda = []
        fdas.map(fda => newFda.push(...fda.results))
        newFda.forEach(async fda => {
            await Fda.findOneAndUpdate({},{$push: {results: fda}})
        })
      }
      async function makeAPICall(endpoint) {
        const response = await axios.get(endpoint);
        const data = await response.data;
        return data;
      }
    
      async function makeMultipleAPICalls(endpoints) {
        const promises = endpoints.map(makeAPICall);
        const responses = await Promise.all(promises);
        createFda(responses)
        return responses;
      }
      (async () => {
        try {
        await makeMultipleAPICalls([
          "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20240101+TO+20241231]&limit=1000",
        ]);
          
        } catch (error) {
          setErrorFda(error.message)
          console.log(error.message)
        }
      })()*/
})

const getFdaRecalls = asyncHandler(async (req, res) => {
    const fdaRecalls = await Fda.findOne({})
    const { results } = fdaRecalls
    const a = []
    const newArray = []
    for (let i = 0; i < results.length; i++) {
        if (a.includes(results[i].event_id)) continue;
        a.push(results[i].event_id)
        newArray.push(results[i])
    }
    res.status(200).json(newArray)
})

const getFdaLastDate = asyncHandler(async (req, res) => {
  const fdaRecalls = await Fda.findOne({})
  const { results } = fdaRecalls
  const a = []
  const newArray = []
  for (let i = 0; i < results.length; i++) {
      if (a.includes(results[i].event_id)) continue;
      a.push(results[i].event_id)
      newArray.push(results[i])
  }
  const lastRecall = newArray.sort((x,y) => x.report_date > y.report_date ? -1 :1)[0].report_date
  const lastDayOflastRecall = new Date(lastRecall.slice(0,4)+'-'+lastRecall.slice(4,6)+'-'+lastRecall.slice(6))
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
    return dateStringForm
})

module.exports = { getRecalls, getFdaRecalls, getFdaLastDate }