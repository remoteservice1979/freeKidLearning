var oktaConfig = {
  baseUrl: "https://dev-457161.okta.com",
  clientId: "0oa635bfZhhSjdsPM5d5",
  authParams: {
      issuer: "https://dev-457161.okta.com/oauth2/default",
    responseType: ["token", "00sE5ktioDx54TXR2Vb48HAyEZK9p0EVSFR8Up7_uv"],
      display: "page"
  },
  logo: '../static/cynorix.png'
}
// https://dev-457161.okta.com/oauth2/default/.well-known/oauth-authorization-server
var okta = new OktaSignIn(oktaConfig);
function showLogin() {
    okta.renderEl(
        { el: "#okta-login-container" },
        function (res) {},
        function (err) {
            alert("Couldn't render the login form, something horrible must have happened. Please refresh the page.");
        }
    );
    document.getElementById("login").style.display = "none";
}
function hasQueryString() {
    return location.href.indexOf("?") !== -1;
}
function handleLogin() {
    if (okta.token.hasTokensInUrl()) {
        okta.token.parseTokensFromUrl(
            function success(res) {
                okta.tokenManager.add("accessToken", res[0]);
                okta.tokenManager.add("idToken", res[1]);
                window.location = getRoomURL();
            },
            function error(err) {
                alert("We weren't able to log you in, something horrible must have happened. Please refresh the page.");
            }
        );
    } else {
        okta.session.get(function (res) {
            if (res.status === "ACTIVE") {
                if (!hasQueryString()) {
                    window.location = getRoomURL();
                }
                return enableVideo();
            }
            if (hasQueryString()) {
                document.getElementById("login").style.display = "block";
                enableVideo();
            } else {
                showLogin();
            }
        });
    }
}
function getRoom() {
    var query = location.search && location.search.split("?")[1];
    if (query) {
        return location.search && decodeURIComponent(query.split("=")[1]);
    }
    return okta.tokenManager.get("idToken").claims.email;
}
function getRoomURL() {
    return location.protocol + "//" + location.host + (location.path || "") + "?room=" + getRoom();
}
function enableVideo() {
    document.getElementById("url").style.display = "block";
    document.getElementById("remotes").style.visibility = "visible";
    loadSimpleWebRTC();
}
function loadSimpleWebRTC() {
    var script = document.createElement("script");
    script.src = ""/static/js/latest-v3.js"";
    document.head.appendChild(script);
    script.onload = function () {
        var webrtc = new SimpleWebRTC({ localVideoEl: "selfVideo", remoteVideosEl: "", autoRequestMedia: true, debug: false, detectSpeakingEvents: true, autoAdjustMic: false });
        document.getElementById("roomUrl").innerText = getRoomURL();
        webrtc.on("readyToCall", function () {
            webrtc.joinRoom(getRoom());
        });
        function showVolume(el, volume) {
            if (!el) return;
            if (volume < -45) volume = -45;
            if (volume > -20) volume = -20;
            el.value = volume;
        }
        webrtc.on("localStream", function (stream) {
            var button = document.querySelector("form>button");
            if (button) button.removeAttribute("disabled");
            document.getElementById("localVolume").style.display = "block";
        });
        webrtc.on("localMediaError", function (err) {
            alert("This service only works if you allow camera access.Please grant access and refresh the page.");
        });
        webrtc.on("videoAdded", function (video, peer) {
            console.log("user added to chat", peer);
            var remotes = document.getElementById("remotes");
            if (remotes) {
                var outerContainer = document.createElement("div");
                outerContainer.className = "col-md-6";
                var container = document.createElement("div");
                container.className = "videoContainer";
                container.id = "container_" + webrtc.getDomId(peer);
                container.appendChild(video);
                video.oncontextmenu = function () {
                    return false;
                };
                var vol = document.createElement("meter");
                vol.id = "volume_" + peer.id;
                vol.className = "volume";
                vol.min = -45;
                vol.max = -20;
                vol.low = -40;
                vol.high = -25;
                container.appendChild(vol);
                if (peer && peer.pc) {
                    var connstate = document.createElement("div");
                    connstate.className = "connectionstate";
                    container.appendChild(connstate);
                    peer.pc.on("iceConnectionStateChange", function (event) {
                        switch (peer.pc.iceConnectionState) {
                            case "checking":
                                connstate.innerText = "connecting to peer...";
                                break;
                            case "connected":
                            case "completed":
                                vol.style.display = "block";
                                connstate.innerText = "connection established";
                                break;
                            case "disconnected":
                                connstate.innerText = "disconnected";
                                break;
                            case "failed":
                                connstate.innerText = "connection failed";
                                break;
                            case "closed":
                                connstate.innerText = "connection closed";
                                break;
                        }
                    });
                }
                outerContainer.appendChild(container);
                remotes.appendChild(outerContainer);
                var remoteVideos = document.getElementById("remotes").getElementsByTagName("video").length;
                if (!(remoteVideos % 2)) {
                    var spacer = document.createElement("div");
                    spacer.className = "w-100";
                    remotes.appendChild(spacer);
                }
            }
        });
        webrtc.on("videoRemoved", function (video, peer) {
            console.log("user removed from chat", peer);
            var remotes = document.getElementById("remotes");
            var el = document.getElementById("container_" + webrtc.getDomId(peer));
            if (remotes && el) {
                remotes.removeChild(el.parentElement);
            }
        });
        webrtc.on("volumeChange", function (volume, treshold) {
            showVolume(document.getElementById("localVolume"), volume);
        });
        webrtc.on("remoteVolumeChange", function (peer, volume) {
            showVolume(document.getElementById("volume_" + peer.id), volume);
        });
        webrtc.on("iceFailed", function (peer) {
            var connstate = document.querySelector("#container_" + webrtc.getDomId(peer) + " .connectionstate");
            console.log("local fail", connstate);
            if (connstate) {
                connstate.innerText = "connection failed";
                fileinput.disabled = "disabled";
            }
        });
        webrtc.on("connectivityError", function (peer) {
            var connstate = document.querySelector("#container_" + webrtc.getDomId(peer) + " .connectionstate");
            console.log("remote fail", connstate);
            if (connstate) {
                connstate.innerText = "connection failed";
                fileinput.disabled = "disabled";
            }
        });
    };
}
