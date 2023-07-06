import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";

const markersSource = new VectorSource({
  url: "data/points.geojson",
  format: new GeoJSON({}),
});

export default markersSource;
