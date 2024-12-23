const apiUrl = 'http://localhost:3000/api/vehiclerentals';
let editingRentalId = null;
let rentals = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'rentalId';
let sortOrder = 'asc';

// Function to toggle the form visibility
async function toggleForm(forceShow = false) {
  const form = document.getElementById('rentalForm');
  const button = document.getElementById('toggleFormButton');

  if (forceShow || form.classList.contains('d-none')) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  } else {
    form.classList.add('d-none');
    button.textContent = 'Add Rental';
    editingRentalId = null;
    form.reset();
  }
}

// Function to handle form submission (Create or Update)
async function handleFormSubmit(event) {
    event.preventDefault();
  
    const additionalCharges = Array.from(document.getElementById("additionalChargesList").children).map((row) => ({
      description: row.cells[0].querySelector("input").value,
      amount: parseFloat(row.cells[1].querySelector("input").value),
    }));
  
    const data = {
      rentalId: document.getElementById("rentalId").value,
      vehicleId: document.getElementById("vehicleId").value,
      make: document.getElementById("make").value,
      model: document.getElementById("model").value,
      year: parseInt(document.getElementById("year").value, 10),
      type: document.getElementById("type").value,
      licensePlate: document.getElementById("licensePlate").value,
      mileage: parseFloat(document.getElementById("mileage").value),
      fuelType: document.getElementById("fuelType").value,
      seatingCapacity: parseInt(document.getElementById("seatingCapacity").value, 10),
      features: document.getElementById("features").value.split(",").map((f) => f.trim()),
  
      rentalDetails: {
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        rentalType: document.getElementById("rentalType").value,
        dailyRate: parseFloat(document.getElementById("dailyRate").value),
        weeklyRate: parseFloat(document.getElementById("weeklyRate").value),
        monthlyRate: parseFloat(document.getElementById("monthlyRate").value),
        depositAmount: parseFloat(document.getElementById("depositAmount").value),
      },
  
      customer: {
        customerId: document.getElementById("customerId").value,
        customerName: document.getElementById("customerName").value,
        contactNumber: document.getElementById("contactNumber").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
      },
  
      operationalDetails: {
        pickupLocation: document.getElementById("pickupLocation").value,
        dropoffLocation: document.getElementById("dropoffLocation").value,
        additionalCharges,
        paymentStatus: document.getElementById("paymentStatus").value,
      },
  
      rentalConditions: {
        mileageLimit: parseFloat(document.getElementById("mileageLimit").value),
        insuranceIncluded: document.getElementById("insuranceIncluded").value === "true",
        additionalDriversAllowed: document.getElementById("additionalDriversAllowed").value === "true",
        notes: document.getElementById("notes").value,
      },
    };
  
    try {
      let response;
      if (editingRentalId) {
        response = await fetch(`${apiUrl}/${editingRentalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
  
      if (!response.ok) throw new Error(await response.text());
      alert(editingRentalId ? "Rental updated successfully!" : "Rental created successfully!");
      fetchRentals();
      toggleForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
    }
  }
  

// Function to fetch rentals with paging and sorting
async function fetchRentals() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const { records, totalCount } = await response.json();

    rentals = records;
    renderRentalTable();
    updatePageInfo(totalCount);
  } catch (error) {
    console.error('Error fetching rentals:', error);
  }
}

// Function to render the rental list table
function renderRentalTable() {
  const rentalList = document.getElementById('rentalList');
  rentalList.innerHTML = '';

  rentals.forEach((rental) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rental.rentalId}</td>
      <td>${rental.vehicleId}</td>
      <td>${rental.customerName}</td>
      <td>${rental.rentalType}</td>
      <td>${new Date(rental.startDate).toLocaleDateString()}</td>
      <td>${new Date(rental.endDate).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editRental('${rental._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRental('${rental._id}')">Delete</button>
      </td>
    `;
    rentalList.appendChild(row);
  });
}

// Function to edit a rental
async function editRental(id) {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      const rental = await response.json();
  
      // Populate basic fields
      document.getElementById("rentalId").value = rental.rentalId;
      document.getElementById("vehicleId").value = rental.vehicleId;
      document.getElementById("make").value = rental.make;
      document.getElementById("model").value = rental.model;
      document.getElementById("year").value = rental.year;
      document.getElementById("type").value = rental.type;
      document.getElementById("licensePlate").value = rental.licensePlate;
      document.getElementById("mileage").value = rental.mileage;
      document.getElementById("fuelType").value = rental.fuelType;
      document.getElementById("seatingCapacity").value = rental.seatingCapacity;
      document.getElementById("features").value = rental.features.join(", ");
  
      // Populate rental details
      document.getElementById("startDate").value = rental.rentalDetails.startDate.split("T")[0];
      document.getElementById("endDate").value = rental.rentalDetails.endDate.split("T")[0];
      document.getElementById("rentalType").value = rental.rentalDetails.rentalType;
      document.getElementById("dailyRate").value = rental.rentalDetails.dailyRate;
      document.getElementById("weeklyRate").value = rental.rentalDetails.weeklyRate || "";
      document.getElementById("monthlyRate").value = rental.rentalDetails.monthlyRate || "";
      document.getElementById("depositAmount").value = rental.rentalDetails.depositAmount;
  
      // Populate customer info
      document.getElementById("customerId").value = rental.customer.customerId;
      document.getElementById("customerName").value = rental.customer.customerName;
      document.getElementById("contactNumber").value = rental.customer.contactNumber;
      document.getElementById("email").value = rental.customer.email;
      document.getElementById("address").value = rental.customer.address;
  
      // Populate operational details
      document.getElementById("pickupLocation").value = rental.operationalDetails.pickupLocation;
      document.getElementById("dropoffLocation").value = rental.operationalDetails.dropoffLocation;
      // Populate additional charges dynamically
      const additionalChargesList = document.getElementById("additionalChargesList");
      additionalChargesList.innerHTML = "";
      rental.operationalDetails.additionalCharges.forEach((charge) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="text" value="${charge.description}" class="form-control"></td>
          <td><input type="number" value="${charge.amount}" class="form-control"></td>
        `;
        additionalChargesList.appendChild(row);
      });
      document.getElementById("paymentStatus").value = rental.operationalDetails.paymentStatus;
  
      // Populate rental conditions
      document.getElementById("mileageLimit").value = rental.rentalConditions.mileageLimit || "";
      document.getElementById("insuranceIncluded").value = rental.rentalConditions.insuranceIncluded.toString();
      document.getElementById("additionalDriversAllowed").value = rental.rentalConditions.additionalDriversAllowed.toString();
      document.getElementById("notes").value = rental.rentalConditions.notes || "";
  
      editingRentalId = id;
      toggleForm(true);
    } catch (error) {
      console.error("Error fetching rental details:", error);
      alert(`Error: ${error.message}`);
    }
  }
  

// Function to delete a rental
async function deleteRental(id) {
  if (!confirm('Are you sure you want to delete this rental?')) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());

    alert('Rental deleted successfully!');
    fetchRentals();
  } catch (error) {
    console.error('Error deleting rental:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to add a new row to the additional charges table
function addAdditionalCharge() {
    const additionalChargesList = document.getElementById("additionalChargesList");
  
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" class="form-control" placeholder="Charge description"></td>
      <td><input type="number" class="form-control" placeholder="Charge amount"></td>
      <td>
        <button type="button" class="btn btn-danger btn-sm" onclick="deleteAdditionalCharge(this)">Delete</button>
      </td>
    `;
    additionalChargesList.appendChild(row);
  }
  
  // Function to delete a specific row in the additional charges table
  function deleteAdditionalCharge(button) {
    const row = button.closest("tr");
    row.remove();
  }
  

// Function to update page info
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
  fetchRentals();
}

// Function to navigate to the previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchRentals();
  }
}

// Function to navigate to the next page
function nextPage() {
  currentPage++;
  fetchRentals();
}

// Fetch rentals on page load
fetchRentals();
