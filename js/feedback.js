document.addEventListener("DOMContentLoaded", function () {

  renderFeedbacks();

});

function renderFeedbacks() {

  var container =
    document.getElementById(
      "feedback-container"
    );

  if (!container) {
    return;
  }

  var feedbacks =
    getFeedbacks();

  updateStatistics(feedbacks);

  container.innerHTML = "";

  feedbacks.forEach(function(item){

    var badgeClass = "badge-review";

    if(item.status === "Diproses"){
      badgeClass = "badge-process";
    }

    if(item.status === "Disetujui"){
      badgeClass = "badge-approved";
    }

    if(item.status === "Ditolak"){
      badgeClass = "badge-rejected";
    }

    if(item.status === "Sudah Menjadi Proyek"){
      badgeClass = "badge-project";
    }

    var projectButton = "";

    if(item.status === "Disetujui"){

      projectButton = `
        <button
          class="feedback-btn feedback-btn-primary"
          onclick="createProjectFromFeedback(${item.id})"
        >
          Buat Proyek
        </button>
      `;

    }

    var projectInfo = "";

    if(
      item.status ===
      "Sudah Menjadi Proyek"
    ){

      projectInfo = `
        <div class="project-created">
          ✓ Aspirasi ini telah dibuat menjadi proyek
        </div>
      `;

    }

    container.innerHTML += `

      <div class="feedback-card">

        <div class="feedback-top">

          <div>

            <div class="feedback-title">
              ${item.title}
            </div>

            <div class="feedback-location">
              📍 ${item.location}
            </div>

          </div>

          <div class="feedback-status-badge ${badgeClass}">
            ${item.status}
          </div>

        </div>

        <div class="feedback-photo">
          <img src="${item.photo || 'assets/images/default-placeholder.jpg'}" width="100%" onerror="this.onerror=null; this.src='assets/images/default-placeholder.jpg';">
        </div>

        <p>
          <strong>Kategori:</strong>
          ${item.category}
        </p>

        <p>
          ${item.description}
        </p>

        <div class="feedback-status">

          <label>Status</label>

          <select
            onchange="handleFeedbackStatusChange(${item.id}, this)"
          >

            <option ${item.status === "Menunggu Review" ? "selected" : ""}>
              Menunggu Review
            </option>

            <option ${item.status === "Diproses" ? "selected" : ""}>
              Diproses
            </option>

            <option ${item.status === "Disetujui" ? "selected" : ""}>
              Disetujui
            </option>

            <option ${item.status === "Ditolak" ? "selected" : ""}>
              Ditolak
            </option>

            <option ${item.status === "Sudah Menjadi Proyek" ? "selected" : ""}>
              Sudah Menjadi Proyek
            </option>

          </select>

        </div>

        <div
          class="feedback-note rejection-field"
          id="rejection-field-${item.id}"
          style="display:none;"
        >

        <label>
          Alasan Penolakan
        </label>

        <textarea
          id="rejection-reason-${item.id}"
          placeholder="Tuliskan alasan penolakan..."
          required
        ></textarea>

        <div class="feedback-actions">
          <button
            class="feedback-btn feedback-btn-primary"
            onclick="saveFeedbackRejection(${item.id})"
          >
            Simpan Penolakan
          </button>

          <button
            class="feedback-btn feedback-btn-secondary"
            onclick="cancelFeedbackRejection(${item.id})"
          >
            Batal
          </button>
        </div>
          </div>

        <div class="feedback-actions">

          ${projectButton}

        </div>

        ${projectInfo}

      </div>

    `;

  });

}

function handleFeedbackStatusChange(id, select){

  if(select.value === "Ditolak"){
    showRejectionField(id);
    return;
  }

  updateFeedbackStatus(
    id,
    select.value
  );

}

function showRejectionField(id){

  var field =
    document.getElementById(
      "rejection-field-" + id
    );

  if(field){
    field.style.display =
      "block";
  }

}

function cancelFeedbackRejection(id){

  var field =
    document.getElementById(
      "rejection-field-" + id
    );

  if(field){
    field.style.display =
      "none";
  }

  renderFeedbacks();

}

function saveFeedbackRejection(id){

  var reasonInput =
    document.getElementById(
      "rejection-reason-" + id
    );

  var reason =
    reasonInput
      ? reasonInput.value.trim()
      : "";

  if(!reason){
    showMessage(
      "Validasi Gagal",
      "Alasan penolakan wajib diisi."
    );
    return;
  }

  var feedbacks =
    getFeedbacks();

  var feedback =
    feedbacks.find(function(item){
      return item.id === id;
    });

  if(!feedback){
    return;
  }

  showConfirm(
    "Tolak Aspirasi",
    "Aspirasi ini akan ditolak dan tidak lagi tampil pada halaman publik.",
    function(){

      var rejectedFeedback =
        Object.assign(
          {},
          feedback,
          {
            status: "Ditolak",
            note: reason,
            rejectionReason: reason
          }
        );

      feedbacks =
        feedbacks.filter(function(item){
          return item.id !== id;
        });

      saveFeedbacks(
        feedbacks
      );

      addActivityLog({
        type: "feedback_rejected",
        text: "Aspirasi ditolak: " + rejectedFeedback.title,
        feedback: rejectedFeedback
      });

      renderFeedbacks();

      showMessage(
        "Berhasil",
        "Aspirasi berhasil ditolak."
      );

    }
  );

}

function updateStatistics(feedbacks){

  document.getElementById(
    "total-feedbacks"
  ).textContent =
    feedbacks.length;

  document.getElementById(
    "review-feedbacks"
  ).textContent =
    feedbacks.filter(
      x => x.status === "Menunggu Review"
    ).length;

  document.getElementById(
    "rejected-feedbacks"
  ).textContent =
    feedbacks.filter(
      x => x.status === "Ditolak"
    ).length;

  document.getElementById(
    "project-feedbacks"
  ).textContent =
    feedbacks.filter(
      x => x.status === "Sudah Menjadi Proyek"
    ).length;

}

function updateFeedbackStatus(id, status){

  var feedbacks =
    getFeedbacks();

  var feedback =
    feedbacks.find(function(item){
      return item.id === id;
    });

  if(!feedback){
    return;
  }

  var oldStatus =
    feedback.status;

  feedback.status = status;

  if(status !== "Ditolak"){
  feedback.note = "";
  }

  saveFeedbacks(
    feedbacks
  );

  if(
    oldStatus !== status &&
    status === "Disetujui"
  ){
    addActivityLog({
      type: "feedback_accepted",
      text: "Aspirasi diterima: " + feedback.title,
      feedbackId: feedback.id
    });
  }

  renderFeedbacks();

}

function updateFeedbackNote(id, note){

  var feedbacks =
    getFeedbacks();

  var feedback =
    feedbacks.find(function(item){
      return item.id === id;
    });

  if(!feedback){
    return;
  }

  feedback.note =
    note;

  saveFeedbacks(
    feedbacks
  );

}

function createProjectFromFeedback(id){

  var feedbacks =
    getFeedbacks();

  var feedback =
    feedbacks.find(function(item){
      return item.id === id;
    });

  if(!feedback){
    return;
  }

  showConfirm(
  "Buat Proyek",
  "Aspirasi ini akan dibuat menjadi proyek. Detail proyek dapat dilengkapi melalui halaman Detail Proyek setelah proyek dibuat.",
  function(){

    var projects =
    getProjects();

  projects.push({

    id:
      Date.now(),

    name:
      feedback.title,

    location:
      feedback.location,

    description:
      feedback.description,

    status:
      "Perencanaan",

    progress:
      20,

    startDate:
      "2026-07-01",

    targetDate:
      "2026-12-31",

    timeline: [

      {
        phase:"Perencanaan",
        start:"2026-07-01",
        end:"2026-08-01"
      },

      {
        phase:"Pelaksanaan",
        start:"2026-08-02",
        end:"2026-11-01"
      },

      {
        phase:"Pengawasan",
        start:"2026-11-02",
        end:"2026-12-31"
      }

    ]

    });

    saveProjects(
      projects
    );

    feedback.status =
      "Sudah Menjadi Proyek";

    saveFeedbacks(
      feedbacks
    );

    addActivityLog({
      type: "feedback_to_project",
      text: "Aspirasi dijadikan proyek: " + feedback.title,
      feedbackId: feedback.id
    });

    renderFeedbacks();

    showMessage(
    "Berhasil",
      "Proyek berhasil dibuat."
    );

    }
    );

}
