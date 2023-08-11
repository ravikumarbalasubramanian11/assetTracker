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

	var username = localStorage.getItem("username");

	if (username === 'hr') {
		document.getElementById('tableHeading').style.display = 'block';
		document.getElementById('myModal').style.display = 'block';

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
				{
					data: 'UserId',
					render: function (data, type, row) {
						if (data === null) {
							return 'N/A';
						} else {
							return data;
						}
					}
				},
				{ data: 'status' },
				{
					data: 'UserId',
					render: function (data, type, row) {
						var editButton = '<button class="btn btn-edit"><i class="fas fa-edit"></i></button>';
						var deleteButton = '<button class="btn btn-delete"><i class="fas fa-trash"></i></button>';
						return '<div class="d-flex">' + editButton + '<div class="mx-1"></div>' + deleteButton + '</div>';
					}
				}
			],
		});

		var editedRowData;

		$('#myTable').on('click', '.btn-edit', function () {
			var rowData = table.row($(this).parents('tr')).data();

			$('#editModal #assetId').val(rowData.assetId);
			$('#editModal #assetName').val(rowData.assetName);
			$('#editModal #manufacturer').val(rowData.manufacturer);
			$('#editModal #purchaseDate').val(rowData.purchaseDate);
			$('#editModal #vendorDetails').val(rowData.vendorDetails);
			$('#editModal #specification').val(rowData.spec);
			$('#editModal #status').val(rowData.status);

			editedRowData = rowData;
			$('#editModal').modal('show');
		});

		$('#saveEdit').on('click', function () {
			var updatedAssetId = $('#editModal #assetId').val();
			var updatedAssetName = $('#editModal #assetName').val();
			var updatedManufacturer = $('#editModal #manufacturer').val();
			var updatedPurchaseDate = $('#editModal #purchaseDate').val();
			var updatedVendorDetails = $('#editModal #vendorDetails').val();
			var updatedSpecification = $('#editModal #specification').val();
			var updatedStatus = $('#editModal #status').val();
			console.log(updatedStatus);

			if (!editedRowData) {
				alert('Error: No row data found.');
				return;
			}

			$.ajax({
				url: 'http://localhost:3000/api/inventory/edit/' + editedRowData.id,
				type: 'PUT',
				data: {
					assetId: updatedAssetId,
					assetName: updatedAssetName,
					manufacturer: updatedManufacturer,
					purchaseDate: updatedPurchaseDate,
					vendorDetails: updatedVendorDetails,
					spec: updatedSpecification,
					status: updatedStatus,
				},
				success: function (response) {
					console.log(response);
					if (response.success) {
						table.ajax.reload();
						$('#editModal').modal('hide');
					} else {
						alert('Failed to save changes: ' + response.message);
					}
				},
				error: function (xhr, textStatus, error) {
					alert('Error during saving changes: ' + error);
				}
			});
		});

		$('#editModal').on('hidden.bs.modal', function () {
			$(this).find('form')[0].reset();
		});

		$('#myTable').on('click', '.btn-delete', function () {
			var rowData = table.row($(this).parents('tr')).data();
			var confirmation = confirm('Are you sure you want to delete ' + rowData.assetName + '?');

			if (confirmation) {
				$.ajax({
					url: 'http://localhost:3000/api/inventory/delete/' + rowData.id,
					type: 'DELETE',
					success: function (response) {
						if (response.success) {
							alert('Delete operation for ' + rowData.assetName + ' is confirmed!');
							table.ajax.reload();
						} else {
							alert('Delete operation failed: ' + response.message);
						}
					},
					error: function (xhr, textStatus, error) {
						alert('Error during delete operation: ' + error);
					}
				});
			}
		});

	}
	else {
		$('#myTable').hide();
	}

	if (username !== 'hr') {
		document.getElementById('raiseRequestBtn').style.display = 'block';

		$('#raiseRequestBtn').on('click', function () {
			$('#requestModal').modal('show');
		});

		$('#submitRequestBtn').on('click', function () {
			function submitRequest() {
				var requestData = {
					requestType: $('#requestType').val(),
					assetType: $('#assetType').val(),
					presentStatus: $('#presentStatus').val(),
					requestDetails: $('#requestDetails').val(),
				};

				$.ajax({
					url: 'http://localhost:3000/api/request/create',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(requestData),
					success: function (response) {
						console.log('Request submitted successfully:', response);
						$('#requestModal').modal('hide');
						resetFormInputs();
					},
					error: function (error) {
						console.error('Error submitting request:', error);
					},
				});
			}
			submitRequest()
		});

		function resetFormInputs() {
			$('#requestType').val('');
			$('#assetType').val('');
			$('#presentStatus').val('');
			$('#requestDetails').val('');
		}
	}

})()