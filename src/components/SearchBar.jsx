import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({ query, setQuery, placeholder }) => {
  return (
    <div className="relative w-full max-w-xs mb-4">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-900">
        <HiMiniMagnifyingGlass />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by plant name..."
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
};

export default SearchBar;
