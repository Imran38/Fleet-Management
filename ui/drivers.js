const apiUrl = 'http://localhost:3000/api/drivers';
const imgUrl = 'http://localhost:3000/';
let editingDriverId = null;

let drivers = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'driverId';
let sortOrder = 'asc';

// Function to toggle the form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('driverForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    // Reset and hide the form
    form.classList.add('d-none');
    button.textContent = 'Add Driver';
    document.getElementById('driverForm').reset();
    editingDriverId = null; // Exit edit mode
  } else if (form.classList.contains('d-none') || forceShow) {
    // Show the form
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  } else if (!editingDriverId) {
    // Hide the form and reset if not in edit mode
    form.classList.add('d-none');
    button.textContent = 'Add Driver';
    document.getElementById('driverForm').reset();
  }
}

async function populateVehicleDropdown() {
  const dropdown = document.getElementById("assignedVehicleId");

  try {
    // Fetch vehicles from the API
    const response = await fetch("http://localhost:3000/api/vehicles/all");
    const data = await response.json();

    // Clear existing options
    dropdown.innerHTML = '<option value="">Select a Vehicle</option>';

    // Populate the dropdown with vehicle IDs
    data.forEach((vehicle) => {
      const option = document.createElement("option");
      option.value = vehicle.vehicleId;
      option.textContent = vehicle.vehicleId;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
}


// Function to handle form submission (Create or Update)
async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("driverId", document.getElementById("driverId").value);
  formData.append("name", document.getElementById("name").value);
  formData.append("licenseNumber", document.getElementById("licenseNumber").value);
  formData.append("licenseExpiry", document.getElementById("licenseExpiry").value);
  formData.append("phone", document.getElementById("phone").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("assignedVehicleId", document.getElementById("assignedVehicleId").value);
  formData.append("yearsOfExperience", document.getElementById("yearsOfExperience").value); // New field
  formData.append("salary", document.getElementById("salary").value); // New field
  formData.append("DOB", document.getElementById("DOB").value);
  formData.append("address", document.getElementById("address").value);
  formData.append("street", document.getElementById("street").value);
  formData.append("city", document.getElementById("city").value);
  formData.append("state", document.getElementById("state").value);
  formData.append("code", document.getElementById("code").value);
  formData.append("licenseType", document.getElementById("licenseType").value);
  formData.append("addressVerified", document.getElementById("addressVerified").value);
  formData.append("eyeglass", document.getElementById("eyeglass").value);
  formData.append("medicalCondition", document.getElementById("medicalCondition").value);
  formData.append("medicalFitness", document.getElementById("medicalFitness").value);
  formData.append("image", document.getElementById("image").files[0]);
  formData.append("performance[accidents]", document.getElementById("accidents").value || 0);
  formData.append("performance[violations]", document.getElementById("violations").value || 0);
  formData.append("performance[averageRating]", document.getElementById("averageRating").value || 0);

  try {
    const method = editingDriverId ? "PUT" : "POST";
    const url = editingDriverId ? `${apiUrl}/${editingDriverId}` : apiUrl;

    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (response.ok) {
      alert(editingDriverId ? "Driver updated successfully!" : "Driver created successfully!");
      fetchDrivers();
      toggleForm();
    } else {
      alert(`Error ${editingDriverId ? "updating" : "creating"} driver.`);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}


// Function to fetch drivers
async function fetchDrivers() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();

    drivers = data.drivers;
    renderDriversTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching drivers:', error);
  }
}

// Function to render the drivers table
function renderDriversTable() {
  const driverList = document.getElementById('driverList');
  driverList.innerHTML = ''; // Clear existing rows

  drivers.forEach((driver) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${driver.driverId}</td>
      <td>${driver.name}</td>
      <td>${driver.licenseNumber}</td>
      <td>${new Date(driver.licenseExpiry).toLocaleDateString()}</td>
      <td>${driver.phone}</td>
      
      <td>${driver.assignedVehicleId || 'N/A'}</td>
     
      <td>${driver.performance?.averageRating?.toFixed(2) || 'N/A'}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editDriver('${driver._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteDriver('${driver._id}')">Delete</button>
      </td>
    `;
    driverList.appendChild(row);
  });
}

// Function to update page info
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to sort the table
function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchDrivers();
}

// Pagination functions
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchDrivers();
  }
}

function nextPage() {
  currentPage++;
  fetchDrivers();
}

// Function to edit a driver
function editDriver(driverId) {
  const driver = drivers.find((d) => d._id === driverId);
  if (!driver) return;

  // Utility function to format ISO date to yyyy-MM-dd
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd part
  };

  // Populate basic fields
  document.getElementById("driverId").value = driver.driverId;
  document.getElementById("name").value = driver.name;
  document.getElementById("licenseNumber").value = driver.licenseNumber;
  document.getElementById("licenseExpiry").value = formatDate(driver.licenseExpiry);
  document.getElementById("phone").value = driver.phone;
  document.getElementById("email").value = driver.email;
  document.getElementById("DOB").value = formatDate(driver.DOB);
  document.getElementById("address").value = driver.address || '';
  document.getElementById("street").value = driver.street || '';
  document.getElementById("city").value = driver.city || '';
  document.getElementById("state").value = driver.state || '';
  document.getElementById("code").value = driver.code || '';
  document.getElementById("licenseType").value = driver.licenseType || '';
  document.getElementById("addressVerified").value = driver.addressVerified || 'No';
  document.getElementById("eyeglass").value = driver.eyeglass || 'No';
  document.getElementById("medicalCondition").value = driver.medicalCondition || '';
  document.getElementById("medicalFitness").value = driver.medicalFitness || 'Yes';

  // Populate performance fields
  document.getElementById("accidents").value = driver.performance.accidents || 0;
  document.getElementById("violations").value = driver.performance.violations || 0;
  document.getElementById("averageRating").value = driver.performance.averageRating || 0;
  document.getElementById("yearsOfExperience").value = driver.yearsOfExperience || 0; // New field
  document.getElementById("salary").value = driver.salary || 0; // New field

  // Populate the dropdown with vehicle IDs and set the selected value
  populateVehicleDropdown().then(() => {
    document.getElementById("assignedVehicleId").value = driver.assignedVehicleId || '';
  });

  // Populate image (if any)
  if (driver.image) {
    const imagePreview = document.getElementById("imagePreview");
    if (imagePreview) {
      imagePreview.src = imgUrl + driver.image; // Set preview image source
      imagePreview.style.display = "block"; // Ensure it's visible
    }
  }

  editingDriverId = driverId;
  toggleForm(true); // Ensure the form is displayed in edit mode
}


// Function to delete a driver
async function deleteDriver(driverId) {
  if (!confirm('Are you sure you want to delete this driver?')) return;

  try {
    const response = await fetch(`${apiUrl}/${driverId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      alert('Driver deleted successfully!');
      fetchDrivers();
    } else {
      alert('Error deleting driver.');
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateVehicleDropdown();
});

// Fetch drivers on page load
fetchDrivers();
