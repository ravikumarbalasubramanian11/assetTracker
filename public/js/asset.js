(async () => {
	var username = localStorage.getItem("username");

	var table = $('#myTable').DataTable({
		ajax: {
			dataType: 'json',
			method: 'GET',
			url: '/api/inventory/inventorySearchId/4',
			dataSrc: 'message',
		},
		columns: [
			{ data: 'id' },
			{ data: 'assetName' },
			{ data: 'assetId' },
			{ data: 'manufacturer' },
			{ data: 'spec' },
			{ data: 'purchaseDate' },
			{
				data: '',
				render: function (data, type, row) {
					var raiseRequest = '<button class="btn btn-delete raise-complaint-btn" data-id="' + row.id + '">Raise Complaint</button>';
					return '<div class="d-flex">' + raiseRequest + '</div>';
				}
			}
		]
	})

	var id;
	$('#myTable').on('click', '.raise-complaint-btn', function () {
		var rowData = table.row($(this).closest('tr')).data();
		id = rowData.id;
		$('#complaintSubject').val(rowData.assetName);
		$('#complaintDescription').val('');
		$('#complaintModal').modal('show');
		console.log('Clicked column id:', id);
	});

	$('#submitComplaint').on('click', function () {
		var subject = $('#complaintSubject').val();
		var description = $('#complaintDescription').val();
		$.ajax({
			url: 'http://localhost:3000/api/request/create',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				subject: subject,
				issue: description,
				requestType: 2,
				InventoryId: id
			}),
			headers: {
				'x-at-sessiontoken': localStorage.getItem('token')
			},
			success: function (data, textStatus, jqXHR) {
				console.log('Complaint submitted successfully', data);
				alert('Complaint submitted successfully');
				console.log('Server response:', data);
				$('#complaintModal').modal('hide');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('Failed to submit complaint', errorThrown);
				console.log('Error response data:', jqXHR.responseJSON);
				alert(jqXHR.responseJSON.message)
			}
		});
	});

	$('#transactionButton').on("click", function () {
		$.ajax({
			url: 'http://localhost:3000/api/request/transaction',
			method: 'GET',
			headers: {
				'x-at-sessiontoken': localStorage.getItem('token')
			},
			success: function (data) {
				console.log(data);

				var statusHeadings = {
					"status1": "Pending",
					"status2": "Completed",
					"status3": "Cancelled",
					"status4": "Rejected",
					"status5": "Resolved"
				};

				var requestType = {
					1: "Request for Asset",
					2: "Request for Service",
					3: "Return the asset"
				};

				var statusHtml = '';
				for (var status in data.statusData) {
					var statusArray = data.statusData[status];

					if (statusArray.length > 0) {
						var heading = statusHeadings[status] || "Unknown";
						statusHtml += '<h4>' + heading + '</h4>';

						var statusBarsHtml = '';
						for (var i = 0; i < statusArray.length; i++) {
							var requestTypeId = statusArray[i].requestType;
							var requestTypeName = requestType[requestTypeId] || "Unknown Request Type";

							statusHtml += '<div class=" row status-bar">' +
								'<div class="col-6"><h5>Request Type</h5></div>' +
								'<div class="col-6"><h5>Issue</h5></div>' +
								'<div class="col-6">' + requestTypeName + '</div>' +
								'<div class="status-label col-6">' + statusArray[i].issue + '</div>' +
								'<div class="col-6"><h5>Created Date</h5></div>' +
								'<div class="col-6"><h5>Last Action</h5></div>' +
								'<div class="col-6">' + formatDate(statusArray[i].createdAt) + '</div>' +
								'<div class="status-label col-6">' + formatDate(statusArray[i].updatedAt) + '</div>' +
								'</div>';
						}

						statusHtml += statusBarsHtml;
					}
				}

				$('#transactionModal .modal-body').html(statusHtml);

				$('#transactionModal').modal('show');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('Failed to get API data', errorThrown);
				console.log('Error response data:', jqXHR.responseJSON);
			}
		});
	});

	function formatDate(dateTime) {
		var date = new Date(dateTime);
		var formattedDate = date.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		return formattedDate;
	}

	if (username !== 'hr') {
		$('#requestAsset').css('display', 'block');

		$('#requestAsset').on('click', function () {
			$('#raiseRequestModal').modal('show');
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
					headers: {
						'x-at-sessiontoken': localStorage.getItem('token')
					},
					data: JSON.stringify(requestData),
					success: function (response) {
						console.log('Request submitted successfully:', response);
						alert('Asset request submitted');
						$('#raiseRequestModal').modal('hide');
						resetFormInputs();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log('Failed to get API data', errorThrown);
						console.log('Error response data:', jqXHR.responseJSON);
					}
				});
			}
			submitRequest();
		});

		function resetFormInputs() {
			$('#requestType').val('');
			$('#assetType').val('');
			$('#presentStatus').val('');
			$('#requestDetails').val('');
		}
	}
})()