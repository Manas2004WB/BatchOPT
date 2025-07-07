import React from "react";
import { useParams } from "react-router-dom";

const PlantDetails = () => {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Plant Details</h1>
      <p>
        Showing details for plant : <strong>{id}</strong>
      </p>
    </div>
  );
};

export default PlantDetails;
