$(document).ready(function () {

	if (getCookie('userid') === '') {
		location.href = './login.html';
	}

	loadListUser();

	$('#btnCloseSuccessDelx').on('click', function () {
		location.reload();
	});

	$('#btnCloseSuccessDel').on('click', function () {
		location.reload();
	});

});

function loadListUser() {
	$.ajax({
		url: 'http://localhost:3000/users/',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		$(document.getElementById('tbListUser')).text('');
		var dem = 1;
		data.forEach(element => {
			$(document.getElementById('tbListUser')).append(
				'<tr>' +
				'<th scope="row">' + dem + '</th>' +
				'<td style="min-width: 400px;">' + element.tennguoidung + '</td>' +
				'<td>' +
				'<button type="button" onclick="resetPass(' + element.manguoidung + ')" class="btn btn-success">Reset mật khẩu</button>&nbsp;' + 
				'<button type="button" onclick="deleteUser(' + element.manguoidung + ')" class="btn btn-danger">Xóa người dùng</button>' + 
				'</td>' +
				'</tr'
			);
			dem++;
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function resetPass(userid) {

	var pass = Math.random().toString(36).slice(-8);

	var dataArr = {
		userid: userid,
		pass: md5(pass),
		passnot: pass
	};
	
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/resetpass',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$('#successResetModal').modal('show');
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function deleteUser(userid) {

	var dataArr = {
		userid: userid
	};
	
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/deleteuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$('#successDelModal').modal('show');
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}