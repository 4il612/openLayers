import VectorLayer from "ol/layer/Vector.js";
import markersSource from "../sources/markersSource";

const markersLayer = new VectorLayer({
  className: "markers",
  source: markersSource,
});

export default markersLayer;
