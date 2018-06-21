var postRegister = () => {
	var email = $('#email').val();
	var name = $('#name').val();
	var password = md5($('#pwd').val());
	var repassword = md5($('#repwd').val());

	if (email === '' || name === '' || password === '' || repassword === '3')
		return alertMessage('Vui lòng nhập đủ thông tin')
	if (password.length < 6)
		return alertMessage('Mật khẩu dài hơn 6 ký tự')
	if (password !== repassword)
		return alertMessage('Nhập lại mật khẩu không trùng')
	$('#signup-alert').prop('hidden', true)
	

	if (String(grecaptcha.getResponse()) !== '') {
		$.ajax({
			url: 'http://localhost:3000/users/signup',
			type: 'POST',
			data: {
				email,
				password,
				name
			}
		}).done(res => {
			if(res.msg === 'OK'){
				$('#signupModal').hide();
				$('#successRegModal').modal('show');
			}
			else{
				alertMessage('Email đã tồn tại!!')
			}
		}).fail(function (xhr, status, err) {
			console.log(err);
		});
	} else {
		alertMessage('Chưa nhập recapcha');
	}
}

$('#submitSignup').on('click', (e) => {
	e.preventDefault()
	postRegister()
})

var alertMessage = (message) => {
	$('#signup-alert').html(message)
	$('#signup-alert').prop('hidden', false)
}

$('#btnCloseSuccessReg').on('click', function () {
	location.href = '../index.html';
});

$('#btnCloseSuccessReg').on('click', function () {
	location.href = '../index.html';
});