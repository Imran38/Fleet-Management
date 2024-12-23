const apiUrl = 'http://localhost:3000/api/customers';
let editingCustomerId = null;

let customers = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'customerId';
let sortOrder = 'asc';

// Toggle form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('customerForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    form.classList.add('d-none');
    button.textContent = 'Add Customer';
    document.getElementById('customerForm').reset();
    editingCustomerId = null;
  } else if (form.classList.contains('d-none') || forceShow) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  }
}

// Handle form submission (Create or Update)
async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    customerId: document.getElementById('customerId').value,
    name: document.getElementById('name').value,
    contactNumber: document.getElementById('contactNumber').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    associatedTrips: document.getElementById('associatedTrips').value.split(','),
    city: document.getElementById('city').value,
  };

  try {
    if (editingCustomerId) {
      const response = await fetch(`${apiUrl}/${editingCustomerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Customer updated successfully!');
      else alert('Error updating customer.');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('Customer created successfully!');
      else alert('Error creating customer.');
    }
    fetchCustomers();
    toggleForm();
  } catch (error) {
    console.error(error);
  }
}

// Fetch customers
async function fetchCustomers() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();

    customers = data.customers;
    renderCustomerTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
}

// Render customer table
function renderCustomerTable() {
  const customerList = document.getElementById('customerList');
  customerList.innerHTML = '';

  customers.forEach((customer) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.customerId}</td>
      <td>${customer.name}</td>
      <td>${customer.contactNumber}</td>
      <td>${customer.email}</td>
      <td>${customer.city}</td>
      <td>${customer.associatedTrips.join(', ')}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editCustomer('${customer._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer._id}')">Delete</button>
      </td>
    `;
    customerList.appendChild(row);
  });
}

// Update page information
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Sorting function
function sortTable(field) {
  if (sortField === field) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  else {
    sortField = field;
    sortOrder = 'asc';
  }
  fetchCustomers();
}

// Pagination controls
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchCustomers();
  }
}

function nextPage() {
  currentPage++;
  fetchCustomers();
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
  document.getElementById("city").value = customer.city;
  document.getElementById("associatedTrips").value = customer.associatedTrips.join(", ");

  editingCustomerId = customerId; // Set the editing customer ID
  toggleForm(true); // Show the form in edit mode
}


// Initial fetch
fetchCustomers();
