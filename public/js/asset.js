(async () => {
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
	$('#myTable').on('click', '.raise-complaint-btn', function () {
		var rowData = table.row($(this).closest('tr')).data();
		$('#complaintSubject').val(rowData.assetName);
		$('#complaintDescription').val(''); // Clear description field if needed
		$('#complaintModal').modal('show');
	});

	// When "Submit" button in modal is clicked
	$('#submitComplaint').on('click', async function () {
		var subject = $('#complaintSubject').val();
		var description = $('#complaintDescription').val();

		try {
			$.ajax({
				url: 'http://localhost:3000/api/request/create',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					subject: subject,
					description: description,
				}),
				success: function (data, textStatus, jqXHR) {
					console.log('Complaint submitted successfully', data);
					// Display an alert or notification here
					alert('Complaint submitted successfully');
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.error('Failed to submit complaint', errorThrown);
					// Handle error case here
				}
			});
		} catch (error) {
			console.error('Error:', error);
			// Handle error case here
		}

		// Close the modal
		$('#complaintModal').modal('hide');
	});
})()