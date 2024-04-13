import { Route, Routes } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from '../../Components/Button';
import MyPieChart from '../../Components/Statistics/PieChart';
import E404 from '../E404';
import ResponseByTime from './ResponseByTime';

function GlobalStatisticsPage({ credentials }: { credentials: Credentials }) {
	const [Ratios, setRatios] = useState<Array<{ name: string; value: number }>>([]);
	const [Progress, setProgress] = useState<Array<{ name: string; value: number }>>([]);

	function getRatios() {
		return new Promise<RatiosResponse | undefined>(resolve => {
			axios
				.post(credentials.URL + '/stats/response', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId
				})
				.then(res => {
					if (res.data.OK) {
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

	function getProgress() {
		return new Promise<ProgressResponse | undefined>(resolve => {
			axios
				.post(credentials.URL + '/stats/call', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId
				})
				.then(res => {
					if (res.data.OK) {
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

	const COLORS = ['#08A47C', '#E74855', '#FFC482', '#403F4C'];
	const COLORS2 = ['#08A47C', '#4775FF', '#E74855'];

	useEffect(() => {
		getRatios().then(res => {
			if (res) {
				const newDatas = new Array<{ name: string; value: number }>();
				newDatas.push({ name: 'Voté pour nous', value: res.converted });
				newDatas.push({ name: 'Pas voté pour nous', value: res.failure });
				newDatas.push({ name: 'Pas interessé·e', value: res.notInterested });
				newDatas.push({ name: 'À retirer', value: res.removed });
				setRatios(newDatas);
			}
		});
		getProgress().then(res => {
			if (res) {
				const newDatas = new Array<{ name: string; value: number }>();
				newDatas.push({ name: 'Appelés', value: res.totalCalled });
				newDatas.push({ name: 'Pas répondu', value: res.totalNotRespond });
				newDatas.push({ name: 'Pas appelés', value: res.totalUser - res.totalNotRespond - res.totalCalled });
				setProgress(newDatas);
			}
		});
	}, []);

	return (
		<div className="GenericPage StatisticPage">
			<h1>Statistiques</h1>
			<div>
				<div>
					<div>
						<h4>Résultats des appels</h4>
						{Ratios.length != 0 ? (
							<MyPieChart colors={COLORS} datas={Ratios} />
						) : (
							<>Récupération en cours...</>
						)}
					</div>
					<div>
						<h4>Avancement des appels</h4>
						{Progress.length != 0 ? (
							<MyPieChart colors={COLORS2} datas={Progress} />
						) : (
							<>Récupération en cours...</>
						)}
					</div>
				</div>
				<div>
					<Button value="Réponses sur le temps" link="callByDate" />
				</div>
			</div>
		</div>
	);
}

function Satistics({ credentials }: { credentials: Credentials }) {
	const routes = [
		{
			path: '/',
			element: <GlobalStatisticsPage credentials={credentials} />
		},
		{
			path: '/callByDate',
			element: <ResponseByTime credentials={credentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<Routes>
			{routes.map((element, i) => {
				return <Route path={element.path} element={element.element} key={i} />;
			})}
		</Routes>
	);
}

export default Satistics;
