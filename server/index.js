require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())

const getApiData = async () => {
  try {
    const response = await axios.get(process.env.API_URL);
    return await response.data;
  } catch (error) {
    console.error(error);
  }
};

// api 1
app.get("/list-transactions", async (req, res) => {
  try {
    const { month, search_text = "", page = 1, per_page = 10 } = req.query;
    if (!month) {
      return res.json({
        status: false,
        msg: "invalid month",
      });
    }
    const data = await getApiData();
    const searchTextData = await data.filter(
      (eachItem) =>
        eachItem.title.toLowerCase().includes(search_text.toLowerCase()) ||
        eachItem.price
          .toString()
          .toLowerCase()
          .includes(search_text.toLowerCase()) ||
        eachItem.description.toLowerCase().includes(search_text.toLowerCase())
    );
    const monthData = searchTextData.filter(
      (eachItem) =>
        new Date(eachItem.dateOfSale)
          .toLocaleString("default", { month: "long" })
          .toLowerCase() === month.toLowerCase()
    );

    const start_from = (page - 1) * per_page;
    const to_end = start_from + parseInt(per_page) - 1;
    const filteredData = monthData.slice(start_from, to_end + 1);
    const transactions = filteredData;
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// api 2
app.get("/statistics", async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  const transactionsData = await getApiData();

  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

  const totalSaleAmount = transactionsData
    .filter(
      (transaction) =>
        new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    )
    .reduce((total, transaction) => total + transaction.price, 0);

  const totalSoldItems = transactionsData.filter(
    (transaction) =>
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber &&
      transaction.price > 0
  ).length;

  const totalNotSoldItems = transactionsData.filter(
    (transaction) =>
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber &&
      transaction.price === 0
  ).length;

  res.json({
    total_sale_amount: totalSaleAmount,
    total_sold_items: totalSoldItems,
    total_not_sold_items: totalNotSoldItems,
  });
});

// api 3
app.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  const transactionsData = await getApiData();

  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Number.POSITIVE_INFINITY },
  ];

  const priceRangeCounts = Array(priceRanges.length).fill(0);

  transactionsData
    .filter(
      (transaction) =>
        new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    )
    .forEach((transaction) => {
      const price = transaction.price;
      const rangeIndex = priceRanges.findIndex(
        (range) => price >= range.min && price <= range.max
      );
      if (rangeIndex !== -1) {
        priceRangeCounts[rangeIndex]++;
      }
    });

  const response = priceRanges.map((range, index) => ({
    price_range: `${range.min}-${
      range.max === Number.POSITIVE_INFINITY ? "above" : range.max
    }`,
    number_of_items: priceRangeCounts[index],
  }));

  res.json(response);
});

// api 4
app.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }
  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;
  const transactionsData = await getApiData();
  const categoryCounts = new Map();
  transactionsData
    .filter(
      (transaction) =>
        new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    )
    .forEach((transaction) => {
      const category = transaction.category;
      if (categoryCounts.has(category)) {
        categoryCounts.set(category, categoryCounts.get(category) + 1);
      } else {
        categoryCounts.set(category, 1);
      }
    });

  const response = Array.from(categoryCounts.entries()).map(
    ([category, count]) => ({
      category,
      number_of_items: count,
    })
  );

  res.json(response);
});

// api 5
app.get("/combined-data", async (req, res) => {
  try {
    const API_URL_STATISTICS = `http://localhost:${PORT}/statistics`;
    const API_URL_PIE_CHART = `http://localhost:${PORT}/pie-chart`;

    const [statisticsResponse, pieChartResponse] = await Promise.all([
      axios.get(API_URL_STATISTICS, { params: req.query }),
      axios.get(API_URL_PIE_CHART, { params: req.query }),
    ]);
    const transactionsData = await getApiData();

    const combinedData = {
      initialize: transactionsData,
      statistics: statisticsResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
