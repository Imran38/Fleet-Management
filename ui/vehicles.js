const apiUrl = 'http://localhost:3000/api/vehicles';
const imgUrl = 'http://localhost:3000/';
let editingVehicleId = null;

let vehicles = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'vehicleId';
let sortOrder = 'asc';


// Function to toggle the form visibility
function toggleForm(forceShow = false) {
const form = document.getElementById('vehicleForm');
const button = document.getElementById('toggleFormButton');

if (button.textContent === 'Cancel') {
// Reset and hide the form
form.classList.add('d-none');
button.textContent = 'Add Vehicle';
document.getElementById('vehicleForm').reset();
editingVehicleId = null; // Exit edit mode
} else if (form.classList.contains('d-none') || forceShow) {
// Show the form
form.classList.remove('d-none');
button.textContent = 'Cancel';
} else if (!editingVehicleId) {
// Hide the form and reset if not in edit mode
form.classList.add('d-none');
button.textContent = 'Add Vehicle';
document.getElementById('vehicleForm').reset();
}
}


// Function to handle form submission (Create or Update)
async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("vehicleId", document.getElementById("vehicleId").value);
  formData.append("make", document.getElementById("make").value);
  formData.append("model", document.getElementById("model").value);
  formData.append("year", document.getElementById("year").value);
  formData.append("vin", document.getElementById("vin").value);
  formData.append("licensePlate", document.getElementById("licensePlate").value);
  formData.append("ownershipType", document.getElementById("ownershipType").value);
  formData.append("status", document.getElementById("status").value);
  formData.append("ownerName", document.getElementById("ownerName").value); // New field
  formData.append("fuelType", document.getElementById("fuelType").value); // New field
  formData.append("mileage", document.getElementById("mileage").value); // New field

  // Append additional fields to FormData
  const additionalFields = [
    "odometer", "accidental", "color", "engineCapacity", "insuranceType",
    "lockSystem", "makeMonth", "parkingSensors", "powerSteering",
    "registrationPlace", "finance", "tyreCondition", "gpsInstalled",
    "loadCapacity", "serviceHistory", "seatCapacity", "antiTheftDevice",
    "batteryCondition", "vehicleCertified"
  ];

  additionalFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      formData.append(field, element.value);
    }
  });

  // Append images if any are uploaded
  const imageFields = ["image1", "image2", "image3"];
  imageFields.forEach((field) => {
    const fileInput = document.getElementById(field);
    if (fileInput && fileInput.files[0]) {
      formData.append(field, fileInput.files[0]);
    }
  });

  try {
    const method = editingVehicleId ? "PUT" : "POST";
    const url = editingVehicleId ? `${apiUrl}/${editingVehicleId}` : apiUrl;

    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (response.ok) {
      alert(editingVehicleId ? "Vehicle updated successfully!" : "Vehicle created successfully!");
      fetchVehicles();
      toggleForm(); // Close the form
    } else {
      alert(`Error ${editingVehicleId ? "updating" : "creating"} vehicle.`);
    }
  } catch (error) {
    console.error(`Error submitting ${editingVehicleId ? "edit" : "create"} form:`, error);
  }
}




async function fetchVehicles() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();

    vehicles = data.vehicles;
    renderVehiclesTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
  }
}

function renderVehiclesTable() {
    const vehicleList = document.getElementById('vehicleList'); // Ensure this targets <tbody>
    vehicleList.innerHTML = ''; // Clear existing rows
  
    vehicles.forEach((vehicle) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehicle.vehicleId}</td>
        <td>${vehicle.make}</td>
        <td>${vehicle.model}</td>
        <td>${vehicle.year}</td>
        <td>${vehicle.vin}</td>
        <td>${vehicle.licensePlate}</td>
        <td>${vehicle.ownershipType}</td>
        <td>${vehicle.status}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editVehicle('${vehicle._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteVehicle('${vehicle._id}')">Delete</button>
        </td>
      `;
      vehicleList.appendChild(row);
    });
  }

// Function to edit a vehicle
async function editVehicle(id) {
  try {
    // Fetch vehicle data by ID
    const response = await fetch(`${apiUrl}/${id}`);
    const vehicle = await response.json();

    // Populate basic vehicle fields
    document.getElementById('vehicleId').value = vehicle.vehicleId;
    document.getElementById('make').value = vehicle.make;
    document.getElementById('model').value = vehicle.model;
    document.getElementById('year').value = vehicle.year;
    document.getElementById('vin').value = vehicle.vin;
    document.getElementById('licensePlate').value = vehicle.licensePlate;
    document.getElementById('ownershipType').value = vehicle.ownershipType;
    document.getElementById('status').value = vehicle.status;
    document.getElementById("ownerName").value = vehicle.ownerName || ""; // New field
    document.getElementById("fuelType").value = vehicle.fuelType || ""; // New field
    document.getElementById("mileage").value = vehicle.mileage || ""; // New field

    // Populate additional fields
    const additionalFields = [
      'odometer', 'accidental', 'color', 'engineCapacity', 'insuranceType',
      'lockSystem', 'makeMonth', 'parkingSensors', 'powerSteering',
      'registrationPlace', 'finance', 'tyreCondition', 'gpsInstalled',
      'loadCapacity', 'serviceHistory', 'seatCapacity', 'antiTheftDevice',
      'batteryCondition', 'vehicleCertified'
    ];

    additionalFields.forEach((field) => {
      const element = document.getElementById(field);
      if (element) {
        element.value = vehicle[field] || ''; // Populate with vehicle data or default to an empty string
      }
    });

    // Preview images
    const imageFields = ['image1', 'image2', 'image3'];
    imageFields.forEach((imageField) => {
      const previewElement = document.getElementById(`${imageField}Preview`);
      if (previewElement && vehicle[imageField]) {
        previewElement.src = imgUrl + vehicle[imageField]; // Set image source
        previewElement.style.display = 'block'; // Ensure it's visible
      } else if (previewElement) {
        previewElement.style.display = 'none'; // Hide if no image available
      }
    });

    // Update the editing vehicle ID
    editingVehicleId = id;
    toggleForm(true); // Force the form to open
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
  }
}


// Function to handle form submission for editing
async function handleEditFormSubmit(event) {
  event.preventDefault();

  if (!editingVehicleId) {
    alert('No vehicle is being edited.');
    return;
  }

  const formData = new FormData();
  formData.append('vehicleId', document.getElementById('vehicleId').value);
  formData.append('make', document.getElementById('make').value);
  formData.append('model', document.getElementById('model').value);
  formData.append('year', document.getElementById('year').value);
  formData.append('vin', document.getElementById('vin').value);
  formData.append('licensePlate', document.getElementById('licensePlate').value);
  formData.append('ownershipType', document.getElementById('ownershipType').value);
  formData.append('status', document.getElementById('status').value);

  // Append additional fields to FormData
  const additionalFields = [
    'odometer', 'accidental', 'color', 'engineCapacity', 'insuranceType',
    'lockSystem', 'makeMonth', 'parkingSensors', 'powerSteering',
    'registrationPlace', 'finance', 'tyreCondition', 'gpsInstalled',
    'loadCapacity', 'serviceHistory', 'seatCapacity', 'antiTheftDevice',
    'batteryCondition', 'vehicleCertified'
  ];

  additionalFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      formData.append(field, element.value);
    }
  });

  // Append images if any are uploaded
  const imageFields = ['image1', 'image2', 'image3'];
  imageFields.forEach((field) => {
    const fileInput = document.getElementById(field);
    if (fileInput && fileInput.files[0]) {
      formData.append(field, fileInput.files[0]);
    }
  });

  try {
    // Send the PUT request with FormData
    const response = await fetch(`${apiUrl}/${editingVehicleId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      alert('Vehicle updated successfully!');
      fetchVehicles();
      toggleForm(); // Close the form
    } else {
      alert('Error updating vehicle.');
    }
  } catch (error) {
    console.error('Error submitting edit form:', error);
  }
}


// Function to delete a vehicle
async function deleteVehicle(id) {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Vehicle deleted successfully!');
        fetchVehicles();
      } else {
        alert('Error deleting vehicle.');
      }
    } catch (error) {
      console.error(error);
    }
  }
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
  fetchVehicles();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchVehicles();
  }
}

function nextPage() {
  currentPage++;
  fetchVehicles();
}

// Fetch vehicles on page load
fetchVehicles();
