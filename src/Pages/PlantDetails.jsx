import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import TinterTable from "../components/TinterTable";
import SkuTable from "../components/SkuTable";
import NavbarPlantDetails from "../components/NavbarPlantDetails";
import AddSkuBatches from "../components/AddSkuBatches";
import Calibration from "../components/Calibration/Calibration";

const PlantDetails = ({ user }) => {
  const { id: plantId } = useParams(); // more meaningful name
  const [activeTab, setActiveTab] = useState("tinter");
  const [plantName, setPlantName] = useState("");

  useEffect(() => {
    async function fetchPlantName() {
      try {
        const res = await import("../services/plantApi");
        const plant = await res.getPlantById(plantId);
        setPlantName(plant.PlantName || "");
      } catch (err) {
        setPlantName("");
      }
    }
    fetchPlantName();
  }, [plantId]);

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
    <div
      className="w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Navbar with tab buttons */}
      <NavbarPlantDetails activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main blurred card */}
      <div className="bg-cover bg-center px-4 pt-24 w-full h-screen flex justify-center p-10">
        <div className="w-full max-w-7xl bg-white/25 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
