//Load Page
function loadPage(page_name){
  $.ajax({
    method:'get',
    url:`../../public/pages/${page_name}`,
    success:(res)=>{
      $("section").html(res);
    },
    error:()=>{
      $("section").html(`<h2>Page Was Not Found !!!</h2>`);
    }
  })
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
       console.log(res.user); // Debug log
      if(res.user)
      {
        $('.auth-section').addClass('d-none');
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
    loadPage("login.html")
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
      }
    })
  })

  //Log in Button Click - user Login
  $(document).on('click','#btnUserLogIn',()=>{

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

        loadPage("jobs.html")
      },
      error: function(xhr) {
        alert(xhr.responseJSON?.error || 'Login failed');
      }
    })
  })

  //OnClick - LogOut
  $(document).on('click', '#logoutBtn', function() {

    loadPage("home.html");
    // Clear both client-side storage
    localStorage.removeItem('token');
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Update UI
    $('.auth-section').removeClass('d-none');
    $('.user-section').addClass('d-none');
  });

  //Job Form Displayed
  $(document).on('click','#createJobBtn',()=>{
    loadPage("createJob.html");

  })

  //Job Form Displayed
  $(document).on('click','#btnCancel',()=>{
    loadPage("jobs.html");
  })
})