function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function findMax(arr) {
  if (arr.length === 0) return 0;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function filterLoudTracks(arr, threshold) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > threshold) {
      result.push(arr[i]);
    }
  }
  return result;
}

function runVolumeAnalysis() {
  const rawName = prompt("Введите ваше имя:");
  const userName = rawName && rawName.trim() !== "" ? rawName.trim() : "Гость";
  
  alert(`Привет, ${userName}! Запускаем анализ громкости треков.`);

  const trackVolumes = [70, 74, 86, 88, 96, 108];
  console.log("Исходный массив громкости треков (дБ):", trackVolumes);

  const totalSum = calculateSum(trackVolumes);
  const averageVolume = Math.round((totalSum / trackVolumes.length) * 10) / 10;

  const loudTracks = filterLoudTracks(trackVolumes, 90);
  console.log("Громкие треки (> 90 дБ):", loudTracks);

  const quietTracks = [];
  let quietCount = 0;

  for (let i = 0; i < trackVolumes.length; i++) {
    if (trackVolumes[i] <= 75) {
      quietTracks.push(trackVolumes[i]);
      quietCount++;
    }
  }

  const quietAverage = quietCount > 0 
    ? Math.round((calculateSum(quietTracks) / quietCount) * 10) / 10 
    : 0;

  alert(`Средняя громкость – ${averageVolume} дБ, ${loudTracks.length} треков – громкие`);

  console.log(`Количество тихих треков (≤ 75 дБ): ${quietCount}`);
  console.log(`Средняя громкость тихих треков: ${quietAverage} дБ`);

  const maxVolume = findMax(trackVolumes);
  console.log(`Максимальная громкость: ${maxVolume} дБ`);

  if (maxVolume >= 105) {
    console.log("Такая громкость может повредить слух – используйте наушники с ограничением");
  }
}

const STORAGE_KEYS = {
  THEME: "lab5_theme",
  PLAYLIST: "lab5_playlist"
};

const DEFAULT_PLAYLIST = [
  { id: "track-1", title: "Neon Nights", duration: "03:42", favorite: true },
  { id: "track-2", title: "Dark Matter", duration: "04:15", favorite: false },
  { id: "track-3", title: "Retro Pulse", duration: "02:58", favorite: false }
];

function getRequiredElementById(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Ошибка: элемент с id "${id}" не найден в DOM.`);
    return null;
  }
  return element;
}

function initLab5() {
  const bodyElement = document.querySelector("body");
  const errorBox = document.querySelector("#playlist-error");
  const totalCountSpan = document.querySelector("#total-tracks-count");
  const favCountSpan = document.querySelector("#fav-tracks-count");

  const themeToggleBtn = getRequiredElementById("theme-toggle-btn");
  const togglePlaylistBtn = getRequiredElementById("toggle-playlist-btn");
  const playlistContainer = getRequiredElementById("playlist-container");
  const playlistList = getRequiredElementById("playlist-list");
  const titleInput = getRequiredElementById("track-title-input");
  const durationInput = getRequiredElementById("track-duration-input");
  const addTrackBtn = getRequiredElementById("add-track-btn");
  const clearPlaylistBtn = getRequiredElementById("clear-playlist-btn");

  if (
    !bodyElement ||
    !errorBox ||
    !totalCountSpan ||
    !favCountSpan ||
    !themeToggleBtn ||
    !togglePlaylistBtn ||
    !playlistContainer ||
    !playlistList ||
    !titleInput ||
    !durationInput ||
    !addTrackBtn ||
    !clearPlaylistBtn
  ) {
    console.error("Инициализация прервана: отсутствуют обязательные элементы страницы.");
    return;
  }

  let playlistData = loadPlaylistFromStorage();

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  function savePlaylistToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(playlistData));
    } catch (err) {
      console.error("Ошибка сохранения плейлиста в localStorage:", err);
    }
  }

  function loadPlaylistFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYLIST);
      if (saved === null) {
        return [...DEFAULT_PLAYLIST];
      }
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [...DEFAULT_PLAYLIST];
    } catch (err) {
      console.error("Ошибка чтения плейлиста из localStorage:", err);
      return [...DEFAULT_PLAYLIST];
    }
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    bodyElement.classList.toggle("light-theme", isLight);
    themeToggleBtn.textContent = isLight ? "Тёмная тема" : "Светлая тема";
    themeToggleBtn.setAttribute("aria-pressed", String(isLight));
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    applyTheme(savedTheme);
  }

  function updateCounters() {
    const allTrackElements = document.querySelectorAll("#playlist-list .playlist-item");
    const favTrackElements = document.querySelectorAll("#playlist-list .playlist-item.is-favorite");

    totalCountSpan.textContent = String(allTrackElements.length);
    favCountSpan.textContent = String(favTrackElements.length);
  }

  function createTrackElement(track) {
    const li = document.createElement("li");
    li.classList.add("playlist-item");
    if (track.favorite) {
      li.classList.add("is-favorite");
    }
    li.setAttribute("data-id", track.id);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("track-info");

    const titleStrong = document.createElement("strong");
    titleStrong.textContent = track.title;

    const durationSpan = document.createElement("span");
    durationSpan.classList.add("track-duration");
    durationSpan.textContent = `(${track.duration})`;

    infoDiv.appendChild(titleStrong);
    infoDiv.appendChild(durationSpan);

    const controlsDiv = document.createElement("div");
    controlsDiv.classList.add("track-controls");

    const favLabel = document.createElement("label");
    favLabel.classList.add("favorite-label");

    const favCheckbox = document.createElement("input");
    favCheckbox.setAttribute("type", "checkbox");
    favCheckbox.classList.add("favorite-checkbox");
    favCheckbox.checked = Boolean(track.favorite);

    const favText = document.createElement("span");
    favText.textContent = "Избранное";

    favLabel.appendChild(favCheckbox);
    favLabel.appendChild(favText);

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.classList.add("delete-track-btn", "danger-btn");
    deleteBtn.textContent = "Удалить";

    favCheckbox.addEventListener("change", function () {
      track.favorite = favCheckbox.checked;
      li.classList.toggle("is-favorite", track.favorite);
      savePlaylistToStorage();
      updateCounters();
    });

    deleteBtn.addEventListener("click", function () {
      li.remove();
      playlistData = playlistData.filter(function (item) {
        return item.id !== track.id;
      });
      savePlaylistToStorage();
      updateCounters();
    });

    controlsDiv.appendChild(favLabel);
    controlsDiv.appendChild(deleteBtn);

    li.appendChild(infoDiv);
    li.appendChild(controlsDiv);

    return li;
  }

  function renderPlaylist() {
    playlistList.innerHTML = "";
    for (let i = 0; i < playlistData.length; i++) {
      const trackEl = createTrackElement(playlistData[i]);
      playlistList.appendChild(trackEl);
    }
    updateCounters();
  }

  themeToggleBtn.addEventListener("click", function () {
    const isCurrentlyLight = bodyElement.classList.contains("light-theme");
    const nextTheme = isCurrentlyLight ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
  });

  togglePlaylistBtn.addEventListener("click", function () {
    const isHidden = playlistContainer.classList.toggle("hidden");
    togglePlaylistBtn.textContent = isHidden ? "Показать плейлист" : "Скрыть плейлист";
    togglePlaylistBtn.setAttribute("aria-expanded", String(!isHidden));
  });

  addTrackBtn.addEventListener("click", function () {
    clearError();
    const title = titleInput.value.trim();
    const duration = durationInput.value.trim();

    if (title === "" || duration === "") {
      showError("Заполните название и длительность трека.");
      return;
    }

    const durationRegex = /^\d{1,2}:[0-5]\d$/;
    if (!durationRegex.test(duration)) {
      showError("Укажите длительность в формате ММ:СС (например, 03:45).");
      durationInput.focus();
      return;
    }

    const newTrack = {
      id: "track-" + Date.now(),
      title: title,
      duration: duration,
      favorite: false
    };

    playlistData.push(newTrack);
    const newTrackElement = createTrackElement(newTrack);
    playlistList.appendChild(newTrackElement);

    savePlaylistToStorage();
    updateCounters();

    titleInput.value = "";
    durationInput.value = "";
    titleInput.focus();
  });

  clearPlaylistBtn.addEventListener("click", function () {
    clearError();
    const allItems = document.querySelectorAll("#playlist-list .playlist-item");
    allItems.forEach(function (item) {
      item.remove();
    });

    playlistData = [];
    savePlaylistToStorage();
    updateCounters();
  });

  initTheme();
  renderPlaylist();
}

document.addEventListener("DOMContentLoaded", initLab5);