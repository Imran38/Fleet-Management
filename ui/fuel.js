const apiUrl = 'http://localhost:3000/api/fuel';
let editingRecordId = null;

let fuelRecords = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'recordId';
let sortOrder = 'asc';

// Toggle form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('fuelForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Fuel Record';
    document.getElementById('fuelForm').reset();
    editingRecordId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('recordId', document.getElementById('recordId').value);
  formData.append('vehicleId', document.getElementById('vehicleId').value);
  formData.append('driverId', document.getElementById('driverId').value);
  formData.append('fuelType', document.getElementById('fuelType').value);
  formData.append('fuelQuantity', document.getElementById('fuelQuantity').value);
  formData.append('cost', document.getElementById('cost').value);
  formData.append('paymentType', document.getElementById('paymentType').value);
  formData.append('receiptNumber', document.getElementById('receiptNumber').value);
  formData.append('tripId', document.getElementById('tripId').value);
  formData.append('date', document.getElementById('date').value);
  formData.append('location', document.getElementById('location').value);
  formData.append('notes', document.getElementById('notes').value);
  const receiptImage = document.getElementById('receiptImage').files[0];
  if (receiptImage) formData.append('receiptImage', receiptImage);

  try {
    const url = editingRecordId ? `${apiUrl}/${editingRecordId}` : apiUrl;
    const method = editingRecordId ? 'PUT' : 'POST';

    const response = await fetch(url, { method, body: formData });
    if (!response.ok) throw new Error('Failed to save fuel record');
    alert('Fuel record saved successfully!');
    fetchFuelRecords();
    toggleForm();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// Edit Fuel Record
function editFuel(id) {
  const record = fuelRecords.find((r) => r._id === id);
  if (!record) return;

  document.getElementById('recordId').value = record.recordId;
  document.getElementById('vehicleId').value = record.vehicleId;
  document.getElementById('driverId').value = record.driverId;
  document.getElementById('fuelType').value = record.fuelType;
  document.getElementById('fuelQuantity').value = record.fuelQuantity;
  document.getElementById('cost').value = record.cost;
  document.getElementById('paymentType').value = record.paymentType;
  document.getElementById('receiptNumber').value = record.receiptNumber;
  document.getElementById('tripId').value = record.tripId || '';
  document.getElementById('date').value = record.date.split('T')[0];
  document.getElementById('location').value = record.location;
  document.getElementById('notes').value = record.notes;

  if (record.receiptImage) {
    document.getElementById('previewImage').src = `http://localhost:3000/uploads/${record.receiptImage}`;
    document.getElementById('receiptPreview').style.display = 'block';
  } else {
    document.getElementById('receiptPreview').style.display = 'none';
  }

  editingRecordId = id;
  toggleForm(true);
}


// Fetch fuel records
async function fetchFuelRecords() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();

    fuelRecords = data.records;
    renderFuelTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching fuel records:', error);
  }
}

// Render fuel table
function renderFuelTable() {
  const fuelList = document.getElementById('fuelList');
  fuelList.innerHTML = '';

  fuelRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.recordId}</td>
      <td>${record.vehicleId}</td>
      <td>${record.driverId}</td>
      <td>${record.fuelType}</td>
      <td>${record.fuelQuantity}</td>
      <td>${record.cost}</td>
      <td>${new Date(record.date).toLocaleDateString()}</td>
      <td>${record.location}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editFuel('${record._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFuel('${record._id}')">Delete</button>
      </td>
    `;
    fuelList.appendChild(row);
  });
}



// Delete fuel record
async function deleteFuel(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Fuel record deleted successfully!');
      fetchFuelRecords();
    } else {
      alert('Error deleting fuel record.');
    }
  } catch (error) {
    console.error(error);
  }
}

// Update page info
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Sorting
function sortTable(field) {
  if (sortField === field) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchFuelRecords();
}

// Pagination
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchFuelRecords();
  }
}

function nextPage() {
  currentPage++;
  fetchFuelRecords();
}

// Fetch initial data
fetchFuelRecords();
