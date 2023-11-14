/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import useFetch from "../hooks/usefetch";
import ReactLoader from "./ReactLoader";

const TransactionsTable = ({ selectedMonth, searchText, page, limit }) => {
  const url = `http://localhost:3000/list-transactions?search_text=${searchText}&&month=${selectedMonth}&&page=${page}&&per_page=${limit}`;
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
      <h2>Transactions Table</h2>

      <table>
        {/* Table header */}
        <thead>
          <tr>
            <th>ID</th>
            <th>title</th>
            <th>Description</th>
            <th>Price</th>
            {/* <th>Category</th> */}
            <th>sold</th>
            {/* <th>image</th> */}
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {data?.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description.slice(0, 6)}</td>
              <td>{transaction.price}</td>
              <td>{transaction.dateOfSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="center">No transaction</p>}
    </div>
  );
};

export default TransactionsTable;
