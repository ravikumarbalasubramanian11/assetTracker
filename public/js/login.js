(() => {
	document.getElementById('registrationForm').addEventListener('submit', function (e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const formDataObject = {};
		formData.forEach((value, key) => {
			formDataObject[key] = value;
		});

		const loadingIcon = document.createElement('img');
		loadingIcon.src = 'loading.gif';
		loadingIcon.alt = 'Loading...';
		loadingIcon.style.display = 'block';
		e.target.appendChild(loadingIcon);

		fetch('http://localhost:3000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formDataObject)
			})
			.then(response => response.json())
			.then(data => {
				console.log(data);

				e.target.removeChild(loadingIcon);

				if (data.success) {
					localStorage.setItem('token', data.token);
					localStorage.setItem('username', data.username);
					window.location.href = '/dashboard';
				} else {
					const errorMessageElement = document.getElementById('error-message');
					errorMessageElement.style.display = 'block';
				}
			})
			.catch(error => {
				e.target.removeChild(loadingIcon);
				console.error(error);
			});
	});
})()