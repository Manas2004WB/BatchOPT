import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({ query, setQuery, placeholder }) => {
  const maxLen = 25;
  // Only allow letters and spaces
  const validPattern = /^[A-Za-z ]*$/;
  const isValid = validPattern.test(query);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "" || validPattern.test(val)) {
      setQuery(val);
    }
  };

  return (
    <div className="relative w-full max-w-xs mb-4">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
        <HiMiniMagnifyingGlass />
      </span>
      <input
        type="text"
        value={query}
        maxLength={maxLen}
        onChange={handleChange}
        placeholder={placeholder || "Search by plant name..."}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      {query.length >= maxLen && (
        <div className="absolute left-0 right-0 -bottom-7 text-xs text-red-600 bg-white px-2 py-1 rounded shadow border border-red-300 z-10">
          Max 25 characters allowed
        </div>
      )}
      {!isValid && (
        <div className="absolute left-0 right-0 -bottom-14 text-xs text-red-600 bg-white px-2 py-1 rounded shadow border border-red-300 z-10">
          Only letters and spaces allowed
        </div>
      )}
    </div>
  );
};

export default SearchBar;
