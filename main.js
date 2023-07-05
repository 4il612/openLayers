import GeoJSON from "ol/format/GeoJSON.js";
import Map from "ol/Map.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import View from "ol/View.js";
import { Fill, Style } from "ol/style.js";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

//построение ресурсов
const markersSource = new VectorSource({
  url: "data/points.geojson",
  format: new GeoJSON({}),
});

const ruMarkersSource = new VectorSource({
  url: "data/ruPoints.geojson",
  format: new GeoJSON(),
});

//построение слоев
const markersLayer = new VectorLayer({
  className: "markers",
  source: markersSource,
});

const ruMarkersLayer = new VectorLayer({
  className: "ruMarkers",
  source: ruMarkersSource,
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

const tileLayer = new TileLayer({
  source: new OSM(),
});

//парсинг URL
const urlArgs = new URLSearchParams(window.location.search);

//инициализация карты
const map = new Map({
  target: "map",
  controls: [],
  layers: [tileLayer, markersLayer, ruMarkersLayer],
  view: new View({
    center: [Number(urlArgs.get("lat")), Number(urlArgs.get("lon"))],
    zoom: Number(urlArgs.get("zoom")),
  }),
});

const style = new Style({
  fill: new Fill({
    color: "#eeeeee",
  }),
});

//поиск объектов для взаимодействия
const showTileBTN = document.getElementById("showTileBTN");
const showVectorBTN = document.getElementById("showVectorBTN");
const closeModalBTN = document.getElementById("myModal__closeBtn");
const startShowBTN = document.getElementById("startShowBTN");
const isRussianOnlyCheckBox = document.getElementById("filterBoxCheck");
const isEnglishOnlyCheckBox = document.getElementById("filterBoxCheck2");
const searchBar = document.getElementById("searchPointInput");

//массив строк таблицы
const featuresTable = [];

//обработчики событий
markersSource.on("addfeature", (feature) => {
  featuresTable.push(feature.feature);
});

ruMarkersSource.on("addfeature", (feature) => {
  featuresTable.push(feature.feature);
});

searchBar.onkeyup = () => {
  featuresTable.sort();
  const table = document.getElementById("mainTable__body");
  const removableElements = table.getElementsByClassName("mainTable__row");
  while (removableElements[0]) {
    removableElements[0].parentNode.removeChild(removableElements[0]);
  }
  for (let i = featuresTable.length - 1; i > 0; --i) {
    if (featuresTable[i].values_.name_ru?.includes(searchBar.value)) {
      const trow = document.createElement("tr");
      trow.className = "mainTable__row";
      const trowName = document.createElement("td");
      trowName.innerHTML = featuresTable[i].values_.name_ru;
      trowName.className = "mainTable__name";
      const trowType = document.createElement("td");
      trowType.innerHTML = "";
      trowType.className = "mainTable__type";
      const trowAddress = document.createElement("td");
      trowAddress.innerHTML = "";
      trowAddress.className = "mainTable__address";
      const trowLON = document.createElement("td");
      trowLON.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[0];
      trowLON.className = "mainTable__lon";
      const trowLAT = document.createElement("td");
      trowLAT.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[1];
      trowLAT.className = "mainTable__lat";
      trow.appendChild(trowName);
      trow.appendChild(trowType);
      trow.appendChild(trowAddress);
      trow.appendChild(trowLON);
      trow.appendChild(trowLAT);
      table.appendChild(trow);
      trow.onclick = (e) => {
        zoomToMarker(
          Number(e.currentTarget.children[3].textContent),
          Number(e.currentTarget.children[4].textContent)
        );
      };
    }

    if (featuresTable[i].values_.name?.includes(searchBar.value)) {
      const trow = document.createElement("tr");
      trow.className = "mainTable__row englishRow";
      const trowName = document.createElement("td");
      trowName.innerHTML = featuresTable[i].values_.name;
      trowName.className = "mainTable__name";
      const trowType = document.createElement("td");
      trowType.innerHTML = featuresTable[i].values_["marker-symbol"];
      trowType.className = "mainTable__type";
      const trowAddress = document.createElement("td");
      trowAddress.innerHTML = featuresTable[i].values_.address;
      trowAddress.className = "mainTable__address";
      const trowLON = document.createElement("td");
      trowLON.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[0];
      trowLON.className = "mainTable__lon";
      const trowLAT = document.createElement("td");
      trowLAT.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[1];
      trowLAT.className = "mainTable__lat";
      trow.appendChild(trowName);
      trow.appendChild(trowType);
      trow.appendChild(trowAddress);
      trow.appendChild(trowLON);
      trow.appendChild(trowLAT);
      table.appendChild(trow);
      trow.onclick = (e) => {
        zoomToMarker(
          Number(e.currentTarget.children[3].textContent),
          Number(e.currentTarget.children[4].textContent)
        );
      };
    }
  }
};

isEnglishOnlyCheckBox.onchange = () => {
  if (isEnglishOnlyCheckBox.checked) {
    map.addLayer(markersLayer);
    return;
  }
  map.removeLayer(markersLayer);
};

isRussianOnlyCheckBox.onchange = () => {
  if (isRussianOnlyCheckBox.checked) {
    map.addLayer(ruMarkersLayer);
    return;
  }
  map.removeLayer(ruMarkersLayer);
};

// isRussianOnlyCheckBox.onchange = () => {
//   if (isRussianOnlyCheckBox.checked) {
//     map.setLayers([tileLayer, ruMarkersLayer]);
//     const table = document.getElementById("mainTable__body");
//     const removableElements = table.getElementsByClassName("englishRow");
//     while (removableElements[0]) {
//       removableElements[0].parentNode.removeChild(removableElements[0]);
//     }
//     return;
//   }
//   map.setLayers([tileLayer, markersLayer, ruMarkersLayer]);
//   const markerTabel = document.getElementById("mainTable__body");
//   markerTabel.replaceChildren();
//   let data = [];
//   markersSource.forEachFeature((feature) => {
//     data.push([
//       feature.values_.name,
//       feature.values_["marker-symbol"],
//       feature.values_.address,
//       feature.values_.geometry.flatCoordinates[0],
//       feature.values_.geometry.flatCoordinates[1],
//     ]);
//   });
//   for (let i = 0; i < data.length; ++i) {
//     const elem = data[i];
//     const trow = document.createElement("tr");
//     trow.className = "mainTable__row englishRow";
//     const trowName = document.createElement("td");
//     trowName.innerHTML = elem[0];
//     trowName.className = "mainTable__name";
//     const trowType = document.createElement("td");
//     trowType.innerHTML = elem[1];
//     trowType.className = "mainTable__type";
//     const trowAddress = document.createElement("td");
//     trowAddress.innerHTML = elem[2];
//     trowAddress.className = "mainTable__address";
//     const trowLON = document.createElement("td");
//     trowLON.innerHTML = elem[3];
//     trowLON.className = "mainTable__lon";
//     const trowLAT = document.createElement("td");
//     trowLAT.innerHTML = elem[4];
//     trowLAT.className = "mainTable__lat";
//     trow.appendChild(trowName);
//     trow.appendChild(trowType);
//     trow.appendChild(trowAddress);
//     trow.appendChild(trowLON);
//     trow.appendChild(trowLAT);
//     markerTabel.appendChild(trow);
//     trow.onclick = (e) => {
//       zoomToMarker(
//         Number(e.currentTarget.children[3].textContent),
//         Number(e.currentTarget.children[4].textContent)
//       );
//     };
//   }
//   data = [];
//   ruMarkersSource.forEachFeature((feature) => {
//     data.push([
//       feature.values_.name_ru,
//       "",
//       "",
//       feature.values_.geometry.flatCoordinates[0],
//       feature.values_.geometry.flatCoordinates[1],
//     ]);
//   });
//   for (let i = 0; i < data.length; ++i) {
//     const elem = data[i];
//     const trow = document.createElement("tr");
//     trow.className = "mainTable__row";
//     const trowName = document.createElement("td");
//     trowName.innerHTML = elem[0];
//     trowName.className = "mainTable__name";
//     const trowType = document.createElement("td");
//     trowType.innerHTML = elem[1];
//     trowType.className = "mainTable__type";
//     const trowAddress = document.createElement("td");
//     trowAddress.innerHTML = elem[2];
//     trowAddress.className = "mainTable__address";
//     const trowLON = document.createElement("td");
//     trowLON.innerHTML = elem[3];
//     trowLON.className = "mainTable__lon";
//     const trowLAT = document.createElement("td");
//     trowLAT.innerHTML = elem[4];
//     trowLAT.className = "mainTable__lat";
//     trow.appendChild(trowName);
//     trow.appendChild(trowType);
//     trow.appendChild(trowAddress);
//     trow.appendChild(trowLON);
//     trow.appendChild(trowLAT);
//     markerTabel.appendChild(trow);
//     trow.onclick = (e) => {
//       zoomToMarker(
//         Number(e.currentTarget.children[3].textContent),
//         Number(e.currentTarget.children[4].textContent)
//       );
//     };
//   }
// };

showTileBTN.onclick = () => {
  map.setLayers([tileLayer, markersLayer, ruMarkersLayer]);
  document.getElementsByTagName("body")[0].style.backgroundColor = "#aad3df";
  document.getElementsByTagName("tr")[0].style.color = "black";
};

showVectorBTN.onclick = () => {
  map.setLayers([vectorLayer, markersLayer, ruMarkersLayer]);
  document.getElementsByTagName("body")[0].style.backgroundColor = "#1A2B39";
  document.getElementsByTagName("tr")[0].style.color = "white";
};

closeModalBTN.onclick = () => {
  document.getElementById("myModal").style.display = "none";
};

map.on("click", function (e) {
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    if (layer.getClassName() == "markers") {
      showModal(
        feature.values_.name,
        feature.values_["marker-symbol"],
        feature.values_.address
      );
    }
    if (layer.getClassName() == "ruMarkers") {
      showModal(feature.values_.name_en, "", "", feature.values_.name_ru);
    }
  });
});

map.on("moveend", () => {
  dumpView();
});

startShowBTN.onclick = () => {
  const btn = document.getElementById("myModal__closeBtn");
  btn.style.display = "none";
  if (map.getAllLayers().includes(markersLayer)) {
    const features = markersSource
      .getFeatures()
      .concat(ruMarkersSource.getFeatures());
    startShow(features, 0);
  } else {
    const features = ruMarkersSource.getFeatures();
    startShow(features, 0);
  }
};

ruMarkersSource.on("featuresloadend", () => {
  featuresTable.sort();
  const markerTabel = document.getElementById("mainTable__body");
  for (let i = 0; i < featuresTable.length; ++i) {
    if (featuresTable[i].name_ru !== undefined) {
      const trow = document.createElement("tr");
      trow.className = "mainTable__row";
      const trowName = document.createElement("td");
      trowName.innerHTML = featuresTable[i].values_.name_ru;
      trowName.className = "mainTable__name";
      const trowType = document.createElement("td");
      trowType.innerHTML = "";
      trowType.className = "mainTable__type";
      const trowAddress = document.createElement("td");
      trowAddress.innerHTML = "";
      trowAddress.className = "mainTable__address";
      const trowLON = document.createElement("td");
      trowLON.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[0];
      trowLON.className = "mainTable__lon";
      const trowLAT = document.createElement("td");
      trowLAT.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[1];
      trowLAT.className = "mainTable__lat";
      trow.appendChild(trowName);
      trow.appendChild(trowType);
      trow.appendChild(trowAddress);
      trow.appendChild(trowLON);
      trow.appendChild(trowLAT);
      markerTabel.appendChild(trow);
      trow.onclick = (e) => {
        zoomToMarker(
          Number(e.currentTarget.children[3].textContent),
          Number(e.currentTarget.children[4].textContent)
        );
      };
    }
  }
});

markersSource.on("featuresloadend", () => {
  featuresTable.sort();
  const markerTabel = document.getElementById("mainTable__body");
  for (let i = 0; i < featuresTable.length; ++i) {
    if (featuresTable[i].values_.name !== undefined) {
      const trow = document.createElement("tr");
      trow.className = "mainTable__row englishRow";
      const trowName = document.createElement("td");
      trowName.innerHTML = featuresTable[i].values_.name;
      trowName.className = "mainTable__name";
      const trowType = document.createElement("td");
      trowType.innerHTML = featuresTable[i].values_["makrer-symbol"];
      trowType.className = "mainTable__type";
      const trowAddress = document.createElement("td");
      trowAddress.innerHTML = featuresTable[i].values_.address;
      trowAddress.className = "mainTable__address";
      const trowLON = document.createElement("td");
      trowLON.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[0];
      trowLON.className = "mainTable__lon";
      const trowLAT = document.createElement("td");
      trowLAT.innerHTML = featuresTable[i].values_.geometry.flatCoordinates[1];
      trowLAT.className = "mainTable__lat";
      trow.appendChild(trowName);
      trow.appendChild(trowType);
      trow.appendChild(trowAddress);
      trow.appendChild(trowLON);
      trow.appendChild(trowLAT);
      markerTabel.appendChild(trow);
      trow.onclick = (e) => {
        zoomToMarker(
          Number(e.currentTarget.children[3].textContent),
          Number(e.currentTarget.children[4].textContent)
        );
      };
    }
  }
});

const showModal = (name, type, address, name_ru = null) => {
  const modalWindow = document.getElementById("myModal");
  document.getElementById("myModal__name").textContent = name;
  if (name_ru !== null) {
    const ruHeader = document.getElementById("myModal__nameRU");
    ruHeader.textContent = name_ru;
    ruHeader.style.display = "block";
  }
  document.getElementById("myModal__address").textContent = address;
  document.getElementById("myModal__marker").textContent = type;
  modalWindow.style.display = "flex";
};

const dumpView = () => {
  window.history.pushState(
    null,
    null,
    encodeURI(
      `/?zoom=${map.getView().getZoom()}&lat=${
        map.getView().getCenter()[0]
      }&lon=${map.getView().getCenter()[1]}`
    )
  );
};

const zoomToMarker = (lat, lon) => {
  map.setView(
    new View({
      center: [lat, lon],
      zoom: 18,
    })
  );
  dumpView();
};

const startShow = (features, cur) => {
  const btn = document.getElementById("myModal__closeBtn");
  zoomToMarker(
    features[cur].values_.geometry.flatCoordinates[0],
    features[cur].values_.geometry.flatCoordinates[1]
  );
  if (features[cur].values_.name_ru !== undefined) {
    showModal(
      features[cur].values_.name_en,
      "",
      "",
      features[cur].values_.name_ru
    );
  } else {
    showModal(
      features[cur].values_.name,
      features[cur].values_["marker-symbol"],
      features[cur].values_.address
    );
  }

  if (cur == features.length - 1) {
    btn.style.display = "block";
    return;
  }
  return setTimeout(() => startShow(features, cur + 1), 2000);
};
