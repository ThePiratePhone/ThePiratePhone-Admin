import axios from 'axios';
import { useEffect, useState } from 'react';
import MyBarChart from '../../Components/Statistics/BarChart';

function CallByDate({ credentials }: { credentials: Credentials }) {
	const [callByDate, setCallByDate] = useState<statsResponse>([]);
	function getStats() {
		return new Promise<statsResponse | undefined>(resolve => {
			axios
				.post(credentials.URL + '/stats/callByDate', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId
				})
				.then(res => {
					if (res.data) {
						resolve(res.data.data);
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

	useEffect(() => {
		getStats().then(res => {
			if (res) {
				setCallByDate(res);
			}
		});
	}, []);
	return (
		<div className="CallByDate">
			<h4>Résultats des appels par heurs</h4>
			{callByDate.length != 0 ? <MyBarChart datas={callByDate} /> : <>Récupération en cours...</>}
		</div>
	);
}
export default CallByDate;
