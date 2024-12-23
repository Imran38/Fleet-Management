const apiUrl = 'http://localhost:3000/api/usedcarsales';
let editingCarId = null;
let cars = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'vehicleId';
let sortOrder = 'asc';

// Function to toggle the form visibility
async function toggleForm(forceShow = false) {
  const form = document.getElementById('usedCarSalesForm');
  const button = document.getElementById('toggleFormButton');

  if (forceShow || form.classList.contains('d-none')) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  } else {
    form.classList.add('d-none');
    button.textContent = 'Add Listing';
    editingCarId = null;
    form.reset();
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    vehicleId: document.getElementById('vehicleId').value,
    make: document.getElementById('make').value,
    model: document.getElementById('model').value,
    year: parseInt(document.getElementById('year').value, 10),
    type: document.getElementById("type").value, // Vehicle Type
    odometer: parseInt(document.getElementById("odometer").value, 10), // Odometer
    fuelType: document.getElementById("fuelType").value, // Fuel Type
    transmission: document.getElementById("transmission").value, // Transmission
    price: parseFloat(document.getElementById('price').value),
    mileage: parseFloat(document.getElementById('mileage').value),    
    engineCapacity: parseFloat(document.getElementById("engineCapacity").value),
    seatingCapacity: parseInt(document.getElementById("seatingCapacity").value, 10),
    registrationState: document.getElementById("registrationState").value,
    condition: document.getElementById("condition").value,
    tyreCondition: document.getElementById("tyreCondition").value,
    batteryCondition: document.getElementById("batteryCondition").value,
    accidental: document.getElementById("accidental").value === "true",
    serviceHistory: document.getElementById("serviceHistory").value === "true",
    gpsInstalled: document.getElementById("gpsInstalled").value === "true",
    features: document.getElementById("features").value.split(",").map((f) => f.trim()),
    insuranceIncluded: document.getElementById("insuranceIncluded").value === "true",
    description: document.getElementById('description').value,
    seller: {
      sellerId: document.getElementById("sellerId").value, // Seller ID
      sellerName: document.getElementById("sellerName").value, // Seller Name
      contactNumber: document.getElementById("contactNumber").value, // Seller Contact
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
    },
    // Additional properties
    price: parseFloat(document.getElementById("price").value),
    negotiable: document.getElementById("negotiable").value === "true",
    condition: document.getElementById("condition").value,
    color: document.getElementById("color").value,

    media: {
      documents: [document.getElementById("document1").files[0]?.name, document.getElementById("document2").files[0]?.name],
    },
    salesInfo: {
      availabilityStatus: document.getElementById("availabilityStatus").value,
      listedDate: document.getElementById("listedDate").value,
      soldDate: document.getElementById("soldDate").value,},      

  };

  try {
    let response;
    if (editingCarId) {
      response = await fetch(`${apiUrl}/${editingCarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    if (!response.ok) throw new Error(await response.text());
    alert(editingCarId ? 'Car updated successfully!' : 'Car listed successfully!');
    fetchCars();
    toggleForm();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to fetch car listings
async function fetchCars() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const { records, totalCount } = await response.json();

    cars = records;
    renderCarTable();
    updatePageInfo(totalCount);
  } catch (error) {
    console.error('Error fetching cars:', error);
  }
}

// Function to render the car list table
function renderCarTable() {
  const carList = document.getElementById('usedCarSalesList');
  carList.innerHTML = '';

  cars.forEach((car) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${car.vehicleId}</td>
      <td>${car.make}</td>
      <td>${car.model}</td>
      <td>${car.year}</td>
      <td>${car.price}</td>
      <td>${car.condition}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editCar('${car._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCar('${car._id}')">Delete</button>
      </td>
    `;
    carList.appendChild(row);
  });
}

// Function to edit a car listing
async function editCar(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const vehicle = await response.json();

    document.getElementById('vehicleId').value = vehicle.vehicleId;
    document.getElementById('make').value = vehicle.make;
    document.getElementById('model').value = vehicle.model;
    document.getElementById('year').value = vehicle.year;
    document.getElementById('price').value = vehicle.price;
    document.getElementById('mileage').value = vehicle.mileage;    
    document.getElementById('description').value = vehicle.description;
    document.getElementById("color").value = vehicle.color;
    
    document.getElementById("engineCapacity").value = vehicle.engineCapacity || "";
    document.getElementById("seatingCapacity").value = vehicle.seatingCapacity || "";
    document.getElementById("registrationState").value = vehicle.registrationState || "";
    document.getElementById("condition").value = vehicle.condition || "Used";
    document.getElementById("tyreCondition").value = vehicle.tyreCondition || "Used";
    document.getElementById("batteryCondition").value = vehicle.batteryCondition || "Old";
    document.getElementById("accidental").value = vehicle.accidental ? "true" : "false";
    document.getElementById("serviceHistory").value = vehicle.serviceHistory ? "true" : "false";
    document.getElementById("gpsInstalled").value = vehicle.gpsInstalled ? "true" : "false";
    document.getElementById("features").value = (vehicle.features || []).join(", ");
    document.getElementById("insuranceIncluded").value = vehicle.insuranceIncluded ? "true" : "false";
    document.getElementById("availabilityStatus").value = vehicle.salesInfo.availabilityStatus || "Available";
    document.getElementById("listedDate").value = vehicle.salesInfo.listedDate?.split("T")[0] || "";
    document.getElementById("soldDate").value = vehicle.salesInfo.soldDate?.split("T")[0] || "";

    document.getElementById("type").value = vehicle.type; // Vehicle Type
    document.getElementById("odometer").value = vehicle.odometer; // Odometer
    document.getElementById("fuelType").value = vehicle.fuelType; // Fuel Type
    document.getElementById("transmission").value = vehicle.transmission; // Transmission

    // Seller Information
    document.getElementById("sellerId").value = vehicle.seller.sellerId;
    document.getElementById("sellerName").value = vehicle.seller.sellerName;
    document.getElementById("contactNumber").value = vehicle.seller.contactNumber;
    document.getElementById("email").value = vehicle.seller.email;
    document.getElementById("address").value = vehicle.seller.address;


    editingCarId = id;
    toggleForm(true);
  } catch (error) {
    console.error('Error fetching car details:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to delete a car listing
async function deleteCar(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());

    alert('Car listing deleted successfully!');
    fetchCars();
  } catch (error) {
    console.error('Error deleting car listing:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to update pagination info
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to sort table columns
function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchCars();
}

// Function to navigate to the previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchCars();
  }
}

// Function to navigate to the next page
function nextPage() {
  currentPage++;
  fetchCars();
}

// Fetch car listings on page load
fetchCars();
