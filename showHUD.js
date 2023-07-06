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
  tableWrapper.appendChild(table);
  root.appendChild(tableWrapper);

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
  closeBTN.innerHTML = "CLOSE";
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

export default showOpenLayersWidgetHUD;
