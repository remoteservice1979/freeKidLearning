var oktaConfig = {
  baseUrl: "https://dev-457161.okta.com",
  clientId: "aus637uk1ZGj660Y55d5",
  authParams: {
      issuer: "https://dev-457161.okta.com/oauth2/aus637uk1ZGj660Y55d5",
    responseType: ["token", "00O76RXZkUg_5aU_vKhukZQ84hhnBKub0Igp1xakxZ"],
      display: "page"
  },
  logo: '../static/cynorix.png'
}
// https://dev-457161.okta.com/oauth2/default/.well-known/oauth-authorization-server
var okta = new OktaSignIn(oktaConfig);

// Render the login form anil
function showLogin() {
  okta.renderEl({ el: "#okta-login-container" }, function(res) {}, function(err) {
    alert("Couldn't render the login form, something horrible must have happened. Please refresh the page.");
  });

  document.getElementById("login").style.display = "none";
}

// Determine whether or not we have a querystring.
function hasQueryString() {
  return location.href.indexOf("?") !== -1;
}

// Handle the user's login and what happens next.
function handleLogin() {
  // If the user is logging in for the first time...
  if (okta.token.hasTokensInUrl()) {
    okta.token.parseTokensFromUrl(
      function success(res) {
        // Save the tokens for later use, e.g. if the page gets refreshed:
        okta.tokenManager.add("accessToken", res[0]);
        okta.tokenManager.add("idToken", res[1]);

        // Redirect to this user's dedicated room URL.
        window.location = getRoomURL();
      }, function error(err) {
        alert("We weren't able to log you in, something horrible must have happened. Please refresh the page.");
      }
    );
  } else {
    okta.session.get(function(res) {

      // If the user is logged in, display the app.
      if (res.status === "ACTIVE") {
        console.log("you are already logged in!")
        // If the user is logged in on the home page, redirect to their room page.
        if (!hasQueryString()) {
          window.location = getRoomURL();
        }

        return enableVideo();
      }

      // If we get here, the user is not logged in.

      // If there's a querystring in the URL, it means this person is in a
      // "room" so we should display our passive login notice. Otherwise,
      // we'll prompt them for login immediately.
      console.log("you are not logged in")
      if (hasQueryString()) {
        document.getElementById("login").style.display = "block";
        enableVideo();
      } else {
        showLogin();
      }
    });
  }
}

// Logout function
function logout() {
  console.log("logout clicked!!");
  okta.signOut();
  window.location = location.protocol + "//" + location.host + (location.path || "");
}
