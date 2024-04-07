import axios from 'axios';

async function exportCSV(credentials: Credentials, campaign: Campaign) {
	return new Promise<string | undefined>(resolve => {
		axios
			.post(credentials.URL + '/admin/client/exportClientsCSV', {
				area: credentials.content.areaId,
				adminCode: credentials.content.password
			})
			.then(res => {
				if (res.status == 200) {
					const blob = new Blob(['\ufeff', res.data], { type: 'text/csv;charset=UTF-8' });
					const a = document.createElement('a');
					a.download = 'Export ' + campaign.name + ' ' + new Date().toLocaleDateString() + '.csv';
					a.href = URL.createObjectURL(blob);
					a.addEventListener('click', () => {
						setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
					});
					a.click();
					resolve(res.data);
				} else {
					resolve(undefined);
				}
			})
			.catch(err => {
				console.error(err);
				resolve(undefined);
			});
	});
}

export default exportCSV;
