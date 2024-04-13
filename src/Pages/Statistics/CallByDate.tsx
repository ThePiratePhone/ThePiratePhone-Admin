import axios from 'axios';
import { useEffect, useState } from 'react';
import MyBarChart from '../../Components/Statistics/BarChart';

function CallByDate({ credentials }: { credentials: Credentials }) {
	const [callByDate, setCallByDate] = useState<statsResponse>([]);
	const [granularity, setGranularity] = useState<number>(3_600_000);
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

	function granularityChange() {
		switch ((document.querySelector('#granularity') as any).value ?? '') {
			case 'day':
				setGranularity(86_400_000);
				break;
			case 'hours':
				setGranularity(3_600_000);
				break;
			case '30minutes':
				setGranularity(1_800_000);
				break;
			case 'minutes':
				setGranularity(60_000);
				break;
			default:
				setGranularity(3_600_000);
				break;
		}
	}

	return (
		<div className="CallByDate">
			<h4>Résultats des appels par heurs</h4>
			{callByDate.length != 0 ? (
				<MyBarChart datas={callByDate} granularity={granularity} />
			) : (
				<>Récupération en cours...</>
			)}
			granularité:
			<select id="granularity" className="inputField" defaultValue={'hours'} onChange={granularityChange}>
				<option key={1} value={'day'}>
					1j
				</option>
				<option key={1} value={'hours'}>
					1h
				</option>
				<option key={1} value={'30minutes'}>
					30min
				</option>
				<option key={1} value={'minutes'}>
					1min
				</option>
			</select>
		</div>
	);
}
export default CallByDate;
