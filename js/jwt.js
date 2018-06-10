$(document).ready(function () {
	$.ajax({
		url: 'http://localhost:3000/timenow',
		type: 'get',
		dataType: 'json'
	}).done(function (data) {
		var timeserver = data.time;
		var access_token = getCookie('access_token');
		var exp_token = getCookie('exp_token');
		if (access_token != '' && parseInt(exp_token) - parseInt(timeserver) > 0) {
			showNavbarUser();
		} else {
			if (getCookie('userid') != ''){
				updateLoginStatus(getCookie('userid'), 1);
			}			
			cleanCookieStorage();
			cleanLoginModal();
			showNavbarLogin();
		}
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
});

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

function showNavbarUser() {
	$(navbarlogin).addClass('d-none');
	$(navbaruser).removeClass('d-none');

	var access_token = getCookie('access_token');
	$.ajax({
		url: 'http://localhost:3000/jwt/secured',
		dataType: 'json',
		timeout: 10000,
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

function cleanCookieStorage() {
	setCookie('access_token', '', 7);
	setCookie('exp_token', '', 7);
	setCookie('userid', '', 7);
}

function cleanLoginModal() {
	$(document.getElementById('loginEmail')).val('');
	$(document.getElementById('loginPassword')).val('');
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
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
	return "";
}