document.addEventListener("DOMContentLoaded", function () {

  renderProgress();

});

function renderProgress() {

  var container =
    document.getElementById(
      "progress-container"
    );

  if (!container) {
    return;
  }

  var projects =
    getProjects();

  container.innerHTML = "";

  projects.forEach(function(project){

    container.innerHTML +=
      createProgressCard(project);

  });

  bindMilestones();

}

function createProgressCard(project){

  var activeStep = 1;

  if(project.status === "Perencanaan"){
    activeStep = 1;
  }

  if(project.status === "Pelaksanaan"){
  activeStep = 2;
  }

  if(project.status === "Pengawasan"){
    activeStep = 3;
  }

  if(project.status === "Selesai"){
    activeStep = 4;
  }

  return `

  <div class="milestone-card">

    <div class="milestone-header">

      <h3>${project.name}</h3>

      <span class="milestone-location">
        ${project.location}
      </span>

    </div>

    <div
      class="milestone-wrapper"
      data-id="${project.id}"
    >

      <div
        class="milestone-node ${activeStep >= 1 ? "active" : ""}"
        data-step="1"
      >
        <span>20%</span>
      </div>

      <div class="milestone-line"></div>

      <div
        class="milestone-node ${activeStep >= 2 ? "active" : ""}"
        data-step="2"
      >
        <span>45%</span>
      </div>

      <div class="milestone-line"></div>

      <div
        class="milestone-node ${activeStep >= 3 ? "active" : ""}"
        data-step="3"
      >
        <span>75%</span>
      </div>

      <div class="milestone-line"></div>

      <div
        class="milestone-node ${activeStep >= 4 ? "active" : ""}"
        data-step="4"
      >
        <span>100%</span>
      </div>

    </div>

    <div class="milestone-labels">

      <span>Perencanaan</span>
      <span>Pelaksanaan</span>
      <span>Pengawasan</span>
      <span>Selesai</span>

    </div>

  </div>

  `;

}

function bindMilestones(){

  var wrappers =
    document.querySelectorAll(
      ".milestone-wrapper"
    );

  wrappers.forEach(function(wrapper){

    var projectId =
      Number(
        wrapper.dataset.id
      );

    var nodes =
      wrapper.querySelectorAll(
        ".milestone-node"
      );

    nodes.forEach(function(node){

      node.addEventListener(
        "click",
        function(){

          var step =
            Number(
              node.dataset.step
            );

          updateProjectProgress(
            projectId,
            step
          );

        }
      );

    });

  });

}

function updateProjectProgress(
  projectId,
  step
){

  var projects =
    getProjects();

  var project =
    projects.find(function(item){

      return item.id === projectId;

    });

  if(!project){
    return;
  }

  var oldStatus =
    project.status;

  var newStatus = "";
  var newProgress = 0;

  if(step === 1){
    newStatus = "Perencanaan";
    newProgress = 20;
  }

  if(step === 2){
    newStatus = "Pelaksanaan";
    newProgress = 45;
  }

  if(step === 3){
    newStatus = "Pengawasan";
    newProgress = 75;
  }

  if(step === 4){
    newStatus = "Selesai";
    newProgress = 100;
  }

  showConfirm(
    "Konfirmasi Perubahan",
    "Yakin mengubah status proyek menjadi " +
    newStatus +
    "?",
    function(){

      project.status =
      newStatus;

      project.progress =
        newProgress;

      saveProjects(
        projects
      );

      if(oldStatus !== newStatus){
        addActivityLog({
          type: "project_status_changed",
          text: "Status proyek berubah: " + project.name + " menjadi " + newStatus,
          projectId: project.id
        });
      }

      renderProgress();

      showMessage(
      "Berhasil",
      "Status proyek berhasil diperbarui."
      );

      }
      );

      return;

}
