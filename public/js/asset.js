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
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('Failed to submit complaint', errorThrown);
				console.log('Error response data:', jqXHR.responseJSON);
			}
		});

		$('#complaintModal').modal('hide');
	});

	$(document).on('click',function () {
		$('#requestButton').on("click",function () {
			$('#requestModal').modal('show');
		});
	});
})()