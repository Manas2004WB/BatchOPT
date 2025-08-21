import React, { useEffect, useMemo, useState } from "react";
import { plants as initialPlants } from "../Data/PlantData";
import heroBg from "../assets/hero-bg.jpg";
import AddPlantForm from "../components/AddPlantForm";
import UpdatePlantForm from "../components/UpdateForm";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { FaArrowsAltV, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import Navbar from "../components/Navbar";

import {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../services/plantApi"; // Import API service

const Dashboard = ({ user }) => {
  const [plantList, setPlantList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [plantPerPage, setPlantPerPage] = useState(7);

  const navigate = useNavigate();

  // ✅ Fetch plants on mount
  useEffect(() => {
    (async () => {
      try {
        const plants = await getPlants();
        setPlantList(plants);
      } catch (err) {
        console.error("Failed to fetch plants", err);
      }
    })();
  }, []);

  useEffect(() => {
    const handler = _.debounce(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 1000); // 300ms delay
    handler();
    // Cleanup debounce on unmount
    return () => {
      handler.cancel();
    };
  }, [searchQuery]);

  const filteredPlants = plantList.filter((plant) =>
    plant.PlantName?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );
  console.log("this can be issue", filteredPlants);
  const sortedPlants = useMemo(() => {
    console.log("sortConfig:", sortConfig);
    console.log("filteredPlants (before sort):", filteredPlants);

    if (!sortConfig.key) return filteredPlants;

    const sorted = [...filteredPlants].sort((a, b) => {
      let valA = a?.[sortConfig.key];
      let valB = b?.[sortConfig.key];
      console.log("Comparing:", valA, valB);

      const normalize = (v) => {
        if (typeof v === "boolean") return v ? "Active" : "Inactive";
        if (typeof v === "number") return v.toString();
        return v ?? "";
      };

      valA = normalize(valA);
      valB = normalize(valB);

      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    console.log("sortedPlants (after sort):", sorted);
    return sorted;
  }, [filteredPlants, sortConfig]);

  const indexOfLast = currentPage * plantPerPage;
  const indexOfFirst = indexOfLast - plantPerPage;
  const currentPlants = sortedPlants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPlants.length / plantPerPage);

  const handleAddPlant = async (newPlant) => {
    try {
      const created = await createPlant(newPlant);
      setPlantList((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create plant", err);
    }
  };
  const handleUpdatePlant = async (updatedPlant) => {
    try {
      const updated = await updatePlant(updatedPlant.PlantId, updatedPlant);
      setPlantList((prev) =>
        prev.map((p) => (p.PlantId === updated.PlantId ? updated : p))
      );
    } catch (err) {
      console.error("Failed to update plant", err);
    }
  };

  const handleDeletePlant = async (id) => {
    if (!window.confirm("Do you want to delete the plant?")) return;
    try {
      await deletePlant(id);
      setPlantList((prev) => prev.filter((p) => p.PlantId !== id));
    } catch (err) {
      console.error("Failed to delete plant", err);
    }
  };
  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  return (
    <>
      <Navbar user={user} />
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 pt-24"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="w-full max-w-6xl bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-8 overflow-hidden">
          <div className="flex flex-row gap-10 justify-between mt-1.5">
            <button
              onClick={() => setShowModal(true)}
              className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
            >
              + Add Plant
            </button>

            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              placeholder="Search by plant name..."
            />
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  &times;
                </button>

                {/* Add Plant Form */}
                <AddPlantForm
                  onAdd={(plant) => {
                    handleAddPlant(plant);
                    setShowModal(false);
                  }}
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg min-h-[350px] max-h-[400px] overflow-y-auto border border-white/30">
            <table className="min-w-full text-left border border-white/30 backdrop-blur">
              <thead className="bg-cyan-700 text-white sticky top-0 z-10">
                <tr>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("plant_name")}
                  >
                    <div className="flex items-center gap-1">
                      Plant Name
                      {sortConfig.key === "plant_name" ? (
                        sortConfig.direction === "asc" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort className="text-white/70" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("is_active")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === "is_active" ? (
                        sortConfig.direction === "asc" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort className="text-white/70" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white/60 min-h-52">
                {currentPlants.map((plant) => (
                  <tr
                    key={plant.PlantId || "N/A"}
                    className="border-t border-white/30 hover:bg-white/80 transition"
                  >
                    <td className="px-4 py-2">{plant.PlantName}</td>
                    <td className="px-4 py-2">
                      {plant.IsActive ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className={`px-4 py-1 rounded text-sm ${
                          plant.IsActive
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-400 cursor-not-allowed text-white"
                        }`}
                        disabled={!plant.IsActive}
                        onClick={() => {
                          if (plant.IsActive) {
                            navigate(`/plant/${plant.PlantId}`);
                          }
                        }}
                      >
                        View
                      </button>
                      <button
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-1 rounded text-sm"
                        onClick={() => {
                          setSelectedPlant(plant);
                          setShowUpdateModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                          handleDeletePlant(plant.PlantId);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Add empty rows to keep table height consistent */}
                {Array.from({
                  length: plantPerPage - currentPlants.length,
                }).map((_, idx) => (
                  <tr key={"empty-" + idx} className="border-t border-white/30">
                    <td className="px-4 py-2">&nbsp;</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showUpdateModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                  >
                    &times;
                  </button>

                  {/* Update Form */}
                  <UpdatePlantForm
                    plant={selectedPlant}
                    onUpdate={(updatedPlant) => {
                      handleUpdatePlant(updatedPlant);
                      setShowUpdateModal(false); // close modal
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <Pagination
            plantList={plantList}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            plantPerPage={plantPerPage}
            setPlantPerPage={setPlantPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
