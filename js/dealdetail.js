$(document).ready(function () {

	getProductDetail();

	$('#list-likeproduct-list').on('click', function () {

	});

});

function getProductDetail() {
	var proID = getParameter('dealid', window.location.href);

	var dataArr = {
		dealid: proID
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
		console.log(data);
		console.log();
		var datetime = new Date(data[0].thoigian);
		var now = datetime.toLocaleString();
		$(document.getElementById('lbProductName')).text(now);
		$(document.getElementById('lbPrice')).text(data[0].giagoc);
		if (data[0].giamuangay === null) {
			$(document.getElementById('lbUnitNow')).text('');
			$(document.getElementById('lbPriceNow')).text('Không có');
		} else {
			$(document.getElementById('lbPriceNow')).text(data[0].giamuangay);
		}
		
		/*
		var row = $(
			"<tr>" +
				"<th scope=\"row\">" +
					demtt +
				"</th>" +
				"<td>" +
					data[0].tensanpham +
				"</td>" +
				"<td>" +
					"<button type=\"button\" id=\"btnDelLikeProduct_ " + data[0].masanpham + "\" class=\"btn btn-danger\">Xóa</button>" +
				"</td>" +
			"</tr>");
		$("#likeProductTable > tbody").append(row);
		demtt++;
		*/
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function getParameter(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}