document.addEventListener("DOMContentLoaded", function () {

  renderProjectDetail();

});

var PROJECT_REGIONS = [
  "Bandung Utara",
  "Bandung Timur",
  "Bandung Barat",
  "Bandung Selatan",
  "Bandung Tengah"
];

function renderProjectDetail() {

  var container =
    document.getElementById(
      "project-detail-container"
    );

  if (!container) {
    return;
  }

  var params =
    new URLSearchParams(
      window.location.search
    );

  var projectId =
    Number(
      params.get("id")
    );

  var projects =
    getProjects();

  var project =
    projects.find(function(item){

      return item.id === projectId;

    });

  if (!project) {

    container.innerHTML =
      "<h2>Proyek tidak ditemukan</h2>";

    return;

  }

  var projectRegion =
    getProjectRegion(project);

  container.innerHTML =

  '<div class="project-detail-card">' +

    '<div class="project-detail-header">' +

      '<h1>' +
      project.name +
      '</h1>' +

      '<p>' +
      formatProjectLocation(project) +
      '</p>' +

    '</div>' +

    createProjectPhotoPreview(project) +

    '<div class="project-detail-grid">' +

      '<div class="input-group">' +
        '<label>Nama Proyek</label>' +
        '<input id="project-name" value="' +
        project.name +
        '">' +
      '</div>' +

      '<div class="input-group">' +
        '<label>Region</label>' +
        '<select id="project-region">' +
          createRegionOptions(projectRegion) +
        '</select>' +
      '</div>' +

      '<div class="input-group">' +
        '<label>Lokasi Spesifik</label>' +
        '<input id="project-location" value="' +
        (project.location || "") +
        '">' +
      '</div>' +

      '<div class="input-group">' +
        '<label>Status</label>' +

        '<select id="project-status">' +

          '<option ' +
          (project.status === "Perencanaan" ? "selected" : "") +
          '>Perencanaan</option>' +

          '<option ' +
          (project.status === "Pelaksanaan" ? "selected" : "") +
          '>Pelaksanaan</option>' +

          '<option ' +
          (project.status === "Pengawasan" ? "selected" : "") +
          '>Pengawasan</option>' +

          '<option ' +
          (project.status === "Selesai" ? "selected" : "") +
          '>Selesai</option>' +

        '</select>' +

      '</div>' +

      '<div class="input-group">' +
        '<label>Tanggal Mulai</label>' +
        '<input type="date" id="project-start" value="' +
        project.startDate +
        '">' +
      '</div>' +

      '<div class="input-group">' +
        '<label>Target Selesai</label>' +
        '<input type="date" id="project-target" value="' +
        project.targetDate +
        '">' +
      '</div>' +

      '<div class="input-group">' +
        '<label>Upload Foto</label>' +
        '<input type="file" id="project-photo" accept="image/*">' +
      '</div>' +

    '</div>' +

    '<div class="input-group">' +

      '<label>Deskripsi Proyek</label>' +

      '<textarea class="project-description" id="project-description">' +

      project.description +

      '</textarea>' +

    '</div>' +

    '<div class="save-section">' +

      '<button class="button button-primary" id="save-project-btn">' +

      'Simpan Perubahan' +

      '</button>' +

      '<button id="delete-project-btn" class="button button-danger">' +
      'Hapus Proyek' +
      '</button>'

    '</div>' +

  '</div>';

  setupSaveButton(projectId);
  setupPhotoPreview();
  setupDeleteButton(projectId);

}

function setupSaveButton(projectId){

  var button =
    document.getElementById(
      "save-project-btn"
    );

  button.addEventListener(
    "click",
    function(){

      var projects =
        getProjects();

      var project =
        projects.find(function(item){

          return item.id === projectId;

        });

      if(!project){
        return;
      }

      var previousProject =
        Object.assign(
          {},
          project
        );

      project.name =
        document.getElementById(
          "project-name"
        ).value;

      project.region =
        document.getElementById(
          "project-region"
        ).value;

      project.location =
        document.getElementById(
          "project-location"
        ).value;

      project.status =
        document.getElementById(
          "project-status"
        ).value;

      project.startDate =
        document.getElementById(
          "project-start"
        ).value;

      project.targetDate =
        document.getElementById(
          "project-target"
        ).value;

      project.description =
        document.getElementById(
          "project-description"
        ).value;

      var photoPreview =
        document.getElementById(
          "project-photo-preview"
        );

      if(
        photoPreview &&
        photoPreview.dataset.photo !== undefined
      ){
        project.photo =
          photoPreview.dataset.photo;
      }

      var startDate =
        new Date(
          project.startDate
        );

      var targetDate =
        new Date(
          project.targetDate
        );

      if(targetDate < startDate){

      showMessage(
        "Tanggal Tidak Valid",
        "Target selesai tidak boleh lebih awal dari tanggal mulai."
      );

      return;

      }

      saveProjects(
      projects
      );

      logProjectDetailChanges(
        previousProject,
        project
      );

      showConfirm(
      "Berhasil",
      "Perubahan berhasil disimpan.",
      function(){

        window.location.href =
          "workspace.html";

        }
        );

    }
  );

}      

function logProjectDetailChanges(previousProject, project){

  if(previousProject.status !== project.status){
    addActivityLog({
      type: "project_status_changed",
      text: "Status proyek berubah: " + project.name + " menjadi " + project.status,
      projectId: project.id
    });
  }

  if(previousProject.photo !== project.photo){
    addActivityLog({
      type: "project_photo_updated",
      text: "Foto proyek diperbarui: " + project.name,
      projectId: project.id
    });
  }

  if(
    previousProject.name !== project.name ||
    previousProject.region !== project.region ||
    previousProject.location !== project.location ||
    previousProject.startDate !== project.startDate ||
    previousProject.targetDate !== project.targetDate ||
    previousProject.description !== project.description
  ){
    addActivityLog({
      type: "project_updated",
      text: "Detail proyek diperbarui: " + project.name,
      projectId: project.id
    });
  }

}

function createProjectPhotoPreview(project){

  if(project.photo){

    return (
      '<div class="project-photo-card">' +
        '<img ' +
          'class="project-photo-preview" ' +
          'id="project-photo-preview" ' +
          'src="' +
          project.photo +
          '" ' +
          'data-photo="' +
          project.photo +
        '">' +
      '</div>'
    );

  }

  return (
    '<div class="project-photo-card">' +
      '<div ' +
        'class="project-photo-placeholder" ' +
        'id="project-photo-preview" ' +
        'data-photo=""' +
      '>' +
        'Belum ada foto proyek' +
      '</div>' +
    '</div>'
  );

}

function setupPhotoPreview(){

  var input =
    document.getElementById(
      "project-photo"
    );

  if(!input){
    return;
  }

  input.addEventListener(
    "change",
    function(){

      if(
        !input.files ||
        !input.files.length
      ){
        return;
      }

      var reader =
        new FileReader();

      reader.onload = function(){

        updateProjectPhotoPreview(
          reader.result
        );

      };

      reader.readAsDataURL(
        input.files[0]
      );

    }
  );

}

function updateProjectPhotoPreview(photo){

  var currentPreview =
    document.getElementById(
      "project-photo-preview"
    );

  if(!currentPreview){
    return;
  }

  var image =
    document.createElement(
      "img"
    );

  image.className =
    "project-photo-preview";

  image.id =
    "project-photo-preview";

  image.src =
    photo;

  image.dataset.photo =
    photo;

  currentPreview.parentNode.replaceChild(
    image,
    currentPreview
  );

}

function createRegionOptions(selectedRegion){

  var options =
    '<option value="">Pilih Region</option>';

  PROJECT_REGIONS.forEach(function(region){

    options +=
      '<option value="' +
      region +
      '" ' +
      (selectedRegion === region ? "selected" : "") +
      '>' +
      region +
      '</option>';

  });

  return options;

}

function getProjectRegion(project){

  if(project.region){
    return project.region;
  }

  if(
    PROJECT_REGIONS.indexOf(
      project.location
    ) !== -1
  ){
    return project.location;
  }

  return "";

}

function formatProjectLocation(project){

  var region =
    getProjectRegion(project);

  if(region && project.location){
    if(region === project.location){
      return region;
    }

    return region + " - " + project.location;
  }

  return project.location || region || "";

}

function setupDeleteButton(projectId){

  var deleteButton =
    document.getElementById(
      "delete-project-btn"
    );

  if(!deleteButton){
    return;
  }

  deleteButton.addEventListener(
    "click",
    function(){

      showConfirm(
        "Hapus Proyek",
        "Apakah Anda yakin ingin menghapus proyek ini?",
        function(){

          var projects =
            getProjects();

          var deletedProject =
            projects.find(function(project){

              return project.id === projectId;

            });

          projects =
            projects.filter(
              function(project){

                return project.id !== projectId;

              }
            );

          saveProjects(
            projects
          );

          if(deletedProject){
            addActivityLog({
              type: "project_deleted",
              text: "Proyek dihapus: " + deletedProject.name,
              projectId: deletedProject.id
            });
          }

          showMessage(
            "Berhasil",
            "Proyek berhasil dihapus.",
            function(){

              window.location.href =
                "workspace.html";

            }
          );

        }
      );

    }
  );

}
