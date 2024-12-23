const apiUrl = 'http://localhost:3000/api/maintenance';
let editingMaintenanceId = null;

let maintenanceRecords = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'maintenanceId';
let sortOrder = 'asc';

function toggleForm(forceShow = false) {
  const form = document.getElementById('maintenanceForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Maintenance';
    document.getElementById('maintenanceForm').reset();
    editingMaintenanceId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    maintenanceId: document.getElementById('maintenanceId').value,
    vehicleId: document.getElementById('vehicleId').value,
    maintenanceType: document.getElementById('maintenanceType').value,
    date: document.getElementById('date').value,
    cost: document.getElementById('cost').value,
    serviceCenter: document.getElementById('serviceCenter').value,
    notes: document.getElementById('notes').value,
    status: document.getElementById('status').value,
  };

  try {
    if (editingMaintenanceId) {
      const response = await fetch(`${apiUrl}/${editingMaintenanceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Maintenance updated successfully!');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Maintenance added successfully!');
    }
    fetchMaintenanceRecords();
    toggleForm();
  } catch (error) {
    console.error('Error saving maintenance record:', error);
  }
}

async function fetchMaintenanceRecords() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    maintenanceRecords = data.records;
    renderMaintenanceTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
  }
}

function renderMaintenanceTable() {
  const maintenanceList = document.getElementById('maintenanceList');
  maintenanceList.innerHTML = '';
  maintenanceRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.maintenanceId}</td>
      <td>${record.vehicleId}</td>
      <td>${record.maintenanceType}</td>
      <td>${new Date(record.date).toLocaleDateString()}</td>
      <td>${record.cost}</td>
      <td>${record.serviceCenter}</td>
      <td>${record.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editMaintenance('${record.maintenanceId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMaintenance('${record.maintenanceId}')">Delete</button>
      </td>
    `;
    maintenanceList.appendChild(row);
  });
}

function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchMaintenanceRecords();
}

function editMaintenance(id) {
  const record = maintenanceRecords.find((r) => r.maintenanceId === id);
  if (!record) return;
  document.getElementById('maintenanceId').value = record.maintenanceId;
  document.getElementById('vehicleId').value = record.vehicleId;
  document.getElementById('maintenanceType').value = record.maintenanceType;
  document.getElementById('date').value = new Date(record.date).toISOString().split('T')[0];
  document.getElementById('cost').value = record.cost;
  document.getElementById('serviceCenter').value = record.serviceCenter;
  document.getElementById('notes').value = record.notes;
  document.getElementById('status').value = record.status;

  editingMaintenanceId = id;
  toggleForm(true);
}

async function deleteMaintenance(id) {
  if (!confirm('Are you sure you want to delete this maintenance record?')) return;
  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (response.ok) alert('Maintenance record deleted successfully!');
    fetchMaintenanceRecords();
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMaintenanceRecords();
  }
}

function nextPage() {
  currentPage++;
  fetchMaintenanceRecords();
}

fetchMaintenanceRecords();
