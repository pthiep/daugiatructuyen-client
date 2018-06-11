var socket = io('http://localhost:3000');

var updateid = new Array({
	dealid: String,
	sid: String,
	endtime: Date
});

socket.on('time_ostartupdatetime', function (data) {
	updateid.forEach(function(it){
		getStringOutTime(data, it.endtime, it.sid);
		if (data > it.endtime){
			setTimeout(function(){
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
			var card =
				'<div class="card">' +
				'<img class="card-img-top" src="../img/laroche.jpg" alt="">' +
				'<div class="card-body">' +
				'<h4 class="card-title text-center">' + it.tensanpham + '</h4>' +
				'<h5 class="card-text text-center" style="color: red">Giá: ' + it.giacaonhat + '</h5>' +
				'<h6 class="card-text text-center"><span id=\'time_1_' + dem + '\'></span></h6>' +
				'</div>' +
				'<div class="card-footer text-center">' +
				'<a href="./dealdetail.html?dealid=' + it.madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
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
			var card =
				'<div class="card">' +
				'<img class="card-img-top" src="../img/laroche.jpg" alt="">' +
				'<div class="card-body">' +
				'<h4 class="card-title text-center">' + it.tensanpham + '</h4>' +
				'<h5 class="card-text text-center" style="color: red">Giá: ' + it.giacaonhat + '</h5>' +
				'<h6 class="card-text text-center"><span id=\'time_2_' + dem + '\'></span></h6>' +
				'</div>' +
				'<div class="card-footer text-center">' +
				'<a href="./dealdetail.html?dealid=' + it.madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
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
			var card =
				'<div class="card">' +
				'<img class="card-img-top" src="../img/laroche.jpg" alt="">' +
				'<div class="card-body">' +
				'<h4 class="card-title text-center">' + it.tensanpham + '</h4>' +
				'<h5 class="card-text text-center" style="color: red">Giá: ' + it.giacaonhat + '</h5>' +
				'<h6 class="card-text text-center"><span id=\'time_3_' + dem + '\'></span></h6>' +
				'</div>' +
				'<div class="card-footer text-center">' +
				'<a href="./dealdetail.html?dealid=' + it.madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
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
	s
}