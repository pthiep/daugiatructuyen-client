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
		Login();
	});

	$('#btnExit').on('click', function () {
		cleanLocalStorage();
		location.href = "../index.html";
	});

});

function Login() {
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
		cleanLocalStorage();
		hiddennotificationNull();
		var dataArr = {
			email: emailLogin,
			password: passLogin
		};
		var dataJS = JSON.stringify(dataArr);
		$.ajax({
			url: 'http://localhost:3000/users/login',
			type: 'POST',
			dataType: 'json',
			timeout: 10000,
			contentType: 'application/json',
			data: dataJS
		}).done(function (data) {
			localStorage.access_token = data.access_token;

			$.ajax({
				url: 'http://localhost:3000/users/secured',
				dataType: 'json',
				timeout: 10000,
				headers: {
					'x-access-token': localStorage.access_token
				}
			}).done(function (data) {
				localStorage.isLogin = data.payload.isLogin;
				if (localStorage.getItem('isLogin') === 'true') {
					localStorage.userid = data.payload.userObj.userid;
					localStorage.username = data.payload.userObj.username;
					localStorage.address = data.payload.userObj.address;
					showNavbarUser();
					$('#loginModal').modal('hide');
				} else if (localStorage.getItem('isLogin') === 'false') {
					cleanLoginModal();
					shownotificationLogin();
				}
			});

		}).fail(function (xhr, status, err) {
			console.log(err);
		});
	} else {
		shownotificationNull();
	}
}

// Press Enter login
function enterLogin(e) {
	if (e.keyCode == 13) {
		Login();
		return false;
	}
}

function cleanLocalStorage() {
	localStorage.clear()
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
	$(document.getElementById('navbarDropdownUsername')).text(localStorage.getItem('username'));
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