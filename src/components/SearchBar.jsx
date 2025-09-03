import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({ query, setQuery, placeholder }) => {
  const maxLen = 15;
  return (
    <div className="relative w-full max-w-xs mb-4">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-900">
        <HiMiniMagnifyingGlass />
      </span>
      <input
        type="text"
        value={query}
        maxLength={maxLen}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search by plant name..."}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      {query.length >= maxLen && (
        <div className="absolute left-0 right-0 -bottom-7 text-xs text-red-600 bg-white px-2 py-1 rounded shadow border border-red-200 z-10">
          Max 15 characters allowed
        </div>
      )}
    </div>
  );
};

export default SearchBar;
