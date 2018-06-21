$(document).ready(function () {

	$('#btnLogin').on('click', function () {
		Login();
	});
});


function Login() {
	$('#signup-alert').prop('hidden',true);
	
	var emailLogin = $(document.getElementById('loginEmail')).val();
	var passLogin = md5($(document.getElementById('loginPassword')).val());

	if (emailLogin !== '' && passLogin !== '') {
		var dataArr = {
			username: emailLogin,
			password: passLogin
		};

		var dataJS = JSON.stringify(dataArr);
		$.ajax({
			url: 'http://localhost:3000/users/checkuseradmin',
			type: 'POST',
			dataType: 'json',
			timeout: 10000,
			contentType: 'application/json',
			data: dataJS
		}).done(function (data) {
			if (data.checkuser === true && data.islogin === false) {
				updateLoginStatus(data.userid, 0);
				var dataArr = {
					userid: data.userid
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
						location.href = './index.html';
					});
				}).fail(function (xhr, status, err) {
					console.log(err);
				});
			} else if (data.checkuser === true && data.islogin === true) {
				alertMessage('Đã đăng nhập ở nơi khác');
			} else if (data.checkuser === false) {
				alertMessage('Sai email hoặc mật khẩu. Vui lòng đăng nhập lại.');
			}
		}).fail(function (xhr, status, err) {
			console.log(err);
		});
	} else {
		alertMessage('Chưa nhập email hoặc mật khẩu.');
	}
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

function logoutUser() {
	updateLoginStatus(getCookie('userid'), 1);
	cleanCookieStorage();
	location.href = './login.html';
}

function cleanCookieStorage() {
	setCookie('access_token', '', 7);
	setCookie('exp_token', '', 7);
	setCookie('userid', '', 7);
}

var alertMessage = (message) => {
    $('#signup-alert').html(message);
    $('#signup-alert').prop('hidden',false);
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