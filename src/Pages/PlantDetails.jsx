import React, { useState } from "react";
import { useParams } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import TinterTable from "../components/TinterTable";
import SkuTable from "../components/SkuTable";
import NavbarPlantDetails from "../components/NavbarPlantDetails"; // updated

const PlantDetails = ({ user }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("tinter");

  return (
    <>
      <NavbarPlantDetails activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 pt-24"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="w-full max-w-6xl bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-8 overflow-hidden">
          <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
            Plant Details (ID: {id})
          </h1>

          {/* Content Area */}
          <div className="rounded-lg min-h-[300px]">
            {activeTab === "tinter" ? (
              <TinterTable user={user} plantId={id} />
            ) : (
              <SkuTable plantId={id} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantDetails;
