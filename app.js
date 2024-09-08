const BACKEND_CONSULTANTS = 'https://back-demo-001-cnacf2c3cta4embv.northeurope-01.azurewebsites.net';
const BACKEND_INTELL_MISSION_PROPOSER = 'https://back-inteligent-mission-proposer-001-cpckegfpdna5c8ah.northeurope-01.azurewebsites.net';

    
$(document).ready(function() {

    

    
    let currentSkills = [];

    function loadConsultants() {
        $.get(`${BACKEND_CONSULTANTS}/consultants`, function(data) {
            $('#consultant-list').empty();
            $('#consultant-list').show();
            data.forEach(consultant => {
                $('#consultant-list').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${consultant.firstName} ${consultant.lastName} (CIN: ${consultant.CIN})
                        <button class="btn btn-primary show-skills-btn" data-id="${consultant._id}" data-name="${consultant.firstName} ${consultant.lastName}">Show Skills</button>
                    </li>
                `);
            });
        }).fail(function() {
            alert('Error loading consultants.');
        });
    }

    // Show skills of the selected consultant
    $(document).on('click', '.show-skills-btn', function() {
        const consultantId = $(this).data('id');
        const consultantName = $(this).data('name');
        console.log(consultantId);
        $.get(`${BACKEND_CONSULTANTS}/consultants/${consultantId}`, function(consultant) {
            $('#skills-title').text(`Skills of ${consultantName}`);
            currentSkills = consultant.skills;
            $('#skills-list').empty();
            consultant.skills.forEach(skill => {
                $('#skills-list').append(`<li class="list-group-item">${skill}</li>`);
            });
            $('#skills-view').show();
            $('#back-btn').show();
        });
    });

    $('#back-btn').click(function() {

        loadConsultants();
    });
    // Suggest missions based on skills
   $('#suggest-missions-btn').click(function() {
        $.ajax({
            url: `${BACKEND_INTELL_MISSION_PROPOSER}/suggest-missions`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ skills: currentSkills }),
            success: function(missions) {
                $('#missions-list').empty();
                if (missions.length > 0) {
                    missions.forEach(mission => {
                        $('#missions-list').append(`<li class="list-group-item">${mission.name}</li>`);
                    });
                } else {
                    $('#missions-list').append(`<li class="list-group-item">No matching missions found</li>`);
                }
                $('#missions-view').show();
            },
            error: function() {
                alert('Error suggesting missions.');
            }
        });
    });
    
    // Load consultants initially
    loadConsultants();
});
