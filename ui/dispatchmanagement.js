const apiUrl = 'http://localhost:3000/api/dispatch';
let editingDispatchId = null;

let dispatches = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'dispatchId';
let sortOrder = 'asc';

// Toggle the form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('dispatchForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Dispatch';
    document.getElementById('dispatchForm').reset();
    editingDispatchId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  } else {
    form.classList.add('d-none');
    button.textContent = 'Add Dispatch';
    document.getElementById('dispatchForm').reset();
  }
}

// Handle form submission (Create or Update)
async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    vehicleId: document.getElementById('vehicleId').value,
    driverId: document.getElementById('driverId').value,
    routeId: document.getElementById('routeId').value,
    dispatchTime: document.getElementById('dispatchTime').value,
    status: document.getElementById('status').value,
    priority: document.getElementById('priority').value,
    notes: document.getElementById('notes').value,
  };

  try {
    if (editingDispatchId) {
      const response = await fetch(`${apiUrl}/${editingDispatchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert('Dispatch updated successfully!');
      } else {
        alert('Error updating dispatch.');
      }
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert('Dispatch created successfully!');
      } else {
        alert('Error creating dispatch.');
      }
    }
    fetchDispatches();
    toggleForm();
  } catch (error) {
    console.error(error);
  }
}

// Fetch dispatches with paging and sorting
async function fetchDispatches() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();

    dispatches = data.dispatches;
    renderDispatchTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching dispatches:', error);
  }
}

// Render the dispatch list table
function renderDispatchTable() {
  const dispatchList = document.getElementById('dispatchList');
  dispatchList.innerHTML = '';

  dispatches.forEach((dispatch) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dispatch.dispatchId}</td>
      <td>${dispatch.vehicleId}</td>
      <td>${dispatch.driverId}</td>
      <td>${dispatch.routeId}</td>
      <td>${dispatch.dispatchTime}</td>
      <td>${dispatch.status}</td>
      <td>${dispatch.priority}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editDispatch('${dispatch._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteDispatch('${dispatch._id}')">Delete</button>
      </td>
    `;
    dispatchList.appendChild(row);
  });
}

// Update page information
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Sorting functionality
function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchDispatches();
}

// Pagination: Previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchDispatches();
  }
}

// Pagination: Next page
function nextPage() {
  currentPage++;
  fetchDispatches();
}

// Edit a dispatch
function editDispatch(id) {
  const dispatch = dispatches.find((d) => d._id === id);
  if (!dispatch) return;

  document.getElementById('vehicleId').value = dispatch.vehicleId;
  document.getElementById('driverId').value = dispatch.driverId;
  document.getElementById('routeId').value = dispatch.routeId;
  document.getElementById('dispatchTime').value = dispatch.dispatchTime;
  document.getElementById('status').value = dispatch.status;
  document.getElementById('priority').value = dispatch.priority;
  document.getElementById('notes').value = dispatch.notes;

  editingDispatchId = id;
  toggleForm(true);
}

// Delete a dispatch
async function deleteDispatch(id) {
  if (!confirm('Are you sure you want to delete this dispatch?')) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      alert('Dispatch deleted successfully!');
      fetchDispatches();
    } else {
      alert('Error deleting dispatch.');
    }
  } catch (error) {
    console.error('Error deleting dispatch:', error);
  }
}

// Fetch dispatches on page load
fetchDispatches();
