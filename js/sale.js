$(document).ready(function () {
	checkUserLogin();
	loadinputCategories();

	loadListDeal();
	loadListDealing();

	$('#btnCreateDeal').on('click', function () {
		createDeal();
	});

	$('#closeSuccess').on('click', function () {
		location.reload();
	});

	$('#btncloseSuccess').on('click', function () {
		location.reload();
	});

	$('#btnInsertDes').on('click', function () {
		insertDescription();
	});

	$("input[type='file']").on("change", function () {
		var numFiles = $(this).get(0).files.length
		if (numFiles > 3) {
			$('#filenotiModal').modal('show');
			document.getElementById("uploadIMG").value = "";
		}
	});
});

function checkUserLogin() {
	if (getCookie('userid') === '') {
		location.href = 'homepage.html';
	}
}

function createDeal() {
	if (checkInput()) {
		//console.log($('#datetimepickerTimeEndText').val()); //06/13/2018 1:07 AM

		var userid = getCookie('userid');
		var useridpricemax = 1;
		var nameProduct = $(document.getElementById('nameProduct')).val();
		var priceProduct = $(document.getElementById('priceProduct')).val();
		var pricenowProduct = $(document.getElementById('pricenowProduct')).val();
		var pricestepProduct = $(document.getElementById('pricestepProduct')).val();
		var descriptionProduct = $(document.getElementById('descriptionProduct')).val();
		var dealTimeCreate = coverDateTime(new Date().toLocaleString(), 2);
		var dealTimeEnd = coverDateTime($('#datetimepickerTimeEndText').val(), 1);
		var idCategory = $('#inputCategory :selected').val();
		var bcheckGiahan = $('#checkGiahan').is(':checked');
		var checkGiahan = 1;
		if (bcheckGiahan === true) {
			checkGiahan = 0;
		} else {
			checkGiahan = 1;
		}

		var form = $('#fileUploadForm')[0];
		var data = new FormData(form);

		data.append("userid", userid);
		data.append("useridpricemax", useridpricemax);
		data.append("nameProduct", nameProduct);
		data.append("priceProduct", priceProduct);
		data.append("pricenowProduct", pricenowProduct);
		data.append("pricestepProduct", pricestepProduct);
		data.append("descriptionProduct", descriptionProduct);
		data.append("dealTimeCreate", dealTimeCreate);
		data.append("dealTimeEnd", dealTimeEnd);
		data.append("idCategory", idCategory);
		data.append("checkGiahan", checkGiahan);

		$.ajax({
			type: "POST",
			enctype: 'multipart/form-data',
			url: "http://localhost:3000/deals/createdeal",
			data: data,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 10000
		}).done(function (data) {
			console.log(data);

			if (data.result === 'OK') {
				$('#successModal').modal('show');
			}
		}).fail(function (xhr, status, err) {
			console.log(err);
		});

	}
}

function checkInput() {
	var rs = true;
	var listErr = new Array();
	$(document.getElementById('lbThongbao')).addClass('d-none');
	$(document.getElementById('lstErr')).text('');

	if ($(document.getElementById('nameProduct')).val() == '') {
		listErr.push(1);
		rs = false;
	}
	if ($(document.getElementById('priceProduct')).val() == '') {
		listErr.push(2);
		rs = false;
	}
	if ($(document.getElementById('pricestepProduct')).val() == '') {
		listErr.push(3);
		rs = false;
	}
	if (document.getElementById('uploadIMG').files.length == 0) {
		listErr.push(4);
		rs = false;
	}
	if (rs === false) {
		$(document.getElementById('lbThongbao')).removeClass('d-none');
	}
	listErr.forEach(function (it) {
		if (it === 1) {
			$(document.getElementById('lstErr')).append('<li>Chưa nhập tên sản phẩm</li>');
		}
		if (it === 2) {
			$(document.getElementById('lstErr')).append('<li>Chưa nhập giá gốc sản phẩm</li>');
		}
		if (it === 3) {
			$(document.getElementById('lstErr')).append('<li>Chưa nhập bước giá</li>');
		}
		if (it === 4) {
			$(document.getElementById('lstErr')).append('<li>Chưa nhập hình ảnh</li>');
		}
	});
	return rs;
}

function loadinputCategories() {
	$.ajax({
		url: 'http://localhost:3000/categories/',
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		data.forEach(element => {
			$(document.getElementById('inputCategory')).append(
				'<option value="' + element.madanhmuc + '">' + element.tendanhmuc + '</option>'
			);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListDeal() {
	var dataArr = {
		userid: getCookie('userid')
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/listdeal',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		data.forEach(element => {
			$(document.getElementById('listDeal')).append(
				'<tr>' +
				'<th scope="row">' + element.madaugia + '</th>' +
				'<td style="min-width: 375px;">' +
				'<a href="dealdetail.html?dealid=' + element.madaugia + '">' + element.tensanpham + '</a>' +
				'</td>' +
				'<td>' +
				'<button type="button" class="btn btn-info" id="btnChitiet" onclick="loadModalChitiet(' + element.madaugia + ')" value="' + element.madaugia + '">Chi tiết</button>' +
				'</td>' +
				'<td>' +
				'<button type="button" class="btn btn-info" id="btnLichsu" onclick="loadModalLichsu(' + element.madaugia + ')" value="' + element.madaugia + '">Lịch sử</button>' +
				'</td>' +
				'</tr>'
			);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadModalChitiet(dealid) {
	$('#chitietModal').modal('show');

	$(document.getElementById('listDescriptionEdit')).text('');
	$(document.getElementById('showDesOld')).text('');
	$(document.getElementById('footerModalChiTiet')).text('');
	$(document.getElementById('motaTextarea')).val('');
	var dataArr = {
		dealid: dealid
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/listdescription',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		var desOld = '';
		data.forEach(element => {
			desOld += element.mota;
			var datetime = new Date(element.thoigianthem);
			var time = datetime.toLocaleString("en-US");
			$(document.getElementById('listDescriptionEdit')).append(
				'<tr>' +
				'<td style="min-width: 250px;"><xmp>' + String(element.mota) + '</xmp></td>' +
				'<td>' + time + '</td>' +
				'</tr>'
			);
		});
		$(document.getElementById('showDesOld')).append(desOld);
		$(document.getElementById('footerModalChiTiet')).append(
			'<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>' +
			'<button type="button" class="btn btn-primary" onclick="insertDescription(' + dealid + ')" id="btnInsertDes">Thêm</button>'
		);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadModalLichsu(dealid) {
	console.log(dealid);
	$(document.getElementById('listHistoryEdit')).text('');
	$(document.getElementById('footerModalLichSu')).text('');

	$('#lichsuModal').modal('show');
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
		data.forEach(element => {
			var datetime = new Date(element.thoigiandaugia);
			var time = datetime.toLocaleString("en-US");
			$(document.getElementById('listHistoryEdit')).append(
				'<tr>' +
				'<td style="min-width: 250px;">' + element.tennguoidung + '</td>' +
				'<td>' + element.giadaugia + '</td>' +
				'<td>' + time + '</td>' +
				'<td><button type="button" class="btn btn-danger" onclick="kickUser(' + element.manguoidung +
				', ' + dealid + ',' + element.giadaugia + ')">KICK</button></td>' +
				'</tr>'
			);
		});
		$(document.getElementById('footerModalLichSu')).append(
			'<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>'
		);
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function kickUser(userid, dealid, gia) {
	console.log(userid + ' + ' + dealid + ' + ' + gia);

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
		if (gia === data[0].giacaonhat) {
			// cap nhat gia max + id
			$.ajax({
				url: 'http://localhost:3000/deals/dealhistory',
				type: 'POST',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json',
				data: dataJS
			}).done(function (data) {
				// data[1]. 				
				var dataArr = {
					userid: data[1].manguoidung,
					dealprice: data[1].giadaugia,
					dealid: dealid
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

					// insert camdaugia

					var dataArr = {
						userid: userid,
						dealid: dealid
					};

					var dataJS = JSON.stringify(dataArr);
					$.ajax({
						url: 'http://localhost:3000/deals/insertuserban',
						type: 'POST',
						dataType: 'json',
						timeout: 10000,
						contentType: 'application/json',
						data: dataJS
					}).done(function (data) {

						// Xoa khoi nhat ky dau gia

						var dataJS = JSON.stringify(dataArr);
						$.ajax({
							url: 'http://localhost:3000/deals/deleteuserban',
							type: 'POST',
							dataType: 'json',
							timeout: 10000,
							contentType: 'application/json',
							data: dataJS
						}).done(function (data) {
							$('#lichsuModal').modal('hide');
							$('#successlichsuModal').modal('show');
						}).fail(function (xhr, status, err) {
							console.log(err);
						});


					}).fail(function (xhr, status, err) {
						console.log(err);
					});

				}).fail(function (xhr, status, err) {
					console.log(err);
				});

			}).fail(function (xhr, status, err) {
				console.log(err);
			});

		}

		// insert camdaugia
		// delete nhat ki dau gia
	}).fail(function (xhr, status, err) {
		console.log(err);
	});

}

function insertDescription(dealid) {
	var mota = $(document.getElementById('motaTextarea')).val();
	var motamoi = String($(document.getElementById('showDesOld')).html()) + mota;

	var dataArr = {
		dealid: dealid,
		desciption: mota,
		timecreate: coverDateTime(new Date().toLocaleString(), 2)
	};

	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/insertdescription',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {

		var dataUpdate = {
			dealid: dealid,
			desciption: motamoi
		};
		console.log(dataUpdate);
		var dataJSU = JSON.stringify(dataUpdate);

		console.log(dataJSU);
		$.ajax({
			url: 'http://localhost:3000/deals/updatedescription',
			type: 'POST',
			dataType: 'text',
			timeout: 10000,
			contentType: 'application/json',
			data: dataJSU
		}).done(function (data) {
			$('#chitietModal').modal('hide');
			$('#successchitietModal').modal('show');
		}).fail(function (xhr, status, err) {
			console.log(err);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function loadListDealing() {

	var dataArr = {
		userid: getCookie('userid')
	};
	var dataJS = JSON.stringify(dataArr);
	$.ajax({
		url: 'http://localhost:3000/deals/listdeal',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: dataJS
	}).done(function (data) {
		var datenow = new Date().getTime();
		console.log(Math.floor(datenow / 1000));
		data.forEach(element => {
			
			var datetime = new Date(element.thoigianketthuc);
			var time = datetime.toLocaleString("en-US");
			console.log(datetime.getTime());
			if (datetime.getTime() >= datenow) {
				$(document.getElementById('listDealing')).append(
					'<tr>' +
					'<td>' + element.madaugia + '</td>' +
					'<td><a href="dealdetail.html?dealid=' + element.madaugia + '">' + element.tensanpham + '</a></td>' +
					'<td>' + element.giacaonhat + '</td>' +
					'<td>' + time + '</td>' +
					'</tr>'
				);
			}
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}

function coverDateTime(dt, check) {
	var arr = dt.split(' ');
	var arrdate = [];
	var arrtime = arr[1].split(':');
	var h = '';
	if (check === 1) {
		arrdate = arr[0].split('/');
		if (arr[2] === 'AM') {
			if (parseInt(arrtime[0]) < 10) {
				h = '0' + arrtime[0];
			} else {
				h = arrtime[0];
			}
		} else if (arr[2] === 'PM') {
			if (parseInt(arrtime[0]) === 12) {
				h = '00';
			} else {
				h = String(parseInt(arrtime[0]) + 12);
			}
		}
	} else {
		arrdate = arr[0].replace(',', '').split('/');
		if (arr[2] === 'AM') {
			if (parseInt(arrtime[0]) < 10) {
				h = '0' + arrtime[0];
			} else {
				h = arrtime[0];
			}
		} else if (arr[2] === 'PM') {
			if (parseInt(arrtime[0]) === 12) {
				h = '00';
			} else {
				h = String(parseInt(arrtime[0]) + 12);
			}
		}
		if (parseInt(arrdate[0]) < 10) {
			arrdate[0] = '0' + String(arrdate[0]);
		}
	}

	return arrdate[2] + '-' + arrdate[0] + '-' + arrdate[1] + ' ' + h + ':' + arrtime[1] + ':00';
}