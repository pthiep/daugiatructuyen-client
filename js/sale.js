$(document).ready(function () {
	checkUserLogin();
	loadinputCategories();

	$('#btnCreateDeal').on('click', function () {
		createDeal();
	});

	$('#closeSuccess').on('click', function () {
		location.reload();
	});
	
	$('#btncloseSuccess').on('click', function () {
		location.reload();
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
		var checkGiahan = $('#checkGiahan').is(':checked');

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
		if (parseInt(arrdate[0]) < 10){
			arrdate[0] = '0' + String(arrdate[0]);
		}
	}

	return arrdate[2] + '-' + arrdate[0] + '-' + arrdate[1] + ' ' + h + ':' + arrtime[1] + ':00';
}