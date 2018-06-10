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
	timeout: 10000
}).done(function (data) {
	data.forEach(element => {
		$(document.getElementById('listCategory')).append(
			'<a class="dropdown-item" href="#">' + element.tendanhmuc + '</a>'
		);
	});
}).fail(function (xhr, status, err) {
	console.log(err);
});

