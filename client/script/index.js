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
  $.ajax({
    url: 'http://localhost:5000/api/jobs/authenticate',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    success: function(user) {
      alert(`Authentication Successful`)
      if (user) $('#user-email').text(user.email);
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
      xhrFields: {
        withCredentials: true // REQUIRED for cookies
      },
      crossDomain: true,
      data: JSON.stringify(formData),
      success:(res) => {
        
        if(res.token){
          localStorage.setItem('token',res.token);
        }

        checkAuthStatus();
        loadPage("jobs.html")
      }
    })
  })


})