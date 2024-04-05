var uid = localStorage.getItem('uid');
var auth = localStorage.getItem('auth');
var username;

var params;
if (uid && auth) {
	params = { query: 'uid=' + uid + '&auth=' + auth };
}

var socket = io.connect('http://localhost:8004', params);

socket.on('connect', function (data) {
	console.log('Connected!!!');
	if (!uid || !auth) {
		showSignin();
	}
});

socket.on('auth', function (data) {
	username = data.name;

	if (data.invalid) {
		showSignin();
	} else {
		showLobby();
	}
});
