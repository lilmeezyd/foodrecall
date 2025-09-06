const axios = require('axios')
const asyncHandler = require('express-async-handler')
const FdaRecall = require('../models/fdaRecallModel')
const Fda = require('../models/fdaModel')
//const { findOne } = require('../models/tokenModel')

//@desc Get all fda recalls
//@route GETT /api/fda
//@access Public
const getRecalls = asyncHandler(async (req, res) => {
  /*let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20150101+TO+20150330]&limit=1000",
    headers: {}
  }

  try {
    const response = await axios.request(config)
    const data = await response.data
    const { results } = data
    const newFda = new Fda({ results })
    const saved = await newFda.save()
    res.status(200).json(saved)
  } catch (error) {
    console.log(error)
  }*/

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
 const { page = 1, limit = 10, risk, status, state, year, word } = req.query;
const query = {};
  if (risk) query.classification = new RegExp(risk, i);
  if (status) query.status = status;
  if (state) query.distribution_pattern = new RegExp(state, 'i');
  if (year) query.report_date = new RegExp(`^${year}`);
  if (word) {
    query.$or = [
      { product_description: new RegExp(word, "i") },
      { reason_for_recall: new RegExp(word, "i") },
      { recalling_firm: new RegExp(word, "i") },
    ];
  }

  const data = await FdaRecall.find(query)
    .sort({ report_date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await FdaRecall.countDocuments(query);

  res.json({
    data,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    total,
  });
})
const getOldFdaRecalls = asyncHandler(async (req, res) => {
const fdaRecalls = await Fda.find({}, 'results').lean()
  const newRecalls = fdaRecalls.flatMap(doc => doc.results || [])
  res.status(200).json(newRecalls)
})

const migrateFdaData = asyncHandler(async () => {
  try{
  const fdaDocs = await Fda.find({}, 'results').lean()
  const recalls = fdaDocs.flatMap(doc => doc.results || [])

const result = await FdaRecall.insertMany(recalls, { ordered: false })
  console.log(`${result.length} new recalls inserted (duplicates skipped).`)
} catch (err) {
  if (err.code === 11000) {
    console.warn('Some duplicates were skipped due to unique recall_number.')
  } else {
    console.error('Migration failed:', err)
  }
}} )


module.exports = { getRecalls, getFdaRecalls, getOldFdaRecalls, migrateFdaData }