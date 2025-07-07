import React, { useEffect, useState } from "react";
import { plants as initialPlants } from "../PlantData";
import heroBg from "../assets/hero-bg.jpg";
import AddPlantForm from "../components/AddPlantForm";
import UpdatePlantForm from "../components/UpdateForm";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import _ from "lodash";

const Dashboard = ({ user }) => {
  const [plantList, setPlantList] = useState(initialPlants);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 7;

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
    plant.plant_name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );
  const indexOfLast = currentPage * plantsPerPage;
  const indexOfFirst = indexOfLast - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const handleAddPlant = (newPlant) => {
    const nextId =
      plantList.length > 0
        ? Math.max(...plantList.map((p) => p.plant_id)) + 1
        : 1;
    setPlantList([...plantList, { ...newPlant, plant_id: nextId }]);
  };
  const handleUpdatePlant = (updatedPlant) => {
    setPlantList((prevList) =>
      prevList.map((plant) =>
        plant.plant_id === updatedPlant.plant_id ? updatedPlant : plant
      )
    );
  };

  const handleDeletePlant = (id) => {
    const confirm = window.confirm("Do yo want to delete the plant");
    if (!confirm) return;
    setPlantList((prev) => prev.filter((p) => p.plant_id !== id));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="w-full max-w-6xl bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-8 overflow-hidden">
        <div className="flex flex-row gap-10 justify-between">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-2">
            Welcome, {user.username}!
          </h2>
          <p className="text-white drop-shadow mb-1 text-2xl">
            Email: {user.email}
          </p>
        </div>
        <div className="flex flex-row gap-10 justify-around mt-1.5">
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

        <div className="overflow-x-auto rounded-lg min-h-[400px] overflow-auto">
          <table className="min-w-full text-left border border-white/30 backdrop-blur">
            <thead className="bg-cyan-700 text-white">
              <tr>
                <th className="px-4 py-2">Plant ID</th>
                <th className="px-4 py-2">Plant Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white/60 min-h-52">
              {currentPlants.map((plant) => (
                <tr
                  key={plant.plant_id}
                  className="border-t border-white/30 hover:bg-white/80 transition"
                >
                  <td className="px-4 py-2">{plant.plant_id}</td>
                  <td className="px-4 py-2">{plant.plant_name}</td>
                  <td className="px-4 py-2">
                    {plant.is_active ? (
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
                      className="bg-cyan-600 hover:bg-cyan-800 text-white px-5 py-1 rounded text-sm"
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
                        handleDeletePlant(plant.plant_id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
      </div>
    </div>
  );
};

export default Dashboard;
