(async () => {
	var username = localStorage.getItem("username");

	var DisplayUsername = username.charAt(0).toUpperCase() + username.slice(1);

	var usersDataMap = {};
	var editedRowData;

	$.ajax({
		url: "http://localhost:3000/api/list",
		method: "GET",
		dataType: "json",
		headers: {
			'x-at-sessiontoken': localStorage.getItem('token')
		},
		success: function (data) {
			console.log(data);

			if (data.data) {
				const selectElement = $("#assignedTo");
				usersDataMap[0] = "None";
				data.data.forEach(function (user) {
					usersDataMap[user.id] = user.username;
				});
				selectElement.empty();

				for (const userId in usersDataMap) {
					selectElement.append(new Option(usersDataMap[userId], userId));
				}
			} else {
				console.error("API Error:", data.message);
			}
		},
		error: function (xhr, status, error) {
			console.error("API Request Failed:", error);
		}
	});


	$("#myModal").on('click', function () {
		$("#exampleModal").modal("show");
	});

	$("#saveDevice").on('click', function () {
		var assetId = $("#assetId1").val();
		var assetName = $("#assetName1").val();
		var manufacturer = $("#manufacturer1").val();
		var purchaseDate = $("#purchaseDate1").val();
		var vendorDetails = $("#vendorDetails1").val();
		var specification = $("#specification1").val();

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

	$("#username").text(DisplayUsername || "Default Username");

	if (username === 'hr') {
		setTimeout(() => {
			table.ajax.reload();
		}, 2000);

		document.getElementById('tableHeading').style.display = 'block';
		document.getElementById('myModal').style.display = 'block';

		var table = $('#myTable').DataTable({
			ajax: {
				dataType: 'json',
				method: 'GET',
				url: '/api/inventory/get',
				dataSrc: 'message',
			},
			columns: [{
					data: 'id'
				},
				{
					data: 'assetName'
				},
				{
					data: 'assetId'
				},
				{
					data: 'manufacturer'
				},
				{
					data: 'vendorDetails'
				},
				{
					data: 'purchaseDate'
				},
				{
					data: 'spec'
				},
				{
					data: 'UserId',
					render: function (data, type, row) {
						return usersDataMap[data] || data;
					}
				},
				{
					data: 'status'
				},
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

		$('#myTable').on('click', '.btn-edit', function () {
			var rowData = table.row($(this).parents('tr')).data();

			$('#editModal #assetId').val(rowData.assetId);
			$('#editModal #assetName').val(rowData.assetName);
			$('#editModal #manufacturer').val(rowData.manufacturer);
			$('#editModal #purchaseDate').val(rowData.purchaseDate);
			$('#editModal #vendorDetails').val(rowData.vendorDetails);
			$('#editModal #specification').val(rowData.spec);
			$('#editModal #status').val(rowData.status);
			$("#editModal #assignedTo").val(rowData.UserId);
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
			var updatedAssignee = $("#editModal #assignedTo").val();

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
					UserId: updatedAssignee,
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
				var loadingIcon = $('<img src="loading.gif" alt="Loading..." />');
				$(this).after(loadingIcon);

				$.ajax({
					url: 'http://localhost:3000/api/inventory/delete/' + rowData.id,
					type: 'DELETE',
					success: function (response) {
						loadingIcon.remove();

						if (response.success) {
							alert('Delete operation for ' + rowData.assetName + ' is confirmed!');
							table.ajax.reload();
						} else {
							alert('Delete operation failed: ' + response.message);
						}
					},
					error: function (xhr, textStatus, error) {
						loadingIcon.remove();
						alert('Error during delete operation: ' + error);
					}
				});
			}
		});

	} else {
		$('#myTable').hide();
	}
})()