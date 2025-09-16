import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import TinterTable from "../components/TinterTable";
import SkuTable from "../components/SkuTable";
import NavbarPlantDetails from "../components/NavbarPlantDetails";
import AddSkuBatches from "../components/AddSkuBatches";
import Calibration from "../components/Calibration/Calibration";

const PlantDetails = ({ user, handleLogout }) => {
  const { id: plantId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tinter");
  const [plantName, setPlantName] = useState("");

  useEffect(() => {
    async function fetchPlant() {
      try {
        const res = await import("../services/plantApi");
        const plant = await res.getPlantById(plantId);

        if (!plant) {
          navigate("/not-found");
          return;
        }
        if (!plant.IsActive) {
          navigate("/not-authorized");
          return;
        }
        setPlantName(plant.PlantName || "");
      } catch (err) {
        console.error("Error fetching plant:", err);
        navigate("/not-found");
      }
    }
    fetchPlant();
  }, [plantId, navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "tinter":
        return (
          <TinterTable
            user={user}
            plantId={Number(plantId)}
            plantName={plantName}
          />
        );
      case "sku":
        return (
          <SkuTable
            user={user}
            plantId={Number(plantId)}
            plantName={plantName}
          />
        );
      case "batches":
        return (
          <AddSkuBatches
            user={user}
            plantId={Number(plantId)}
            plantName={plantName}
          />
        );
      case "calibration":
        return (
          <Calibration
            user={user}
            plantId={Number(plantId)}
            plantName={plantName}
          />
        );
      default:
        return (
          <div className="text-center text-gray-600 py-10">
            Select a valid tab.
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-green-50 bg-cover bg-center">
      <NavbarPlantDetails
        handleLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="bg-cover bg-center px-4 pt-20  flex justify-center ">
        <div className="w-full max-w-full min-h-[85vh] bg-white/60 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-green-100">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
