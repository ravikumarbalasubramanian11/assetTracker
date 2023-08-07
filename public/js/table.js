(async () => {

	$("#myModal").on('click', function () {
		$("#exampleModal").modal("show");
	});

	$("#saveDevice").on('click', function () {
		var assetId = $("#assetId").val();
		var assetName = $("#assetName").val();
		var manufacturer = $("#manufacturer").val();
		var purchaseDate = $("#purchaseDate").val();
		var vendorDetails = $("#vendorDetails").val();
		var specification = $("#specification").val();

		console.log("000000000000", assetName);

		$.ajax({
			url: "http://localhost:3000/api/inventory/create",
			type: "POST",
			data: {
				assetId: assetId,
				assetName: assetName,
				manufacturer: manufacturer,
				purchaseDate: purchaseDate,
				vendorDetails: vendorDetails,
				spec: specification,
			},
			success: function (response) {
				console.log(response);
				if (response.success) {
					alert("Device created successfully!");
					$("#exampleModal").modal("hide");
				} else {
					alert(response.message);
				}
			},
			error: function (error) {
				alert("Error creating device!");
			},
		});
	});

	var table = $('#myTable').DataTable({
		ajax: {
			dataType: 'json',
			method: 'GET',
			url: '/api/inventory/get',
			dataSrc: 'message',
		},
		columns: [
			{ data: 'id' },
			{ data: 'assetName' },
			{ data: 'assetId' },
			{ data: 'manufacturer' },
			{ data: 'vendorDetails' },
			{ data: 'purchaseDate' },
			{ data: 'spec' },
			{ data: 'status' },
			{
				data: null,
				render: function (data, type, row) {
					var editButton = '<button class="btn btn-edit"><i class="fas fa-edit"></i></button>';
					var deleteButton = '<button class="btn btn-delete"><i class="fas fa-trash"></i></button>';
					return editButton + ' ' + deleteButton ;
				}
			}
		],
	});

	$('#myTable').on('click', '.btn-delete', function () {
		var rowData = table.row($(this).parents('tr')).data();
		var confirmation = confirm('Are you sure you want to delete ' + rowData.assetName + '?');
		if (confirmation) {
			alert('Delete operation for ' + rowData.assetName + ' is confirmed!');
		}
	});

})()