var postRegister = () => {
    let email = $('#email').val()
    let password = $('#pwd').val()
    let repassword = $('#repwd').val()

    if(email == '' || password == '' || repassword == '3')
        return alertMessage('Vui lòng nhập đủ thông tin')
    if(password.length < 6)
        return alertMessage('Mật khẩu dài hơn 6 ký tự')
    if(password !== repassword)
        return alertMessage('Nhập lại mật khẩu không trùng')
    $('#signup-alert').prop('hidden',true)

    $.ajax({
        url: 'http://localhost:3000/users/signup',
        type: 'POST',
        data: {email,password}
    }).done(res => {
        if(res.msg === 'OK'){
            $('#signupModal').hide()
            alert('Đăng ký thành công!')
        }
        else{
            alertMessage('Email đã tồn tại!!')
        }
    }).fail(err => alertMessage('Can not connect to server, try again later!'))
    
}

$('#submitSignup').on('click', (e) => {
    e.preventDefault()
    postRegister()
})

var alertMessage = (message) => {
    $('#signup-alert').html(message)
    $('#signup-alert').prop('hidden',false)
}
