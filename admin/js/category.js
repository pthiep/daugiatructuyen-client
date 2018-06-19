$(document).ready(function () {

	if (getCookie('userid') === '') {
		location.href = './login.html';
	}

	loadListCate();

	$('#btnAddCate').on('click', function () {
		addCate();
	});

	$('#btnCloseSuccessAddx').on('click', function () {
		location.reload();
	});

	$('#btnCloseSuccessAdd').on('click', function () {
		location.reload();
	});

	$('#btnCloseSuccessDelx').on('click', function () {
		location.reload();
	});

	$('#btnCloseSuccessDel').on('click', function () {
		location.reload();
	});

	$('#btnUpdate').on('click', function () {
		edit();
	});
});

function addCate() {

	var nameCate = $('#nameCate').val();

	if (nameCate !== '') {
		var dataArr = {
			namecate: nameCate
		};

		var dataJS = JSON.stringify(dataArr);
		$.ajax({
			url: 'http://localhost:3000/categories/addcategory',
			type: 'POST',
			dataType: 'json',
			timeout: 10000,
			contentType: 'application/json',
			data: dataJS
		}).done(function (data) {
			$('#successAddModal').modal('show');
		}).fail(function (xhr, status, err) {
			console.log(err);
		});
	} else {
		alertMessage('Chưa nhập tên danh mục');
	}
}

var alertMessage = (message) => {
	$('#signup-alert').html(message);
	$('#signup-alert').prop('hidden', false);
}

function loadListCate() {
	$.ajax({
		url: 'http://localhost:3000/categories/',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		$(document.getElementById('tbListCate')).text('');
		var dem = 1;
		data.forEach(element => {
			$(document.getElementById('tbListCate')).append(
				'<tr>' +
				'<th scope="row">' + dem + '</th>' +
				'<td style="min-width: 400px;">' + element.tendanhmuc + '</td>' +
				'<td>' +
				'<button type="button" onclick="editCate(' + element.madanhmuc + ', \'' + element.tendanhmuc + '\')" class="btn btn-success">Sửa</button>&nbsp;' +
				'<button type="button" onclick="deleteCate(' + element.madanhmuc + ')" class="btn btn-danger">Xóa</button>' +
				'</td>' +
				'</tr'
			);
			dem++;
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function editCate(cateid, namecate) {
	$('#EditModal').modal('show');
	$(document.getElementById('bEdit')).text('');
	$(document.getElementById('cEdit')).text('');
	$(document.getElementById('bEdit')).append(
		'<input type="text" class="form-control" id="nameCateUpdate" value="' + namecate + '">'
	);

	$(document.getElementById('cEdit')).append(
		'<input type="hidden" value="' + cateid + '" id="idcate">'
	);
}

function edit() {
	$('#EditModal').modal('hide');
	var id = $('#idcate').attr("value");
	var name = $('#nameCateUpdate').val();
	var dataArr = {
		cateid: id,
		namecate: name
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/categories/updatecategory',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$('#successEditModal').modal('show');
		location.reload();
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function deleteCate(cateid) {

	var dataArr = {
		cateid: cateid
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/categories/deletecategory',
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