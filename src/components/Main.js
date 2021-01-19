import React, { useEffect, useState } from "react";
import { Pagination, AllData } from "./Data";
// import Search from "./Filter";
import Loader from "./Loader";

function App() {
  React.useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    setLoading(true);

    fetch("https://api.enye.tech/v1/challenge/records")
      .then((response) => response.json())
      .then((res) => {
        console.log(res.records.profiles);
        setData(res.records.profiles);
        setInitialData(res.records.profiles);
      })
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  };

  const filterListPayment = [
    {
      id: 11,
      name: "PayPal",
      value: "paypal",
    },
    {
      id: 12,
      name: "Check",
      value: "check",
    },
    {
      id: 13,
      name: "Money Order",
      value: "money order",
    },
    {
      id: 14,
      name: "CC",
      value: "cc",
    },
  ];

  const filterListGender = [
    {
      id: 18,
      name: "Male",
      value: "Male",
    },
    {
      id: 19,
      name: "Female",
      value: "Female",
    },
    {
      id: 23,
      name: "Others",
      value: "Prefer to skip",
    },
  ];

  const [activeFilter, setActiveFilter] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);

  // exclude column list from filter
  const excludeColumns = [
    "Latitude",
    "Longitude",
    "CreditCardNumber",
    "MacAddress",
    "LastLogin",
  ];

  // handle change event of search input
  const handleChange = (value) => {
    setSearchText(value);
    filterData(value);
  };

  useEffect(() => {
    console.log(activeFilter);

    let filtered = initialData;
    if (activeFilter.length)
      filtered = initialData.filter(
        (item) =>
          activeFilter.includes(item.PaymentMethod) ||
          activeFilter.includes(item.Gender)
      );
    setData(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const onFilterChange = (filter, isChecked) => {
    if (isChecked) {
      setActiveFilter([...activeFilter, filter]);
    } else {
      setActiveFilter(activeFilter.filter((f) => f !== filter));
    }
  };

  // filter records by search text
  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();

    if (lowercasedValue === "") {
      setData(initialData);
      activeFilter.length && onFilterChange(activeFilter, true);
    } else {
      const filteredData = data.filter((item) => {
        return Object.keys(item).some((key) =>
          excludeColumns.includes(key)
            ? false
            : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      setData(filteredData);
    }
  };

  const clearFilter = () => {
    setActiveFilter([]);
    setData(initialData);
    setSearchText("");
  };

  return (
    <div className="App">
      {!loading ? (
        <div className="data-body">
          <h5 className="title">ENYE E-COMMERCE</h5>
          <div className="search-bar">
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          {data.length ? (
            <div className="filter">
              <form>
                <div className="form-row">
                  {filterListPayment.map((filter, i) => (
                    <div className="checkbox-container" key={i}>
                      <input
                        id={filter.id}
                        type="checkbox"
                        className="styled-checkbox"
                        checked={activeFilter.includes(filter.value)}
                        onClick={(e) =>
                          onFilterChange(filter.value, e.target.checked)
                        }
                      />
                      <label htmlFor={filter.id}>{filter.name}</label>
                    </div>
                  ))}
                </div>
                <br />
                <div className="form-row">
                  {filterListGender.map((filter, i) => (
                    <div className="checkbox-container" key={i}>
                      <input
                        id={filter.id}
                        className="styled-checkbox"
                        type="checkbox"
                        checked={activeFilter.includes(filter.value)}
                        onClick={(e) =>
                          onFilterChange(filter.value, e.target.checked)
                        }
                      />
                      <label htmlFor={filter.id}>{filter.name}</label>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="checkbox-clear-button"
                  onClick={clearFilter}
                >
                  Clear
                </button>
              </form>
            </div>
          ) : (
            <p>No data available</p>
          )}
          <br />
          <Pagination data={data} pageSize={20} startingPage={1}>
            <AllData />
          </Pagination>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default App;
