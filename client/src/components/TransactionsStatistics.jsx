/* eslint-disable react/prop-types */
import useFetch from "../hooks/usefetch";
import ReactLoader from "./ReactLoader";

const TransactionsStatistics = ({ selectedMonth, searchText, page, limit }) => {
  const url = `http://localhost:3000/statistics?search_text=${searchText}&&month=${selectedMonth}&&page=${page}&&per_page=${limit}`;
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
  
  const {
    total_sale_amount,
    total_sold_items,
    total_not_sold_items
  } = data;
  return (
    <div className="card">
      <h2>Transactions Statistics</h2>
      <div>Total Sale Amount: {total_sale_amount}</div>
      <div>Total Sold Items: {total_sold_items}</div>
      <div>Total Not Sold Items: {total_not_sold_items}</div>
    </div>
  );
};

export default TransactionsStatistics;
