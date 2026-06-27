document.addEventListener("DOMContentLoaded", function () {

  var loginForm = document.getElementById("login-form");

  if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

      event.preventDefault();

      localStorage.setItem(
        "sitara_admin_login",
        "true"
      );

      window.location.href =
        "admin-dashboard.html";

    });

  }

});