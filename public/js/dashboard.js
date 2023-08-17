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
								var formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
								var formattedValue = specifications[key] ? specifications[key] : 'null';
								renderedSpec += formattedKey + ': ' + formattedValue + ',<br>';
							}
						}

						renderedSpec = renderedSpec.replace(/,([a-z])/g, function (letter) {
							return ', ' + letter.toUpperCase();
						});

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
			rowData = table.row($(this).parents('tr')).data();

			$('#editModal #assetId-edit').val(rowData.assetId);
			$('#editModal #assetName-edit').val(rowData.assetName);
			$('#editModal #manufacturer-edit').val(rowData.manufacturer);
			$('#editModal #purchaseDate-edit').val(rowData.purchaseDate);
			$('#editModal #vendorDetails-edit').val(rowData.vendorDetails);
			$("#editModal #assetType-edit").val(rowData.assetType);
			$('#editModal #status-edit').val(rowData.status);

			hideAllDetails();

			if (rowData.assetType === 1) {
				$('#laptopDetails-edit').show();

				if (rowData.spec) {
					$('#editModal #ram-edit').val(rowData.spec.ram);
					$('#editModal #cpuModel-edit').val(rowData.spec.cpuModel);
					$('#editModal #screenSize-laptop-edit').val(rowData.spec.screenSize);
					$('#editModal #internalStorage-edit').val(rowData.spec.internalStorage);
				} else {
					clearLaptopDetails();
				}
			} else if (rowData.assetType === 2) {
				$('#pcDetails-edit').show();

				if (rowData.spec) {
					$("#editModal #screenSize-edit").val(rowData.spec.screenSize);
				} else {
					clearPcDetails();
				}
			} else if (rowData.assetType === 3) {
				$('##mobileDetails-edit').show();

				if (rowData.spec) {
					$('#internalStorage-mobile-edit').show(rowData.spec.mobileInternalStorage);
					$('#ram-mobile-edit').show(rowData.spec.mobileRAM);
				} else {
					clearMobileDetails()
				}
			} else if (rowData.assetType === 4) {
				$('#chargerDetails-edit').show();
				if (rowData.spec) {
					$('#editModal #chargerVoltage-edit').val(rowData.spec.chargerVoltage);
				} else {
					clearChargerDetails();
				}
			} else if (rowData.assetType === 5) {
				$('#keyboardDetails-edit').show();

				if (rowData.spec) {
					$('#keyboardLayout-edit').val(rowData.spec.keyboardLayout); // Use the correct ID here
				} else {
					clearKeyboardDetails();
				}
			} else if (rowData.assetType === 6) {
				$('#mouseDetails-edit').show();
				if (rowData.spec) {
					$('#editModal #mouseType-edit').val(rowData.spec.mouseType);
				} else {
					clearMouseDetails();
				}
			}
			$('#editModal').modal('show');
		});

		function hideAllDetails() {
			$('#laptopDetails-edit').hide();
			$('#pcDetails-edit').hide();
			$('#mobileDetails-edit').hide();
			$('#chargerDetails-edit').hide();
			$('#keyboardDetails-edit').hide();
			$('#mouseDetails-edit').hide();
		}

		function clearLaptopDetails() {
			$('#editModal #ram-edit').val('');
			$('#editModal #cpuModel-edit').val('');
			$('#editModal #screenSize-laptop-edit').val('');
			$('#editModal #internalStorage-edit').val('');
		}

		function clearPcDetails() {
			$("#editModal #screenSize-edit").val("");
		}

		function clearChargerDetails() {
			$('#editModal #chargerVoltage-edit').val('');
		}

		function clearKeyboardDetails() {
			$("#editModal #keyBoardLayout-edit").val("");
		}

		function clearMobileDetails() {
			$('#internalStorage-mobile-edit').val("");
			$('#ram-mobile-edit').val("");
		}

		function clearMouseDetails() {
			$("#editModal #mouseType-edit").val("");
		}

		$('#saveEdit').on('click', function () {
			if (!rowData) {
				alert('Error: No row data found.');
				return;
			}

			var editedData = {
				assetId: $('#editModal #assetId-edit').val(),
				assetName: $('#editModal #assetName-edit').val(),
				manufacturer: $('#editModal #manufacturer-edit').val(),
				purchaseDate: $('#editModal #purchaseDate-edit').val(),
				vendorDetails: $('#editModal #vendorDetails-edit').val(),
				assetType: $("#editModal #assetType-edit").val(),
				status: $('#editModal #status-edit').val()
			};

			if (editedData.assetType === "1") {
				editedData.spec = {
					ram: $('#editModal #ram-edit').val(),
					cpuModel: $('#editModal #cpuModel-edit').val(),
					screenSize: $('#editModal #screenSize-laptop-edit').val(),
					internalStorage: $('#editModal #internalStorage-edit').val()
				};
			} else if (editedData.assetType === "2") {
				editedData.spec = {
					screenSize: $('#editModal #screenSize-edit').val()
				};
			} else if (editedData.assetType === "3") {
				editedData.spec = {
					mobileInternalStorage: $('#internalStorage-mobile-edit').val(),
					mobileRAM: $('#ram-mobile-edit').val()
				};
			} else if (editedData.assetType === "4") {
				editedData.spec = {
					chargerVoltage: $('#editModal #chargerVoltage-edit').val()
				};
			} else if (editedData.assetType === "5") {
				editedData.spec = {
					keyboardLayout: $('#keyboardLayout-edit').val()
				};
			} else if (editedData.assetType === "6") {
				editedData.spec = {
					mouseType: $('#editModal #mouseType-edit').val()
				};
			}

			console.log(editedData);

			$.ajax({
				url: 'http://localhost:3000/api/inventory/edit/' + rowData.id,
				type: 'PUT',
				data: editedData,
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