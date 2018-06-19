var socket = io('http://localhost:3000');

var updateid = new Array({
	dealid: String,
	sid: String,
	endtime: Date
});

socket.on('time_ostartupdatetime', function (data) {
	updateid.forEach(function (it) {
		getStringOutTime(data, it.endtime, it.sid);
	});
	if (data < it.endtime) {
		socket.emit('time_estartupdatetime', '');
		socket.on('update_dealdetail', function (data) {
			// alert('ID : ' + socket.id);
			getProductDetail();
		});
		
		socket.on('update_dealhistory', function (data) {
			cleanHistoryTable();
			getDealHistory();
		});
	}
});

$(document).ready(function () {
	socket.emit('time_estartupdatetime', '');

	getProductDetail();

	if (getCookie('userid') !== '') {
		$(document.getElementById('shTB')).append(
			'<table class="table" id="dealProductTable"><thead class="thead-light"><tr>' +
			'<th scope="col"></th><th scope="col">Thời gian đấu giá</th><th scope="col">Tên người đấu giá</th><th scope="col">Giá đấu giá</th>' +
			'</tr></thead><tbody></tbody></table>'
		);
		getDealHistory();
	}

	if (getCookie('userid') !== '') {
		$(document.getElementById('bnLike')).append(
			'<a href="#" class="btn btn-lg btn-outline-danger text-uppercase" id="btnLikeDeal"><i class="fas fa-heart"></i></a>'
		);
	}

	$('#btnDeal').on('click', function () {
		Deal();
	});

	$('#btnBuyNow').on('click', function () {
		BuyNow();
	});

	$('#btnLikeDeal').on('click', function () {
		likedeal();
	});

	$('#btnSubDealPrice').on('click', function () {
		subInputDealPrice();
	});

	$('#btnAddDealPrice').on('click', function () {
		addInputDealPrice();
	});

	$('#btnxCloseNotiDealSuccess').on('click', function () {
		location.reload();
	});

	$('#btnCloseNotiDealSuccess').on('click', function () {
		location.reload();
	});

	$('#slide_1').on('click', function () {
		var link = document.getElementById('slide_1').src;
		$(document.getElementById('slide_index')).attr('src', link);
	});

	$('#slide_2').on('click', function () {
		var link = document.getElementById('slide_2').src;
		$(document.getElementById('slide_index')).attr('src', link);
	});

	$('#slide_3').on('click', function () {
		var link = document.getElementById('slide_3').src;
		$(document.getElementById('slide_index')).attr('src', link);
	});


});

function Deal() {
	var userid = getCookie('userid');
	var dataArr = {
		userid: userid
	};

	var dataJS = JSON.stringify(dataArr);
	console.log(dataJS);
	$.ajax({
		url: 'http://localhost:3000/users/getnumreviewuser',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {

		var per = 0;

		if (Object.keys(data).length === 0) {
			per = 100;
		} else {
			per = (data[0].soluongthich / data[0].tongdanhgia) * 100;
		}

		if (per >= 80) {

			hiddennotificationHighPrice();
			hiddennotificationLogin();
			hiddennotificationSuccessDeal();
			hiddennotificationReview();

			var pricedeal = $(document.getElementById('tbDealPrice')).val();
			var dealid = $(document.getElementById('dealid')).val();
			var dealprice = $(document.getElementById('tbDealPrice')).val();
			var userid = getCookie('userid');

			if (getCookie('userid') !== '') {
				var dataArr = {
					dealid: dealid
				};
				var dataJS = JSON.stringify(dataArr);
				$.ajax({
					url: 'http://localhost:3000/deals/dealprice',
					type: 'POST',
					dataType: 'json',
					timeout: 10000,
					contentType: 'application/json',
					data: dataJS
				}).done(function (data) {
					if (data[0].giacaonhat >= parseInt(covertVNDtoInt(pricedeal))) {
						shownotificationHighPrice();
					} else {
						var dataArr = {
							dealid: dealid,
							userid: userid,
							dealprice: covertVNDtoInt(dealprice)
						};
						var dataJS = JSON.stringify(dataArr);
						$.ajax({
							url: 'http://localhost:3000/deals/updatedealprice',
							type: 'POST',
							dataType: 'json',
							timeout: 10000,
							contentType: 'application/json',
							data: dataJS
						}).done(function (data) {
							var time = new Date();
							var dataArr = {
								dealid: dealid,
								dealtime: time,
								userid: userid,
								dealprice: covertVNDtoInt(dealprice)
							};
							var dataJS = JSON.stringify(dataArr);
							$.ajax({
								url: 'http://localhost:3000/deals/insertdealhistory',
								type: 'POST',
								dataType: 'json',
								timeout: 10000,
								contentType: 'application/json',
								data: dataJS
							}).done(function (data) {
								shownotificationSuccessDeal();
								socket.emit('deal_pricesuccess', {
									dealid: dealid
								});
							}).fail(function (xhr, status, err) {
								console.log(err);
							});
							shownotificationSuccessDeal();
							socket.emit('deal_pricesuccess', {
								dealid: dealid
							});
							socket.emit('deal_updatehistory', {
								dealid: dealid
							});
						}).fail(function (xhr, status, err) {
							console.log(err);
						});
					}
				}).fail(function (xhr, status, err) {
					console.log(err);
				});
			} else {
				shownotificationLogin();
			}

		} else {
			shownotificationReview();
		}
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function BuyNow() {
	var userid = getCookie('userid');
	var pricemax = $(document.getElementById('lbPriceNow')).text();
	var dealid = getParameter('dealid', window.location.href);

	var dataArr = {
		userid: userid,
		pricemax: covertVNDtoInt(pricemax),
		dealid: dealid
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/updatebuynow',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		location.reload();
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function getProductDetail() {
	var dealid = getParameter('dealid', window.location.href);
	var dataArr = {
		dealid: dealid
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/dealdetail',
		type: 'post',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		
		$(document.getElementById('dealid')).val(dealid);
		$(document.getElementById('purchaserid')).val(getCookie('userid'));
		$(document.getElementById('SalerName')).text(data[0].tennguoiban);
		$(document.getElementById('SalerName')).attr('href', '../views/infouser.html?userid=' + data[0].manguoiban);
		if (data[0].manguoidaugiacaonhat !== 1) {
			$(document.getElementById('PurchaserName')).text(data[0].tennguoidaugiacaonhat);
			$(document.getElementById('PurchaserName')).attr('href', '../views/infouser.html?userid=' + data[0].manguoidaugiacaonhat);
		} else {
			$(document.getElementById('PurchaserName')).text('Chưa có');
			$(document.getElementById('PurchaserName')).removeAttr('href');
			$(document.getElementById('reviewPurchaser')).text('0');
		}
		$(document.getElementById('idPriceNow')).val(data[0].giacaonhat);


		document.title = data[0].tensanpham;
		$(document.getElementById('lbProductName')).text(data[0].tensanpham);
		$(document.getElementById('lbPrice')).text(covertInttoVND(data[0].giacaonhat));
		if (data[0].giamuangay === 0 || data[0].giamuangay < data[0].giacaonhat) {
			$(document.getElementById('lbUnitNow')).text('');
			$(document.getElementById('lbPriceNow')).text('Không có');
			$(document.getElementById('btnBuyNow')).removeClass('btn-outline-primary');
			$(document.getElementById('btnBuyNow')).addClass('btn-secondary');
			$(document.getElementById('btnBuyNow')).addClass('disabled');
		} else {
			$(document.getElementById('lbPriceNow')).text(covertInttoVND(data[0].giamuangay));
		}

		$(document.getElementById('slide_index')).attr('src', 'http://localhost:3000/assets/img/products/' + data[0].link_img1);
		$(document.getElementById('slide_1')).attr('src', 'http://localhost:3000/assets/img/products/' + data[0].link_img1);
		$(document.getElementById('slide_2')).attr('src', 'http://localhost:3000/assets/img/products/' + data[0].link_img2);
		$(document.getElementById('slide_3')).attr('src', 'http://localhost:3000/assets/img/products/' + data[0].link_img3);

		var datetime = new Date(data[0].thoigiandang);
		var time = datetime.toLocaleString("en-US");
		$(document.getElementById('createTime')).text(time);

		datetime = new Date(data[0].thoigianketthuc);
		time = datetime.toLocaleString("en-US");
		$(document.getElementById('endTime')).text(time);

		$(document.getElementById('descrep')).text('');
		$(document.getElementById('descrep')).append(data[0].mota);
		

		if (new Date().getTime() / 1000 > datetime.getTime() / 1000 || data[0].damua === 0) {
			$(document.getElementById('btnDeal')).addClass('disabled');
			$(document.getElementById('timeOut')).text('');
			$(document.getElementById('timeOut')).append('<b>Đã được mua</b>');
			$(document.getElementById('btnDeal')).text('');
			$(document.getElementById('btnDeal')).append('&nbsp;&nbsp;<i class="fas fa-gavel"></i>Đã được mua &nbsp;&nbsp;');
			$(document.getElementById('btnBuyNow')).addClass('disabled');
		} else {
			var objcard = {
				dealid: String,
				sid: String,
				endtime: Date
			};
			objcard.dealid = dealid;
			objcard.sid = 'timeOut';
			objcard.endtime = data[0].thoigianketthuc;
			updateid.push(objcard);
		}

		loadInputDealPrice(data[0].giacaonhat, data[0].buocgia);

		getStringOutTime(data[0].thoigianhientai, data[0].thoigianketthuc, 'timeOut');
		
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function getDealHistory() {
	var dealid = getParameter('dealid', window.location.href);
	var dataArr = {
		dealid: dealid
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/dealhistory',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		var demtt = 1;
		data.forEach(function (it) {
			var datetime = new Date(it.thoigiandaugia);
			var time = datetime.toLocaleString("en-US");
			var row = $(
				'<tr>' +
				'<th scope=\'row\'>' +
				demtt +
				'</th>' +
				'<td>' +
				time +
				'</td>' +
				'<td>' +
				encodeName(it.tennguoidung) +
				'</td>' +
				'<td>' +
				covertInttoVND(it.giadaugia) +
				'</td>' +
				'</tr>');
			$('#dealProductTable > tbody').append(row);
			demtt++;
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function cleanHistoryTable() {
	$("#dealProductTable tr").remove();
}

function loadInputDealPrice(pricenow, pricestep) {
	$(document.getElementById('idPriceStep')).val(pricestep);
	$(document.getElementById('tbDealPrice')).val(covertInttoVND(pricenow + pricestep));
}

function addInputDealPrice() {
	var pricestep = $(document.getElementById('idPriceStep')).val();
	var dealpricenow = $(document.getElementById('tbDealPrice')).val();
	var result = parseInt(covertVNDtoInt(dealpricenow)) + parseInt(pricestep);
	$(document.getElementById('tbDealPrice')).val(covertInttoVND(result));
}

function subInputDealPrice() {
	var pricestep = $(document.getElementById('idPriceStep')).val();
	var dealpricenow = $(document.getElementById('tbDealPrice')).val();
	var pricenow = $(document.getElementById('idPriceNow')).val();
	var result = parseInt(covertVNDtoInt(dealpricenow)) - parseInt(pricestep);
	if (result > parseInt(pricenow)) {
		$(document.getElementById('tbDealPrice')).val(covertInttoVND(result));
	}
}

function likedeal() {
	var userid = getCookie('userid');
	var dealid = getParameter('dealid', window.location.href);
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

function hiddennotificationLogin() {
	var notificationLogin = document.getElementById('notificationLogin');
	$(notificationLogin).addClass('d-none');
}

function shownotificationLogin() {
	var notificationLogin = document.getElementById('notificationLogin');
	$(notificationLogin).removeClass('d-none');
}

function hiddennotificationHighPrice() {
	var notificationLogin = document.getElementById('notificationHighPrice');
	$(notificationLogin).addClass('d-none');
}

function shownotificationHighPrice() {
	var notificationLogin = document.getElementById('notificationHighPrice');
	$(notificationLogin).removeClass('d-none');
}

function hiddennotificationSuccessDeal() {
	var notificationLogin = document.getElementById('notificationSuccessDeal');
	$(notificationLogin).addClass('d-none');
}

function shownotificationSuccessDeal() {
	var notificationLogin = document.getElementById('notificationSuccessDeal');
	$(notificationLogin).removeClass('d-none');
}

function hiddennotificationReview() {
	var notificationLogin = document.getElementById('notificationReview');
	$(notificationLogin).addClass('d-none');
}

function shownotificationReview() {
	var notificationLogin = document.getElementById('notificationReview');
	$(notificationLogin).removeClass('d-none');
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

function encodeName(name) {
	var result = '';
	for (var i = 0; i < name.length; i++) {
		if (Math.floor(name.length * 0.7) > i) {
			result += '*';
		} else {
			result += name[i];
		}
	}
	return result;
}

function getParameter(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	var regexS = '[\\?&]' + name + '=([^&#]*)';
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
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