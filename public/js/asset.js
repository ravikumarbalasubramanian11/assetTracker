(async () => {
	var username = localStorage.getItem("username");
	var DisplayUsername = username.charAt(0).toUpperCase() + username.slice(1);
	var id;
	var tableTransaction;
	var approvalModal;

	$("#username").text(DisplayUsername || "Default Username");

	var table = $('#myTable').DataTable({
		ajax: {
			dataType: 'json',
			method: 'GET',
			url: '/api/inventory/inventorySearchId',
			headers: {
				'x-at-sessiontoken': localStorage.getItem('token')
			},
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
				data: 'spec'
			},
			{
				data: 'purchaseDate'
			},
			{
				data: '',
				render: function (data, type, row) {
					var raiseRequest = '<button class="btn btn-delete raise-complaint-btn" data-id="' + row.id + '">Raise Complaint</button>';
					return '<div class="d-flex">' + raiseRequest + '</div>';
				}
			}
		]
	})

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

	var status = {
		1: "Pending",
		2: "Completed",
		3: "Cancelled",
		4: 'Rejected',
		5: 'Resolved'
	};

	var request = {
		1: "Request for Asset",
		2: 'Request for Service',
		3: 'Return the asset'
	};

	var asset = {
		1: "Laptop",
		2: "PC",
		3: "Mobile"
	}

	$('#transactionButton').on("click", function () {
		$('#transactionModal').modal('show');

		if (!tableTransaction) {
			tableTransaction = $('#TransactionTable').DataTable({
				ajax: {
					dataType: 'json',
					method: 'GET',
					url: '/api/request/transaction/0',
					headers: {
						'x-at-sessiontoken': localStorage.getItem('token')
					},
					dataSrc: 'message',
				},
				columns: [{
						data: 'id'
					},
					{
						data: "createdAt",
						render: function (data, type, row) {
							return formatDate(data);
						}
					},
					{
						data: 'requestType',
						render: function (data, type, row) {
							return request[row.requestType];
						}
					},
					{
						data: 'issue'
					},
					{
						data: 'assetType',
						render: function (data, type, row) {
							return data ? asset[data] : 'N/A';
						}
					},
					{
						data: 'status',
						render: function (data, type, row) {
							return status[row.status];
						}
					},
					{
						data: "updatedAt",
						render: function (data, type, row) {
							return formatDate(data);
						}
					},
					{
						data: null,
						render: function (data, type, row) {
							if (row.status === 1) {
								return '<button class="btn btn-success cancelled-complaint-btn" data-id="' + row.id + '">Cancel</button>';
							} else {
								return '';
							}
						}
					}
				],
				order: [
					[4, 'asc']
				]
			});
		}

		$('#TransactionTable tbody').on("click", ".cancelled-complaint-btn", function () {
			var requestId = $(this).data('id');

			var confirmed = confirm("Are you sure you want to cancel this request?");

			if (!confirmed) {
				return;
			}

			console.log('Cancelled button clicked for request ID:', requestId);

			$.ajax({
				url: 'http://localhost:3000/api/request/approve/' + requestId,
				method: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify({
					status: 3
				}),
				headers: {
					'x-at-sessiontoken': localStorage.getItem('token')
				},
				success: function (data) {
					console.log('Request cancelled successfully:', data);
					alert("Request cancelled successfully");
					tableTransaction.ajax.reload();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to cancel request', errorThrown);
					console.log('Error response data:', jqXHR.responseJSON);
				}
			});
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

	$('#approvalButton').on("click", function () {
		$('#approvalModal').modal('show');

		if (!approvalModal) {
			approvalModal = $('#ApprovalTable').DataTable({
				ajax: {
					dataType: 'json',
					method: 'GET',
					url: '/api/request/getRequest',
					headers: {
						'x-at-sessiontoken': localStorage.getItem('token')
					},
					dataSrc: 'data',
				},
				columns: [{
						data: 'id'
					},
					{
						data: "createdAt",
						render: function (data, type, row) {
							return formatDate(data);
						}
					},
					{
						data: 'requestType',
						render: function (data, type, row) {
							return request[row.requestType];
						}
					},
					{
						data: 'issue'
					},
					{
						data: 'assetType',
						render: function (data, type, row) {
							return data ? asset[data] : 'N/A';
						}
					},
					{
						data: 'status',
						render: function (data, type, row) {
							return status[row.status];
						}
					},
					{
						data: "updatedAt",
						render: function (data, type, row) {
							return formatDate(data);
						}
					},
					{
						data: null,
						render: function (data, type, row) {
							if (row.status === 1) {
								return '<button class="btn-sm my-2 btn-success cancelled-complaint-btn" data-id="' + row.id + '">Proceed</button>' +
									'<button class="btn-sm btn-danger rejected-complaint-btn" data-id="' + row.id + '">Reject</button>';
							} else {
								return '';
							}
						}
					}
				],
				order: [
					[4, 'asc']
				],
				success: function (response) {
					console.log("API Response Data:", response.message);
				},
				error: function (xhr, status, error) {
					console.error("API Request Error:", error);
				}
			});
		}
	});

	if (username !== 'hr') {
		$('#ApprovalTable').on('click', '.cancelled-complaint-btn', function () {
			const requestId = $(this).data('id');

			var confirmed = confirm("Are you sure you want to proceed this request?");

			if (!confirmed) {
				return;
			}
			updateStatus(requestId, 1, "proceed");
		});
	} else {
		$('#ApprovalTable').on('click', '.cancelled-complaint-btn', function () {
			const requestId = $(this).data('id');

			var confirmed = confirm("Are you sure you want to approve this request?");

			if (!confirmed) {
				return;
			}

			updateStatus(requestId, 2, "approved");
		});
	}

	$('#ApprovalTable').on('click', '.rejected-complaint-btn', function () {
		const requestId = $(this).data('id');
		var confirmed = confirm("Are you sure you want to reject this request?");

		if (!confirmed) {
			return;
		}

		updateStatus(requestId, 4, "rejected");
	});

	function updateStatus(id, newStatus, message) {
		$.ajax({
			url: `http://localhost:3000/api/request/approve/${id}`,
			type: 'PUT',
			contentType: 'application/json',
			headers: {
				'x-at-sessiontoken': localStorage.getItem('token')
			},
			data: JSON.stringify({
				status: newStatus
			}),
			success: function (response) {
				alert("Successfully " + message + " the request")
				console.log('Status updated successfully:', response);
				approvalModal.ajax.reload();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('Failed to update status', errorThrown);
				console.log('Error response data:', jqXHR.responseJSON);
			}
		});
	}
})()