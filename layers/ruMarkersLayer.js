import VectorLayer from "ol/layer/Vector.js";
import ruMarkersSource from "../sources/ruMarkersSource";

const ruMarkersLayer = new VectorLayer({
  className: "ruMarkers",
  source: ruMarkersSource,
});

export default ruMarkersLayer;
