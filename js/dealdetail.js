var socket = io('http://localhost:3000');

socket.on('update_dealdetail', function (data) {
	// alert('ID : ' + socket.id);
	getProductDetail();
});

socket.on('update_dealhistory', function (data) {
	cleanHistoryTable();
	getDealHistory();
});

$(document).ready(function () {
	getProductDetail();
	getDealHistory();

	$('#btnDeal').on('click', function () {
		Deal();
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
});

function Deal() {
	hiddennotificationHighPrice();
	hiddennotificationLogin();
	hiddennotificationSuccessDeal();

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
			if (data[0].giacaonhat >= parseInt(pricedeal)) {
				shownotificationHighPrice();
			} else {
				var dataArr = {
					dealid: dealid,
					userid: userid,
					dealprice: dealprice
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
						dealprice: dealprice
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
		if (data[0].manguoidaugiacaonhat !== 1) {
			$(document.getElementById('PurchaserName')).text(data[0].tennguoidaugiacaonhat);
		} else {
			$(document.getElementById('PurchaserName')).text('Chưa có');
			$(document.getElementById('PurchaserName')).removeAttr('href');
			$(document.getElementById('reviewPurchaser')).text('0');
		}
		$(document.getElementById('idPriceNow')).val(data[0].giacaonhat);


		document.title = data[0].tensanpham;
		$(document.getElementById('lbProductName')).text(data[0].tensanpham);
		$(document.getElementById('lbPrice')).text(data[0].giacaonhat);
		if (data[0].giamuangay === 0 || data[0].giamuangay < data[0].giacaonhat) {
			$(document.getElementById('lbUnitNow')).text('');
			$(document.getElementById('lbPriceNow')).text('Không có');
			$(document.getElementById('btnBuyNow')).removeClass('btn-outline-primary');
			$(document.getElementById('btnBuyNow')).addClass('btn-secondary');
			$(document.getElementById('btnBuyNow')).addClass('disabled');
		} else {
			$(document.getElementById('lbPriceNow')).text(data[0].giamuangay);
		}

		var datetime = new Date(data[0].thoigiandang);
		var time = datetime.toLocaleString();
		$(document.getElementById('createTime')).text(time);
		datetime = new Date(data[0].thoigianketthuc);
		time = datetime.toLocaleString();
		$(document.getElementById('endTime')).text(time);
		$(document.getElementById('descrep')).text(data[0].mota);
		$(document.getElementById('reviewSaler')).text(data[0].danhgianguoiban);
		$(document.getElementById('reviewPurchaser')).text(data[0].danhgianguoimua);

		loadInputDealPrice(data[0].giacaonhat, data[0].buocgia);
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
				it.giadaugia +
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
	$(document.getElementById('tbDealPrice')).val(pricenow + pricestep);
}

function addInputDealPrice() {
	var pricestep = $(document.getElementById('idPriceStep')).val();
	var dealpricenow = $(document.getElementById('tbDealPrice')).val();
	var result = parseInt(dealpricenow) + parseInt(pricestep);
	$(document.getElementById('tbDealPrice')).val(result);
}

function subInputDealPrice() {
	var pricestep = $(document.getElementById('idPriceStep')).val();
	var dealpricenow = $(document.getElementById('tbDealPrice')).val();
	var pricenow = $(document.getElementById('idPriceNow')).val();
	var result = parseInt(dealpricenow) - parseInt(pricestep);
	if (result > parseInt(pricenow)) {
		$(document.getElementById('tbDealPrice')).val(result);
	}
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