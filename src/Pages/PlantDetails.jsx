import React, { useState } from "react";
import { useParams } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import TinterTable from "../components/TinterTable";
import SkuTable from "../components/SkuTable";
import NavbarPlantDetails from "../components/NavbarPlantDetails";
import AddSkuBatches from "../components/AddSkuBatches";
import Calibration from "../components/Calibration/Calibration";

const PlantDetails = ({ user }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("calibration");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tinter":
        return <TinterTable user={user} plantId={id} />;
      case "sku":
        return <SkuTable user={user} plantId={id} />;
      case "batches":
        return <AddSkuBatches user={user} plantId={id} />;
      case "calibration":
        return <Calibration user={user} plantId={id} />;
      default:
        return (
          <div className="text-center text-gray-600">Select a valid tab.</div>
        );
    }
  };

  return (
    <div
      className="w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <NavbarPlantDetails activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-cover bg-center px-4 pt-24 w-full h-screen flex justify-center p-10">
        <div className="w-full max-w-7xl bg-white/25 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
