// get references to the elements we need to manipulate
const activeRolesDiv = document.getElementById("active-roles");
const inDemandRolesDiv = document.getElementById("in-demand-roles");
const historyDiv = document.getElementById("history");

// define the endpoint URLs for the data
const activeRolesEndpoint = "/roles/active-roles";
const inDemandRolesEndpoint = "/roles/in-demand-roles";
const historyEndpoint = "/roles/history";


// function to fetch data and update the DOM
function fetchDataAndUpdateDOM(endpoint, div) {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      // loop through the data and create a list of items
      const list = document.createElement("ul");
      data.forEach((item) => {
        const listItem = document.createElement("li");
        //Grab the name
        listItem.textContent = item.name;
         // Add a class to the list items
         listItem.classList.add('list-item-style');
         
        list.appendChild(listItem);
      });
      // add the list to the div
      div.appendChild(list);
      div.style.height = 'auto';
    })
    .catch((error) => {
      console.error(`Error fetching data from ${endpoint}: ${error}`);
    });
}

function updateDOMWithHeadingAndDescription(endpoint, div) {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const heading = document.createElement("h3");
        heading.textContent = item.name;
        const description = document.createElement("p");
        description.textContent = item.description;

        div.appendChild(heading);
        div.appendChild(description);
      });

      // Resize the parent div
      div.style.height = 'auto';
    })
    .catch((error) => {
      console.error(`Error fetching data from ${endpoint}: ${error}`);
    });
}

// call the functions to fetch the data and update the DOM
updateDOMWithHeadingAndDescription(activeRolesEndpoint, activeRolesDiv);
fetchDataAndUpdateDOM(inDemandRolesEndpoint, inDemandRolesDiv);
fetchDataAndUpdateDOM(historyEndpoint, historyDiv);


//Modal form logic
const openModalButton = document.getElementById('open-modal');
const modal = document.getElementById('modal');
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');

const searchItems = async (searchQuery) => {
  const response = await fetch('/roles/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ searchQuery })
  });
  const data = await response.json();
  return data;
}

const renderSearchResults = (results) => {
  searchResults.innerHTML = '';
  results.forEach(result => {
    const li = document.createElement('li');
    li.dataset.roleId = result.id; // update the data attribute to use "id" instead of "roleId"
    const button = document.createElement('button');
    button.textContent = result.name;

    button.addEventListener('click', (event) => {
      event.preventDefault(); // prevent the default behavior of the button click

      fetch('/roles/newrole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `roleId=${encodeURIComponent(li.dataset.roleId)}`
      })
      .then(response => {
        if (response.ok) {
          modal.style.display = 'none'; // close the modal
          updateDOMWithHeadingAndDescription(activeRolesEndpoint, activeRolesDiv);
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error(error);
      });
    });

    li.appendChild(button);
    searchResults.appendChild(li);
  });
};

openModalButton.addEventListener('click', () => {
  modal.style.display = 'block';
  searchForm.reset();
  searchForm.querySelector('input[type=text]').focus();
});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchQuery = searchForm.elements['search-query'].value;
  const results = await searchItems(searchQuery);
  renderSearchResults(results);
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});