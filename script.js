let selectedList = null;

document.getElementById('create-list-button').addEventListener('click', createList);
document.getElementById('list-name-input').addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
      //keycode 13 os for enter key
      createList();
    }
  });
document.getElementById('item-quantity').addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
      //keycode 13 os for enter key
      addItemToSelectedList();
    }
  });
document.getElementById('item-input').addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
      //keycode 13 os for enter key
      document.getElementById('item-quantity').focus();
    }
  });


document.getElementById('add-item-button').addEventListener('click', addItemToSelectedList);

function createList() {
  const listName = document.getElementById('list-name-input').value.trim();
  if (listName === '') return;

  const listContainer = document.createElement('div');
  listContainer.className = 'list-container';

  const listHeader = document.createElement('div');
  listHeader.className = 'list-header';
  listHeader.addEventListener('click', () => {
    const listItems = listContainer.querySelector('ul');
    listItems.style.display = listItems.style.display === 'none' ? 'block' : 'none';
    selectedList = listContainer;
    highlightSelectedList();
  });

  const listNameSpan = document.createElement('span');
  listNameSpan.textContent = listName;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete List';
  deleteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('lists-container').removeChild(listContainer);
    if (selectedList === listContainer) {
      selectedList = null;
      highlightSelectedList();
    }
  });

  listHeader.appendChild(listNameSpan);
  listHeader.appendChild(deleteButton);
  listContainer.appendChild(listHeader);

  const itemList = document.createElement('ul');
  itemList.style.display = 'none'; // Initially hide the item list

  listContainer.appendChild(itemList);
  document.getElementById('lists-container').appendChild(listContainer);
  document.getElementById('list-name-input').value = '';
}

function addItemToSelectedList() {
  if (!selectedList) {
    alert('Please select a list first.');
    return;
  }
  const itemName = document.getElementById('item-input').value.trim();
  const quantity = document.getElementById('item-quantity').value;

  addItem(selectedList, itemName, quantity);
}

function addItem(listContainer, itemName, quantity) {
  const itemList = listContainer.querySelector('ul');
  if (itemName.trim() === '' || quantity <= 0) return;

  const existingItem = Array.from(itemList.children).find(item => item.dataset.name === itemName);
  

  if (existingItem) {
    const currentQuantity = parseInt(existingItem.dataset.quantity);
    existingItem.dataset.quantity = currentQuantity + parseInt(quantity);
    existingItem.querySelector('.quantity').textContent = `x${existingItem.dataset.quantity}`;
  } else {
    const listItem = document.createElement('li');
    
    listItem.dataset.name = itemName;
    listItem.dataset.quantity = quantity;

    listItem.innerHTML = `
      ${Array.from(itemList.children).length + 1}.<span class="itemNamespan">${itemName}</span> <span class="quantity">x${quantity}</span>
      <div class="quantity-controls">
        <button onclick="updateQuantity(this, 1)">+</button>
        <button onclick="updateQuantity(this, -1)">-</button>
      </div>
      <button class="delete-button" onclick="deleteItem(this)">Delete</button>
    `;

    itemList.appendChild(listItem);
    
    Array.from(document.getElementsByClassName("itemNamespan")).find(item =>   item.addEventListener("click", (event) => {
    if (item.classList.contains("checked")) {
      item.classList.remove("checked");
    } else {
    item.classList.add("checked");
    }
}));
  }  

  document.getElementById('item-input').value = '';
  document.getElementById('item-quantity').value = '1';
}

function updateQuantity(button, change) {
  const listItem = button.closest('li');
  let quantity = parseInt(listItem.dataset.quantity) + change;

  if (quantity <= 0) {
    listItem.parentElement.removeChild(listItem);
  } else {
    listItem.dataset.quantity = quantity;
    listItem.querySelector('.quantity').textContent = `x${quantity}`;
  }
}

function deleteItem(button) {
  const listItem = button.parentElement;
  listItem.parentElement.removeChild(listItem);
}

function highlightSelectedList() {
  const lists = document.querySelectorAll('.list-container');
  lists.forEach(list => list.classList.remove('selected'));
  if (selectedList) {
    selectedList.classList.add('selected');
  }
}
