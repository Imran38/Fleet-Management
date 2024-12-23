const apiUrl = 'http://localhost:3000/api/trips';
let editingTripId = null;

let trips = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'tripId';
let sortOrder = 'asc';

// Toggle form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('tripForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Trip';
    document.getElementById('tripForm').reset();
    editingTripId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

// Handle form submission (Create or Update)
async function handleFormSubmit(event) {
  event.preventDefault();
   // Gather incidental charges
   const incidentalCharges = [];
   const rows = document.getElementById("incidentalChargesTable").querySelectorAll("tbody tr");
 
   rows.forEach((row) => {
     const chargeType = row.querySelector(".chargeType").value;
     const amount = parseFloat(row.querySelector(".chargeAmount").value);
     incidentalCharges.push({ chargeType, amount });
   });
  const data = {
    tripId: document.getElementById('tripId').value,
    vehicleId: document.getElementById('vehicleId').value,
    driverId: document.getElementById('driverId').value,
    routeId: document.getElementById('routeId').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
    distanceTraveled: parseFloat(document.getElementById('distanceTraveled').value),
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value,
    odometerStart: parseFloat(document.getElementById("odometerStart").value),
    odometerEnd: parseFloat(document.getElementById("odometerEnd").value),
    fuelOrChargeStart: parseFloat(document.getElementById("fuelOrChargeStart").value),
    fuelOrChargeEnd: parseFloat(document.getElementById("fuelOrChargeEnd").value),
    incidentalCharges,
  };

  try {
    if (editingTripId) {
      const response = await fetch(`${apiUrl}/${editingTripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Trip updated successfully!');
      else alert('Error updating trip.');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Trip created successfully!');
      else alert('Error creating trip.');
    }
    fetchTrips();
    toggleForm();
  } catch (error) {
    console.error(error);
  }
}

// Fetch trips from server
async function fetchTrips() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();

    trips = data.trips;
    renderTripsTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching trips:', error);
  }
}

// Render trips table
function renderTripsTable() {
  const tripList = document.getElementById('tripList');
  tripList.innerHTML = '';

  trips.forEach((trip) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${trip.tripId}</td>
      <td>${trip.vehicleId}</td>
      <td>${trip.driverId}</td>
      <td>${trip.routeId}</td>
      <td>${new Date(trip.startTime).toLocaleString()}</td>
      <td>${new Date(trip.endTime).toLocaleString()}</td>
      <td>${trip.distanceTraveled}</td>
      <td>${trip.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editTrip('${trip._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTrip('${trip._id}')">Delete</button>
      </td>
    `;
    tripList.appendChild(row);
  });
}

// Update page information
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Sorting function
function sortTable(field) {
  if (sortField === field) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchTrips();
}

// Pagination controls
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchTrips();
  }
}

function nextPage() {
  currentPage++;
  fetchTrips();
}

// Initial fetch
fetchTrips();

function addIncidentalChargeRow(chargeType = "", amount = "") {
  const tableBody = document.getElementById("incidentalChargesTable").querySelector("tbody");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="form-control chargeType" value="${chargeType}" required></td>
    <td><input type="number" class="form-control chargeAmount" value="${amount}" required></td>
    <td><button type="button" class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button></td>
  `;

  tableBody.appendChild(row);
}

function deleteRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
}


async function editTrip(tripId) {
  try {
    const response = await fetch(`${apiUrl}/${tripId}`);
    const trip = await response.json();

    document.getElementById("tripId").value = trip.tripId;
    document.getElementById("vehicleId").value = trip.vehicleId;
    document.getElementById("driverId").value = trip.driverId;
    document.getElementById("routeId").value = trip.routeId;
    document.getElementById("startTime").value = formatDateForInput(trip.startTime);
    document.getElementById("endTime").value = formatDateForInput(trip.endTime);
    document.getElementById("distanceTraveled").value = trip.distanceTraveled;
    document.getElementById("status").value = trip.status;
    document.getElementById("notes").value = trip.notes;
    document.getElementById("odometerStart").value = trip.odometerStart || "";
    document.getElementById("odometerEnd").value = trip.odometerEnd || "";
    document.getElementById("fuelOrChargeStart").value = trip.fuelOrChargeStart || "";
    document.getElementById("fuelOrChargeEnd").value = trip.fuelOrChargeEnd || "";

    // Populate incidental charges
    const tableBody = document.getElementById("incidentalChargesTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows
    trip.incidentalCharges.forEach((charge) => {
      addIncidentalChargeRow(charge.chargeType, charge.amount);
    });

    editingTripId = tripId;
    toggleForm(true);
  } catch (error) {
    console.error("Error fetching trip details:", error);
  }
}


async function deleteTrip(tripId) {
  if (!confirm("Are you sure you want to delete this trip?")) return;

  try {
    const response = await fetch(`${apiUrl}/${tripId}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete trip.");
    }

    alert("Trip deleted successfully!");
    fetchTrips(); // Refresh the trip list
  } catch (error) {
    console.error("Error deleting trip:", error);
    alert("Error deleting trip. Please try again.");
  }
}

function formatDateForInput(datetime) {
  const date = new Date(datetime); // Parse the input datetime string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`; // Format as yyyy-MM-ddThh:mm
}



fetchTrips();

