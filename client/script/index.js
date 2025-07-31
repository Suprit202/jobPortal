//Decode token
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error("Invalid JWT token", e);
    return {};
  }
}

//loadPage Function
function loadPage(page_name, callback = null) {
  
  $.ajax({
    method: 'GET',
    url: `../../public/pages/${page_name}`,
    success: (res) => {
      $("section").html(res);
      if (typeof callback === 'function') {
        callback(); 
      }
    },
    error: () => {
      $("section").html(`<h2>Page Was Not Found !!!</h2>`);
    }
  });
}

//Check Authentication
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  // console.log(token);
  
  $.ajax({
    method:'GET',
    url: 'http://localhost:5000/api/auth/check',
    headers: {
       'Authorization': `Bearer ${token}` 
    },
    success: function(res) {
      //  console.log(res.user); // Debug log
      if(res.user)
      {
        $('.auth-section').addClass('d-none');
        $('.search-bar').removeClass('d-none');
        $('.user-section').removeClass('d-none');
        $('#user-email').text(res.user.email);
      }
    },
    error: function(xhr) {
        if (xhr.status === 401) { // Unauthorized
        localStorage.removeItem('token');
        $('.auth-section').addClass('d-none');
        $('.user-section').removeClass('d-none');
      }
      // For other errors (500, network issues), keep the token
      console.error('Auth check failed:', xhr.status, xhr.responseText);
    }
  });
}

//loadJobs Function
function loadJobs(callback = null) {

  const token = localStorage.getItem('token');

  $.ajax({
    method: 'GET',
    url: 'http://localhost:5000/api/jobs/getJobs',
    headers: {
      'Authorization': `Bearer ${token}` // ✅ Send token in headers
    },
    success: (jobs) => {
      let html = '';

      if (jobs.length === 0) {
        html += '<p class="h1 text-center">No Jobs Available</p>';
      } else {
        jobs.forEach(job => {
          html += `
                  <div>
                      <div class="bg-white position-relative text-black p-4 my-2 rounded rounded-3 shadow-sm">
                        <h3 class="font-monospace fw-bold">${job.title}</h3>
                        <p class="fw-semibold">Description: <span class="fw-light fw-bold">${job.description}</span></p>
                        <p class="fw-semibold">Salary: <span class="fw-light">${job.salary}</span></p>
                        <p class="fw-semibold">Skills Required: <span class="fw-light">${job.skills}</span></p>
                        <p class="fw-semibold">Job Location: <span class="fw-light">${job.location}</span></p>
                        <div class="me-3 mb-3 position-absolute bottom-0 end-0">
                          <span><button value=${job._id} class="btnEditJob btn btn-warning d-none"><span class="bi bi-pen"></span></button></span>
                          <span><button value=${job._id} class="btnDeleteJob btn btn-danger ms-1 d-none"><span class="bi bi-trash"></span></button></span>
                        </div>
                      </div>
                  </div>
                 `;
        });
      }

      $('#jobSection').html(html);

      // ✅ Role check: Only admin can see edit/delete
      const decoded = parseJwt(token);
      if (decoded.role === 'admin') {
        $('.btnEditJob, .btnDeleteJob').removeClass('d-none');
      }

      if (typeof callback === 'function') {
        callback();
      }
      
    },
    error: () => {
      $("#jobSection").html(`<p>Error loading jobs</p>`);
    }
  });
}

//Search Job Function
function searchJobs(keyword) {

  const token = localStorage.getItem('token');

  $.ajax({
    method: 'GET',
    url: 'http://localhost:5000/api/jobs/getJobs',
    headers: {
      'Authorization': `Bearer ${token}` // ✅ Send token in headers
    },
    success: (jobs) => {
      let html = '';
      const search = keyword.trim().toLowerCase();

    const filteredJobs = jobs.filter(job =>
      (job.title?.toLowerCase().includes(search)) ||
      (job.description?.toLowerCase().includes(search)) ||
      (job.location?.toLowerCase().includes(search))
    ); //means that one of the fields like job.title, job.description, or job.location is null or undefined.

      if (filteredJobs.length === 0) {
        html += '<p class="text-center">No matching jobs found.</p>';
      } else {
        filteredJobs.forEach(job => {
          html += `
            <div>
              <div class="bg-white position-relative text-black p-4 my-2 rounded rounded-3 shadow-sm">
                <h3 class="font-monospace fw-bold">${job.title}</h3>
                <p class="fw-semibold">Description: <span class="fw-light fw-bold">${job.description}</span></p>
                <p class="fw-semibold">Salary: <span class="fw-light">${job.salary}</span></p>
                <p class="fw-semibold">Skills Required: <span class="fw-light">${job.skills}</span></p>
                <p class="fw-semibold">Job Location: <span class="fw-light">${job.location}</span></p>
                <div class="me-3 mb-3 position-absolute bottom-0 end-0">
                  <button class="btn btn-warning btnEditJob" value="${job._id}"><span class="bi bi-pen"></span></button>
                  <button class="btn btn-danger btnDeleteJob ms-1" value="${job._id}"><span class="bi bi-trash"></span></button>
                </div>
              </div>
            </div>
          `;
        });
      }

      $('#jobSection').html(html);
    },
    error: () => {
      $('#jobSection').html(`<p class="text-danger text-center">Error loading jobs.</p>`);
    }
  });
}





//Main Logic
$(function(){
  // Load Home Page
  loadPage("home.html");

  //New User button-click - on home
  $(document).on('click','#btnSignIn',()=>{
    loadPage("register.html")
  })

  //New User button-click - on home
  $(document).on('click','#btnLogIn ',()=>{
    loadPage("login.html");
  })

  //Register Button Click - Post Data to Users
  $(document).on('click','#btnRegister',()=>{
    const formData = {
      name: $("#name").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      role: $("#role").val()
    }

    $.ajax({
      method:'post',
      url:`http://localhost:5000/api/auth/register`,
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success:() => {
        alert(`Registration Successful! please Login.`);
        loadPage("login.html");
      },
      error: function(xhr) {
        alert(xhr.responseJSON?.error || 'Login failed');
      }
    })
  })

  //Log in Button Click - user Login
  $(document).on('click','#btnUserLogIn',(e)=>{
    e.preventDefault();

    const formData ={
      email:$('#login-email').val(),
      password:$('#login-password').val()
    };

    $.ajax({
      method:'POST',
      url:`http://localhost:5000/api/auth/login`,
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success:(res) => {
        if(res.token){
          localStorage.setItem('token', res.token);
        }
        
        checkAuthStatus();

        loadPage('jobs.html', () => {

          const decoded = parseJwt(res.token);

          if (decoded.role === 'admin') {
            $('#createJobBtn').removeClass('d-none'); // show admin-only buttons/sections
            $('.btnEditJob').removeClass('d-none'); // show admin-only buttons/sections
            $('.btnDeleteJob').removeClass('d-none'); // show admin-only buttons/sections
          } else {
            $('#createJobBtn').addClass('d-none'); // hide them
          }

          loadJobs(); // ✅ reload after page is loaded
        });

      },
      error: function(xhr) {
        alert(xhr.responseJSON?.error || 'Login failed');
      }
    })
  })

  //OnClick - LogOut
  $(document).on('click', '#logoutBtn', function() {
    const choice = confirm(`Are you really want sign out?`);
    
    if(choice === true)
    {
      loadPage("home.html");
    }
    
    // Clear both client-side storage
    localStorage.removeItem('token');
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Update UI
    $('.auth-section').removeClass('d-none');
    $('.user-section').addClass('d-none');
    $('.search-bar').addClass('d-none');
  });

  //Job Form Displayed
  $(document).on('click','#createJobBtn',()=>{
    loadPage("createJob.html");

  })

  //Cancel btn -- on job creation
  $(document).on('click','#btnCancel',(e)=>{
    e.preventDefault();

    loadPage('jobs.html', () => {
      // const decoded = parseJwt(res.token)
      // if (decoded.role === 'admin') {
      //   $('#createJobBtn').removeClass('d-none'); // show admin-only buttons/sections
      // } else {
      //   $('#createJobBtn').addClass('d-none'); // hide them
      // }

      loadJobs(); // ✅ reload after page is loaded
    });

  })

  //Post Job- onClick btn
  $(document).on('click','#btnPost',(e)=>{
    e.preventDefault();

    const token = localStorage.getItem('token');

    const formData = {
      title: $('#jobTitle').val(),
      description: $('#jobDes').val(),
      salary: $('#jobSalary').val(),
      skills: $('#jobSkill').val().split(',').map(skill => skill.trim()),
      location:$('#jobLocation').val()
    };

    $.ajax({
      method:'POST',
      url:'http://localhost:5000/api/jobs/createJob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success:()=>{
        alert('Job Created Successfully! Check Job Board');

      loadPage('jobs.html', () => {        
        loadJobs(); // ✅ reload after page is loaded
      });

      },
      error:(xhr) => {
        alert(xhr.responseJSON?.error || 'job creation faild');
      }
    })
  })

  //Edit job window- onClick edit
  $(document).on('click', '.btnEditJob', function () {

    const token = localStorage.getItem('token');

    const jobId = $(this).val(); // ✅ this gets the value of the clicked button
  
    // Optionally, load the page after the job is fetched
    // or delay AJAX call slightly until the page loads
    loadPage('editJob.html', () => {
      // Perform AJAX call after edit page is loaded
      $.ajax({
        method: 'GET',
        url: `http://localhost:5000/api/jobs/getJobById/${jobId}`,
        headers: {
              'Authorization': `Bearer ${token}` // ✅ Send token in headers
        },
        contentType: 'application/json',
        success: (job) => {
          $('#editJobTitle').val(job.title);
          $('#editJobDes').val(job.description);
          $('#editJobSalary').val(job.salary);
          $('#editJobSkill').val(job.skills);
          $('#editJobLocation').val(job.location);
          sessionStorage.setItem("job_id", job._id);
        },
        error: (xhr) => {
          alert(xhr.responseJSON?.error || 'Failed to fetch job');
        }
      });
    });
  });


  //Edit content saved- onClick save
  $(document).on('click','#btnEditSave',()=>{

    const token = localStorage.getItem('token');

    var formData = {
        title: $('#editJobTitle').val(),
        description: $('#editJobDes').val(),
        salary: $('#editJobSalary').val(),
        skills: $('#editJobSkill').val(),
        location:$('#editJobLocation').val()
    }

    $.ajax({
      method:'PUT',
      url:`http://localhost:5000/api/jobs/editJob/${sessionStorage.getItem('job_id')}`,
      contentType: 'application/json',
      headers: {
            'Authorization': `Bearer ${token}` // ✅ Send token in headers
      },
      data: JSON.stringify(formData),
      success:(job)=>{
      loadPage('jobs.html', () => {        
        loadJobs(); // ✅ reload after page is loaded
      });
      },
      error:(xhr) => {
        alert(xhr.responseJSON?.error || 'job creation faild');
      }
    })
  })

  //Delete content saved- onClick delete
  $(document).on('click','.btnDeleteJob',function(){

    const token = localStorage.getItem('token');

    const jobId = $(this).val();

    $.ajax({
      method:'DELETE',
      url:`http://localhost:5000/api/jobs/deleteJob/${jobId}`,
      headers: {
          'Authorization': `Bearer ${token}` // ✅ Send token in headers
      },
      contentType: 'application/json',
      success:(job)=>{
        alert(`Job post was deleted!`);
        loadPage('jobs.html', () => {
          loadJobs(); // ✅ reload after page is loaded
        });
      },
      error:(xhr) => {
        alert(xhr.responseJSON?.error || 'Job Can not deleted!');
      }
    })
  })
 

  //Not want to edit- onClick cancel
  $(document).on('click','#btnEditCancel',(e)=>{
      loadPage('jobs.html', () => {
        loadJobs(); // ✅ reload after page is loaded
      });
  })

  // Search on button click
  $(document).on('click', '#searchBtn', function () {
    const keyword = $('#searchInput').val();
    searchJobs(keyword);
  });
  
  // Optional: Search on Enter key
  $('#searchInput').on('keypress', function (e) {
    if (e.which === 13) { //13 is keycode of  'Enter -> key'
      const keyword = $(this).val();
      searchJobs(keyword);
    }
  });


})