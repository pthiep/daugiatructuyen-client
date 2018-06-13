$(document).ready(function () {
	checkUserLogin();
	// console.log(coverDateTime('06/13/2018 12:07 PM'));
	$('#loginModal').on('hidden.bs.modal', function (e) {
		
	})
	$('#btnCreateDeal').on('click', function () {
		
	});

	$("input[type='file']").on("change", function(){  
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
	if (checkInput())
	{
		//console.log($('#datetimepickerTimeEndText').val()); //06/13/2018 1:07 AM
	}
}

function checkInput() {

}

function coverDateTime(dt) {
	var arr = dt.split(' ');
	var arrdate = arr[0].split('/');
	var arrtime = arr[1].split(':');

	var h = '';

	if (arr[2] === 'AM'){
		if (parseInt(arrtime[0]) < 10){
			h = '0' + arrtime[0];
		} else {
			h = arrtime[0];
		}
	} else if (arr[2] === 'PM'){
		if (parseInt(arrtime[0]) === 12) {
			h = '00';
		} else {
			h = String(parseInt(arrtime[0]) + 12);
		}		
	}

	return arrdate[2] + '-' + arrdate[0] + '-' + arrdate[1] + ' ' + h + ':' + arrtime[1] + ':00';
}