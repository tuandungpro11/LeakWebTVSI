// ** Navigation sections imports
import apps from "./apps";
import pages from "./pages";
import forms from "./forms";
import tables from "./tables";
import others from "./others";
import dashboards from "./dashboards";
import uiElements from "./ui-elements";
import chartsAndMaps from "./charts-maps";
import xtradeBO from "../horizontal/x-tradeBO";
import twork from "./twork";
import authorization from "./authorization";

// ** Merge & Export
export default [
  ...dashboards,
  // ...xtradeBO,
  // ...twork,
  // ...authorization
  // ...twork,
  ...authorization,
  // ...forms,
  // ...others,
  // ...uiElements
];
