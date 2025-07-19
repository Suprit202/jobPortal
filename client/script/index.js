$(document).ready(function() {
  // Fetch jobs
  $.ajax({
    url: '/api/jobs',
    method: 'GET',
    success: function(jobs) {
      let html = '';
      jobs.forEach(job => {
        html += `<div class="job"><h3>${job.title}</h3><p>${job.description}</p></div>`;
      });
      $('#content').html(html);
    },
    error: function(err) {
      console.error('Error fetching jobs:', err);
    }
  });
});