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
})