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
         listItem.addEventListener("click", displayAgileProgramLeadDetails);
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
  // Replace "endpoint" with the URL for your server endpoint
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      updateActiveSkill(data, div);
    })
    .catch((error) => {
      console.error(`Error fetching data from ${endpoint}: ${error}`);
    });
}

function updateActiveSkill(data, div) {
  data.forEach((roleRecord) => {
    const startDate = new Date(roleRecord.startdate);
    const endDate = roleRecord.enddate ? new Date(roleRecord.enddate) : 'present';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const startMonthName = monthNames[startDate.getMonth()];
    const startYear = startDate.getFullYear();
    const endMonthName = endDate !== 'present' ? monthNames[endDate.getMonth()] : '';
    const endYear = endDate !== 'present' ? endDate.getFullYear() : '';

    const dateRange = `${startMonthName} ${startYear} to ${endDate === 'present' ? endDate : `${endMonthName} ${endYear}`}`;

    const heading = document.createElement("h3");

    const editButton = document.createElement('img');
    editButton.src = 'img/edit.png';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => {
      window.location.href = `/roles/editMyRole/${roleRecord.userRoleId}`;
    });

    heading.appendChild(editButton);
    heading.innerHTML += `${dateRange} - ${roleRecord.name}`;
    div.appendChild(heading);

    const description = document.createElement("p");
    description.textContent = roleRecord.description;
    description.dataset.Id = roleRecord.id

    description.addEventListener("click", () => {
      const createTestButtonForm = (label, roleId) => {
        const form = document.createElement("form");
        form.action = `/skillhierarchy/test-skills/${roleId}/${label}`;
        form.method = "get";
      
        const testButton = document.createElement("button");
        testButton.textContent = "Test me";
        form.appendChild(testButton);
      
        return form;
      };

      const createHeadingWithButton = (text, label, roleId) => {
        const wrapperDiv = document.createElement("div");
        wrapperDiv.style.display = "flex";
        wrapperDiv.style.alignItems = "center";
        wrapperDiv.style.justifyContent = "space-between";

        const heading = document.createElement("h2");
        heading.textContent = text;

        const testButtonForm = createTestButtonForm(label, roleId);

        wrapperDiv.appendChild(heading);
        wrapperDiv.appendChild(testButtonForm);

        return wrapperDiv;
      };

      const skillId = description.dataset.Id;
      const requiredTableDiv = document.querySelector("#required-table");
      const recommendedTableDiv = document.querySelector("#recommended-table");

      // Clear the content of the required-table and recommended-table divs
      requiredTableDiv.innerHTML = "";
      recommendedTableDiv.innerHTML = "";

      const requiredHeadingWithButton = createHeadingWithButton("Required Skills", "Required", skillId);
      requiredTableDiv.before(requiredHeadingWithButton);

      const recommendedHeadingWithButton = createHeadingWithButton("Recommended Skills", "Recommended", skillId);
      recommendedTableDiv.before(recommendedHeadingWithButton);
    
      const populateTable = (endpoint, containerId) => {
        fetch(endpoint)
          .then(response => response.json())
          .then(skills => {
            const table = document.createElement('table');
            table.innerHTML = `
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Seniority</th>
                  <th>Description</th>
                  <th>Test Date</th>
                  <th>Score</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');
    
            skills.forEach(skill => {
              const row = document.createElement('tr');
              const formattedDate = skill.resultdate
                ? new Date(skill.resultdate).toLocaleDateString()
                : 'Not Tested';
              const score = skill.score !== null ? skill.score : 0;
              const rank = 'TBD';
              row.innerHTML = `
                <td>${skill.skillname}</td>
                <td>${skill.seniority}</td>
                <td>${skill.skilldescription}</td>
                <td>${formattedDate}</td>
                <td>${score}</td>
                <td>${rank}</td>
              `;
              tbody.appendChild(row);
            });
            
    
            const container = document.getElementById(containerId);
            container.appendChild(table);
          })
          .catch(error => {
            console.error(`Error fetching data from ${endpoint}: ${error}`);
          });
      };
    
      populateTable(`/roles/skills-required/${skillId}`, 'required-table');
      populateTable(`/roles/skills-recommended/${skillId}`, 'recommended-table');
    });        
    div.appendChild(description);
  });

  // Resize the parent div
  div.style.height = 'auto';
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

function displayAgileProgramLeadDetails() {
  const agileProgramLeadDiv = document.getElementById("agile-program-lead-details");
  agileProgramLeadDiv.innerHTML = ""; // Clear the existing content

  // Add your content here
  const heading = document.createElement("h3");
  heading.textContent = "Agile Program Lead";
  agileProgramLeadDiv.appendChild(heading);

  const description = document.createElement("p");
  description.textContent = "This is a description of the Agile Program Lead role.";
  agileProgramLeadDiv.appendChild(description);
}