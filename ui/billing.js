const apiUrl = 'http://localhost:3000/api/billing';
let editingBillingId = null;

let billingRecords = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'billingId';
let sortOrder = 'asc';

function toggleForm(forceShow = false) {
  const form = document.getElementById('billingForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Billing';
    document.getElementById('billingForm').reset();
    editingBillingId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

   // Gather breakup list
   const breakUpList = [];
   const rows = document.getElementById("breakUpListTable").querySelectorAll("tbody tr");
 
   rows.forEach((row) => {
     const chargeType = row.querySelector(".chargeType").value;
     const amount = parseFloat(row.querySelector(".chargeAmount").value);
     breakUpList.push({ chargeType, amount });
   });

  const data = {
    billingId: document.getElementById('billingId').value,
    customerId: document.getElementById('customerId').value,
    tripId: document.getElementById('tripId').value,
    amount: parseFloat(document.getElementById('amount').value),
    paymentStatus: document.getElementById('paymentStatus').value,
    billingDate: document.getElementById('billingDate').value,
    dueDate: document.getElementById('dueDate').value,
    advanceAmount: parseFloat(document.getElementById("advanceAmount").value),
    breakUpList,
  };

  try {
    if (editingBillingId) {
      const response = await fetch(`${apiUrl}/${editingBillingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Billing record updated successfully!');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Billing record added successfully!');
    }
    fetchBillingRecords();
    toggleForm();
  } catch (error) {
    console.error('Error saving billing record:', error);
  }
}

async function editBilling(billingId) {
  try {
    const response = await fetch(`${apiUrl}/${billingId}`);
    const billing = await response.json();

    document.getElementById("billingId").value = billing.billingId;
    document.getElementById("customerId").value = billing.customerId;
    document.getElementById("tripId").value = billing.tripId;
    document.getElementById("amount").value = billing.amount;
    document.getElementById("paymentStatus").value = billing.paymentStatus;
    document.getElementById("billingDate").value = formatDate(billing.billingDate);
    document.getElementById("dueDate").value = formatDate(billing.dueDate);
    document.getElementById("advanceAmount").value = billing.advanceAmount || "";

    // Populate breakup list
    const tableBody = document.getElementById("breakUpListTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows
    billing.breakUpList.forEach((item) => {
      addBreakupRow(item.chargeType, item.amount);
    });

    editingBillingId = billingId;
    toggleForm(true);
  } catch (error) {
    console.error("Error fetching billing details:", error);
  }
}


async function fetchBillingRecords() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    billingRecords = data.records;
    renderBillingTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching billing records:', error);
  }
}

function renderBillingTable() {
  const billingList = document.getElementById('billingList');
  billingList.innerHTML = '';
  billingRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.billingId}</td>
      <td>${record.customerId}</td>
      <td>${record.tripId}</td>
      <td>${record.amount.toFixed(2)}</td>
      <td>${record.paymentStatus}</td>
      <td>${new Date(record.dueDate).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editBilling('${record.billingId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBilling('${record.billingId}')">Delete</button>
      </td>
    `;
    billingList.appendChild(row);
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
  fetchBillingRecords();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchBillingRecords();
  }
}

function nextPage() {
  currentPage++;
  fetchBillingRecords();
}

function addBreakupRow(chargeType = "", amount = "") {
  const tableBody = document.getElementById("breakUpListTable").querySelector("tbody");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="form-control chargeType" value="${chargeType}" required></td>
    <td><input type="number" class="form-control chargeAmount" value="${amount}" required></td>
    <td><button type="button" class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button></td>
  `;

  tableBody.appendChild(row);
}

function deleteRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
}

async function deleteBilling(billingId) {
  if (!confirm("Are you sure you want to delete this billing entry?")) return;

  try {
    const response = await fetch(`${apiUrl}/${billingId}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete billing entry.");
    }

    alert("Billing entry deleted successfully!");   
  fetchBillingRecords();
  } catch (error) {
    console.error("Error deleting billing entry:", error);
    alert("Error deleting billing entry. Please try again.");
  }
}


fetchBillingRecords();
