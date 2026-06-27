document.addEventListener("DOMContentLoaded", function () {

  renderWorkspace();
  renderDashboardStats();
  setupDashboardAutoRefresh();

});

window.addEventListener("storage", function () {

  renderDashboardStats();

});

function renderDashboardStats() {

  var totalProjectsElement =
    document.getElementById("total-projects");

  var activeProjectsElement =
    document.getElementById("active-projects");

  var completedProjectsElement =
    document.getElementById("completed-projects");

  var feedbackCountElement =
    document.getElementById("feedback-count");

  if (
    !totalProjectsElement ||
    !activeProjectsElement ||
    !completedProjectsElement ||
    !feedbackCountElement
  ) {
    return;
  }

  var projects =
    getProjects();

  var feedbacks =
    getFeedbacks();

  var runningProjects =
    projects.filter(function (project) {

      return (
        project.status === "Perencanaan" ||
        project.status === "Pelaksanaan" ||
        project.status === "Pengawasan"
      );

    });

  var completedProjects =
    projects.filter(function (project) {

      return project.status === "Selesai";

    });

  totalProjectsElement.textContent =
    projects.length;

  activeProjectsElement.textContent =
    runningProjects.length;

  completedProjectsElement.textContent =
    completedProjects.length;

  feedbackCountElement.textContent =
    feedbacks.length;

  var unreadFeedbacks = feedbacks.filter(function (item) {
    return item.status === "Menunggu Review";
  });
  var badgeElement = document.querySelector(".notification-badge");
  if (badgeElement) {
    if (unreadFeedbacks.length > 0) {
      badgeElement.style.display = "block";
    } else {
      badgeElement.style.display = "none";
    }
  }

  renderProjectStatusSummary(projects);
  renderRecentActivities(projects, feedbacks);

}

function setupDashboardAutoRefresh() {

  if (!document.getElementById("total-projects")) {
    return;
  }

  window.addEventListener("focus", function () {

    renderDashboardStats();

  });

  setInterval(function () {

    renderDashboardStats();

  }, 1000);

}

function renderProjectStatusSummary(projects) {

  var statusOverview =
    document.querySelector(".status-overview");

  if (!statusOverview) {
    return;
  }

  var statusCounts = {
    Perencanaan: 0,
    Pelaksanaan: 0,
    Pengawasan: 0,
    Selesai: 0
  };

  projects.forEach(function (project) {

    if (statusCounts[project.status] !== undefined) {
      statusCounts[project.status] += 1;
    }

  });

  var badges =
    statusOverview.querySelectorAll(".badge");

  if (badges.length < 4) {
    return;
  }

  badges[0].textContent =
    "Perencanaan: " + statusCounts.Perencanaan;

  badges[1].textContent =
    "Pelaksanaan: " + statusCounts.Pelaksanaan;

  badges[2].textContent =
    "Pengawasan: " + statusCounts.Pengawasan;

  badges[3].textContent =
    "Selesai: " + statusCounts.Selesai;

}

function renderRecentActivities(projects, feedbacks) {

  var container =
    document.getElementById("recent-activities");

  if (!container) {
    return;
  }

  var activities =
    [];

  if (typeof getActivityLogs === "function") {

    activities =
      getActivityLogs()
        .slice()
        .sort(function (a, b) {

          return getActivityOrder(b) - getActivityOrder(a);

        })
        .slice(0, 5);

  }

  container.innerHTML = "";

  if (!activities.length) {

    var emptyText =
      document.createElement("p");

    emptyText.textContent =
      "Belum ada aktivitas.";

    container.appendChild(emptyText);

    return;

  }

  activities.forEach(function (activity) {

    var item =
      document.createElement("div");

    item.className =
      "activity-item";

    var icon =
      document.createElement("div");

    icon.className =
      "activity-icon";

    icon.textContent =
      getActivityIcon(activity.type);

    var content =
      document.createElement("div");

    content.className =
      "activity-content";

    var description =
      document.createElement("p");

    description.textContent =
      activity.text;

    var time =
      document.createElement("span");

    time.className =
      "activity-time";

    time.textContent =
      formatActivityTime(activity);

    content.appendChild(description);
    content.appendChild(time);
    item.appendChild(icon);
    item.appendChild(content);
    container.appendChild(item);

  });

}

function getActivityOrder(activity) {

  var numericId =
    Number(activity.id);

  if (!Number.isNaN(numericId)) {
    return numericId;
  }

  return 0;

}

function getActivityIcon(type) {

  var icons = {
    feedback_created: "+",
    feedback_accepted: "✓",
    feedback_rejected: "!",
    feedback_to_project: "→",
    project_created: "+",
    project_deleted: "-",
    project_status_changed: "↻",
    project_updated: "✎",
    project_photo_updated: "□"
  };

  return icons[type] || "I";

}

function formatActivityTime(activity) {

  var timestamp =
    activity.createdAt
      ? new Date(activity.createdAt).getTime()
      : Number(activity.id);

  if (
    !timestamp ||
    Number.isNaN(timestamp)
  ) {
    return "-";
  }

  var diffMs =
    Date.now() - timestamp;

  var diffMinutes =
    Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Baru saja";
  }

  if (diffMinutes < 60) {
    return diffMinutes + " menit yang lalu";
  }

  var diffHours =
    Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return diffHours + " jam yang lalu";
  }

  return new Date(timestamp).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}

function renderWorkspace() {

  var planningBoard = document.getElementById("planning-board");
  var runningBoard = document.getElementById("running-board");
  var monitoringBoard = document.getElementById("monitoring-board");
  var completedBoard = document.getElementById("completed-board");

  if (
    !planningBoard ||
    !runningBoard ||
    !monitoringBoard ||
    !completedBoard
  ) {
    return;
  }

  var projects = getProjects();

  planningBoard.innerHTML = "";
  runningBoard.innerHTML = "";
  monitoringBoard.innerHTML = "";
  completedBoard.innerHTML = "";

  projects.forEach(function (project) {

    var card = createProjectCard(project);

    if (project.status === "Perencanaan") {
      planningBoard.appendChild(card);
    }

    else if (project.status === "Pelaksanaan") {
      runningBoard.appendChild(card);
    }

    else if (project.status === "Pengawasan") {
      monitoringBoard.appendChild(card);
    }

    else if (project.status === "Selesai") {
      completedBoard.appendChild(card);
    }

  });

}

document.addEventListener("DOMContentLoaded", function () {

  renderWorkspace();
  setupAddProjectModal();

});

function createProjectCard(project) {

  var card = document.createElement("div");
  card.className = "project-card";

  card.innerHTML =
    '<div class="project-title">📁 ' + project.name + '</div>' +

    '<div class="project-location">' +
    project.location +
    '</div>' +

    '<div class="project-date">' +
    formatDate(project.startDate) +
    '</div>' +

    '<div class="project-date">' +
    formatDate(project.targetDate) +
    '</div>' +

    '<div class="project-actions">' +

    '<button class="button button-secondary detail-btn">' +
    'Buka Detail' +
    '</button>' +

    '</div>';

  var detailButton =
    card.querySelector(".detail-btn");

  detailButton.addEventListener(
    "click",
    function () {

      window.location.href =
        "project-detail.html?id=" +
        project.id;

    }
  );

  return card;

}

function formatDate(dateString) {

  var date =
    new Date(dateString);

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}

function setupAddProjectModal(){

  var openBtn =
    document.getElementById(
      "add-project-btn"
    );

  var modal =
    document.getElementById(
      "project-modal"
    );

  if(!openBtn || !modal){
    return;
  }

  var closeBtn =
    document.getElementById(
      "close-project-modal"
    );

  var saveBtn =
    document.getElementById(
      "save-new-project"
    );

  openBtn.addEventListener(
    "click",
    function(){

      modal.classList.add(
        "active"
      );

    }
  );

  closeBtn.addEventListener(
    "click",
    function(){

      modal.classList.remove(
        "active"
      );

    }
  );

  saveBtn.addEventListener(
    "click",
    function(){

      var name =
        document.getElementById(
          "new-project-name"
        ).value;

      var location =
        document.getElementById(
          "new-project-location"
        ).value;

      var startDate =
        document.getElementById(
          "new-project-start"
        ).value;

      var targetDate =
        document.getElementById(
          "new-project-target"
        ).value;

      var description =
        document.getElementById(
          "new-project-description"
        ).value;

      if(
        !name ||
        !startDate ||
        !targetDate
      ){
        showMessage(
        "Validasi Gagal",
        "Lengkapi data proyek terlebih dahulu."
        );
        return;
      }

      var projects =
        getProjects();
      
      if(
      new Date(targetDate)
      <
      new Date(startDate)
      ){

      showMessage(
      "Validasi Gagal",
      "Target selesai tidak boleh lebih awal dari tanggal mulai."
      );

        return;

      }
      var newProject = {

        id: Date.now(),

        name: name,

        location: location,

        description: description,

        status: "Perencanaan",

        progress: 20,

        startDate: startDate,

        targetDate: targetDate,

        photo: ""

      };

      projects.push(
        newProject
      );

      saveProjects(
        projects
      );

      addActivityLog({
        type: "project_created",
        text: "Proyek ditambahkan: " + newProject.name,
        projectId: newProject.id
      });

      modal.classList.remove(
        "active"
      );

      showMessage(
      "Berhasil",
      "Proyek baru telah ditambahkan!",
      function(){

        location.reload();

      }
      );

    }
  );

}
