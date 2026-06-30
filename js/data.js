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
      photo: "assets/images/projects/pedestrian-walkway.jpg",
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
      photo: "assets/images/projects/drainage-construction.jpg",
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
      name: "Pembangunan Jembatan",
      location: "Bandung Timur",
      description: "Pembangunan struktur jembatan penyeberangan untuk peningkatan keselamatan pengguna.",
      status: "Selesai",
      progress: 100,
      startDate: "2025-09-01",
      targetDate: "2026-01-30",
      photo: "assets/images/projects/bridge-construction.jpg",
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
    },
    {
      id: 4,
      name: "Jalan Kurang Penerangan",
      location: "Bandung Barat",
      description: "Pemasangan PJU baru di titik-titik jalan lingkungan yang kurang penerangan.",
      status: "Perencanaan",
      progress: 10,
      startDate: "2026-06-01",
      targetDate: "2026-09-30",
      photo: "assets/images/projects/street-lighting.jpg",
      timeline: [
        {
          phase: "Perencanaan",
          start: "2026-06-01",
          end: "2026-07-01"
        },
        {
          phase: "Pelaksanaan",
          start: "2026-07-02",
          end: "2026-09-01"
        },
        {
          phase: "Pengawasan",
          start: "2026-09-02",
          end: "2026-09-30"
        }
      ]
    },
    {
      id: 5,
      name: "Kemacetan Jalan Braga",
      location: "Bandung Tengah",
      description: "Manajemen rekayasa lalu lintas dan penataan parkir liar untuk mengurangi kemacetan di Braga.",
      status: "Pelaksanaan",
      progress: 40,
      startDate: "2026-03-10",
      targetDate: "2026-10-15",
      photo: "assets/images/projects/traffic-road.jpg",
      timeline: [
        {
          phase: "Perencanaan",
          start: "2026-03-10",
          end: "2026-04-10"
        },
        {
          phase: "Pelaksanaan",
          start: "2026-04-11",
          end: "2026-09-15"
        },
        {
          phase: "Pengawasan",
          start: "2026-09-16",
          end: "2026-10-15"
        }
      ]
    },
    {
      id: 6,
      name: "Normalisasi Sungai",
      location: "Bandung Selatan",
      description: "Pengerukan lumpur dan penataan bantaran sungai untuk meminimalisir luapan air saat musim hujan.",
      status: "Perencanaan",
      progress: 15,
      startDate: "2026-07-01",
      targetDate: "2026-12-15",
      photo: "assets/images/projects/river-improvement.jpg",
      timeline: [
        {
          phase: "Perencanaan",
          start: "2026-07-01",
          end: "2026-08-01"
        },
        {
          phase: "Pelaksanaan",
          start: "2026-08-02",
          end: "2026-11-15"
        },
        {
          phase: "Pengawasan",
          start: "2026-11-16",
          end: "2026-12-15"
        }
      ]
    },
    {
      id: 7,
      name: "Penataan Kawasan Kota",
      location: "Bandung Tengah",
      description: "Penataan ruang publik terpadu dan taman kota untuk meningkatkan kenyamanan warga.",
      status: "Pelaksanaan",
      progress: 60,
      startDate: "2026-02-15",
      targetDate: "2026-11-30",
      photo: "assets/images/projects/urban-public-space.jpg",
      timeline: [
        {
          phase: "Perencanaan",
          start: "2026-02-15",
          end: "2026-03-20"
        },
        {
          phase: "Pelaksanaan",
          start: "2026-03-21",
          end: "2026-10-20"
        },
        {
          phase: "Pengawasan",
          start: "2026-10-21",
          end: "2026-11-30"
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
      description: "Trotoar di kawasan Dago banyak yang rusak dan membahayakan pejalan kaki.",
      location: "Bandung Utara",
      photo: "assets/images/aspiration/trotoar-rusak.jpg",
      status: "Menunggu Review",
      note: "",
      rejectionReason: ""
    },
    {
      id: 2,
      category: "Drainase",
      customCategory: "",
      title: "Drainase Tersumbat Antapani",
      description: "Drainase tersumbat dan menyebabkan genangan saat hujan.",
      location: "Bandung Timur",
      photo: "assets/images/aspiration/saluran-mampet.jpg",
      status: "Diproses",
      note: "",
      rejectionReason: ""
    },
    {
      id: 3,
      category: "Jalan",
      customCategory: "",
      title: "Jalan Berlubang Pasteur",
      description: "Lubang jalan cukup dalam di dekat persimpangan Pasteur sangat membahayakan pengendara motor.",
      location: "Bandung Barat",
      photo: "assets/images/aspiration/jalan-berlubang.jpg",
      status: "Disetujui",
      note: "",
      rejectionReason: ""
    },
    {
      id: 4,
      category: "Penerangan",
      customCategory: "",
      title: "Lampu Jalan Mati Gegerkalong",
      description: "Sudah tiga malam lampu penerangan jalan utama Gegerkalong padam sepenuhnya.",
      location: "Bandung Utara",
      photo: "assets/images/aspiration/lampu-jalan-mati.jpg",
      status: "Menunggu Review",
      note: "",
      rejectionReason: ""
    },
    {
      id: 5,
      category: "Sampah",
      customCategory: "",
      title: "Sampah Liar Tegalega",
      description: "Penumpukan sampah liar di trotoar pinggir lapangan Tegalega mengganggu pejalan kaki dan bau menyengat.",
      location: "Bandung Tengah",
      photo: "assets/images/aspiration/sampah-liar.jpg",
      status: "Diproses",
      note: "",
      rejectionReason: ""
    },
    {
      id: 6,
      category: "Lainnya",
      customCategory: "",
      title: "Pohon Tumbang Dago",
      description: "Ada dahan pohon besar yang rentan tumbang di dekat halte Dago, mohon pemangkasan demi keamanan.",
      location: "Bandung Utara",
      photo: "assets/images/aspiration/pohon-tumbang.jpg",
      status: "Disetujui",
      note: "",
      rejectionReason: ""
    }
  ];
}

function initializeData() {
  var projectsStr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!projectsStr) {
    localStorage.setItem(
      STORAGE_KEYS.PROJECTS,
      JSON.stringify(createDefaultProjects())
    );
  } else {
    // Migrate: check if existing stored projects need photos or if new default projects need to be added
    try {
      var projects = JSON.parse(projectsStr);
      var defaults = createDefaultProjects();
      var updated = false;
      
      // Update photos for default projects if currently empty
      projects.forEach(function(p) {
        var def = defaults.find(function(d) { return d.id === p.id || d.name === p.name; });
        if (def && (!p.photo || p.photo === "")) {
          p.photo = def.photo;
          updated = true;
        }
      });

      // Also ensure that all 7 default projects are present in storage
      defaults.forEach(function(def) {
        var exists = projects.some(function(p) { return p.id === def.id || p.name === def.name; });
        if (!exists) {
          projects.push(def);
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      }
    } catch (e) {
      console.error("Migration of projects failed", e);
    }
  }

  var feedbacksStr = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
  if (!feedbacksStr) {
    localStorage.setItem(
      STORAGE_KEYS.FEEDBACKS,
      JSON.stringify([])
    );
  }
}

function isDefaultFeedbackModified(f) {
  var defaults = createDefaultFeedbacks();
  var def = defaults.find(function(d) { return d.id === f.id; });
  if (!def) return false;
  return f.status !== def.status || f.note !== def.note || f.rejectionReason !== def.rejectionReason;
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
  var storedFeedbacks = [];
  try {
    var storedStr = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    if (storedStr) {
      storedFeedbacks = JSON.parse(storedStr) || [];
    }
  } catch (e) {
    console.error("Failed to load feedbacks from local storage", e);
  }

  var defaultFeedbacks = createDefaultFeedbacks();
  var combined = [];

  // Merge default feedbacks
  defaultFeedbacks.forEach(function(def) {
    var storedMod = storedFeedbacks.find(function(stored) {
      return stored.id === def.id;
    });
    if (storedMod) {
      combined.push(storedMod);
    } else {
      combined.push(def);
    }
  });

  // Append user-submitted feedbacks (non-default IDs)
  var defaultIds = defaultFeedbacks.map(function(d) { return d.id; });
  storedFeedbacks.forEach(function(stored) {
    if (defaultIds.indexOf(stored.id) === -1) {
      combined.push(stored);
    }
  });

  return combined;
}

function saveFeedbacks(feedbacks) {
  // Only save user-submitted and modified default feedbacks to local storage
  var feedbacksToSave = feedbacks.filter(function(f) {
    var defaults = createDefaultFeedbacks();
    var isDefault = defaults.some(function(d) { return d.id === f.id; });
    if (isDefault) {
      return isDefaultFeedbackModified(f);
    }
    return true; // user-submitted
  });

  try {
    localStorage.setItem(
      STORAGE_KEYS.FEEDBACKS,
      JSON.stringify(feedbacksToSave)
    );
  } catch (err) {
    console.error("QuotaExceededError in saveFeedbacks: attempting to remove older images to fit feedbacks.", err);
    // Strip image strings from older feedbacks to reclaim space
    for (var i = 0; i < feedbacksToSave.length; i++) {
      if (feedbacksToSave[i].photo) {
        feedbacksToSave[i].photo = "";
        try {
          localStorage.setItem(
            STORAGE_KEYS.FEEDBACKS,
            JSON.stringify(feedbacksToSave)
          );
          console.log("Successfully saved feedbacks after removing image from feedback ID " + feedbacksToSave[i].id);
          return;
        } catch (innerErr) {
          // Keep loop going to strip other photos
        }
      }
    }
    // If it still fails, remove photo from the newly added feedback as well
    if (feedbacksToSave.length > 0) {
      feedbacksToSave[feedbacksToSave.length - 1].photo = "";
      try {
        localStorage.setItem(
          STORAGE_KEYS.FEEDBACKS,
          JSON.stringify(feedbacksToSave)
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
