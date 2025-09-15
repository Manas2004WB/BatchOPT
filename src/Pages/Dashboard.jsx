import React, { useEffect, useMemo, useState } from "react";
import heroBg from "../assets/hero-bg.jpg";
import AddPlantForm from "../components/AddPlantForm";
import UpdatePlantForm from "../components/UpdateForm";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "sonner";
import { MdRemoveRedEye, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../services/plantApi";

const Dashboard = ({ user, handleLogout }) => {
  console.log("Dashboard user prop:", user);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.UserId;
  console.log("User ID from localStorage:", userId);
  const hasFullAccess = userId === 6;
  const [plantList, setPlantList] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    plantId: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [plantPerPage, setPlantPerPage] = useState(10);

  const navigate = useNavigate();
  // Remove doLogout indirection, use handleLogout directly

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
  // Trigger toast when sortConfig changes
  useEffect(() => {
    if (sortConfig.key) {
      toast.info(
        `Sorted by ${
          sortConfig.key == "PlantName" ? "plant name" : "is active"
        } (${sortConfig.direction.toUpperCase()})`,
        { autoClose: 2000 }
      );
    }
  }, [sortConfig]);

  const indexOfLast = currentPage * plantPerPage;
  const indexOfFirst = indexOfLast - plantPerPage;
  const currentPlants = sortedPlants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPlants.length / plantPerPage);

  const handleAddPlant = async (newPlant) => {
    try {
      const created = await createPlant(newPlant);
      setPlantList((prev) => {
        const updated = [...prev, created];
        return updated.sort(
          (a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)
        );
      });

      toast.success("Plant added successfully!");
    } catch (err) {
      console.error("Failed to create plant", err);
      toast.error("Failed to add plant.");
    }
  };

  const handleUpdatePlant = async (updatedPlant) => {
    try {
      const updated = await updatePlant(updatedPlant.PlantId, updatedPlant);
      setPlantList((prev) =>
        prev.map((p) => (p.PlantId === updated.PlantId ? updated : p))
      );
      toast.success("Plant updated successfully!");
    } catch (err) {
      console.error("Failed to update plant", err);
      toast.error("Failed to update plant.");
    }
  };

  const handleDeletePlant = (id) => {
    setConfirmDelete({ open: true, plantId: id });
  };

  const confirmDeletePlant = async () => {
    try {
      await deletePlant(confirmDelete.plantId);
      setPlantList((prev) =>
        prev.filter((p) => p.PlantId !== confirmDelete.plantId)
      );
      toast.success("Plant deleted successfully!");
    } catch (err) {
      console.error("Failed to delete plant", err);
      toast.error("Failed to delete plant.");
    } finally {
      setConfirmDelete({ open: false, plantId: null });
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
      <Toaster richColors position="top-right" />
      <Navbar user={user} onLogout={handleLogout} />
      <div className="max-h-screen bg-cover bg-center flex items-center justify-center pt-12 overflow-y-hidden">
        <div className="w-full max-w-full bg-white backdrop-blur-md  rounded-2xl p-8 overflow-hidden">
          <div className="flex flex-row gap-10 justify-between mt-1.5">
            <button
              onClick={() => setShowModal(true)}
              className="mb-4 bg-[#3dcd58] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
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
            <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
                >
                  &times;
                </button>

                <AddPlantForm
                  onAdd={(plant) => {
                    handleAddPlant(plant);
                    setShowModal(false);
                  }}
                />
              </div>
            </div>
          )}

          {confirmDelete.open && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
                <h2 className="text-lg font-bold mb-2 text-red-700">
                  Delete Plant?
                </h2>
                <p className="mb-4 text-gray-700">
                  Are you sure you want to delete this plant? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() =>
                      setConfirmDelete({
                        open: false,
                        plantId: null,
                      })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={confirmDeletePlant}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg min-h-[508px] max-h-[508px] overflow-y-auto border border-gray-200">
            <table className="min-w-full text-left border border-gray-200 backdrop-blur">
              <thead className="bg-[#3dcd58] text-white sticky top-0 z-10">
                <tr>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("PlantName")}
                  >
                    <div className="flex items-center gap-1">
                      Plant Name
                      {sortConfig.key === "PlantName" ? (
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
                  <th className="px-4 py-2">SKU Tinter Count</th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("IsActive")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === "IsActive" ? (
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
              <tbody className="bg-white/80 min-h-52">
                {currentPlants.map((plant) => (
                  <tr
                    key={plant.PlantId || "N/A"}
                    className="border-t border-gray-200 hover:bg-green-50 transition"
                  >
                    <td className="px-4 py-2">{plant.PlantName}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-row gap-4">
                        <span className="px-2 py-1 bg-green-300 rounded-2xl">
                          SKUS:{plant.Skus.length}
                        </span>
                        <span className="px-2 py-1 bg-green-300 rounded-2xl">
                          Tinters:
                          {plant.Tinters.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {plant.IsActive ? (
                        <span className="text-green-700 font-semibold">
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
                        className={`px-4 py-2 rounded text-sm ${
                          plant.IsActive
                            ? "bg-amber-300 hover:bg-amber-500 text-white"
                            : "bg-gray-400 cursor-not-allowed text-white"
                        }`}
                        disabled={!plant.IsActive}
                        onClick={() => {
                          if (plant.IsActive) {
                            navigate(`/plant/${plant.PlantId}`);
                          }
                        }}
                      >
                        <MdRemoveRedEye />
                      </button>
                      {hasFullAccess && (
                        <>
                          <button
                            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded sm"
                            onClick={() => {
                              setSelectedPlant(plant);
                              setShowUpdateModal(true);
                            }}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm "
                            onClick={() => handleDeletePlant(plant.PlantId)}
                          >
                            <MdDelete />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {Array.from({
                  length: plantPerPage - currentPlants.length,
                }).map((_, idx) => (
                  <tr key={"empty-" + idx} className="border-t border-gray-200">
                    <td className="px-4 py-2">&nbsp;</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showUpdateModal && (
              <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
                  >
                    &times;
                  </button>

                  <UpdatePlantForm
                    plant={selectedPlant}
                    onUpdate={(updatedPlant) => {
                      handleUpdatePlant(updatedPlant);
                      setShowUpdateModal(false);
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
