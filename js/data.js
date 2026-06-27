const STORAGE_KEYS = {
  PROJECTS: "sitara_projects",
  FEEDBACKS: "sitara_feedbacks",
  ACTIVITY_LOGS: "sitara_activity_logs"
};

function createDefaultProjects() {
  return [
    {
      id: 1,
      name: "Revitalisasi Trotoar Dago",
      location: "Bandung Utara",
      description: "Revitalisasi trotoar untuk meningkatkan kenyamanan pejalan kaki di kawasan Dago.",
      status: "Pelaksanaan",
      progress: 50,
      startDate: "2026-01-01",
      targetDate: "2026-12-31",
      photo: "",

      timeline: [
        {
          phase: "Perencanaan",
          start: "2026-01-01",
          end: "2026-02-01"
        },
        {
          phase: "Pelaksanaan",
          start: "2026-02-02",
          end: "2026-08-01"
        },
        {
          phase: "Pengawasan",
          start: "2026-08-02",
          end: "2026-11-01"
        }
      ]
    },

    {
      id: 2,
      name: "Drainase Antapani",
      location: "Bandung Timur",
      description: "Perbaikan dan pelebaran saluran drainase untuk mengurangi genangan.",
      status: "Pengawasan",
      progress: 83,
      startDate: "2026-01-15",
      targetDate: "2026-10-30",
      photo: "",

      timeline: [
        {
          phase: "Perencanaan",
          start: "2026-01-15",
          end: "2026-02-15"
        },
        {
          phase: "Pelaksanaan",
          start: "2026-02-16",
          end: "2026-08-30"
        },
        {
          phase: "Pengawasan",
          start: "2026-09-01",
          end: "2026-10-30"
        }
      ]
    },

    {
      id: 3,
      name: "Pemeliharaan Jembatan Cibiru",
      location: "Bandung Timur",
      description: "Pemeliharaan struktur jembatan dan peningkatan keselamatan pengguna.",
      status: "Selesai",
      progress: 100,
      startDate: "2025-09-01",
      targetDate: "2026-01-30",
      photo: "",

      timeline: [
        {
          phase: "Perencanaan",
          start: "2025-09-01",
          end: "2025-10-01"
        },
        {
          phase: "Pelaksanaan",
          start: "2025-10-02",
          end: "2025-12-15"
        },
        {
          phase: "Pengawasan",
          start: "2025-12-16",
          end: "2026-01-15"
        }
      ]
    }
  ];
}

function createDefaultFeedbacks() {
  return [

    {
      id: 1,
      category: "Trotoar",
      customCategory: "",

      title: "Trotoar Rusak Dago",

      description:
        "Trotoar di kawasan Dago banyak yang rusak dan membahayakan pejalan kaki.",

      location:
        "Bandung Utara",

      photo:
        "",

      status:
        "Menunggu Review",

      note:
        "",
      rejectionReason: ""
    },

    {
      id: 2,

      category:
        "Drainase",

      customCategory:
        "",

      title:
        "Drainase Tersumbat Antapani",

      description:
        "Drainase tersumbat dan menyebabkan genangan saat hujan.",

      location:
        "Bandung Timur",

      photo:
        "",

      status:
        "Diproses",

      note:
        "",
      rejectionReason: ""
    }

  ];
}

function initializeData() {

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {

    localStorage.setItem(
      STORAGE_KEYS.PROJECTS,
      JSON.stringify(createDefaultProjects())
    );

  }

  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACKS)) {

    localStorage.setItem(
      STORAGE_KEYS.FEEDBACKS,
      JSON.stringify(createDefaultFeedbacks())
    );

  }

}

function getProjects() {

  return JSON.parse(
    localStorage.getItem(STORAGE_KEYS.PROJECTS)
  ) || [];

}

function saveProjects(projects) {

  localStorage.setItem(
    STORAGE_KEYS.PROJECTS,
    JSON.stringify(projects)
  );

}

function getFeedbacks() {

  return JSON.parse(
    localStorage.getItem(STORAGE_KEYS.FEEDBACKS)
  ) || [];

}

function saveFeedbacks(feedbacks) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.FEEDBACKS,
      JSON.stringify(feedbacks)
    );
  } catch (err) {
    console.error("QuotaExceededError in saveFeedbacks: attempting to remove older images to fit feedbacks.", err);
    // Strip image strings from older feedbacks to reclaim space
    for (var i = 0; i < feedbacks.length; i++) {
      if (feedbacks[i].photo) {
        feedbacks[i].photo = "";
        try {
          localStorage.setItem(
            STORAGE_KEYS.FEEDBACKS,
            JSON.stringify(feedbacks)
          );
          console.log("Successfully saved feedbacks after removing image from feedback ID " + feedbacks[i].id);
          return;
        } catch (innerErr) {
          // Keep loop going to strip other photos
        }
      }
    }
    // If it still fails, remove photo from the newly added feedback as well
    if (feedbacks.length > 0) {
      feedbacks[feedbacks.length - 1].photo = "";
      try {
        localStorage.setItem(
          STORAGE_KEYS.FEEDBACKS,
          JSON.stringify(feedbacks)
        );
      } catch (lastErr) {
        console.error("Fatal QuotaExceededError: unable to save feedbacks even after stripping all photos.", lastErr);
      }
    }
  }
}

function getActivityLogs() {

  return JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)
  ) || [];

}

function saveActivityLogs(logs) {

  localStorage.setItem(
    STORAGE_KEYS.ACTIVITY_LOGS,
    JSON.stringify(logs)
  );

}

function addActivityLog(log) {

  var logs =
    getActivityLogs();

  var now =
    Date.now();

  var lastLog =
    logs[logs.length - 1];

  var logId =
    lastLog && Number(lastLog.id) >= now
      ? Number(lastLog.id) + 1
      : now;

  logs.push(
    Object.assign(
      {
        id: logId,
        createdAt: new Date().toISOString()
      },
      log
    )
  );

  saveActivityLogs(logs);

}

initializeData();

document.addEventListener("DOMContentLoaded", function () {

  setupLogoutConfirmation();

});

function setupLogoutConfirmation() {

  var logoutLink =
    Array.prototype.find.call(
      document.querySelectorAll('.sidebar-link[href="login.html"]'),
      function (link) {

        return link.textContent.trim() === "Logout";

      }
    );

  if (!logoutLink) {
    return;
  }

  createLogoutModal();

  logoutLink.addEventListener("click", function (event) {

    event.preventDefault();
    showLogoutModal(logoutLink.getAttribute("href"));

  });

}

function createLogoutModal() {

  if (document.getElementById("logout-modal")) {
    return;
  }

  var overlay =
    document.createElement("div");

  overlay.className =
    "modal-overlay";

  overlay.id =
    "logout-modal";

  overlay.innerHTML =
    '<div class="modal small-modal">' +
    '<div class="modal-header">' +
    '<h3>Konfirmasi Logout</h3>' +
    '</div>' +
    '<div class="modal-body">' +
    '<p>Apakah Anda yakin ingin keluar dari workspace SITARA?</p>' +
    '</div>' +
    '<div class="modal-footer">' +
    '<button class="button button-secondary" id="logout-cancel">Batal</button>' +
    '<button class="button button-primary" id="logout-confirm">Logout</button>' +
    '</div>' +
    '</div>';

  document.body.appendChild(
    overlay
  );

  document
    .getElementById("logout-cancel")
    .addEventListener("click", function () {

      closeLogoutModal();

    });

}

function showLogoutModal(targetUrl) {

  var modal =
    document.getElementById("logout-modal");

  var confirmButton =
    document.getElementById("logout-confirm");

  if (!modal || !confirmButton) {
    window.location.href =
      targetUrl;
    return;
  }

  confirmButton.onclick = function () {

    window.location.href =
      targetUrl;

  };

  modal.classList.add(
    "active"
  );

}

function closeLogoutModal() {

  var modal =
    document.getElementById("logout-modal");

  if (modal) {
    modal.classList.remove(
      "active"
    );
  }

}
