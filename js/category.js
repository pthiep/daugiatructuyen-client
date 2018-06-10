$(document).ready(function () {

	loadCategories();

	$('#list-likeproduct-list').on('click', function () {

	});
});

function loadCategories() {

	$.ajax({
		url: 'http://localhost:3000/categories/',
		dataType: 'json',
        timeout: 10000
	}).done(function (data) {
		data.forEach(element => {
			$(document.getElementById('listCategory')).append(
				'<a class="dropdown-item" href="#">' + element.tendanhmuc + '</a>'
			);
		});
	}).fail(function (xhr, status, err) {
		console.log(err);
	});
}