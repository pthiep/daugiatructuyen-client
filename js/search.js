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

	$('#btnSort').on('click', function () {
		$(document.getElementById('listSearch')).text('');
		var sort = $('#sbTime').val();
		updateid = new Array({
			dealid: String,
			sid: String,
			endtime: Date
		});
		if (parseInt(sort) === 1) {
			loadListSearch();
		} else if (parseInt(sort) === 2) {
			loadListSearchasc();
		}
	});

});


function loadListSearchasc() {
	var type = getParameter('type', window.location.href);
	if (type === '1') {
		var id = getParameter('id', window.location.href);
		var page = getParameter('page', window.location.href);
		if (id === 'all') {
			loadListAllasc(page);
			loadListAllPage(page);
		} else {
			loadListCateasc(id, page);
			loadListCatePage(id, page);
		}
	} else if (type === '2') {
		var str = getParameter('str', window.location.href);
		var page = getParameter('page', window.location.href);

		loadListSearchStringasc(decodeURIComponent(str), page);
		loadListSearchStringPage(decodeURIComponent(str), page);
	}

	$('#btnSearch').on('click', function () {
		var str = $(document.getElementById('searchString')).val();
		if (str === '') {
			location.href = '../views/search.html?type=1&id=all&page=1';
		} else {
			location.href = '../views/search.html?type=2&str=' + str + '&page=1';
		}
	});
}

function loadListAllasc(ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var dataArr = {
		line: line
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchallasc',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
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
					var btnlike = '';
					if (getCookie('userid') !== '') {
						btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>';
					} else {
						btnlike = '';
					}

					var iconnew = '';
					var datetime = new Date(data[0].thoigiandang);
					if (datetime.getTime() / 1000 - new Date().getTime() / 1000 < 300) {
						iconnew = '<img src="../img/new.png" height="42" width="42">'
					}

					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + data[vt].link_img1 + '" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(data[vt].giacaonhat) + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '">' + iconnew + '<button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						btnlike +
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

function loadListSearchStringasc(str, ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var st = String(str).replace('%20', ' ');
	var dataArr = {
		str: st,
		line: line
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchstringasc',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
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
					var btnlike = '';
					if (getCookie('userid') !== '') {
						btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>';
					} else {
						btnlike = ''
					}
					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + data[vt].link_img1 + '" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(data[vt].giacaonhat) + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						btnlike +
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

function loadListCateasc(cateid, ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var dataArr = {
		cateid: cateid,
		line: line
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchcateasc',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
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
					var btnlike = '';
					if (getCookie('userid') !== '') {
						btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>';
					} else {
						btnlike = ''
					}
					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + data[vt].link_img1 + '" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(data[vt].giacaonhat) + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						btnlike +
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

function loadListSearch() {
	var type = getParameter('type', window.location.href);
	if (type === '1') {
		var id = getParameter('id', window.location.href);
		var page = getParameter('page', window.location.href);
		if (id === 'all') {
			loadListAll(page);
			loadListAllPage(page);
		} else {
			loadListCate(id, page);
			loadListCatePage(id, page);
		}
	} else if (type === '2') {
		var str = getParameter('str', window.location.href);
		var page = getParameter('page', window.location.href);

		loadListSearchString(decodeURIComponent(str), page);
		loadListSearchStringPage(decodeURIComponent(str), page);
	}

	$('#btnSearch').on('click', function () {
		var str = $(document.getElementById('searchString')).val();
		if (str === '') {
			location.href = '../views/search.html?type=1&id=all&page=1';
		} else {
			location.href = '../views/search.html?type=2&str=' + str + '&page=1';
		}
	});
}

function loadListSearchString(str, ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var st = String(str).replace('%20', ' ');
	var dataArr = {
		str: st,
		line: line
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchstring',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
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
					var btnlike = '';
					if (getCookie('userid') !== '') {
						btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>';
					} else {
						btnlike = ''
					}
					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + data[vt].link_img1 + '" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(data[vt].giacaonhat) + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						btnlike +
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

function loadListSearchStringPage(str, ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var st = String(str).replace('%20', ' ');
	var dataArr = {
		str: st,
		line: line
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchstringpage',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		loadPage(Object.keys(data).length);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListCate(cateid, ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var dataArr = {
		cateid: cateid,
		line: line
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchcate',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
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
					var btnlike = '';
					if (getCookie('userid') !== '') {
						btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>';
					} else {
						btnlike = ''
					}
					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + data[vt].link_img1 + '" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(data[vt].giacaonhat) + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '"><button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						btnlike +
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

function loadListCatePage(cateid, ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var dataArr = {
		cateid: cateid,
		line: line
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchcatepage',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		loadPage(Object.keys(data).length);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListAll(ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var dataArr = {
		line: line
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchall',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
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
					var btnlike = '';
					if (getCookie('userid') !== '') {
						btnlike = '&nbsp;<button type="button" class="btn btn-danger" onclick="likeDeal(' + getCookie('userid') + ',' + data[vt].madaugia + ')"><i class="fas fa-heart"></i></button>';
					} else {
						btnlike = '';
					}

					var iconnew = '';
					var datetime = new Date(data[vt].thoigiandang);
					if ((Math.floor(new Date().getTime() / 1000) + 25500  - datetime.getTime() / 1000) < 800) {	
						iconnew = '<img src="../img/new.png" height="35" width="35">'
					}

					$(document.getElementById(idrow)).append(
						'<div class="col">' +
						'<div class="card">' +
						'<img class="card-img-top" src="http://localhost:3000/assets/img/products/' + data[vt].link_img1 + '" alt="">' +
						'<div class="card-body">' +
						'<h4 class="card-title text-center">' + data[vt].tensanpham + '</h4>' +
						'<h5 class="card-text text-center" style="color: red">Giá: ' + covertInttoVND(data[vt].giacaonhat) + '</h5>' +
						'<h6 class="card-text text-center"><span id=\'time_' + i + '_' + j + '\'></span></h6>' +
						'</div>' +
						'<div class="card-footer text-center">' +
						'<a href="./dealdetail.html?dealid=' + data[vt].madaugia + '">' + iconnew + '<button type="button" class="btn btn-primary">ĐẤU GIÁ NGAY</button></a>' +
						btnlike +
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

function loadListAllPage(ln) {

	var line = '';

	if (ln === '1') {
		line = 1;
	} else {
		line = ln * 12 - 11;
	}

	var dataArr = {
		line: line
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/searchallpage',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		loadPage(Object.keys(data).length);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadPage(max) {
	$(document.getElementById('pagesid')).text('');
	var page = getParameter('page', window.location.href);
	var type = getParameter('type', window.location.href);
	var id = '';
	var str = '';
	var link = '../views/search.html?type=';
	if (type === '1') {
		id = getParameter('id', window.location.href);
		link += '1&id=' + id + '&page=';
	} else if (type === '2') {
		str = decodeURIComponent(getParameter('str', window.location.href));
	}

	var sopage = 0;
	if (max % 12 === 0) {
		sopage = Math.floor(max / 12);
	} else {
		sopage = Math.floor(max / 12) + 1;
	}

	var prev = '';

	if (page > 1 && sopage > 1) {
		prev = '<li class="page-item">' +
			'<a class="page-link" href="' + link + String(page - 1) + '" aria-label="Previous">' +
			'<span aria-hidden="true">&laquo;</span>' +
			'<span class="sr-only">Previous</span>' +
			'</a>' +
			'</li>';
	}

	var p = '';

	for (var i = 1; i <= sopage; i++) {
		if (i === page) {
			p += '<li class="page-item active">' +
				'<a class="page-link" href="' + link + String(i) + '">' + i + '</a>' +
				'</li>';
		} else {
			p += '<li class="page-item">' +
				'<a class="page-link" href="' + link + String(i) + '">' + i + '</a>' +
				'</li>';
		}
	}

	var next = '';
	if (page < sopage && sopage > 1) {
		next = '<li class="page-item">' +
			'<a class="page-link" href="' + link + String(parseInt(page) + 1) + '" aria-label="Next">' +
			'<span aria-hidden="true">&raquo;</span>' +
			'<span class="sr-only">Next</span>' +
			'</a>' +
			'</li>';
	}

	$(document.getElementById('pagesid')).append(
		'<div class="row">' + prev + p + next + '</div>'
	);
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

function getParameter(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	var regexS = '[\\?&]' + name + '=([^&#]*)';
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}