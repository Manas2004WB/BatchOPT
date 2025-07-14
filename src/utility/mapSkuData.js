import { skuData } from "../Data/SkuData";
import { skuVersions } from "../Data/SkuVersionData";
import { skuVersionMeasurements } from "../Data/SkuMeasurementData";
import { standardRecipes } from "../Data/standardRecipes";
import { tinters } from "../Data/TinterData";

export const mapSkuData = (plantId) => {
  let result = [];
  let srNoCounter = 1;
  const skuIdToSrNo = {};
  console.log("⛳ mapSkuData called with plantId:", plantId);

  console.log("🧪 All SKU Data with plant_id types:");
  skuData.forEach((sku) =>
    console.log(
      `sku_id: ${sku.sku_id}, plant_id: ${
        sku.plant_id
      } (${typeof sku.plant_id})`
    )
  );
  // ❗️Filter only SKUs for the given plantId
  const filteredSkus = skuData.filter(
    (sku) => Number(sku.plant_id) === Number(plantId)
  );
  console.log("🌱 Filtered SKUs for plant", plantId, "=>", filteredSkus);
  for (const sku of filteredSkus) {
    const versions = skuVersions.filter((v) => v.sku_id === sku.sku_id);

    for (const version of versions) {
      if (!skuIdToSrNo[sku.sku_id]) {
        skuIdToSrNo[sku.sku_id] = srNoCounter++;
      }

      const measurements = skuVersionMeasurements.filter(
        (m) => m.sku_version_id === version.sku_version_id
      );

      const getVal = (type) =>
        measurements.find((m) => m.measurement_type === type)
          ?.measurement_value ?? "-";

      const standardLiquid = {
        L: getVal("liquid_l"),
        a: getVal("liquid_a"),
        b: getVal("liquid_b"),
      };

      const standardPanel = {
        L: getVal("panel_l"),
        a: getVal("panel_a"),
        b: getVal("panel_b"),
      };

      const spectroPanel = {
        L: getVal("colorimeter_l"),
        a: getVal("colorimeter_a"),
        b: getVal("colorimeter_b"),
      };

      const targetDeltaE = getVal("target_delta_e");

      const tinterIds = standardRecipes
        .filter((r) => r.sku_version_id === version.sku_version_id)
        .map((r) => r.tinter_id);

      const tinterCodes = tinters
        .filter((t) => tinterIds.includes(t.tinter_id))
        .map((t) => t.tinter_code);
      console.log("Filtered SKUs for plant", plantId, filteredSkus);
      console.log("Matching versions for SKU", sku.sku_name, versions);
      result.push({
        srNo: skuIdToSrNo[sku.sku_id],
        skuRevision: `${version.version_number}`,
        skuName: sku.sku_name,
        batches: "Static",
        standardLiquid,
        standardPanel,
        spectroPanel,
        standardTinters: tinterCodes,
        targetDeltaE,
        createdOn: formatDate(version.created_at),
        lastUpdated: formatDate(version.updated_at),
        comments: version.comments || "-",
      });
    }
  }
  console.log("✅ Final mapped SKUs for plant:", result);
  return result;
};

// 📅 Utility function to format dates
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
