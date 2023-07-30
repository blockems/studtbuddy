document.addEventListener('DOMContentLoaded', function() {
    var roleElement = document.getElementById('roleName');

    if(roleElement) { // Check if the element exists before adding an event listener
        roleElement.addEventListener('click', function() {
            var roleName = this.textContent;
            var competence = 'emergent';

            fetch('http://localhost:5001/getSkills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: roleName, competence: competence }),
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('results').innerHTML = JSON.stringify(data, null, 2);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    } else {
        console.error('Element with id "roleName" not found.');
    }
});

