const apiUrl = 'http://localhost:3000/api/compliance';
let editingComplianceId = null;

let complianceRecords = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'complianceId';
let sortOrder = 'asc';

function toggleForm(forceShow = false) {
  const form = document.getElementById('complianceForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Compliance';
    document.getElementById('complianceForm').reset();
    editingComplianceId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

    // Gather compliance list
    const complianceList = [];
    const rows = document.getElementById("complianceListTable").querySelectorAll("tbody tr");
  
    rows.forEach((row) => {
      const name = row.querySelector(".complianceName").value;
      const issueDate = row.querySelector(".complianceIssueDate").value;
      const expiryDate = row.querySelector(".complianceExpiryDate").value;
      const validity = row.querySelector(".complianceValidity").value;
  
      complianceList.push({ name, issueDate, expiryDate, validity });
    });

    const data = {
    complianceId: document.getElementById('complianceId').value,
    vehicleId: document.getElementById('vehicleId').value,
    driverId: document.getElementById('driverId').value,   
    notes: document.getElementById('notes').value,
    complianceList,
  };

  try {
    if (editingComplianceId) {
      const response = await fetch(`${apiUrl}/${editingComplianceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Compliance updated successfully!');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Compliance added successfully!');
    }
    fetchComplianceRecords();
    toggleForm();
  } catch (error) {
    console.error('Error saving compliance record:', error);
  }
}

async function editCompliance(complianceId) {
  try {
    const response = await fetch(`${apiUrl}/${complianceId}`);
    const compliance = await response.json();

    document.getElementById("complianceId").value = compliance.complianceId;
    document.getElementById("vehicleId").value = compliance.vehicleId;
    document.getElementById("driverId").value = compliance.driverId || "";
    document.getElementById('notes').value = compliance.notes;

    // Populate compliance list
    const tableBody = document.getElementById("complianceListTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows
    compliance.complianceList.forEach((item) => {
      addComplianceRow(item.name, item.issueDate, item.expiryDate, item.validity);
    });

    editingComplianceId = complianceId;
    toggleForm(true);
  } catch (error) {
    console.error("Error fetching compliance details:", error);
  }
}


async function fetchComplianceRecords() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    complianceRecords = data.records;
    renderComplianceTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching compliance records:', error);
  }
}

function renderComplianceTable() {
  const complianceList = document.getElementById('complianceList');
  complianceList.innerHTML = '';
  complianceRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.complianceId}</td>
      <td>${record.vehicleId}</td>
      <td>${record.driverId}</td>
      <td>${record.complianceList.length}</td>
      <td>${record.complianceList.reduce(( sum, { validity } ) => sum + (validity == 'Valid' ? 1: 0)  , 0)}</td>
      <td>${new Date(record.checkDate).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editCompliance('${record.complianceId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCompliance('${record.complianceId}')">Delete</button>
      </td>
    `;
    complianceList.appendChild(row);
  });
}

  // Utility function to format ISO date to yyyy-MM-dd
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd part
  };

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
  fetchComplianceRecords();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchComplianceRecords();
  }
}

function nextPage() {
  currentPage++;
  fetchComplianceRecords();
}

function addComplianceRow(name = "", issueDate = "", expiryDate = "", validity = "Valid") {
  const tableBody = document.getElementById("complianceListTable").querySelector("tbody");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="form-control complianceName" value="${name}" required></td>
    <td><input type="date" class="form-control complianceIssueDate" value="${formatDate(issueDate)}" required></td>
    <td><input type="date" class="form-control complianceExpiryDate" value="${formatDate(expiryDate)}" required></td>
    <td>
      <select class="form-select complianceValidity" required>
        <option value="Valid" ${validity === "Valid" ? "selected" : ""}>Valid</option>
        <option value="Expired" ${validity === "Expired" ? "selected" : ""}>Expired</option>
      </select>
    </td>
    <td><button type="button" class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button></td>
  `;

  tableBody.appendChild(row);
}

function deleteRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
}

async function deleteCompliance(complianceId) {
  // Confirm the deletion action with the user
  if (!confirm("Are you sure you want to delete this compliance?")) {
    return;
  }

  try {
    // Send a DELETE request to the backend
    const response = await fetch(`${apiUrl}/${complianceId}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete compliance.");
    }

    // Notify the user of successful deletion
    alert("Compliance deleted successfully!");

    // Refresh the compliance list
    fetchComplianceRecords();
  } catch (error) {
    console.error("Error deleting compliance:", error);
    alert("Error deleting compliance. Please try again.");
  }
}

// Function to delete a customer
async function deleteCustomer(customerId) {
  if (confirm("Are you sure you want to delete this customer?")) {
    try {
      const response = await fetch(`${apiUrl}/${customerId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Customer deleted successfully!");
        fetchCustomers(); // Refresh the customer list
      } else {
        alert("Error deleting customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("An error occurred while deleting the customer.");
    }
  }
}

// Function to edit a customer
async function editCustomer(customerId) {
  const customer = customers.find((c) => c._id === customerId);
  if (!customer) return;

  // Populate form fields with customer data
  document.getElementById("customerId").value = customer.customerId;
  document.getElementById("name").value = customer.name;
  document.getElementById("contactNumber").value = customer.contactNumber;
  document.getElementById("email").value = customer.email;
  document.getElementById("address").value = customer.address;
  document.getElementById("associatedTrips").value = customer.associatedTrips.join(", ");

  editingCustomerId = customerId; // Set the editing customer ID
  toggleForm(true); // Show the form in edit mode
}



fetchComplianceRecords();
