import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";

const ruMarkersSource = new VectorSource({
  url: "data/ruPoints.geojson",
  format: new GeoJSON(),
});

export default ruMarkersSource;
