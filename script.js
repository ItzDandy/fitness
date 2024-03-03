// Simulace dat a funkcionality
let activities = [];
let currentDate = new Date();
let weeklyGoal = 0;

document.addEventListener('DOMContentLoaded', function () {
    kalendaraktualizace();
    aktualizacevysledku();
    aktualizaceaktivit();
    filtrmoznosti();
});

function zmenitvikend(offset) {
  currentDate.setDate(currentDate.getDate() + offset * 7);
  kalendaraktualizace();
  aktualizacevysledku();
  aktualizaceaktivit();
  aktualizaceprograsu();
}

function kalendaraktualizace() {
  const calendarBody = document.getElementById('calendar-body');
  const currentWeekElement = document.getElementById('current-week');
  currentWeekElement.textContent = currentDate.toLocaleDateString();

  calendarBody.innerHTML = '';

  for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i - currentDate.getDay() + 1);

      const cell = document.createElement('td');
      cell.textContent = day.getDate();
      cell.dataset.date = day.toISOString().split('T')[0];

      if (day.getMonth() !== currentDate.getMonth()) {
          cell.classList.add('inactive');
      }

      calendarBody.appendChild(cell);
  }
}

function pridataktivitu(event) {
  const clickedElement = event.target;
  const selectedDate = clickedElement.dataset.date;

  if (selectedDate) {
      document.getElementById('activity-date').value = selectedDate;
  }
}

function nacitaniaktivit() {
  const activityType = document.getElementById('activity-type').value;
  const activityDuration = parseInt(document.getElementById('activity-duration').value, 10);
  const activityDistance = document.getElementById('activity-distance').value || 'N/A';
  const activityNotes = document.getElementById('activity-notes').value;
  const activityDate = document.getElementById('activity-date').value;

  const activity = {
      date: activityDate,
      type: activityType,
      duration: activityDuration,
      distance: activityDistance,
      notes: activityNotes
  };

  activities.push(activity);
  aktualizacevysledku();
  aktualizaceaktivit();
  filtrmoznosti();
  updateProgress();
  kontrolacile();
  
  // Resetovat formulář
  document.getElementById('activity-form').reset();
}

function aktualizacevysledku() {
  const totalActivitiesSpan = document.getElementById('total-activities');
  const totalTimeSpan = document.getElementById('total-time');

  totalActivitiesSpan.textContent = activities.length;
  const totalMinutes = activities.reduce((total, activity) => total + activity.duration, 0);
  totalTimeSpan.textContent = totalMinutes;
}

function aktualizaceaktivit() {
  const historyBody = document.getElementById('history-body');
  historyBody.innerHTML = '';

  activities.forEach(activity => {
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + activity.date + '</td>' +
                    '<td>' + activity.type + '</td>' +
                    '<td>' + activity.duration + '</td>' +
                    '<td>' + activity.distance + '</td>' +
                    '<td>' + activity.notes + '</td>';
    historyBody.appendChild(row);
});

}

function filtrmoznosti() {
  const filterTypeSelect = document.getElementById('filter-type');
  const types = new Set(activities.map(activity => activity.type));

  filterTypeSelect.innerHTML = '<option value="">Všechny typy</option>';

  types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      filterTypeSelect.appendChild(option);
  });
}

function filtrhistorie() {
  const filterType = document.getElementById('filter-type').value;
  const filterDate = document.getElementById('filter-date').value;

  const filteredActivities = activities.filter(activity => {
      return (!filterType || activity.type === filterType) &&
             (!filterDate || activity.date === filterDate);
  });

  const historyBody = document.getElementById('history-body');
  historyBody.innerHTML = '';

  filteredActivities.forEach(activity => {
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + activity.date + '</td>' +
                    '<td>' + activity.type + '</td>' +
                    '<td>' + activity.duration + '</td>' +
                    '<td>' + activity.distance + '</td>' +
                    '<td>' + activity.notes + '</td>';
    historyBody.appendChild(row);
});
}

function aktualizaceprograsu() {
  weeklyGoal = parseInt(document.getElementById('weekly-goal').value, 10) || 0;
  const progressSpan = document.getElementById('progress');
  const goalSpan = document.getElementById('goal');

  const totalMinutes = activities.reduce((total, activity) => total + activity.duration, 0);
  progressSpan.textContent = totalMinutes;
  goalSpan.textContent = weeklyGoal;
}

function kontrolacile() {
  const progressSpan = document.getElementById('progress');
  const goalSpan = document.getElementById('goal');
  const totalMinutes = activities.reduce((total, activity) => total + activity.duration, 0);

  if (totalMinutes >= weeklyGoal) {
      alert(`Gratulujeme! Dosáhli jste svého týdenního cíle ${weeklyGoal} minut cvičení.`);
  }
}
