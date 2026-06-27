document.addEventListener("DOMContentLoaded", function () {

  renderTimeline();

});

function renderTimeline() {

  var container =
    document.getElementById(
      "timeline-container"
    );

  if (!container) {
    return;
  }

  var projects =
    getProjects();

  container.innerHTML = "";

  projects.forEach(function(project){

    container.innerHTML +=
      createTimelineCard(project);

  });

}

function createTimelineCard(project){

  var phases =
    generateProjectPhases(project);

  var rows = "";

  phases.forEach(function(item){

    rows += `

      <div class="gantt-row">

        <div class="gantt-phase">
          ${item.phase}
        </div>

        <div class="gantt-calendar">

          <div
            class="gantt-task"
            style="
              left:${getOffset(item.start)}%;
              width:${getWidth(item.start,item.end)}%;
            "
          >
          </div>

        </div>

      </div>

    `;

  });

  return `

    <div class="timeline-card">

      <div class="timeline-header">

        <h3>${project.name}</h3>

        <span>${project.location}</span>

      </div>

      <div class="gantt-months">

        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>Mei</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Agu</span>
        <span>Sep</span>
        <span>Okt</span>
        <span>Nov</span>
        <span>Des</span>

      </div>

      ${rows}

    </div>

  `;

}

function generateProjectPhases(project){

  var start =
    new Date(project.startDate);

  var end =
    new Date(project.targetDate);

  var totalDays =
    Math.max(
      1,
      Math.floor(
        (end - start) /
        (1000 * 60 * 60 * 24)
      )
    );

  var planningEnd =
    new Date(start);

  planningEnd.setDate(
    planningEnd.getDate() +
    Math.floor(totalDays * 0.2)
  );

  var implementationEnd =
    new Date(start);

  implementationEnd.setDate(
    implementationEnd.getDate() +
    Math.floor(totalDays * 0.8)
  );

  return [

    {
      phase:"Perencanaan",
      start:formatDate(start),
      end:formatDate(planningEnd)
    },

    {
      phase:"Pelaksanaan",
      start:formatDate(planningEnd),
      end:formatDate(implementationEnd)
    },

    {
      phase:"Pengawasan",
      start:formatDate(implementationEnd),
      end:formatDate(end)
    }

  ];

}

function getOffset(dateString){

  var date =
    new Date(dateString);

  var month =
    date.getMonth();

  var day =
    date.getDate() - 1;

  var monthWidth =
    100 / 12;

  return (
    month * monthWidth
  ) + (
    (day / 31) * monthWidth
  );

}

function getWidth(start,end){

  var startDate =
    new Date(start);

  var endDate =
    new Date(end);

  var diffDays =
    Math.max(
      1,
      Math.floor(
        (endDate - startDate) /
        (1000 * 60 * 60 * 24)
      )
    );

  return Math.max(
    (diffDays / 365) * 100,
    2
  );

}

function formatDate(date){

  return date
    .toISOString()
    .split("T")[0];

}