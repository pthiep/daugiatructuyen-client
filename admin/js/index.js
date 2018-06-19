$(document).ready(function () {

	if (getCookie('userid') === '') {
		location.href = './login.html';
	}

	loadListReqSale();

	$('#btnCloseSuccessReqx').on('click', function () {
		location.reload();
	});

	$('#btnCloseSuccessReq').on('click', function () {
		location.reload();
	});

});

function loadListReqSale() {
	$.ajax({
		url: 'http://localhost:3000/users/getlistsalerule',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		$(document.getElementById('tbListReq')).text('');
		var dem = 1;
		data.forEach(element => {
			var datetime = new Date(element.thoigian);
			var time = datetime.toLocaleString("en-US");
			$(document.getElementById('tbListReq')).append(
				'<tr>' +
				'<th scope="row">' + dem + '</th>' +
				'<td>' + element.tennguoidung + '</td>' +
				'<td>' + time + '</td>' +
				'<td><button type="button" onclick="acceptReq(' + element.manguoidung + ')" class="btn btn-primary">Duyệt</button></td>' +
				'</tr'
			);
			dem++;
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function acceptReq(userid) {

	var dataArr = {
		userid: userid
	};
	
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/acceptsale',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$('#successReqModal').modal('show');
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}