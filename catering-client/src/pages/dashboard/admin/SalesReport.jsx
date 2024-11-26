import React, { useState } from "react";

const SalesReport = () => {
  const [selectedYear, setSelectedYear] = useState(""); // Stores the selected year
  const [dateRange, setDateRange] = useState(null); // Date range will be set after year selection

  const handleYearSelect = () => {
    if (!selectedYear) return;

    // Set the date range based on the selected year
    setDateRange({
      startDate: `${selectedYear}-01-01`,
      endDate: `${selectedYear}-12-31`,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Modal */}
      {!dateRange && (
        <div className="w-full max-w-sm bg-white shadow-md border border-gray-300 rounded-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
              Select Year for Sales Report
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700"
            >
              <option value="" disabled>
                Select Year
              </option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleYearSelect}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                  !selectedYear ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!selectedYear}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {dateRange && (
        <div className="w-full max-w-6xl bg-white shadow-md border border-gray-300 rounded-md">
          {/* Header */}
          <div className="p-4 bg-gray-100 border-b border-gray-300">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Sales Report ({selectedYear})
            </h2>
          </div>

          {/* Table Placeholder */}
          <div className="p-4">
            <p className="text-center">Display sales data for {selectedYear} here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
