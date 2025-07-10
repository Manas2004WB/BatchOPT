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
    <div
      className="w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <NavbarPlantDetails activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="bg-cover bg-center px-4 pt-24 w-full h-screen flex  justify-center p-10">
        <div className="w-full max-w-7xl bg-white/25 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          {activeTab === "tinter" ? (
            <TinterTable user={user} plantId={id} />
          ) : (
            <SkuTable plantId={id} user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
