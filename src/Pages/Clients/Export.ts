import axios from 'axios';

async function exportCSV(credentials: Credentials) {
	return new Promise<string | undefined>(resolve => {
		axios
			.post(credentials.URL + '/admin/client/exportClientsCSV', {
				area: credentials.content.areaId,
				adminCode: credentials.content.password
			})
			.then(res => {
				if (res.status == 200) {
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
