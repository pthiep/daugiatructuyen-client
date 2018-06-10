var socket = io('http://localhost:3000');

$(document).ready(function () {
	
	loadListLikeProduct();

	$('#list-likeproduct-list').on('click', function () {
		loadListLikeProduct();
	});

});

function loadListLikeProduct() {
	$("#likeProductTable > tbody tr").remove();
	var dataArr = {
		userid: localStorage.getItem('userid')
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
			url: 'http://localhost:3000/users/likeproduct',
			type: 'post',
			dataType: 'json',
			timeout: 10000,
			contentType: 'application/json',
			data: dataJS
		}).done(function (data) {		// Cần sửa lại 1 câu Query
			var demtt = 1;	
			data.forEach(function (it) {
				var dataArrDetail = new Object();
				dataArrDetail = {
					productid: it.masanpham
				};
				var dataDetailJS = JSON.stringify(dataArrDetail);
				$.ajax({
					url: 'http://localhost:3000/products/productdetail',
					type: 'post',
					dataType: 'json',
					timeout: 10000,
					contentType: 'application/json',
					data: dataDetailJS
				}).done(function (data) {
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
				}).fail(function (xhr, status, err) {
					console.log(err);
				});	
			});
			
		})
		.fail(function (xhr, status, err) {
			console.log(err);
		});
}