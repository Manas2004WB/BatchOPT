import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  plantPerPage,
  setPlantPerPage,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-evenly items-center mt-6 flex-wrap gap-4">
      {/* Left: Pagination Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ⟵ Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 rounded ${
              num === currentPage
                ? "bg-cyan-500 text-white"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next ⟶
        </button>
      </div>

      {/* Right: Plants per page selector */}
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="plantPerPage" className="text-white whitespace-nowrap">
          Plants per page:
        </label>
        <select
          id="plantPerPage"
          value={plantPerPage}
          onChange={(e) => {
            const val = Number(e.target.value);
            setPlantPerPage(val);
            onPageChange(1); // Reset to page 1
          }}
          className="border text-white border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {[10, 20, 50, 100].map((option) => (
            <option key={option} value={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
