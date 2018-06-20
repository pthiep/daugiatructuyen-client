var dataArr = {
	username: emailLogin,
	password: passLogin
};

var dataJS = JSON.stringify(dataArr);
$.ajax({
	url: 'http://localhost:3000/users/checkuser',
	type: 'POST',
	dataType: 'json',
	timeout: 10000,
	contentType: 'application/json',
	data: dataJS
}).done(function (data) {

}).fail(function (xhr, status, err) {
	console.log(err);
});

$.ajax({
	url: 'http://localhost:3000/categories/',
	dataType: 'json',
	timeout: 10000,
	crossDomain : true,
    xhrFields: {
        withCredentials: true
    }
}).done(function (data) {
	data.forEach(element => {
		$(document.getElementById('listCategory')).append(
			'<a class="dropdown-item" href="#">' + element.tendanhmuc + '</a>'
		);
	});
}).fail(function (xhr, status, err) {
	console.log(err);
});

var transporter = nodemailer.createTransport({ // config mail server
	service: 'Gmail',
	auth: {
		user: 'dapxekhongyen@gmail.com',
		pass: '01694424958'
	}
});
var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
	from: 'ADMIN',
	to: rows[0].email2,
	subject: 'Thông báo',
	text: 'Bạn nhận được thông báo từ ADMIN',
	html: 'Đã ra giá thành công <a href="http://localhost:8080/client/views/dealdetail.html?dealid=' + req.body.dealid + '">' + 'http://localhost:8080/client/views/dealdetail.html?dealid=' + req.body.dealid + '</a>'
}

transporter.sendMail(mainOptions, function (err, info) {
	if (err) {
		console.log(err);
	}
});