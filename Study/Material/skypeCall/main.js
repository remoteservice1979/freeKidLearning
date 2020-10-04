function el(elementId, username, action){
	document.getElementById(elementId).setAttribute("href", "skype:" + username + "?" + action);
}

function buildLinkRefs(){
	var username = document.getElementById("username").value;

 	el("call-btn", username, "call");
	el("add-to-contacts-btn", username, "add");
  el("view-profile-btn", username, "userinfo");
  el("voice-email-btn", username, "voicemail");
  el("chat-btn", username, "chat");
  el("sendfile-btn", username, "sendfile");
}

document.getElementById("username").addEventListener("change", function(){
	buildLinkRefs();
}, false);

buildLinkRefs();
