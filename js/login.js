var socket = io('http://localhost:3000');

LoginCheckUserOn();

$(document).ready(function () {



	if (localStorage.getItem('isLogin') === 'true') {
		showNavbarUser();
	} else {
		showNavbarLogin();
	}

	// btncloseLogin
	$('#btncloseLogin').on('click', function () {
		hiddennotificationNull();
	});

	// closeModalLogin
	$('#loginModal').on('hidden.bs.modal', function (e) {
		hiddennotificationNull();
	})

	// btnLogin
	$('#btnLogin').on('click', function () {
		LoginEmmit();
	});

	$('#btnExit').on('click', function () {
		logoutUser();
		location.href = '../index.html';
	});

});

function LoginCheckUserOn() {
	socket.on('login_checkuser', function (data) {
		if (data.checkuser === true && data.islogin === false) {
			LoginJWTOn(data.userid);
			$('#loginModal').modal('hide');
		} else if (data.checkuser === true && data.islogin === true) {
			hiddennotificationLogin();
			shownotificationLogined();
		} else if (data.checkuser === false) {
			shownotificationLogin();
			hiddennotificationLogined();
		}
	});
}

function LoginJWTOn(userid) {
	updateLoginStatus(userid, 0);
	var dataArr = {
		userid: userid
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/jwt/login',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		setCookie('access_token', data.access_token, 7);

		var access_token = data.access_token;
		$.ajax({
			url: 'http://localhost:3000/jwt/secured',
			dataType: 'json',
			headers: {
				'x-access-token': access_token
			}
		}).done(function (data) {
			setCookie('exp_token', data.payload.exp, 7);
			showNavbarUser();
		});

	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function LoginEmmit() {

	var notifNull = $(notificationNull).hasClass('d-none');
	if (notifNull !== true) {
		hiddennotificationNull();
	}

	var notifLogin = $(notificationLogin).hasClass('d-none');
	if (notifLogin !== true) {
		hiddennotificationLogin();
	}

	var emailLogin = $(document.getElementById('loginEmail')).val();
	var passLogin = $(document.getElementById('loginPassword')).val();

	if (emailLogin !== '' && passLogin !== '') {
		socket.emit('login', {
			username: emailLogin,
			password: passLogin
		});
	} else {
		shownotificationNull();
	}
}

function logoutUser() {
	socket.emit('logout', {
		userid: getCookie('userid')
	});
	cleanCookieStorage();
	showNavbarLogin();
}

function updateLoginStatus(userid, status) {
	var dataArr = {
		userid: userid,
		status: status
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/login',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function () {
		setCookie('userid', userid, 7);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

// Press Enter login
function enterLogin(e) {
	if (e.keyCode == 13) {
		LoginEmmit();
		return false;
	}
}

function cleanCookieStorage() {
	setCookie('access_token', '', 7);
	setCookie('exp_token', '', 7);
	setCookie('userid', '', 7);
}

function showNavbar(check) {
	// navbar login
	var navbarlogin = document.getElementById('navbarlogin');
	var navbaruser = document.getElementById('navbaruser');

	if (check == false) {
		showNavbarLogin();
	} else {
		showNavbarUser();
	}
}

function showNavbarUser() {
	$(navbarlogin).addClass('d-none');
	$(navbaruser).removeClass('d-none');

	var access_token = getCookie('access_token');
	$.ajax({
		url: 'http://localhost:3000/jwt/secured',
		dataType: 'json',
		headers: {
			'x-access-token': access_token
		}
	}).done(function (data) {
		$(document.getElementById('navbarDropdownUsername')).text(data.payload.userObj.username);
	});
}

function showNavbarLogin() {
	$(navbarlogin).removeClass('d-none');
	$(navbaruser).addClass('d-none');
}

function cleanLoginModal() {
	$(document.getElementById('loginEmail')).val('');
	$(document.getElementById('loginPassword')).val('');
}

function hiddennotificationNull() {
	var notificationNull = document.getElementById('notificationNull');
	$(notificationNull).addClass('d-none');
}

function shownotificationNull() {
	var notificationNull = document.getElementById('notificationNull');
	$(notificationNull).removeClass('d-none');
}

function hiddennotificationLogin() {
	var notificationLogin = document.getElementById('notificationLogin');
	$(notificationLogin).addClass('d-none');
}

function shownotificationLogin() {
	var notificationLogin = document.getElementById('notificationLogin');
	$(notificationLogin).removeClass('d-none');
}

function hiddennotificationLogined() {
	var notificationLogin = document.getElementById('notificationLogined');
	$(notificationLogin).addClass('d-none');
}

function shownotificationLogined() {
	var notificationLogin = document.getElementById('notificationLogined');
	$(notificationLogin).removeClass('d-none');
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
	var name = cname + '=';
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}