var socket = io('http://localhost:3000');

var updateid = new Array({
	dealid: String,
	sid: String,
	endtime: Date
});

socket.on('time_ostartupdatetime', function (data) {
	updateid.forEach(function (it) {
		getStringOutTime(data, it.endtime, it.sid);
		var timenow = new Date(data).getTime() / 1000;
		var timeend = new Date(it.endtime).getTime() / 1000;
		if (timenow > timeend) {
			setTimeout(function () {
				location.reload();
			}, 2000);
		}
	});
	socket.emit('time_estartupdatetime', '');
});

$(document).ready(function () {
	socket.emit('time_estartupdatetime', '');
	loadListSearch();
});

function loadListSearch() {
	var type = getParameter('type', window.location.href);
	if (type === '1') {
		var id = getParameter('id', window.location.href);
		if (id === 'all') {
			loadListAll();
		} else {

		}
	}
}

function loadListAll() {
	$.ajax({
		url: 'http://localhost:3000/deals/searchall',
		type: 'GET',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		$(document.getElementById('listSearch')).text('');

		var soluongdeal = Object.keys(data).length;
		var soluongdealmoidong = 4;

		var sodong = Math.floor(soluongdeal / soluongdealmoidong) + 1;
		var sodealdu = soluongdeal % soluongdealmoidong;
		var sodealdaydu = soluongdealmoidong * sodong;

		var dem = 1;

		var demdeal = 0;
		var vt = 0;
		for (var i = 1; i <= sodong; i++) {
			$(document.getElementById('listSearch')).append(
				'<div class="row" id="row_' + i + '">' +
				'</div>' +
				'<br>'
			);
			for (var j = 0; j < soluongdealmoidong; j++) {
				var idrow = 'row_' + i;
				if (vt < soluongdeal) {
					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="../img/laroche.jpg" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + data[vt].giacaonhat + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						'&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>'
					);
					var objcard = {
						dealid: String,
						sid: String,
						endtime: Date
					};
					objcard.dealid = data[vt].madaugia;
					objcard.sid = 'time_' + i + '_' + j;
					objcard.endtime = data[vt].thoigianketthuc;
					updateid.push(objcard);
					vt++;
				} else {
					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'</div>'
					);
				}
			}
		}
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function likeDeal(userid, dealid) {
	var dataArr = {
		userid: userid,
		dealid: dealid
	};

	var dataJS = JSON.stringify(dataArr);
	console.log(dataJS);
	$.ajax({
		url: 'http://localhost:3000/deals/checklikedeal',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		console.log(Object.keys(data).length);
		if (Object.keys(data).length === 0) {
			$('#successAddLikeModal').modal('show');

			var dataArr = {
				userid: userid,
				dealid: dealid
			};
			
			var dataJS = JSON.stringify(dataArr);
			$.ajax({
				url: 'http://localhost:3000/users/insertlikedeal',
				type: 'POST',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json',
				data: dataJS
			}).done(function (data) {
			
			}).fail(function (xhr, status, err) {
				console.log(err);
			});

		} else {
			$('#failedAddLikeModal').modal('show');
		}
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function getStringOutTime(timenow, timeend, id) {
	var d = new Date(timenow);
	var now = d.getTime() / 1000;
	d = new Date(timeend);
	var end = d.getTime() / 1000;

	var time = end - now;
	var s = '';
	if (time > 0) {
		var days = Math.floor(time / (60 * 60 * 24));
		var hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
		var minutes = Math.floor((time % (60 * 60)) / 60);
		var seconds = Math.floor(time % 60);
		if (days > 0) {
			s = days + ' ngày ' + hours + ' giờ ' + minutes + ' phút ' + seconds + ' giây';
		} else {
			if (hours > 0) {
				s = hours + ' giờ ' + minutes + ' phút ' + seconds + ' giây';
			} else {
				if (minutes > 0) {
					s = minutes + ' phút ' + seconds + ' giây';
				} else {
					s = seconds + ' giây';
				}
			}
		}
	} else {
		s = 'Hết thời gian';
	}
	$(document.getElementById(id)).text(s);
}

function getParameter(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	var regexS = '[\\?&]' + name + '=([^&#]*)';
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}