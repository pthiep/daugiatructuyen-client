$(document).ready(function(){
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
					if (element.trangthai === 0){
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