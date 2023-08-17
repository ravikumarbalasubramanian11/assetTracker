(async () => {
	var username = localStorage.getItem("username");
	var DisplayUsername = username.charAt(0).toUpperCase() + username.slice(1);
	$("#username").text(DisplayUsername || "Default Username");

	const purchaseDateInput = document.getElementById("purchaseDate-create");
	const currentDate = new Date().toISOString().split("T")[0];
	purchaseDateInput.setAttribute("max", currentDate);

	const assetTypeSelect = document.getElementById("assetType-create");
	const laptopDetails = document.getElementById("laptopDetails");
	const pcDetails = document.getElementById("pcDetails");
	const mobileDetails = document.getElementById("mobileDetails");
	const chargerDetails = document.getElementById("chargerDetails");
	const keyboardDetails = document.getElementById("keyboardDetails");
	const mouseDetails = document.getElementById("mouseDetails");

	assetTypeSelect.addEventListener("change", function () {
		laptopDetails.style.display = "none";
		pcDetails.style.display = "none";
		chargerDetails.style.display = "none";
		keyboardDetails.style.display = "none";
		mobileDetails.style.display = "none";
		mouseDetails.style.display = "none";

		if (assetTypeSelect.value === "1") {
			laptopDetails.style.display = "block";
		} else if (assetTypeSelect.value === "2") {
			pcDetails.style.display = "block";
		} else if (assetTypeSelect.value === "3") {
			mobileDetails.style.display = "block";
		} else if (assetTypeSelect.value === "4") {
			chargerDetails.style.display = "block";
		} else if (assetTypeSelect.value === "5") {
			keyboardDetails.style.display = "block";
		} else if (assetTypeSelect.value === "6") {
			mouseDetails.style.display = "block";
		}
	});

	var usersDataMap = {};
	var editedRowData;

	var assetTypes = {
		1: "Laptop",
		2: "PC",
		3: "Mobile",
		4: "Charger",
		5: 'Keyboard',
		6: 'Mouse'
	};

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
		const assetId = $("#assetId-create").val();
		const manufacturer = $("#manufacturer-create").val();
		const assetName = $("#assetName-create").val();
		const purchaseDate = $("#purchaseDate-create").val();
		const vendorDetails = $("#vendorDetails-create").val();
		const assetType = $("#assetType-create").val();

		let data = {
			assetId: assetId,
			assetName: assetName,
			manufacturer: manufacturer,
			purchaseDate: purchaseDate,
			vendorDetails: vendorDetails,
			assetType: assetType,
			spec: {}
		};

		if (assetType === "1") {
			const ram = $("#ram-create").val();
			const internalStorage = $("#internalStorage-create").val();
			const cpuModel = $("#cpuModel-create").val();
			const screenSize = $("#screenSize-laptop-create").val();

			data.spec.ram = ram;
			data.spec.internalStorage = internalStorage;
			data.spec.cpuModel = cpuModel;
			data.spec.screenSize = screenSize;
		} else if (assetType === "2") {
			const screenSize = $("#screenSize-create").val();

			data.spec.screenSize = screenSize;
		} else if (assetType === "3") {
			const mobileRAM = $("#ram-mobile-create").val();
			const mobileInternalStorage = $("#internalStorage-mobile-create").val();

			data.spec.mobileRAM = mobileRAM;
			data.spec.mobileInternalStorage = mobileInternalStorage;
		} else if (assetType === "4") {
			const chargerVoltage = $("#chargerVoltage-create").val();

			data.spec.chargerVoltage = chargerVoltage;
		} else if (assetType === "5") {
			const keyboardLayout = $("#keyboardLayout-create").val();

			data.spec.keyboardLayout = keyboardLayout;
		} else if (assetType === "6") {
			const mouseType = $("#mouseType-create").val();

			data.spec.mouseType = mouseType;
		}

		console.log(data)

		$.ajax({
			url: "http://localhost:3000/api/inventory/create",
			type: "POST",
			data: JSON.stringify(data),
			contentType: "application/json",
			success: function (response) {
				console.log(response);
				if (response.success) {
					alert("Device created successfully!");
					$("#exampleModal").modal("hide");
					table.ajax.reload();
				} else {
					alert(response.message);
				}
			},
			error: function (error) {
				alert("Error creating device!");
			},
		});
	});

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
					data: "assetType",
					render: function (data, row, type) {
						return data ? assetTypes[data] : "---";
					}
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
					data: 'spec',
					render: function (data, type, row) {
						var specifications = data;
						var renderedSpec = '';

						for (var key in specifications) {
							if (specifications.hasOwnProperty(key)) {
								renderedSpec += key + ': ' + (specifications[key] ? specifications[key] : 'null') + ',<br>';
							}
						}
						return renderedSpec;
					}
				},
				{
					data: 'User.username',
					render: function (data, row, type) {
						return data ? data : "---";
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
						alert("Successfully Saved the changes");
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