const API = "https://inventory-management-backend-2v3s.onrender.com";

let editMode = false;
let editBarcode = null;

window.onload = () => {
    loadItems();
};

function loadItems() {
    fetch(API)
        .then(res => res.json())
        .then(showItems);
}

function showItems(items) {
    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    items.forEach(item => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.barcode}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td class="action-btns">
                <button class="edit-btn" onclick="openEdit('${item.barcode}')">Edit</button>
                <button class="delete-btn" onclick="deleteItem('${item.barcode}')">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Modal
const modal = document.getElementById("itemModal");
document.getElementById("openAddModal").onclick = () => { openModal(false) };
document.getElementById("closeModal").onclick = () => modal.style.display = "none";

function openModal(isEdit) {
    modal.style.display = "flex";
    document.getElementById("modalTitle").textContent = isEdit ? "Edit Item" : "Add Item";
    editMode = isEdit;
}

function openEdit(barcode) {
    fetch(API + "/" + barcode)
        .then(res => res.json())
        .then(item => {
            document.getElementById("itemName").value = item.name;
            document.getElementById("itemBarcode").value = item.barcode;
            document.getElementById("itemPrice").value = item.price;
            document.getElementById("itemQuantity").value = item.quantity;
            
            editBarcode = barcode;
            openModal(true);
        });
}

// Save / Update
document.getElementById("itemForm").addEventListener("submit", event => {
    event.preventDefault();

    const item = {
        name: itemName.value,
        barcode: itemBarcode.value,
        price: parseFloat(itemPrice.value),
        quantity: parseInt(itemQuantity.value)
    };

    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `${API}/${editBarcode}` : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    }).then(() => {
        modal.style.display = "none";
        showToast(editMode ? "Item updated" : "Item added");
        loadItems();
    });
});

function deleteItem(barcode) {
    if (!confirm("Delete this item?")) return;
    
    fetch(API + "/" + barcode, { method: "DELETE" })
        .then(() => {
            showToast("Item deleted");
            loadItems();
        });
}

// Search
document.getElementById("search").onkeyup = function() {
    const q = this.value.toLowerCase();
    [...document.querySelectorAll("tbody tr")].forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
    });
};

// Toast
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
}

// Dark mode
document.getElementById("darkModeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};
