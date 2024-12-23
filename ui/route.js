const apiUrl = 'http://localhost:3000/api/routes';
let editingRouteId = null;

let routes = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'routeId';
let sortOrder = 'asc';

// Toggle form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('routeForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Route';
    document.getElementById('routeForm').reset();
    editingRouteId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

// Handle form submission (Add or Edit route)
async function handleFormSubmit(event) {
  event.preventDefault();

  const data = {
    routeId: document.getElementById('routeId').value,
    name: document.getElementById('name').value,
    startLocation: document.getElementById('startLocation').value,
    endLocation: document.getElementById('endLocation').value,
    distance: parseFloat(document.getElementById('distance').value),
    estimatedTime: document.getElementById('estimatedTime').value,
    assignedVehicleId: document.getElementById('assignedVehicleId').value,
    assignedDriverId: document.getElementById('assignedDriverId').value,
    routeMapUrl:  `https://www.google.com/maps/embed/v1/directions?key=AIzaSyB_nzqahY1FMWFen_YP0tDf7SOhot_cae0&origin=${document.getElementById('startLocation').value}&destination=${document.getElementById('endLocation').value}`,
  };

  try {
    if (editingRouteId) {
      // Update route
      const response = await fetch(`${apiUrl}/${editingRouteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update route');
      alert('Route updated successfully!');
    } else {
      // Add new route
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create route');
      alert('Route created successfully!');
    }
    fetchRoutes();
    toggleForm();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// Fetch routes
async function fetchRoutes() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    routes = data.routes;
    renderRoutesTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error(error);
  }
}

// Render routes table
function renderRoutesTable() {
  const routeList = document.getElementById('routeList');
  routeList.innerHTML = '';

  routes.forEach((route) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${route.routeId}</td>
      <td>${route.name}</td>
      <td>${route.startLocation}</td>
      <td>${route.endLocation}</td>
      <td>${route.distance}</td>
      <td>${route.estimatedTime}</td>
      <td>${route.assignedVehicleId || 'N/A'}</td>
      <td>${route.assignedDriverId || 'N/A'}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editRoute('${route._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRoute('${route._id}')">Delete</button>
      </td>
    `;
    routeList.appendChild(row);
  });
}

// Edit route
async function editRoute(routeId) {
  try {
    const response = await fetch(`${apiUrl}/${routeId}`);
    const route = await response.json();

    // Populate form fields
    document.getElementById('routeId').value = route.routeId;
    document.getElementById('name').value = route.name;
    document.getElementById('startLocation').value = route.startLocation;
    document.getElementById('endLocation').value = route.endLocation;
    document.getElementById('distance').value = route.distance;
    document.getElementById('estimatedTime').value = route.estimatedTime;
    document.getElementById('assignedVehicleId').value = route.assignedVehicleId || '';
    document.getElementById('assignedDriverId').value = route.assignedDriverId || '';
    document.getElementById('routeMapUrl').value = route.routeMapUrl || '';

    // Update map preview
    const mapPreview = document.getElementById('mapPreview');
    if (route.routeMapUrl) {
      mapPreview.src = route.routeMapUrl;
      mapPreview.style.display = 'block';
    } else {
      mapPreview.style.display = 'none';
    }

    editingRouteId = routeId; // Set editing mode
    toggleForm(true);
  } catch (error) {
    console.error('Error fetching route details:', error);
  }
}

// Delete route
async function deleteRoute(routeId) {
  if (!confirm("Are you sure you want to delete this route?")) return;

  try {
    const response = await fetch(`${apiUrl}/${routeId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete route');
    alert('Route deleted successfully!');
    fetchRoutes(); // Refresh the route list
  } catch (error) {
    console.error('Error deleting route:', error);
    alert('Error deleting route. Please try again.');
  }
}

// Sorting
function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchRoutes();
}

// Pagination
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchRoutes();
  }
}

function nextPage() {
  currentPage++;
  fetchRoutes();
}

// Update page info
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Initial fetch
fetchRoutes();
