const apiUrl = "http://localhost:3000/api/vehicles";
const imageStoreUrl = "http://localhost:3000/";
let currentPage = 1;
const pageSize = 18;
let allVehicles = [];

// Fetch vehicles with paging
async function fetchVehicles(page = 1, searchQuery = "") {
  const url = `${apiUrl}?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(searchQuery)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return { vehicles: [], totalCount: 0 };
  }
}

// Render vehicles in the list
function renderVehicles(vehicles) {
  const container = document.getElementById("vehicleListContainer");
  vehicles.forEach(vehicle => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card vehicle-card">
        <div id="carousel-${vehicle.vehicleId}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="${imageStoreUrl + (vehicle.image1 || 'uploads/placeholder.jpg')}" class="d-block w-100" alt="Vehicle Image 1">
            </div>
            <div class="carousel-item">
              <img src="${imageStoreUrl + (vehicle.image2 || 'uploads/placeholder.jpg')}" class="d-block w-100" alt="Vehicle Image 2">
            </div>
            <div class="carousel-item">
              <img src="${imageStoreUrl + (vehicle.image3 || 'uploads/placeholder.jpg')}" class="d-block w-100" alt="Vehicle Image 3">
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${vehicle.vehicleId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carousel-${vehicle.vehicleId}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title">${vehicle.make} ${vehicle.model}</h5>
          <p class="card-text">Year: ${vehicle.year} | Status: ${vehicle.status}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Load initial vehicles
async function loadInitialVehicles() {
  const data = await fetchVehicles(currentPage);
  allVehicles = data.vehicles;
  renderVehicles(allVehicles);
  updateLoadMoreButton(data.totalCount);
}

// Handle search functionality
async function handleSearch() {
  const searchQuery = document.getElementById("searchInput").value;
  currentPage = 1; // Reset to first page for new search
  const data = await fetchVehicles(currentPage, searchQuery);
  allVehicles = data.vehicles;
  document.getElementById("vehicleListContainer").innerHTML = ""; // Clear existing list
  renderVehicles(allVehicles);
  updateLoadMoreButton(data.totalCount);
}

// Load more vehicles
async function loadMoreVehicles() {
  currentPage++;
  const searchQuery = document.getElementById("searchInput").value;
  const data = await fetchVehicles(currentPage, searchQuery);
  allVehicles = [...allVehicles, ...data.vehicles];
  renderVehicles(data.vehicles);
  updateLoadMoreButton(data.totalCount);
}

// Update the state of the Load More button
function updateLoadMoreButton(totalCount) {
  const loadMoreButton = document.getElementById("loadMoreButton");
  if (allVehicles.length >= totalCount) {
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "No More Vehicles";
  } else {
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Load More";
  }
}

// Attach event listeners
document.getElementById("searchButton").addEventListener("click", handleSearch);

// Load the initial set of vehicles on page load
loadInitialVehicles();
