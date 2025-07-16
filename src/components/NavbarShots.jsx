import React from "react";
import { MdArrowBackIos } from "react-icons/md";
import { skuVersions } from "../Data/SkuVersionData";
import { skuData } from "../Data/SkuData";

const NavbarShots = ({ batch }) => {
  const getSkuByVersionId = (versionId) => {
    const version = skuVersions.find((v) => v.sku_version_id === versionId);
    if (!version) return "-";

    const sku = skuData.find((s) => s.sku_id === version.sku_id);
    return sku?.sku_name || "-";
  };
  return (
    <div className="bg-white/60 backdrop-blur-md p-4 flex justify-between items-center text-black font-semibold shadow-md">
      <div>
        Batch Code:{" "}
        <span className="text-cyan-800 text-2xl">
          {batch?.batch_code || "-"}
        </span>
      </div>
      <div>
        SKU Name:{" "}
        <span className="text-cyan-800 text-xl">
          {getSkuByVersionId(batch?.sku_version_id || "-")}
        </span>
      </div>
      <div>
        Batch Size:{" "}
        <span className="text-cyan-800">{batch?.batch_size || "-"}</span>
      </div>
      <div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 bg-white text-cyan-800 font-medium text-sm px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition duration-200"
        >
          <MdArrowBackIos className="text-base" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default NavbarShots;
