const apiUrl = 'http://localhost:3000/api/users';
let editingUserId = null;

let users = [];
let currentPage = 1;
let pageSize = 5;
let sortField = 'userId';
let sortOrder = 'asc';

// Function to toggle the form visibility
function toggleForm(forceShow = false) {
  const form = document.getElementById('userForm');
  const button = document.getElementById('toggleFormButton');

  if (button.textContent === 'Cancel') {
    // Reset and hide the form
    form.classList.add('d-none');
    button.textContent = 'Add User';
    document.getElementById('userForm').reset();
    editingUserId = null; // Exit edit mode
  } else if (form.classList.contains('d-none') || forceShow) {
    // Show the form
    form.classList.remove('d-none');
    button.textContent = 'Cancel';
  } else if (!editingUserId) {
    // Hide the form and reset if not in edit mode
    form.classList.add('d-none');
    button.textContent = 'Add User';
    document.getElementById('userForm').reset();
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    userId: document.getElementById('userId').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value,
  };

  try {
    if (editingUserId) {
      const response = await fetch(`${apiUrl}/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data, updatedAt: Date.now}),
      });
      if (response.ok) alert('User updated successfully!');
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert('User added successfully!');
    }
    fetchUsers();
    toggleForm();
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

// Fetch users
async function fetchUsers() {
  try {
    const response = await fetch(
      `${apiUrl}?page=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    users = data.users;
    renderUserTable();
    updatePageInfo(data.totalCount);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Render users
function renderUserTable() {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.userId}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>${new Date(user.updatedAt).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editUser('${user.userId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.userId}')">Delete</button>
      </td>
    `;
    userList.appendChild(row);
  });
}


async function editUser(userId) {
  try {
    const response = await fetch(`${apiUrl}/${userId}`);
    if (!response.ok) throw new Error("User not found.");

    const user = await response.json();

    // Populate the form fields with user data
    document.getElementById("userId").value = user.userId;
    document.getElementById("username").value = user.username;
    document.getElementById("role").value = user.role;
    document.getElementById("password").value = ""; // Password is not fetched for security

    editingUserId = userId;
    toggleForm(true); // Ensure the form is visible
  } catch (error) {
    console.error("Error fetching user details:", error);
    alert("Error fetching user details. Please try again.");
  }
}


async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`${apiUrl}/${userId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete user.");

    alert("User deleted successfully!");
    fetchUsers(); // Refresh the user list
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Error deleting user. Please try again.");
  }
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
  fetchUsers();
}

// Pagination controls
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchUsers();
  }
}

function nextPage() {
  currentPage++;
  fetchUsers();
}

// Initial fetch
fetchUsers();
