import Map from "ol/Map.js";
import View from "ol/View.js";
import markersSource from "./sources/markersSource";
import ruMarkersSource from "./sources/ruMarkersSource";
import markersLayer from "./layers/markersLayer";
import ruMarkersLayer from "./layers/ruMarkersLayer";
import vectorLayer from "./layers/vectorLayer";
import tileLayer from "./layers/tileLayer";

const showOpenLayersWidgetHUD = (rootID) => {
  const root = document.getElementById(rootID);

  //создание и добавление элемента с картой
  const map = document.createElement("div");
  map.id = "map";
  map.className = "map";
  root.appendChild(map);

  //создание и добавление кнопок переключения слоев
  const swapButtons = document.createElement("div");
  swapButtons.id = "swapButtons";

  const showTileBTN = document.createElement("button");
  showTileBTN.id = "showTileBTN";
  showTileBTN.className = "swapButton";
  showTileBTN.innerHTML = "TileLayer";

  const showVectorBTN = document.createElement("button");
  showVectorBTN.id = "showVectorBTN";
  showVectorBTN.className = "swapButton";
  showVectorBTN.innerHTML = "VectorLayer";

  swapButtons.appendChild(showTileBTN);
  swapButtons.appendChild(showVectorBTN);
  root.appendChild(swapButtons);

  //создание и добавление кнопки запуска презентации
  const showWrapper = document.createElement("div");
  showWrapper.className = "showWrapper";
  const startShowBTN = document.createElement("button");
  startShowBTN.id = "startShowBTN";
  startShowBTN.innerHTML = "SHOW";
  showWrapper.appendChild(startShowBTN);
  root.appendChild(showWrapper);

  //создание и добавление меню фильтрации
  const filterBoxWrapper = document.createElement("div");
  filterBoxWrapper.className = "filterBoxWrapper";

  const filterBoxSubWrapper = document.createElement("div");
  filterBoxSubWrapper.className = "filterBoxSubWrapper";

  const isRussianOnlyCheckBox = document.createElement("input");
  isRussianOnlyCheckBox.checked = true;
  isRussianOnlyCheckBox.type = "checkbox";
  isRussianOnlyCheckBox.name = "isRussianOnly";
  isRussianOnlyCheckBox.id = "filterBoxCheck";
  filterBoxSubWrapper.appendChild(isRussianOnlyCheckBox);

  const filterBoxSubWrapper2 = document.createElement("div");
  filterBoxSubWrapper2.className = "filterBoxSubWrapper";

  const isEnglishOnlyCheckBox = document.createElement("input");
  isEnglishOnlyCheckBox.checked = true;
  isEnglishOnlyCheckBox.type = "checkbox";
  isEnglishOnlyCheckBox.name = "isEnglishOnly";
  isEnglishOnlyCheckBox.id = "filterBoxCheck2";
  filterBoxSubWrapper2.appendChild(isEnglishOnlyCheckBox);

  const filterBoxSubWrapper3 = document.createElement("div");
  filterBoxSubWrapper3.className = "filterBoxSubWrapper";

  const searchBarInput = document.createElement("input");
  searchBarInput.id = "searchPointInput";
  searchBarInput.type = "text";

  const searchLabel = document.createElement("label");
  searchLabel.innerHTML = "search";
  filterBoxSubWrapper3.appendChild(searchBarInput);
  filterBoxSubWrapper3.appendChild(searchLabel);

  filterBoxWrapper.appendChild(filterBoxSubWrapper);
  filterBoxWrapper.appendChild(filterBoxSubWrapper2);
  filterBoxWrapper.appendChild(filterBoxSubWrapper3);

  root.appendChild(filterBoxWrapper);

  //создание и добавление таблицы
  const tableWrapper = document.createElement("div");
  tableWrapper.className = "table__wrapper";

  const table = document.createElement("table");
  table.id = "mainTable";

  const thead = document.createElement("thead");

  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  const th5 = document.createElement("th");
  th1.innerHTML = "NAME";
  th2.innerHTML = "TYPE";
  th3.innerHTML = "ADDRESS";
  th4.innerHTML = "lat";
  th5.innerHTML = "lon";
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  tbody.id = "mainTable__body";
  table.appendChild(tbody);

  //создание и добавление модального окна
  const modal = document.createElement("div");
  modal.className = "hystmodal";
  modal.id = "myModal";
  modal.ariaHidden = "true";

  const modalWrap = document.createElement("div");
  modalWrap.className = "hystmodal__wrap";

  const modalWindow = document.createElement("div");
  modalWindow.className = "hystmodal__window";
  modalWindow.role = "dialog";
  modalWindow.ariaModal = "true";

  const hName = document.createElement("h1");
  hName.id = "myModal__name";
  const hNameRU = document.createElement("h2");
  hNameRU.id = "myModal__nameRU";
  const pMarker = document.createElement("p");
  pMarker.id = "myModal__marker";
  const pAddress = document.createElement("p");
  pAddress.id = "myModal__address";
  const closeBTNWrapper = document.createElement("div");
  closeBTNWrapper.className = "hystmodal__btnWrapper";
  const closeBTN = document.createElement("button");
  closeBTN.id = "myModal__closeBtn";

  closeBTNWrapper.appendChild(closeBTN);
  modalWindow.appendChild(hName);
  modalWindow.appendChild(hNameRU);
  modalWindow.appendChild(pMarker);
  modalWindow.appendChild(pAddress);
  modalWindow.appendChild(closeBTNWrapper);
  modalWrap.appendChild(modalWindow);
  modal.appendChild(modalWrap);
  root.appendChild(modal);
};

const initializeOpenLayersWidget = () => {
  showOpenLayersWidgetHUD("root");
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

  //поиск объектов для взаимодействия
  const showTileBTN = document.getElementById("showTileBTN");
  const showVectorBTN = document.getElementById("showVectorBTN");
  const closeModalBTN = document.getElementById("myModal__closeBtn");
  const startShowBTN = document.getElementById("startShowBTN");
  const isRussianOnlyCheckBox = document.getElementById("filterBoxCheck");
  const isEnglishOnlyCheckBox = document.getElementById("filterBoxCheck2");
  const searchBar = document.getElementById("searchPointInput");
  const modalWindow = document.getElementById("myModal");

  //массив строк таблицы
  const featuresTable = [];

  //обработчики событий
  ruMarkersSource.on("addfeature", (feature) => {
    featuresTable.push(feature.feature);
  });

  markersSource.on("addfeature", (feature) => {
    featuresTable.push(feature.feature);
  });

  searchBar.oninput = () => {
    featuresTable.sort();
    const table = document.getElementById("mainTable__body");
    const removableElements = table.getElementsByClassName("mainTable__row");
    while (removableElements[0]) {
      removableElements[0].parentNode.removeChild(removableElements[0]);
    }
    for (let i = featuresTable.length - 1; i >= 0; --i) {
      if (
        featuresTable[i].values_.name_ru
          ?.toLowerCase()
          .includes(searchBar.value.toLowerCase())
      ) {
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
        trowLON.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[0];
        trowLON.className = "mainTable__lon";
        const trowLAT = document.createElement("td");
        trowLAT.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[1];
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

      if (
        featuresTable[i].values_.name
          ?.toLowerCase()
          .includes(searchBar.value.toLowerCase())
      ) {
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
        trowLON.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[0];
        trowLON.className = "mainTable__lon";
        const trowLAT = document.createElement("td");
        trowLAT.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[1];
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
      if (featuresTable[i].values_.name_ru !== undefined) {
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
        trowLON.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[0];
        trowLON.className = "mainTable__lon";
        const trowLAT = document.createElement("td");
        trowLAT.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[1];
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
        trowType.innerHTML = featuresTable[i].values_["marker-symbol"];
        trowType.className = "mainTable__type";
        const trowAddress = document.createElement("td");
        trowAddress.innerHTML = featuresTable[i].values_.address;
        trowAddress.className = "mainTable__address";
        const trowLON = document.createElement("td");
        trowLON.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[0];
        trowLON.className = "mainTable__lon";
        const trowLAT = document.createElement("td");
        trowLAT.innerHTML =
          featuresTable[i].values_.geometry.flatCoordinates[1];
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
};

initializeOpenLayersWidget();
