/* eslint-disable react/prop-types */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useFetch from "../hooks/usefetch";
import ReactLoader from "./ReactLoader";

const TransactionsBarChart = ({ selectedMonth, searchText, page, limit }) => {
  const url = `http://localhost:3000/bar-chart?search_text=${searchText}&&month=${selectedMonth}&&page=${page}&&per_page=${limit}`;
  const { data, loading, error } = useFetch(url);
  if (loading) {
    return <ReactLoader />;
  }
  if (error) {
    return <p>Fetch Error</p>;
  }
  if (data === null) {
    return <ReactLoader />;
  }
  return (
    <div className="card">
      <h2>Transactions Bar Chart</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="price_range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="number_of_items" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TransactionsBarChart;
