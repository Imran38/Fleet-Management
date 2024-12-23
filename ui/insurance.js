const apiUrl = 'http://localhost:3000/api/insurance';
let editingInsuranceId = null;

let insuranceRecords = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'insuranceId';
let sortOrder = 'asc';

// Function to toggle the form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('insuranceForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Insurance';
    document.getElementById('insuranceForm').reset();
    editingInsuranceId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    insuranceId: document.getElementById('insuranceId').value,
    vehicleId: document.getElementById('vehicleId').value,
    provider: document.getElementById('provider').value,
    policyNumber: document.getElementById('policyNumber').value,
    coverageDetails: document.getElementById('coverageDetails').value,
    startDate: document.getElementById('startDate').value,
    expiryDate: document.getElementById('expiryDate').value,
    premiumAmount: parseFloat(document.getElementById('premiumAmount').value),
    insuranceType: document.getElementById('insuranceType').value,
    coverageLimit: parseFloat(document.getElementById('coverageLimit').value),
    claimStatus: document.getElementById('claimStatus').value,
    agencyContact: {
      name: document.getElementById("agencyName").value,
      phone: document.getElementById("agencyPhone").value,
      email: document.getElementById("agencyEmail").value,
      address: document.getElementById("agencyAddress").value,
    },
    insuranceContact: {
      name: document.getElementById("insuranceContactName").value,
      phone: document.getElementById("insuranceContactPhone").value,
      email: document.getElementById("insuranceContactEmail").value,
      address: document.getElementById("insuranceContactAddress").value,
    },
  };

  try {
    if (editingInsuranceId) {
      const response = await fetch(`${apiUrl}/${editingInsuranceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Insurance record updated successfully!');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Insurance record added successfully!');
    }
    fetchInsuranceRecords();
    toggleForm();
  } catch (error) {
    console.error('Error saving insurance record:', error);
  }
}

// Fetch insurance records
async function fetchInsuranceRecords() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    insuranceRecords = data.records;
    renderInsuranceTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching insurance records:', error);
  }
}

// Render insurance records
function renderInsuranceTable() {
  const insuranceList = document.getElementById('insuranceList');
  insuranceList.innerHTML = '';
  insuranceRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.insuranceId}</td>
      <td>${record.vehicleId}</td>
      <td>${record.provider}</td>
      <td>${record.policyNumber}</td>
      <td>${new Date(record.expiryDate).toLocaleDateString()}</td>
      <td>${record.premiumAmount.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editInsurance('${record.insuranceId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteInsurance('${record.insuranceId}')">Delete</button>
      </td>
    `;
    insuranceList.appendChild(row);
  });
}

// Update pagination info
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Sort table
function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchInsuranceRecords();
}

// Pagination
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchInsuranceRecords();
  }
}

function nextPage() {
  currentPage++;
  fetchInsuranceRecords();
}

async function deleteInsurance(insuranceId) {
  if (!confirm("Are you sure you want to delete this insurance?")) return;

  try {
    const response = await fetch(`${apiUrl}/${insuranceId}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete insurance.");
    }

    alert("Insurance deleted successfully!");
    fetchInsuranceRecords(); // Refresh the insurance list
  } catch (error) {
    console.error("Error deleting insurance:", error);
    alert("Error deleting insurance. Please try again.");
  }
}


async function editInsurance(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const insurance = await response.json();

    document.getElementById('insuranceId').value = insurance.insuranceId;
    document.getElementById('vehicleId').value = insurance.vehicleId;
    document.getElementById('provider').value = insurance.provider;
    document.getElementById('policyNumber').value = insurance.policyNumber;
    document.getElementById('startDate').value = insurance.startDate.split('T')[0];
    document.getElementById('expiryDate').value = insurance.expiryDate.split('T')[0];
    document.getElementById('premiumAmount').value = insurance.premiumAmount;
    document.getElementById('insuranceType').value = insurance.insuranceType;
    document.getElementById('coverageLimit').value = insurance.coverageLimit;
    document.getElementById('claimStatus').value = insurance.claimStatus;
    document.getElementById('coverageDetails').value = insurance.coverageDetails;

    // Populate agency contact
    document.getElementById("agencyName").value = insurance.agencyContact?.name || "";
    document.getElementById("agencyPhone").value = insurance.agencyContact?.phone || "";
    document.getElementById("agencyEmail").value = insurance.agencyContact?.email || "";
    document.getElementById("agencyAddress").value = insurance.agencyContact?.address || "";

    // Populate insurance contact
    document.getElementById("insuranceContactName").value = insurance.insuranceContact?.name || "";
    document.getElementById("insuranceContactPhone").value = insurance.insuranceContact?.phone || "";
    document.getElementById("insuranceContactEmail").value = insurance.insuranceContact?.email || "";
    document.getElementById("insuranceContactAddress").value = insurance.insuranceContact?.address || "";
 

    editingInsuranceId = id;
    toggleForm(true);
  } catch (error) {
    console.error('Error fetching insurance details:', error);
  }
}

async function deleteInsurance(id) {
  if (!confirm('Are you sure you want to delete this insurance?')) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete insurance');
    alert('Insurance deleted successfully!');
    fetchInsuranceRecords();
  } catch (error) {
    console.error('Error deleting insurance:', error);
    alert('Error deleting insurance. Please try again.');
  }
}


// Fetch records on load
fetchInsuranceRecords();
