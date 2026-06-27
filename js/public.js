document.addEventListener("DOMContentLoaded", function () {

  renderPublicStats();
  renderProjectMap();
  renderLatestProjects();
  renderLatestFeedbacks();
  setupProjectList();
  setupAspirationForm();

});

window.addEventListener("storage", function () {

  renderPublicStats();
  renderProjectMap();
  renderLatestProjects();
  renderLatestFeedbacks();
  renderPublicProjects();

});

function renderPublicStats() {

  var totalProjectsElement =
    document.getElementById("public-total-projects");
  var mapProjectCount =
    document.getElementById("public-map-project-count");

  var activeProjectsElement =
    document.getElementById("public-active-projects");

  var completedProjectsElement =
    document.getElementById("public-completed-projects");

  var feedbackCountElement =
    document.getElementById("public-feedback-count");

  var projects = getProjects();
  var feedbacks = getPublicFeedbacks();

  if (totalProjectsElement) {
    totalProjectsElement.textContent = projects.length;
  }

  if(mapProjectCount){

    mapProjectCount.textContent =
    projects.length;

}

  if (activeProjectsElement) {
    activeProjectsElement.textContent =
      projects.filter(function(project){
        return project.status !== "Selesai";
      }).length;
  }

  if (completedProjectsElement) {
    completedProjectsElement.textContent =
      projects.filter(function(project){
        return project.status === "Selesai";
      }).length;
  }

  if (feedbackCountElement) {
    feedbackCountElement.textContent = feedbacks.length;
  }
}

function renderProjectMap() {

  var mapElement =
    document.getElementById("project-map");

  if (!mapElement) {
    return;
  }

  if (typeof L === "undefined") {
    mapElement.innerHTML =
      '<div class="public-map-fallback">Peta belum dapat dimuat.</div>';
    return;
  }

  var regionCoordinates = {
    "Bandung Utara": [-6.865, 107.615],
    "Bandung Timur": [-6.914, 107.690],
    "Bandung Barat": [-6.905, 107.560],
    "Bandung Selatan": [-6.960, 107.620],
    "Bandung Tengah": [-6.917, 107.619]
  };

  var fallbackRegion =
    "Bandung Tengah";

  if (window.sitaraProjectMap) {
    window.sitaraProjectMap.remove();
  }

  window.sitaraProjectMap =
    L.map("project-map").setView(
      regionCoordinates[fallbackRegion],
      12
    );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(window.sitaraProjectMap);

  var markers = [];
  var regionMarkerCounts = {};

  getProjects().forEach(function (project) {

    var region =
      regionCoordinates[project.region]
        ? project.region
        : fallbackRegion;

    var coordinates =
      regionCoordinates[region];

    regionMarkerCounts[region] =
      (regionMarkerCounts[region] || 0) + 1;

    var markerCoordinates =
      getProjectMarkerCoordinates(
        coordinates,
        regionMarkerCounts[region]
      );

    var marker =
      L.marker(markerCoordinates)
      .addTo(window.sitaraProjectMap)
      .bindPopup(
        createProjectPopup(project, region)
      );

    markers.push(marker);

  });

  if (markers.length) {

    window.sitaraProjectMap.fitBounds(
      L.featureGroup(markers).getBounds(),
      {
        padding: [32, 32],
        maxZoom: 13
      }
    );

  }

}

function getProjectMarkerCoordinates(coordinates, markerIndex) {

  var offsetSteps = [
    [0, 0],
    [0.006, 0.006],
    [-0.006, 0.006],
    [0.006, -0.006],
    [-0.006, -0.006],
    [0.009, 0],
    [0, 0.009],
    [-0.009, 0],
    [0, -0.009]
  ];

  var offset =
    offsetSteps[
      (markerIndex - 1) % offsetSteps.length
    ];

  return [
    coordinates[0] + offset[0],
    coordinates[1] + offset[1]
  ];

}

function createProjectPopup(project, region) {

  var popup =
    document.createElement("div");

  var title =
    document.createElement("strong");

  title.textContent =
    project.name || "Nama proyek belum tersedia";

  popup.appendChild(title);
  popup.appendChild(createPopupLine("Lokasi: ", project.location || "-"));
  popup.appendChild(createPopupLine("Wilayah: ", region));
  popup.appendChild(createPopupLine("Status: ", project.status || "-"));
  popup.appendChild(createPopupLine("Progress: ", getProjectProgress(project) + "%"));

  return popup;

}

function createPopupLine(label, value) {

  var line =
    document.createElement("div");

  var labelElement =
    document.createElement("span");

  labelElement.textContent =
    label;

  line.appendChild(labelElement);
  line.appendChild(document.createTextNode(value));

  return line;

}

function setupProjectList() {

  var projectList =
    document.getElementById("public-project-list");

  if (!projectList) {
    return;
  }

  var searchInput =
    document.getElementById("project-search");

  var statusFilter =
    document.getElementById("status-filter");

  if (searchInput) {

    searchInput.addEventListener("input", function () {

      renderPublicProjects();

    });

  }

  if (statusFilter) {

    statusFilter.addEventListener("change", function () {

      renderPublicProjects();

    });

  }

  renderPublicProjects();

}

function renderPublicProjects() {

  var projectList =
    document.getElementById("public-project-list");

  if (!projectList) {
    return;
  }

  var searchInput =
    document.getElementById("project-search");

  var statusFilter =
    document.getElementById("status-filter");

  var keyword =
    searchInput ? searchInput.value.toLowerCase().trim() : "";

  var selectedStatus =
    statusFilter ? statusFilter.value : "";

  var projects =
    getProjects().filter(function (project) {

      var searchableText =
        [
          project.name,
          project.location,
          project.status
        ].join(" ").toLowerCase();

      var matchesKeyword =
        !keyword || searchableText.indexOf(keyword) !== -1;

      var matchesStatus =
        !selectedStatus || project.status === selectedStatus;

      return matchesKeyword && matchesStatus;

    });

  projectList.innerHTML = "";

  if (!projects.length) {

    var emptyState =
      document.createElement("div");

    emptyState.className =
      "public-empty";

    emptyState.textContent =
      "Tidak ada proyek yang sesuai dengan pencarian.";

    projectList.appendChild(emptyState);

    return;

  }

  projects.forEach(function (project) {

    projectList.appendChild(
      createPublicProjectCard(project)
    );

  });

}

function renderLatestProjects() {

  var container =
    document.getElementById("latest-projects");

  if (!container) {
    return;
  }

  var projects =
    getProjects()
      .slice()
      .sort(function (a, b) {

        return getNewestOrder(b.id) - getNewestOrder(a.id);

      })
      .slice(0, 3);

  container.innerHTML = "";

  if (!projects.length) {

    container.appendChild(
      createEmptyState("Belum ada proyek yang tersedia.")
    );

    return;

  }

  projects.forEach(function (project) {

    container.appendChild(
      createPublicProjectCard(project)
    );

  });

}

function renderLatestFeedbacks() {

  var container =
    document.getElementById("latest-feedbacks");

  if (!container) {
    return;
  }

  var feedbacks =
    getPublicFeedbacks()
      .slice()
      .sort(function (a, b) {

        return getNewestOrder(b.id) - getNewestOrder(a.id);

      })
      .slice(0, 3);

  container.innerHTML = "";

  if (!feedbacks.length) {

    container.appendChild(
      createEmptyState("Belum ada aspirasi yang tersedia.")
    );

    return;

  }

  feedbacks.forEach(function (feedback) {

    container.appendChild(
      createPublicFeedbackCard(feedback)
    );

  });

}

function createPublicFeedbackCard(feedback) {

  var card =
    document.createElement("article");

  card.className =
    "public-feedback-card";

  var title =
    document.createElement("h2");

  title.className =
    "public-project-title";

  title.textContent =
    feedback.title || "Judul aspirasi belum tersedia";

  var location =
    document.createElement("div");

  location.className =
    "public-project-location";

  location.textContent =
    feedback.location || "Lokasi belum tersedia";

  var status =
    document.createElement("span");

  status.className =
    "badge " + getFeedbackBadgeClass(feedback.status);

  status.textContent =
    feedback.status || "Menunggu Review";

  card.appendChild(title);
  card.appendChild(location);
  card.appendChild(status);

  return card;

}

function getPublicFeedbacks() {

  return getFeedbacks().filter(function (feedback) {

    return feedback.status !== "Ditolak";

  });

}

function createEmptyState(message) {

  var emptyState =
    document.createElement("div");

  emptyState.className =
    "public-empty";

  emptyState.textContent =
    message;

  return emptyState;

}

function createPublicProjectCard(project) {

  var card =
    document.createElement("article");

  card.className =
    "public-project-card";

  var title =
    document.createElement("h2");

  title.className =
    "public-project-title";

  title.textContent =
    project.name || "Nama proyek belum tersedia";

  var location =
    document.createElement("div");

  location.className =
    "public-project-location";

  location.textContent =
    project.location || "Lokasi belum tersedia";

  var dateRange =
    document.createElement("div");

  dateRange.className =
    "public-project-date";

  dateRange.textContent =
    formatProjectDateRange(project);

  var meta =
    document.createElement("div");

  meta.className =
    "public-project-meta";

  var status =
    document.createElement("span");

  status.className =
    "badge " + getStatusBadgeClass(project.status);

  status.textContent =
    project.status || "Belum Ada Status";

  var progressLabel =
    document.createElement("strong");

  progressLabel.textContent =
    getProjectProgress(project) + "%";

  meta.appendChild(status);
  meta.appendChild(progressLabel);

  var progress =
    document.createElement("div");

  progress.className =
    "public-progress";

  var progressBar =
    document.createElement("div");

  progressBar.className =
    "public-progress-bar";

  progressBar.style.width =
    getProjectProgress(project) + "%";

  progress.appendChild(progressBar);

  var progressText =
    document.createElement("div");

  progressText.className =
    "public-progress-text";

  progressText.textContent =
    "Progress pengerjaan proyek";

  card.appendChild(title);
  card.appendChild(location);
  card.appendChild(dateRange);
  card.appendChild(meta);
  card.appendChild(progress);
  card.appendChild(progressText);

  return card;

}

function formatProjectDateRange(project) {

  return formatProjectDate(project.startDate) +
    " - " +
    formatProjectDate(project.targetDate);

}

function formatProjectDate(dateString) {

  if (!dateString) {
    return "-";
  }

  var date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}

function getProjectProgress(project) {

  var progress =
    Number(project.progress);

  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, progress)
  );

}

function getStatusBadgeClass(status) {

  if (status === "Perencanaan") {
    return "badge-warning";
  }

  if (status === "Pelaksanaan" || status === "Selesai") {
    return "badge-success";
  }

  if (status === "Pengawasan") {
    return "badge-danger";
  }

  return "";

}

function getFeedbackBadgeClass(status) {

  if (status === "Menunggu Review") {
    return "badge-warning";
  }

  if (
    status === "Diproses" ||
    status === "Disetujui" ||
    status === "Sudah Menjadi Proyek"
  ) {
    return "badge-success";
  }

  if (status === "Ditolak") {
    return "badge-danger";
  }

  return "";

}

function getNewestOrder(id) {

  var numericId =
    Number(id);

  if (Number.isNaN(numericId)) {
    return 0;
  }

  return numericId;

}

function setupAspirationForm() {

  var form =
    document.getElementById("aspiration-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    showPublicConfirmModal();

  });

  var confirmCancel =
    document.getElementById("public-confirm-cancel");

  if (confirmCancel) {

    confirmCancel.addEventListener("click", function () {

      closePublicConfirmModal();

    });

  }

  var confirmSubmit =
    document.getElementById("public-confirm-submit");

  if (confirmSubmit) {

    confirmSubmit.addEventListener("click", function () {

      closePublicConfirmModal();
      submitAspirationForm();

    });

  }

  var modalOk =
    document.getElementById("public-modal-ok");

  if (modalOk) {

    modalOk.addEventListener("click", function () {

      closePublicSuccessModal();
      window.location.href =
        "index.html#aspirasi-terbaru";

    });

  }

}

function submitAspirationForm() {

  var photoInput =
    document.getElementById("feedback-photo");

  var photoFile =
    photoInput && photoInput.files.length
      ? photoInput.files[0]
      : null;

  if (photoFile) {

    var reader =
      new FileReader();

    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var maxSize = 400; // max size in px
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG format with 0.6 quality
        var compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6);
        saveAspiration(compressedDataUrl);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(photoFile);

    return;

  }

  saveAspiration("");

}

function saveAspiration(photo) {

  var form =
    document.getElementById("aspiration-form");

  var feedbacks =
    getFeedbacks();

  var newFeedback = {
    id: Date.now(),
    name: getInputValue("feedback-name"),
    category: getInputValue("feedback-category"),
    customCategory: "",
    title: getInputValue("feedback-title"),
    description: getInputValue("feedback-description"),
    location: getInputValue("feedback-location"),
    photo: photo,
    status: "Menunggu Review",
    note: "",
    rejectionReason: ""
  };

  feedbacks.push(newFeedback);

  try {
    saveFeedbacks(feedbacks);
  } catch (err) {
    console.warn("Storage quota exceeded. Saving aspiration without image.", err);
    // Remove the photo from the new feedback to fit within localStorage limits
    newFeedback.photo = "";
    try {
      saveFeedbacks(feedbacks);
    } catch (innerErr) {
      console.error("Critical: Failed to save aspiration even without image.", innerErr);
    }
  }

  addActivityLog({
    type: "feedback_created",
    text: "Aspirasi baru masuk: " + newFeedback.title,
    feedbackId: newFeedback.id
  });

  if (form) {
    form.reset();
  }

  showPublicSuccessModal();
  renderPublicStats();

}

function getInputValue(id) {

  var input =
    document.getElementById(id);

  return input
    ? input.value.trim()
    : "";

}

function showPublicSuccessModal() {

  var modal =
    document.getElementById("public-success-modal");

  if (modal) {
    modal.classList.add("active");
  }

}

function showPublicConfirmModal() {

  var modal =
    document.getElementById("public-confirm-modal");

  if (modal) {
    modal.classList.add("active");
  }

}

function closePublicConfirmModal() {

  var modal =
    document.getElementById("public-confirm-modal");

  if (modal) {
    modal.classList.remove("active");
  }

}

function closePublicSuccessModal() {

  var modal =
    document.getElementById("public-success-modal");

  if (modal) {
    modal.classList.remove("active");
  }

}
