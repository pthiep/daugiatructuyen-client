$(document).ready(function () {

	getProductDetail();

	$('#btnSubDealPrice').on('click', function () {
		subInputDealPrice();
	});

	$('#btnAddDealPrice').on('click', function () {
		addInputDealPrice();
	});

});

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
		$(document.getElementById('SalerName')).text(data[0].manguoiban);
		if (data[0].manguoidaugiacaonhat !== 0){
			$(document.getElementById('PurchaserName')).text(data[0].manguoidaugiacaonhat);
		}else{
			$(document.getElementById('PurchaserName')).text('Chưa có');
			$(document.getElementById('PurchaserName')).removeAttr("href");
			$(document.getElementById('reviewPurchaser')).text('0');
		}		

		var giacaonhat = data[0].giacaonhat;
		$(document.getElementById('idPriceNow')).val(giacaonhat);

		var dataProArr = {
			productid: data[0].masanpham
		};
		var dataProJS = JSON.stringify(dataProArr);

		$.ajax({
			url: 'http://localhost:3000/products/productdetail',
			type: 'post',
			dataType: 'json',
			timeout: 10000,
			contentType: 'application/json',
			data: dataProJS
		}).done(function (data) {
			var datetime = new Date(data[0].thoigian);
			var now = datetime.toLocaleString();
			$(document.getElementById('lbProductName')).text(data[0].tensanpham);
			$(document.getElementById('lbPrice')).text(giacaonhat);
			if (data[0].giamuangay === 0 || data[0].giamuangay < giacaonhat) {
				$(document.getElementById('lbUnitNow')).text('');
				$(document.getElementById('lbPriceNow')).text('Không có');
			} else {
				$(document.getElementById('lbPriceNow')).text(data[0].giamuangay);
			}

			loadInputDealPrice(giacaonhat, data[0].buocgia);

		}).fail(function (xhr, status, err) {
			console.log(err);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
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
	if (result > parseInt(pricenow))
	{
		$(document.getElementById('tbDealPrice')).val(result);
	}
}

function getParameter(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}