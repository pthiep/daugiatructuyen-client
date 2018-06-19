var socket = io('http://localhost:3000');

var updateid = new Array({
	dealid: String,
	sid: String,
	endtime: Date
});

socket.on('time_ostartupdatetime', function (data) {
	updateid.forEach(function (it) {
		getStringOutTime(data, it.endtime, it.sid);
		if (data > it.endtime) {
			setTimeout(function () {
				location.reload();
			}, 2000);
		}
	});
	socket.emit('time_estartupdatetime', '');
});

$(document).ready(function () {
	socket.emit('time_estartupdatetime', '');
	getTopBestBid();
	getTopBestPrice();
	getTopTimeOut();
	$('.slickTopBestBid').slick({
		infinite: false,
		centerMode: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 2,
		autoplay: true,
		autoplaySpeed: 2000
	});
	$('.slickTopBestPrice').slick({
		infinite: false,
		centerMode: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 2,
		autoplay: true,
		autoplaySpeed: 2000
	});
	$('.slickTopTimeOut').slick({
		infinite: false,
		centerMode: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 2,
		autoplay: true,
		autoplaySpeed: 2000
	});
});

function getTopBestBid() {
	$.ajax({
		url: 'http://localhost:3000/deals/topbestbid',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		var dem = 1;

		data.forEach(function (it) {
			var btnlike = '';
			if (getCookie('userid') !== '') {
				btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + it.madaugia + ')"><i class="fas fa-heart"></i></button>';
			} else {
				btnlike = ''
			}
			var card =
				'<div class="card">' +
				'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + it.link_img1 + '" alt="">' +
				'<div class="card-body">' +
				'<h4 class="card-title text-center">' + it.tensanpham + '</h4>' +
				'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(it.giacaonhat) + '</h5>' +
				'<h6 class="card-text text-center"><span id=\'time_1_' + dem + '\'></span></h6>' +
				'</div>' +
				'<div class="card-footer text-center">' +
				'<a href="./dealdetail.html?dealid=' + it.madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
				btnlike +
				'</div>' +
				'</div>' +
				'</div>';
			$('.slickTopBestBid').slick('slickAdd', card);
			var objcard = {
				dealid: String,
				sid: String,
				endtime: Date
			};
			objcard.dealid = it.madaugia;
			objcard.sid = 'time_1_' + dem;
			objcard.endtime = it.thoigianketthuc;
			updateid.push(objcard);
			dem++;
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function getTopBestPrice() {
	$.ajax({
		url: 'http://localhost:3000/deals/topbestprice',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		var dem = 1;
		data.forEach(function (it) {
			var btnlike = '';
			if (getCookie('userid') !== '') {
				btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + it.madaugia + ')"><i class="fas fa-heart"></i></button>';
			} else {
				btnlike = ''
			}
			var card =
				'<div class="card">' +
				'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + it.link_img1 + '" alt="">' +
				'<div class="card-body">' +
				'<h4 class="card-title text-center">' + it.tensanpham + '</h4>' +
				'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(it.giacaonhat) + '</h5>' +
				'<h6 class="card-text text-center"><span id=\'time_2_' + dem + '\'></span></h6>' +
				'</div>' +
				'<div class="card-footer text-center">' +
				'<a href="./dealdetail.html?dealid=' + it.madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
				btnlike +
				'</div>' +
				'</div>' +
				'</div>';
			$('.slickTopBestPrice').slick('slickAdd', card);
			var objcard = {
				dealid: String,
				sid: String,
				endtime: Date
			};
			objcard.dealid = it.madaugia;
			objcard.sid = 'time_2_' + dem;
			objcard.endtime = it.thoigianketthuc;
			updateid.push(objcard);
			dem++;
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function getTopTimeOut() {
	$.ajax({
		url: 'http://localhost:3000/deals/toptimeout',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		var dem = 1;
		data.forEach(function (it) {
			var btnlike = '';
			if (getCookie('userid') !== '') {
				btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + it.madaugia + ')"><i class="fas fa-heart"></i></button>';
			} else {
				btnlike = ''
			}
			var card =
				'<div class="card">' +
				'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + it.link_img1 + '" alt="">' +
				'<div class="card-body">' +
				'<h4 class="card-title text-center">' + it.tensanpham + '</h4>' +
				'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(it.giacaonhat) + '</h5>' +
				'<h6 class="card-text text-center"><span id=\'time_3_' + dem + '\'></span></h6>' +
				'</div>' +
				'<div class="card-footer text-center">' +
				'<a href="./dealdetail.html?dealid=' + it.madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
				btnlike +
				'</div>' +
				'</div>' +
				'</div>';
			$('.slickTopTimeOut').slick('slickAdd', card);
			var objcard = {
				dealid: String,
				sid: String,
				endtime: Date
			};
			objcard.dealid = it.madaugia;
			objcard.sid = 'time_3_' + dem;
			objcard.endtime = it.thoigianketthuc;
			updateid.push(objcard);
			dem++;
		});
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

function covertInttoVND(num) {
	var kq = '';
	var temp = String(num);

	if (temp.length > 3) {
		var sll = 0;

		if (temp.length % 3 === 0) {
			sll = Math.floor(temp.length / 3);
		} else {
			sll = Math.floor(temp.length / 3) + 1;
		}

		for (var i = 0; i < sll; i++) {
			if (temp.length > 3) {
				kq = temp.substr(temp.length - 3, 3) + kq;
				temp = temp.substr(0, temp.length - 3);

				kq = ',' + kq;
			} else {
				kq = temp + kq;
			}
		}
	} else {
		kq = temp;
	}

	kq += ' VND';

	return kq;
}

function covertVNDtoInt(tien) {
	var kq = 0;
	var tempsplit = String(tien).split(' ');
	var temp = tempsplit[0];
	var temp3 = '';

	var temp1 = String(temp).split(',');

	for (var i = 0; i < temp1.length; i++) {
		temp3 += temp1[i];
	}
	kq = parseInt(temp3);

	return kq;
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