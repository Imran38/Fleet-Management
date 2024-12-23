const apiUrl = 'http://localhost:3000/api/inventory';
let editingItemId = null;

let inventoryRecords = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'itemId';
let sortOrder = 'asc';

function toggleForm(forceShow = false) {
  const form = document.getElementById('inventoryForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Item';
    document.getElementById('inventoryForm').reset();
    editingItemId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    itemId: document.getElementById('itemId').value,
    itemName: document.getElementById('itemName').value,
    quantity: parseInt(document.getElementById('quantity').value, 10),
    lastUpdated: document.getElementById('lastUpdated').value,
    location: document.getElementById('location').value,
    associatedVehicleId: document.getElementById('associatedVehicleId').value,
  };

  try {
    if (editingItemId) {
      const response = await fetch(`${apiUrl}/${editingItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Inventory item updated successfully!');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Inventory item added successfully!');
    }
    fetchInventoryRecords();
    toggleForm();
  } catch (error) {
    console.error('Error saving inventory record:', error);
  }
}

async function fetchInventoryRecords() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    inventoryRecords = data.records;
    renderInventoryTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching inventory records:', error);
  }
}

function renderInventoryTable() {
  const inventoryList = document.getElementById('inventoryList');
  inventoryList.innerHTML = '';
  inventoryRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.itemId}</td>
      <td>${record.itemName}</td>
      <td>${record.quantity}</td>
      <td>${new Date(record.lastUpdated).toLocaleDateString()}</td>
      <td>${record.location}</td>
      <td>${record.associatedVehicleId}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editInventory('${record.itemId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteInventory('${record.itemId}')">Delete</button>
      </td>
    `;
    inventoryList.appendChild(row);
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
  fetchInventoryRecords();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchInventoryRecords();
  }
}

function nextPage() {
  currentPage++;
  fetchInventoryRecords();
}

function editInventory(itemId) {
  const record = inventoryRecords.find((r) => r.itemId === itemId);
  if (!record) return;

  // Populate the form fields with the record's data
  document.getElementById("itemId").value = record.itemId;
  document.getElementById("itemName").value = record.itemName;
  document.getElementById("quantity").value = record.quantity;
  document.getElementById("lastUpdated").value = new Date(record.lastUpdated)
    .toISOString()
    .split("T")[0];
  document.getElementById("location").value = record.location || "";
  document.getElementById("associatedVehicleId").value = record.associatedVehicleId || "";

  // Set the editing item ID and show the form in edit mode
  editingItemId = itemId;
  toggleForm(true);
}


async function deleteInventory(itemId) {
  if (!confirm("Are you sure you want to delete this inventory item?")) return;

  try {
    const response = await fetch(`${apiUrl}/${itemId}`, { method: "DELETE" });
    if (response.ok) {
      alert("Inventory item deleted successfully!");
      fetchInventoryRecords(); // Refresh the table after deletion
    } else {
      throw new Error("Failed to delete inventory item");
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    alert("Error deleting inventory item. Please try again.");
  }
}

fetchInventoryRecords();
