$(document).ready(function () {
	loadInfo();
	loadListReview();
	loadListDealing();
	loadListDealWin();
	loadListLikeProduct();

	$('#list-infouser-list').on('click', function () {
		loadInfo();
	});

	$('#list-review-list').on('click', function () {
		loadListReview();
	});

	$('#list-dealing-list').on('click', function () {
		loadListDealing();
	});

	$('#list-dealwin-list').on('click', function () {
		loadListDealWin();
	});

	$('#list-listlike-list').on('click', function () {
		loadListDealWin();
	});

	$('#btnUpdateEmail').on('click', function () {
		loadListLikeProduct();
	});

	$('#btnUpdateNameUser').on('click', function () {
		updateNameUser();
	});

	$('#btnUpdatePass').on('click', function () {
		updatePass();
	});

	$('#btnCloseChangePass').on('click', function () {
		$(document.getElementById('notiChangePass')).addClass('d-none');
	});

	$('#btnCloseSuccessChangePassx').on('click', function () {
		logoutUser();
		location.href = '../index.html';
	});

	$('#btnCloseSuccessChangePass').on('click', function () {
		logoutUser();
		location.href = '../index.html';
	});

});

function loadInfo() {
	$(document.getElementById('spanChangeEmail')).text('');
	$(document.getElementById('spanChangeUserName')).text('');
	var dataArr = {
		userid: getCookie('userid')
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/getuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$(document.getElementById('emailUser')).text(data[0].email);
		$(document.getElementById('nameUser')).text(data[0].tennguoidung);
		$(document.getElementById('spanChangeEmail')).text('');
		$(document.getElementById('spanChangeEmail')).append(
			'<button type="button" onclick="showChangeEmail(' + data[0].manguoidung + ')" class="btn btn-primary">Đổi email</button>'
		);
		$(document.getElementById('spanChangeUserName')).text('');
		$(document.getElementById('spanChangeUserName')).append(
			'<button type="button" onclick="showChangeNameUser(' + data[0].manguoidung + ')" class="btn btn-primary">Đổi tên</button>'
		);
		$(document.getElementById('spanChangePass')).text('');
		$(document.getElementById('spanChangePass')).append(
			'<button type="button" onclick="showChangePass(' + data[0].manguoidung + ')" class="btn btn-primary">Đổi mật khẩu</button>'
		);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function showChangeEmail(userid) {
	$('#changeEmailModal').modal('show');
}

function updateEmail() {
	var userid = getCookie('userid');
	var newemail = $(document.getElementById('newEmailChange')).val();

	var dataArr = {
		userid: userid,
		newemail: newemail
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/updateemailuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$('#changeEmailModal').modal('hide');
		$('#successChangeEmailModal').modal('show');
		loadInfo();
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function showChangeNameUser(userid) {
	$('#changeNameUserModal').modal('show');
}

function updateNameUser() {
	var userid = getCookie('userid');
	var newname = $(document.getElementById('newNameUserChange')).val();

	var dataArr = {
		userid: userid,
		newname: newname
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/updatenameuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$('#changeNameUserModal').modal('hide');
		$('#successChangeNameModal').modal('show');
		loadInfo();
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function showChangePass(userid) {
	$('#changePassModal').modal('show');
}

function updatePass() {
	$(document.getElementById('notiChangePass')).addClass('d-none');


	var userid = getCookie('userid');
	var oldPass = md5($(document.getElementById('oldPass')).val());
	var newPass = md5($(document.getElementById('newPass')).val());
	var againNewPass = md5($(document.getElementById('againNewPass')).val());

	var dataArr = {
		userid: userid,
		password: oldPass
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/checkoldpass',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		if (data.result === true) {
			if (newPass !== oldPass) {
				if (againNewPass === newPass) {
					$(document.getElementById('notiChangePass')).addClass('d-none');

					var dataArr = {
						userid: userid,
						password: newPass
					};

					var dataJS = JSON.stringify(dataArr);
					$.ajax({
						url: 'http://localhost:3000/users/updatepass',
						type: 'POST',
						dataType: 'json',
						timeout: 10000,
						contentType: 'application/json',
						data: dataJS
					}).done(function (data) {
						$('#changePassModal').modal('hide');
						$('#successChangePassModal').modal('show');
					}).fail(function (xhr, status, err) {
						console.log(err);
					});


				} else {
					$(document.getElementById('notiChangePass')).removeClass('d-none');
					$(document.getElementById('textnotiChangePass')).text('Mật khẩu nhập lại khác với mật khẩu mới');
					cleanChangePass();
				}
			} else {
				$(document.getElementById('notiChangePass')).removeClass('d-none');
				$(document.getElementById('textnotiChangePass')).text('Mật khẩu mới phải khác mật khẩu cũ');
				cleanChangePass();
			}
		} else {
			$(document.getElementById('notiChangePass')).removeClass('d-none');
			$(document.getElementById('textnotiChangePass')).text('Mật khẩu cũ sai');
			cleanChangePass();
		}
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function cleanChangePass() {
	$(document.getElementById('oldPass')).val('');
	$(document.getElementById('newPass')).val('');
	$(document.getElementById('againNewPass')).val('');
}

function loadListReview() {
	var dataArr = {
		userid: getCookie('userid')
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/getnumreview',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		if (Object.keys(data).length === 0) {
			$(document.getElementById('reviewGood')).text('Chưa có đánh giá');
			$(document.getElementById('sumReview')).text('Chưa có đánh giá');
		} else {
			$(document.getElementById('reviewGood')).text(data[0].soluongthich);
			$(document.getElementById('sumReview')).text(data[0].tongdanhgia);

			var dataArr = {
				userid: getCookie('userid')
			};

			var dataJS = JSON.stringify(dataArr);
			$.ajax({
				url: 'http://localhost:3000/users/getlistreview',
				type: 'POST',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json',
				data: dataJS
			}).done(function (data) {
				$(document.getElementById('listReview')).text('');
				data.forEach(element => {
					var tt = '';
					if (element.trangthai === 0) {
						tt = '+1';
					} else {
						tt = '-1';
					}

					$(document.getElementById('listReview')).append(
						'<tr>' +
						'<td><a href="#">' + element.tennguoidung + '</a></td>' +
						'<td style="min-width: 375px;">' + element.danhgia + '</td>' +
						'<td>' + tt + '</td>' +
						'</tr'
					);
				});


			}).fail(function (xhr, status, err) {
				console.log(err);
			});
		}
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListDealing() {
	var dataArr = {
		userid: getCookie('userid')
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/getlistdealing',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$(document.getElementById('listDealing')).text('');
		data.forEach(element => {
			$(document.getElementById('listDealing')).append(
				'<tr>' +
				'<td>' + element.madaugia + '</td>' +
				'<td><a href="../views/dealdetail.html?dealid=' + element.madaugia + '">' + element.tensanpham + '</a></td>' +
				'</tr'
			);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListDealWin() {
	var dataArr = {
		userid: getCookie('userid')
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/getlistdealwin',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$(document.getElementById('listDealWin')).text('');
		data.forEach(element => {
			$(document.getElementById('listDealWin')).append(
				'<tr>' +
				'<td>' + element.madaugia + '</td>' +
				'<td><a href="../views/dealdetail.html?dealid=' + element.madaugia + '">' + element.tensanpham + '</a></td>' +
				'</tr'
			);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListLikeProduct() {
	$("#likeProductTable > tbody tr").remove();
	var dataArr = {
		userid: getCookie('userid')
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
			url: 'http://localhost:3000/users/likeproduct',
			type: 'post',
			dataType: 'json',
			timeout: 10000,
			contentType: 'application/json',
			data: dataJS
		}).done(function (data) {
			var demtt = 1;
			data.forEach(function (it) {
				var dataArrDetail = new Object();
				dataArrDetail = {
					productid: it.masanpham
				};
				var dataDetailJS = JSON.stringify(dataArrDetail);
				$.ajax({
					url: 'http://localhost:3000/products/productdetail',
					type: 'post',
					dataType: 'json',
					timeout: 10000,
					contentType: 'application/json',
					data: dataDetailJS
				}).done(function (data) {
					var row = $(
						'<tr>' +
						'<th scope=\"row\">' +
						demtt +
						'</th>' +
						'<td><a href="dealdetail.html?dealid=' + data[0].masanpham + '">' +
						data[0].tensanpham +
						'</a></td>' +
						'<td>' +
						'<button type=\"button\" id=\"btnDelLikeProduct_ ' + data[0].masanpham + '\" onclick="deleteLikeProduct(' + getCookie('userid') + ', ' + data[0].masanpham + ')" class=\"btn btn-danger\">Xóa</button>' +
						'</td>' +
						'</tr>');
					$("#likeProductTable > tbody").append(row);
					demtt++;
				}).fail(function (xhr, status, err) {
					console.log(err);
				});
			});

		})
		.fail(function (xhr, status, err) {
			console.log(err);
		});
}

function deleteLikeProduct(userid, dealid) {
	var dataArr = {
		userid: userid,
		dealid: dealid
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/deletelikeproduct',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		loadListLikeProduct();
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}