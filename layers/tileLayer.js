import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const tileLayer = new TileLayer({
  source: new OSM(),
});

export default tileLayer;
