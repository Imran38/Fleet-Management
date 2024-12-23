const apiUrl = 'http://localhost:3000/api/packersmovers';
let editingRequestId = null;
let requests = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'requestId';
let sortOrder = 'asc';

// Function to toggle the form visibility
async function toggleForm(forceShow = false) {
  const form = document.getElementById('packersMoversForm');
  const button = document.getElementById('toggleFormButton');

  if (forceShow || form.classList.contains('d-none')) {
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  } else {
    form.classList.add('d-none');
    button.textContent = 'Add Request';
    editingRequestId = null;
    form.reset();
  }
}

// Function to add a row to the items list
function addItem() {
    const itemsList = document.getElementById("itemsList");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" class="form-control" placeholder="Item Name"></td>
      <td><input type="number" class="form-control" placeholder="Quantity"></td>
      <td><input type="number" class="form-control" placeholder="Weight"></td>
      <td>
        <select class="form-select">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </td>
      <td><input type="text" class="form-control" placeholder="Notes"></td>
      <td>
        <button type="button" class="btn btn-danger btn-sm" onclick="deleteItem(this)">Delete</button>
      </td>
    `;
    itemsList.appendChild(row);
  }
  
  // Function to delete a row from the items list
  function deleteItem(button) {
    const row = button.closest("tr");
    row.remove();
  }
  
  // Function to add a row to the exception logs
  function addExceptionLog() {
    const exceptionLogsList = document.getElementById("exceptionLogsList");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="datetime-local" class="form-control"></td>
      <td><input type="text" class="form-control" placeholder="Message"></td>
      <td>
        <button type="button" class="btn btn-danger btn-sm" onclick="deleteExceptionLog(this)">Delete</button>
      </td>
    `;
    exceptionLogsList.appendChild(row);
  }
  
  // Function to delete a row from the exception logs
  function deleteExceptionLog(button) {
    const row = button.closest("tr");
    row.remove();
  }
  
  // Function to handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();
  
    const items = Array.from(document.getElementById("itemsList").children).map((row) => ({
      itemName: row.cells[0].querySelector("input").value,
      quantity: parseInt(row.cells[1].querySelector("input").value, 10),
      weight: parseFloat(row.cells[2].querySelector("input").value),
      fragile: row.cells[3].querySelector("select").value === "true",
      notes: row.cells[4].querySelector("input").value,
    }));
  
    const exceptionLogs = Array.from(document.getElementById("exceptionLogsList").children).map((row) => ({
      timestamp: new Date(row.cells[0].querySelector("input").value),
      message: row.cells[1].querySelector("input").value,
    }));
  
    const data = {
        requestId: document.getElementById("requestId").value,
        requestDate: document.getElementById("requestDate").value,
        status: document.getElementById("status").value,

      customer: {
        customerId: document.getElementById("customerId").value,
        customerName: document.getElementById("customerName").value,
        contactNumber: document.getElementById("contactNumber").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
      },
      source: {
        address: document.getElementById("sourceAddress").value,
        city: document.getElementById("sourceCity").value,
        pincode: document.getElementById("sourcePincode").value,
      },
      destination: {
        address: document.getElementById("destinationAddress").value,
        city: document.getElementById("destinationCity").value,
        pincode: document.getElementById("destinationPincode").value,
      },
      items,
      transportation: {
        vehicleType: document.getElementById("vehicleType").value,
        numberOfVehicles: parseInt(document.getElementById("numberOfVehicles").value, 10),
        packagingRequired: document.getElementById("packagingRequired").value === "true",
        insuranceRequired: document.getElementById("insuranceRequired").value === "true",
      },
      pricing: {
        estimatedCost: parseFloat(document.getElementById("estimatedCost").value),
        finalCost: parseFloat(document.getElementById("finalCost").value),
        paymentStatus: document.getElementById("paymentStatus").value,
        paymentMode: document.getElementById("paymentMode").value,
      },
      operationalDetails: {
        pickupDate: document.getElementById("pickupDate").value,
        deliveryDate: document.getElementById("deliveryDate").value,
        assignedDriverId: document.getElementById("assignedDriverId").value,
        assignedVehicleId: document.getElementById("assignedVehicleId").value,
        trackingUrl: document.getElementById("trackingUrl").value,
        exceptionLogs,
      },
    };
  
    try {
      let response;
      if (editingRequestId) {
        response = await fetch(`${apiUrl}/${editingRequestId}`, {
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
      alert(editingRequestId ? "Request updated successfully!" : "Request created successfully!");
      fetchRequests();
      toggleForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
    }
  }

// Function to fetch requests
async function fetchRequests() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const { records, totalCount } = await response.json();

    requests = records;
    renderTable();
    updatePageInfo(totalCount);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
}

// Function to render the table
function renderTable() {
  const list = document.getElementById('packersMoversList');
  list.innerHTML = '';

  requests.forEach((request) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${request.requestId}</td>
      <td>${request.customer.customerName}</td>
      <td>${request.source.city}</td>
      <td>${request.destination.city}</td>
      <td>${new Date(request.requestDate).toLocaleDateString()}</td>
      <td>${request.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editRequest('${request._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRequest('${request._id}')">Delete</button>
      </td>
    `;
    list.appendChild(row);
  });
}

async function editRequest(id) {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      const request = await response.json();
  
      // Populate new fields
      document.getElementById("requestId").value = request.requestId;
      document.getElementById("requestDate").value = request.requestDate.split("T")[0];
      document.getElementById("status").value = request.status;
  
      // Populate customer info
      document.getElementById("customerId").value = request.customer.customerId;
      document.getElementById("customerName").value = request.customer.customerName;
      document.getElementById("contactNumber").value = request.customer.contactNumber;
      document.getElementById("email").value = request.customer.email;
      document.getElementById("address").value = request.customer.address;
  
      // Populate source details
      document.getElementById("sourceAddress").value = request.source.address;
      document.getElementById("sourceCity").value = request.source.city;
      document.getElementById("sourcePincode").value = request.source.pincode;
  
      // Populate destination details
      document.getElementById("destinationAddress").value = request.destination.address;
      document.getElementById("destinationCity").value = request.destination.city;
      document.getElementById("destinationPincode").value = request.destination.pincode;
  
      // Populate items dynamically
      const itemsList = document.getElementById("itemsList");
      itemsList.innerHTML = "";
      request.items.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="text" value="${item.itemName}" class="form-control"></td>
          <td><input type="number" value="${item.quantity}" class="form-control"></td>
          <td><input type="number" value="${item.weight || ''}" class="form-control"></td>
          <td>
            <select class="form-select">
              <option value="false" ${!item.fragile ? "selected" : ""}>No</option>
              <option value="true" ${item.fragile ? "selected" : ""}>Yes</option>
            </select>
          </td>
          <td><input type="text" value="${item.notes || ''}" class="form-control"></td>
          <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteItem(this)">Delete</button>
          </td>
        `;
        itemsList.appendChild(row);
      });
  
      // Populate transportation details
      document.getElementById("vehicleType").value = request.transportation.vehicleType;
      document.getElementById("numberOfVehicles").value = request.transportation.numberOfVehicles;
      document.getElementById("packagingRequired").value = request.transportation.packagingRequired ? "true" : "false";
      document.getElementById("insuranceRequired").value = request.transportation.insuranceRequired ? "true" : "false";
  
      // Populate pricing details
      document.getElementById("estimatedCost").value = request.pricing.estimatedCost;
      document.getElementById("finalCost").value = request.pricing.finalCost || '';
      document.getElementById("paymentStatus").value = request.pricing.paymentStatus;
      document.getElementById("paymentMode").value = request.pricing.paymentMode;
  
      // Populate operational details
      document.getElementById("pickupDate").value = request.operationalDetails.pickupDate.split("T")[0];
      document.getElementById("deliveryDate").value = request.operationalDetails.deliveryDate ? request.operationalDetails.deliveryDate.split("T")[0] : '';
      document.getElementById("assignedDriverId").value = request.operationalDetails.assignedDriverId || '';
      document.getElementById("assignedVehicleId").value = request.operationalDetails.assignedVehicleId || '';
      document.getElementById("trackingUrl").value = request.operationalDetails.trackingUrl || '';
  
      // Populate exception logs dynamically
      const exceptionLogsList = document.getElementById("exceptionLogsList");
      exceptionLogsList.innerHTML = "";
      request.operationalDetails.exceptionLogs.forEach((log) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="datetime-local" value="${new Date(log.timestamp).toISOString().slice(0, 16)}" class="form-control"></td>
          <td><input type="text" value="${log.message}" class="form-control"></td>
          <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteExceptionLog(this)">Delete</button>
          </td>
        `;
        exceptionLogsList.appendChild(row);
      });
  
      // Mark editing mode and show form
      editingRequestId = id;
      toggleForm(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
      alert(`Error: ${error.message}`);
    }
  }
    

// Function to delete a request
async function deleteRequest(id) {
  if (!confirm('Are you sure you want to delete this request?')) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());

    alert('Request deleted successfully!');
    fetchRequests();
  } catch (error) {
    console.error('Error deleting request:', error);
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
  fetchRequests();
}

// Function to navigate to the previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchRequests();
  }
}

// Function to navigate to the next page
function nextPage() {
  currentPage++;
  fetchRequests();
}

// Fetch requests on page load
fetchRequests();
