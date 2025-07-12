let employees = [...mockEmployees];
let filteredEmployees = [...employees];
let currentPage = 1;
let pageSize = 10;

// DOM Elements
const employeeList = document.getElementById("employeeList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const pageSizeSelect = document.getElementById("pageSizeSelect");
const paginationControls = document.getElementById("paginationControls");
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");

const formModal = document.getElementById("formModal");
const employeeForm = document.getElementById("employeeForm");
const formTitle = document.getElementById("formTitle");
const cancelBtn = document.getElementById("cancelBtn");

function renderEmployees() {
  employeeList.innerHTML = "";
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedEmployees = filteredEmployees.slice(start, end);

  paginatedEmployees.forEach(emp => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p>ID: ${emp.id}</p>
      <p>Email: ${emp.email}</p>
      <p>Department: ${emp.department}</p>
      <p>Role: ${emp.role}</p>
      <button class="edit-btn" onclick="editEmployee(${emp.id})">Edit</button>
      <button class="delete-btn" onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    employeeList.appendChild(card);
  });

  renderPagination();
}

function renderPagination() {
  paginationControls.innerHTML = "";
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active-page" : "";
    btn.onclick = () => {
      currentPage = i;
      renderEmployees();
    };
    paginationControls.appendChild(btn);
  }
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(query) ||
    emp.lastName.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderEmployees();
});

sortSelect.addEventListener("change", () => {
  const key = sortSelect.value;
  if (key) {
    filteredEmployees.sort((a, b) =>
      a[key].localeCompare(b[key])
    );
  }
  renderEmployees();
});

pageSizeSelect.addEventListener("change", () => {
  pageSize = parseInt(pageSizeSelect.value);
  currentPage = 1;
  renderEmployees();
});

filterToggle.addEventListener("click", () => {
  filterPanel.style.display = filterPanel.style.display === "block" ? "none" : "block";
});

applyFilterBtn.addEventListener("click", () => {
  const name = document.getElementById("filterName").value.toLowerCase();
  const dept = document.getElementById("filterDept").value.toLowerCase();
  const role = document.getElementById("filterRole").value.toLowerCase();

  filteredEmployees = employees.filter(emp => {
    return (
      emp.firstName.toLowerCase().includes(name) &&
      emp.department.toLowerCase().includes(dept) &&
      emp.role.toLowerCase().includes(role)
    );
  });

  currentPage = 1;
  renderEmployees();
});

addEmployeeBtn.addEventListener("click", () => {
  formTitle.textContent = "Add Employee";
  employeeForm.reset();
  document.getElementById("employeeId").value = "";
  formModal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  formModal.style.display = "none";
});

employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("employeeId").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const department = document.getElementById("department").value.trim();
  const role = document.getElementById("role").value.trim();

  if (!firstName || !lastName || !email || !department || !role) {
    alert("All fields are required.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  if (id) {
    // Edit
    const emp = employees.find(e => e.id == id);
    emp.firstName = firstName;
    emp.lastName = lastName;
    emp.email = email;
    emp.department = department;
    emp.role = role;
  } else {
    // Add
    const newEmp = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      department,
      role,
    };
    employees.push(newEmp);
  }

  filteredEmployees = [...employees];
  formModal.style.display = "none";
  renderEmployees();
});

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  formTitle.textContent = "Edit Employee";
  document.getElementById("employeeId").value = emp.id;
  document.getElementById("firstName").value = emp.firstName;
  document.getElementById("lastName").value = emp.lastName;
  document.getElementById("email").value = emp.email;
  document.getElementById("department").value = emp.department;
  document.getElementById("role").value = emp.role;

  formModal.style.display = "flex";
}

function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  employees = employees.filter(e => e.id !== id);
  filteredEmployees = [...employees];
  renderEmployees();
}

renderEmployees();
