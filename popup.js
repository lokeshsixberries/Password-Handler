document.addEventListener('DOMContentLoaded', () => {
  const passwordsTbody = document.getElementById('passwords');
  const addButton = document.getElementById('addButton');
  const modal = document.getElementById('modal');
  const closeModal = document.querySelector('.close');
  const saveButton = document.getElementById('saveButton');
  const siteNameInput = document.getElementById('siteName');
  const passwordInput = document.getElementById('password');
  const modalTitle = document.getElementById('modalTitle');

  let editIndex = null;

  function renderPasswords(passwords) {
    passwordsTbody.innerHTML = '';
    passwords.forEach((entry, index) => {
      const row = document.createElement('tr');

      const siteNameCell = document.createElement('td');
      siteNameCell.textContent = entry.siteName;

      const passwordCell = document.createElement('td');
      const passwordInput = document.createElement('input');
      passwordInput.type = 'password';
      passwordInput.value = entry.password;
      passwordInput.disabled = true; // Disable editing
      passwordCell.appendChild(passwordInput);
      const truncatedPassword = entry.password.slice(0, 6); // Get the first 6 characters
      passwordCell.textContent = truncatedPassword;


      const actionsCell = document.createElement('td');

      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.className = 'btn';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(entry.password).then(() => {
          window.close();
        }).catch(err => {
          console.error('Failed to copy password: ', err);
        });
      });

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'btn';
      editButton.addEventListener('click', () => {
        editIndex = index;
        siteNameInput.value = entry.siteName;
        passwordInput.value = entry.password;
        passwordInput.type = 'password';
        modalTitle.textContent = 'Edit Password';
        modal.style.display = 'block';
      });

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete';
      deleteButton.className = 'btn btn-danger btn-sm';
      deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this password?')) {
          passwords.splice(index, 1);
          savePasswords(passwords);
        }
      });


      actionsCell.appendChild(copyButton);
      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);

      row.appendChild(siteNameCell);
      row.appendChild(passwordCell);
      row.appendChild(actionsCell);

      passwordsTbody.appendChild(row);
    });
  }

  function loadPasswords() {
    chrome.storage.sync.get('passwords', (data) => {
      const passwords = data.passwords || [];
      console.log('Loaded passwords:', passwords);  // Log loaded passwords
      renderPasswords(passwords);
    });
  }

  function savePasswords(passwords) {
    chrome.storage.sync.set({ passwords }, () => {
      console.log('Passwords saved:', passwords);  // Log passwords after saving
      loadPasswords();
    });
  }

  addButton.addEventListener('click', () => {
    editIndex = null;
    siteNameInput.value = '';
    passwordInput.value = '';
    modalTitle.textContent = '';
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  saveButton.addEventListener('click', () => {
    const siteName = siteNameInput.value;
    const password = passwordInput.value;

    if (siteName && password) {
      chrome.storage.sync.get('passwords', (data) => {
        const passwords = data.passwords || [];

        if (editIndex !== null) {
          passwords[editIndex] = { siteName, password };
        } else {
          passwords.push({ siteName, password });
        }

        savePasswords(passwords);
        modal.style.display = 'none';
      });
    } else {
      alert('Please fill out both fields.');
    }
  });

  loadPasswords();
});
