import React, { useEffect, useMemo, useState } from "react";
import AddPlantForm from "../components/Plants/AddPlantForm";
import UpdatePlantForm from "../components/Plants/UpdateForm";
import SearchBar from "../components/Plants/SearchBar";
import Pagination from "../components/Plants/Pagination";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import Navbar from "../components/Plants/Navbar";
import { Toaster, toast } from "sonner";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { hasFullAccess } from "../utility/authUtils";
import {
  getPlants,
  createPlant,
  updatePlant,
  deletePlant,
} from "../services/plantApi";

const Dashboard = ({ user, handleLogout }) => {
  console.log("Dashboard user prop:", user);
  const canAction = hasFullAccess();
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

  const debouncedSetQuery = useMemo(
    () => _.debounce((val) => setDebouncedQuery(val), 500),
    []
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
    return () => debouncedSetQuery.cancel();
  }, [searchQuery, debouncedSetQuery]);

  const filteredPlants = plantList.filter((plant) =>
    plant.PlantName?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );
  const sortedPlants = useMemo(() => {
    if (!sortConfig.key) return filteredPlants;

    const sorted = [...filteredPlants].sort((a, b) => {
      let valA = a?.[sortConfig.key];
      let valB = b?.[sortConfig.key];
      const normalize = (v) => {
        if (typeof v === "boolean") return v ? "Active" : "Inactive";
        if (typeof v === "number") return v.toString();
        return v ?? "";
      };
      valA = normalize(valA);
      valB = normalize(valB);
      if (!isNaN(valA) && !isNaN(valB)) {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
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
        const updated = [created, ...prev]; // put new one at front
        return updated.sort((a, b) => {
          const dateA = new Date(a.UpdatedAt || a.CreatedAt);
          const dateB = new Date(b.UpdatedAt || b.CreatedAt);
          return dateB - dateA;
        });
      });

      setCurrentPage(1);
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
            {canAction && (
              <button
                onClick={() => setShowModal(true)}
                className="mb-4 bg-[#3dcd58] shadow-md hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
              >
                + Add Plant
              </button>
            )}
            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              placeholder="Search by plant name..."
            />
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-400/10 backdrop-blur-sm flex items-center justify-center z-50">
              <AddPlantForm
                onAdd={(plant) => {
                  handleAddPlant(plant);
                  setShowModal(false);
                }}
                onClose={() => {
                  setShowModal(false);
                }}
              />
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 ">
            {/* SCROLLABLE AREA only if needed */}
            <div className="max-h-[466px] overflow-y-auto">
              <table className="min-w-full text-left border font-normal border-gray-200 backdrop-blur">
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
                    {canAction && <th className="px-4 py-2">Action</th>}
                  </tr>
                </thead>
                <tbody className="bg-white/80 ">
                  {currentPlants.map((plant) => (
                    <tr
                      key={plant.PlantId || "N/A"}
                      className="border-t border-gray-200 hover:bg-green-100 cursor-pointer transition"
                      onClick={() => {
                        if (plant.IsActive) {
                          navigate(`/plant/${plant.PlantId}`);
                        }
                      }}
                    >
                      <td className="px-4 py-2 text-black hover:text-blue-600 hover:underline cursor-pointer">
                        {plant.PlantName}
                      </td>
                      <td>
                        <div className="flex flex-row gap-4">
                          <span className="px-2 py-1 bg-green-100 rounded-2xl">
                            SKUS:{plant.Skus.length}
                          </span>
                          <span className="px-2 py-1 bg-green-100 rounded-2xl">
                            Tinters:{plant.Tinters.length}
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

                      {canAction && (
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <button
                              className="flex items-center shadow-md justify-center bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlant(plant);
                                setShowUpdateModal(true);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm shadow-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlant(plant.PlantId);
                              }}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}

                  {/* filler rows */}
                  {currentPlants.length < plantPerPage &&
                    totalPages > 1 &&
                    Array.from({
                      length: plantPerPage - currentPlants.length,
                    }).map((_, idx) => (
                      <tr
                        key={"empty-" + idx}
                        className="border-t border-gray-200"
                        style={{ height: "42px" }}
                      >
                        <td className="px-4 py-2">&nbsp;</td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        {canAction && <td className="px-4 py-2"></td>}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {showUpdateModal && (
              <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
                <UpdatePlantForm
                  plant={selectedPlant}
                  onUpdate={(updatedPlant) => {
                    handleUpdatePlant(updatedPlant);
                    setShowUpdateModal(false);
                  }}
                  onClose={() => {
                    setShowUpdateModal(false);
                  }}
                />
              </div>
            )}
            {confirmDelete.open && (
              <div className="fixed inset-0 bg-gray-300/10  backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
                  <h2 className="text-lg font-bold mb-2 text-red-700">
                    Delete Plant?
                  </h2>
                  <p className="mb-4 text-gray-700">
                    Are you sure you want to delete this plant? This action
                    cannot be undone.
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
                      className="px-4 py-2 shadow-md bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={confirmDeletePlant}
                    >
                      Delete
                    </button>
                  </div>
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
