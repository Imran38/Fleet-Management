const apiUrl = "http://localhost:3000/api/parcels"; // Replace with your actual API endpoint
let parcels = [];
let editingParcelId = null;
let currentPage = 1;
let pageSize = 5;
let sortField = "parcelId";
let sortOrder = "asc";

// Function to toggle the form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById("parcelForm");
  const button = document.getElementById("toggleFormButton");

  if (form.classList.contains("d-none") || forceShow) {
    form.classList.remove("d-none");
    button.textContent = "Cancel";
  } else {
    form.classList.add("d-none");
    button.textContent = "Add Parcel";
    form.reset();
    editingParcelId = null; // Reset edit mode
  }
}

// Function to handle form submission (Create or Update)
async function handleFormSubmit(event) {
    event.preventDefault();

    const trackingHistory = Array.from(document.getElementById("trackingHistoryList").children).map((row) => ({
        location: row.cells[0].querySelector("input").value,
        status: row.cells[1].querySelector("input").value,
        timestamp: new Date(row.cells[2].querySelector("input").value),
      }));
    
      const geoLocations = Array.from(document.getElementById("geoLocationList").children).map((row) => ({
        latitude: parseFloat(row.cells[0].querySelector("input").value),
        longitude: parseFloat(row.cells[1].querySelector("input").value),
      }));
    
      const exceptionLogs = Array.from(document.getElementById("exceptionLogsList").children).map((row) => ({
        timestamp: new Date(row.cells[0].querySelector("input").value),
        message: row.cells[1].querySelector("input").value,
      }));
  
    const data = {
      parcelId: document.getElementById("parcelId").value,
      trackingNumber: document.getElementById("trackingNumber").value,      
      parcelDetails: {
        weight: document.getElementById("weight").value,
        dimensions: {
          length: parseFloat(document.getElementById("length").value),
          width: parseFloat(document.getElementById("width").value),
          height: parseFloat(document.getElementById("height").value),
        },
        description: document.getElementById("description").value,
        specialInstructions: document.getElementById("specialInstructions").value,
        value: document.getElementById("value").value,
        category: document.getElementById("Category").value,
      },
      sender: {
        name: document.getElementById("senderName").value,
        address: document.getElementById("senderAddress").value,
        city: document.getElementById("senderCity").value,
        pincode: document.getElementById("senderCode").value,
        contact: {
          phone: document.getElementById("senderPhone").value,
          email: document.getElementById("senderEmail").value,
        },
      },
      recipient: {
        name: document.getElementById("recipientName").value,
        address: document.getElementById("recipientAddress").value,
        city: document.getElementById("recipientCity").value,
        pincode: document.getElementById("recipientCode").value,
        contact: {
          phone: document.getElementById("recipientPhone").value,
          email: document.getElementById("recipientEmail").value,
        },
      },
      tracking: {
        history: trackingHistory,
        geoLocation: geoLocations, 
      },
      transport: {
        routeId: document.getElementById("routeId").value,
        vehicleId: document.getElementById("vehicleId").value,
        driverId: document.getElementById("driverId").value,
        deliveryConfirmation: {
            signature: document.getElementById("deliverySignature").value,
            proofOfDelivery: document.getElementById("proofOfDelivery").value,
          },

      },

      conditionOnArrival: document.getElementById("conditionOnArrival").value,
      currentStatus: document.getElementById("currentStatus").value,

      payment: {
        shippingCost: parseFloat(document.getElementById("shippingCost").value),
        status: document.getElementById("paymentStatus").value,
        mode: document.getElementById("mode").value,        
        insuranceFee: parseFloat(document.getElementById("insuranceFee").value),
      },
      exceptionLogs,

    };
  
    try {
      let response;
      if (editingParcelId) {
        // Update parcel
        response = await fetch(`${apiUrl}/${editingParcelId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Create new parcel
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error submitting form.");
      }
  
      alert(editingParcelId ? "Parcel updated successfully!" : "Parcel created successfully!");
      fetchParcels();
      toggleForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  }
  

// Function to fetch parcels from the server
async function fetchParcels() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );

    if (!response.ok) throw new Error("Error fetching parcels");

    const data = await response.json();
    parcels = data; // Assuming the API returns a "parcels" field
    renderParcelsTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error("Error fetching parcels:", error);
  }
}

// Function to render the parcels table
function renderParcelsTable() {
  const parcelList = document.getElementById("parcelList");
  parcelList.innerHTML = "";

  parcels.forEach((parcel) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${parcel.parcelId}</td>
      <td>${parcel.trackingNumber}</td>
      <td>${parcel.sender.name}</td>
      <td>${parcel.recipient.name}</td>
      <td>${parcel.currentStatus}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editParcel('${parcel._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteParcel('${parcel._id}')">Delete</button>
      </td>
    `;
    parcelList.appendChild(row);
  });
}

// Function to update pagination info
function updatePageInfo(totalCount) {
  const pageInfo = document.getElementById("pageInfo");
  const totalPages = Math.ceil(totalCount / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to sort the table
function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    sortOrder = "asc";
  }
  fetchParcels();
}

// Pagination controls
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchParcels();
  }
}

function nextPage() {
  currentPage++;
  fetchParcels();
}

// Function to edit a parcel
async function editParcel(parcelId) {
    try {
      // Fetch parcel data by ID
      const response = await fetch(`${apiUrl}/${parcelId}`);
      if (!response.ok) throw new Error("Error fetching parcel data.");
      const parcel = await response.json();
  
      // Populate basic parcel details
      document.getElementById("parcelId").value = parcel.parcelId;
      document.getElementById("trackingNumber").value = parcel.trackingNumber;
      document.getElementById("weight").value = parcel.parcelDetails.weight;
      document.getElementById("length").value = parcel.parcelDetails.dimensions.length;
      document.getElementById("width").value = parcel.parcelDetails.dimensions.width;
      document.getElementById("height").value = parcel.parcelDetails.dimensions.height;
      document.getElementById("description").value = parcel.parcelDetails.description || "";
      document.getElementById("specialInstructions").value = parcel.parcelDetails.specialInstructions || "";
      document.getElementById("value").value = parcel.parcelDetails.value || "";
      document.getElementById("Category").value = parcel.parcelDetails.category || "";
  
      // Populate sender details
      document.getElementById("senderName").value = parcel.sender.name;
      document.getElementById("senderAddress").value = parcel.sender.address;
      document.getElementById("senderCity").value = parcel.sender.city || "";
      document.getElementById("senderCode").value = parcel.sender.pincode || "";
      document.getElementById("senderPhone").value = parcel.sender.contact.phone;
      document.getElementById("senderEmail").value = parcel.sender.contact.email;
  
      // Populate recipient details
      document.getElementById("recipientName").value = parcel.recipient.name;
      document.getElementById("recipientAddress").value = parcel.recipient.address;
      document.getElementById("recipientCity").value = parcel.recipient.city || "";
      document.getElementById("recipientCode").value = parcel.recipient.pincode || "";
      document.getElementById("recipientPhone").value = parcel.recipient.contact.phone;
      document.getElementById("recipientEmail").value = parcel.recipient.contact.email;
  
      // Populate tracking history
      const trackingHistoryList = document.getElementById("trackingHistoryList");
      trackingHistoryList.innerHTML = "";
      parcel.tracking.history.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="text" class="form-control" value="${entry.location}"></td>
          <td><input type="text" class="form-control" value="${entry.status}"></td>
          <td><input type="datetime-local" class="form-control" value="${new Date(entry.timestamp).toISOString().slice(0, 16)}"></td>
          <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button></td>
        `;
        trackingHistoryList.appendChild(row);
      });
  
      // Populate geolocation
      const geoLocationList = document.getElementById("geoLocationList");
      geoLocationList.innerHTML = "";
      parcel.tracking.geoLocation.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="number" class="form-control" value="${entry.latitude}"></td>
          <td><input type="number" class="form-control" value="${entry.longitude}"></td>
          <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button></td>
        `;
        geoLocationList.appendChild(row);
      });
  
      // Populate exception logs
      const exceptionLogsList = document.getElementById("exceptionLogsList");
      exceptionLogsList.innerHTML = "";
      parcel.exceptionLogs.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="datetime-local" class="form-control" value="${new Date(entry.timestamp).toISOString().slice(0, 16)}"></td>
          <td><input type="text" class="form-control" value="${entry.message}"></td>
          <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button></td>
        `;
        exceptionLogsList.appendChild(row);
      });
  
      // Populate transport details
      document.getElementById("routeId").value = parcel.transport.routeId || "";
      document.getElementById("vehicleId").value = parcel.transport.vehicleId || "";
      document.getElementById("driverId").value = parcel.transport.driverId || "";
      document.getElementById("deliverySignature").value = parcel.transport.deliveryConfirmation.signature || "";
      document.getElementById("proofOfDelivery").value = parcel.transport.deliveryConfirmation.proofOfDelivery || "";
  
      // Populate condition and status
      document.getElementById("conditionOnArrival").value = parcel.conditionOnArrival || "";
      document.getElementById("currentStatus").value = parcel.currentStatus;
  
      // Populate payment details
      document.getElementById("shippingCost").value = parcel.payment.shippingCost || 0;
      document.getElementById("paymentStatus").value = parcel.payment.status || "";
      document.getElementById("mode").value = parcel.payment.mode || "";
      document.getElementById("insuranceFee").value = parcel.payment.insuranceFee || 0;
  
      // Set edit mode and show the form
      editingParcelId = parcelId;
      toggleForm(true);
    } catch (error) {
      console.error("Error editing parcel:", error);
      alert("Error fetching parcel data. Please try again.");
    }
  }
  

// Function to delete a parcel
async function deleteParcel(parcelId) {
  if (!confirm("Are you sure you want to delete this parcel?")) return;

  try {
    const response = await fetch(`${apiUrl}/${parcelId}`, { method: "DELETE" });
    if (response.ok) {
      alert("Parcel deleted successfully!");
      fetchParcels();
    } else {
      throw new Error("Error deleting parcel");
    }
  } catch (error) {
    console.error("Error deleting parcel:", error);
    alert("Error deleting parcel. Please try again.");
  }
}


function addTrackingHistoryRow() {
    const table = document.getElementById("trackingHistoryList");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" class="form-control" placeholder="Location"></td>
      <td><input type="text" class="form-control" placeholder="Status"></td>
      <td><input type="datetime-local" class="form-control"></td>
      <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button></td>
    `;
    table.appendChild(row);
  }
  
  function addGeoLocationRow() {
    const table = document.getElementById("geoLocationList");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="number" class="form-control" placeholder="Latitude"></td>
      <td><input type="number" class="form-control" placeholder="Longitude"></td>
      <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button></td>
    `;
    table.appendChild(row);
  }
  
  function addExceptionLogRow() {
    const table = document.getElementById("exceptionLogsList");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="datetime-local" class="form-control"></td>
      <td><input type="text" class="form-control" placeholder="Message"></td>
      <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button></td>
    `;
    table.appendChild(row);
  }
  
  function removeRow(button) {
    const row = button.closest("tr");
    row.parentNode.removeChild(row);
  }
  

// Fetch parcels on page load
fetchParcels();
