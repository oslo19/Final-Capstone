import React, { useEffect, useState } from "react";
import { initializeCharts } from "../../../js/main-chart";
import useMenu from "../../../hooks/useMenu";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUsers from "../../../hooks/useUser";

const Dashboard = () => {
  const [menu, loading] = useMenu();
  const [activeTab, setActiveTab] = useState("faq");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { users } = useUsers();
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  console.log(users);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };
  useEffect(() => {
    initializeCharts();
  }, []);

  return (
    <div className="px-4 pt-6 2xl:px-0">
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white">
                ₱45,385
              </span>
              <h3 className="text-base font-light text-gray-500 dark:text-gray-400">
                Sales this week
              </h3>
            </div>
            <div className="flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400">
              12.5%
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          <div id="main-chart"></div>

          <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
              <div className="relative">
                {" "}
                {/* This wrapper allows positioning for dropdown */}
                <button
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  type="button"
                  onClick={toggleDropdown}
                >
                  Last 7 days{" "}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {/* Dropdown menu with absolute positioning */}
                <div
                  className={`absolute z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 ${
                    isOpen ? "" : "hidden"
                  }`} // Add 'hidden' class if dropdown is closed
                  id="weekly-sales-dropdown"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      October 16, 2024 - December 22, 2024
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Yesterday
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Today
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Last 7 days
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Last 30 days
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Last 90 days
                      </a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Custom...
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <a
                  href="#"
                  className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
                >
                  Sales Report
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Statistics this month
            <button onClick={toggleTooltip} type="button">
              <svg
                className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Show information</span>
            </button>
          </h3>

          {/* Tooltip */}
          {tooltipVisible && (
            <div
              role="tooltip"
              className="absolute z-10 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
            >
              <div className="p-3 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Statistics
                </h3>
                <p>
                  Statistics is a branch of applied mathematics that involves
                  the collection, description, analysis, and inference of
                  conclusions from quantitative data.
                </p>
                <a
                  href="#"
                  className="flex items-center font-medium text-primary-600 dark:text-primary-500 dark:hover:text-primary-600 hover:text-primary-700"
                >
                  Read more
                  <svg
                    className="w-4 h-4 ml-1"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* Tabs for Mobile */}
          <div className="sm:hidden">
            <select
              className="bg-gray-50 border-0 border-b border-gray-200 text-gray-900 text-sm rounded-t-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="faq">Top Menu</option>
              <option value="about">Top Customer</option>
            </select>
          </div>

          {/* Tabs for Desktop */}
          <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400">
            <li className="w-full">
              <button
                onClick={() => setActiveTab("faq")}
                className={`inline-block w-full p-4 rounded-tl-lg ${
                  activeTab === "faq" ? "bg-gray-50 dark:bg-gray-700" : ""
                } hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-600`}
              >
                Top Menu
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => setActiveTab("about")}
                className={`inline-block w-full p-4 rounded-tr-lg ${
                  activeTab === "about" ? "bg-gray-50 dark:bg-gray-700" : ""
                } hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-600`}
              >
                Top Customer
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="border-t border-gray-200 dark:border-gray-600">
            {/* Top Menu Content */}
            {activeTab === "faq" && (
              <div className="pt-4">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {menu.map((item, index) => (
                    <li key={index} className="py-3 sm:py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <img
                            className="flex-shrink-0 w-10 h-10"
                            src={item.image || "/images/products/default.png"}
                            alt="product image"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              {item.name}
                            </p>
                            <div className="flex items-center justify-end flex-1 text-sm text-green-500 dark:text-green-400">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  clipRule="evenodd"
                                  fillRule="evenodd"
                                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                ></path>
                              </svg>
                              2.5%
                              <span className="ml-2 text-gray-500">
                                vs last month
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          ₱{item.price?.toLocaleString() || "0.00"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Top Customer */}
            {activeTab === "about" && (
              <div
                className=" pt-4"
                id="about"
                role="tabpanel"
                aria-labelledby="about-tab"
              >
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {users.length === 0 ? (
                    <li>No users found</li> // Show a message if no users are found
                  ) : (
                    users.map((user, index) => (
                      <li key={index} className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={user.image}
                              alt={user.name}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            ₱3320
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
