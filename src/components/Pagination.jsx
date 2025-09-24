import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  plantPerPage,
  setPlantPerPage,
  plantList,
}) => {
  const getPageNumbers = () => {
    const totalNumbers = 3; // max buttons to show excluding prev/next
    const totalBlocks = totalNumbers + 2; // including first & last

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      const hasLeftEllipsis = leftBound > 2;
      const hasRightEllipsis = rightBound < totalPages - 1;

      pages.push(1); // first page

      if (hasLeftEllipsis) pages.push("...");

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (hasRightEllipsis) pages.push("...");

      pages.push(totalPages); // last page

      return pages;
    }

    // if pages are small, show all
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-evenly items-center mt-10 flex-wrap gap-8">
      {/* Left: Pagination Buttons */}

      <div className="flex items-center gap-2 text-sm">
        <label
          htmlFor="plantPerPage"
          className="text-green-800 font-medium whitespace-nowrap"
        >
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
          className="border text-green-800 border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
        >
          {[10, 20, 50, 100].map((option) => (
            <option key={option} value={option} className="text-green-800">
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200"
        >
          ⟵ Prev
        </button>

        {pageNumbers.map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="px-3 py-1">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-3 py-1 rounded transition-colors ${
                num === currentPage
                  ? "bg-green-700 text-white"
                  : "bg-white border border-gray-300 hover:bg-green-50"
              }`}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200"
        >
          Next ⟶
        </button>
      </div>

      {/* Right: Plants per page selector */}

      <div>
        <label
          htmlFor="plantPerPage"
          className="text-green-800 font-medium whitespace-nowrap"
        >
          Total Plants: {plantList.length}
        </label>
      </div>
    </div>
  );
};

export default Pagination;
