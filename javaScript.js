const apiUrl = 'http://localhost:3000/api/users';
document.addEventListener("DOMContentLoaded", () => {
    loadFromCookies();
    fetchData();
});

function saveDataToCookies(data) {
    Cookies.set('userData', JSON.stringify(data), { expires: 7 });
}

function loadFromCookies() {
    const savedData = Cookies.get('userData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            displayData(data);
        } catch (error) {
            console.error("Error parsing cookie data:", error);
        }
    }
}

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        saveDataToCookies(data);
        displayData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayData(data) {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.first_name}</td>
            <td>${item.email}</td>
        `;
        dataList.appendChild(row);
    });
}

async function addData() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const value = document.getElementById('value').value;

    try {
        const currentData = JSON.parse(Cookies.get('userData') || '[]');
        if (currentData.some(item => item.id == id)) {
            alert("Error: ID already exists!");
            return;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, first_name: name, email: value })
        });
        const newData = await response.json();

        currentData.push(newData);
        saveDataToCookies(currentData);

        addRowToTable(newData);
    } catch (error) {
        console.error("Error adding data:", error);
    }
}

async function updateData() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const value = document.getElementById('value').value;

    try {
        const currentData = JSON.parse(Cookies.get('userData') || '[]');
        const index = currentData.findIndex(item => item.id == id);

        if (index === -1) {
            alert("Error: ID does not exist!");
            return;
        }

        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: name, email: value })
        });
        const updatedData = await response.json();

        currentData[index] = updatedData;
        saveDataToCookies(currentData);

        updateRowInTable(id, updatedData);
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

async function deleteData() {
    const id = document.getElementById('id').value;

    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

        // Update cookies by removing deleted item
        const currentData = JSON.parse(Cookies.get('userData') || '[]');
        const updatedData = currentData.filter(item => item.id != id);
        saveDataToCookies(updatedData);

        deleteRowFromTable(id);
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

function addRowToTable(item) {
    const dataList = document.getElementById('dataList');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.first_name}</td>
        <td>${item.email}</td>
    `;
    dataList.appendChild(row);
}

function updateRowInTable(id, item) {
    const rows = document.querySelectorAll('#dataList tr');
    rows.forEach(row => {
        if (row.children[0].innerText == id) {
            row.children[1].innerText = item.first_name;
            row.children[2].innerText = item.email;
        }
    });
}

function deleteRowFromTable(id) {
    const rows = document.querySelectorAll('#dataList tr');
    rows.forEach(row => {
        if (row.children[0].innerText == id) {
            row.remove();
        }
    });
}
