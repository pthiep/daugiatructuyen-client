$(document).ready(function () {
	loadInfo();
	loadListReview();
});

function loadInfo() {
	var userid = getParameter('userid', window.location.href);
	var dataArr = {
		userid: userid
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
		$(document.getElementById('nameUser')).text(data[0].tennguoidung);

		if (getCookie('userid') !== '' && getCookie('userid') !== getParameter('userid')) {

			var dataArr = {
				userid: getCookie('userid'),
				useridpur: getParameter('userid')
			};

			var dataJS = JSON.stringify(dataArr);
			$.ajax({
				url: 'http://localhost:3000/users/checkreviewuser',
				type: 'POST',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json',
				data: dataJS
			}).done(function (data) {

				if (Object.keys(data).length === 0) {
					$(document.getElementById('Review')).append(
						'<button type="button" onclick="danhgianguoimua(\'' + getCookie('userid') + '\',' + getParameter('userid') + ')" class="btn btn-success">Đánh giá</button>'
					);
				} else {
					$(document.getElementById('Review')).append(
						'<button type="button" disabled class="btn btn-success">Đánh giá</button>'
					);
				}
			}).fail(function (xhr, status, err) {
				console.log(err);
			});

		}

	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function danhgianguoimua(username, useridpur) {
	$(document.getElementById('footerModalDanhgia')).text('');
	var dataArr = {
		userid: useridpur
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/getnumreviewuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		if (data.length === 0) {
			$(document.getElementById('numlike')).text('0');
			$(document.getElementById('numdislike')).text('0');
		} else {
			$(document.getElementById('numlike')).text(data[0].soluotthich);
			$(document.getElementById('numdislike')).text(data[0].soluotkhongthich);
		}
		$(document.getElementById('footerModalDanhgia')).append(
			'<input type="hidden" id="useridpur" value="' + useridpur + '"/>' +
			'<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>' +
			'<button type="button" id="btnReview" onclick="reviewuser()" class="btn btn-success">Xác nhận</button>'
		);

		$('#danhgiaModal').modal('show');
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function reviewuser() {
	var useidpur = document.getElementById('useridpur').value;
	var userid = getCookie('userid');
	var review = document.getElementById('reviewText').value;
	var status = $('#statusReview :selected').val();
	var dataArr = {
		userid: userid,
		useridpur: useidpur,
		status: status,
		review: review
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/users/insertreviewuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		$(document.getElementById('reviewText')).val('');
		$(document.getElementById('footerModalDanhgia')).val('');
		$("#statusReview select").val(0);
		$('#danhgiaModal').modal('hide');
		location.reload();

	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListReview() {
	var userid = getParameter('userid', window.location.href);
	var dataArr = {
		userid: userid
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
		if (Object.keys(data).length === 0 && data.constructor === Object) {
			$(document.getElementById('reviewGood')).text('Chưa có đánh giá');
			$(document.getElementById('sumReview')).text('Chưa có đánh giá');
		} else {
			$(document.getElementById('reviewGood')).text(data[0].soluongthich);
			$(document.getElementById('sumReview')).text(data[0].tongdanhgia);

			var dataArr = {
				userid: userid
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

function getParameter(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	var regexS = '[\\?&]' + name + '=([^&#]*)';
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
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