import VectorLayer from "ol/layer/Vector.js";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector.js";
import { Fill, Style } from "ol/style.js";

const style = new Style({
  fill: new Fill({
    color: "#eeeeee",
  }),
});

const vectorLayer = new VectorLayer({
  background: "#1a2b39",
  source: new VectorSource({
    url: "https://openlayers.org/data/vector/ecoregions.json",
    format: new GeoJSON(),
  }),
  style: function (feature) {
    const color = feature.get("COLOR") || "#eeeeee";
    style.getFill().setColor(color);
    return style;
  },
});

export default vectorLayer;
