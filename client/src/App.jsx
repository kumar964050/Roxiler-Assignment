import { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import TransactionsStatistics from "./components/TransactionsStatistics";
import TransactionsBarChart from "./components/TransactionsBarChart";

import "./App.css";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState("March"); // Default to March
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const onNextPage = () => {
    setPage(page + 1);
  };

  const onPrevPage = () => {
    setPage(page - 1 <= 0 ? 1 : page - 1);
  };

  const increasePageLimit = () => {
    setLimit(limit + 1);
  };
  const decreasePageLimit = () => {
    if (limit > 2) {
      setLimit(limit - 1);
    }
  };

  return (
    <div className="container">
      {/* title */}
      <div className="title">
        <h1>Transaction</h1>
        <h1>Dashboard</h1>
      </div>
      {/* input container {transaction, select month} */}
      <div className="input-container">
        <input
          value={searchText}
          onChange={(e) => {
            setPage(1);
            setSearchText(e.target.value);
          }}
          type="text"
          placeholder="Search transaction"
        />
        <select
          value={selectedMonth}
          onChange={(e) => {
            setPage(1);
            setSelectedMonth(e.target.value);
          }}
        >
          <option value="January">January</option>
          <option value="February">February</option>
          <option defaultValue value="March">
            March
          </option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>

      <TransactionsTable
        selectedMonth={selectedMonth}
        searchText={searchText}
        page={page}
        limit={limit}
      />

      <div className="navigation">
        <p>page : {page}</p>
        <p></p>
        <div>
          <button onClick={onPrevPage}>Previous</button>
          <button onClick={onNextPage}>Next</button>
        </div>
        <p className="limit">
          per page : {limit}{" "}
          <button className="desc" onClick={decreasePageLimit}>
            -
          </button>{" "}
          <button className="inc" onClick={increasePageLimit}>
            +
          </button>
        </p>
      </div>

      <TransactionsStatistics
        selectedMonth={selectedMonth}
        searchText={searchText}
        page={page}
        limit={limit}
      />

      <TransactionsBarChart
        selectedMonth={selectedMonth}
        searchText={searchText}
        page={page}
        limit={limit}
      />
    </div>
  );
};

export default App;
