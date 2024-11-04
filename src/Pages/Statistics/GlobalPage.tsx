import axios from 'axios';
import { PureComponent, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
	Area,
	Brush,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

import MyPieChart from '../../Components/Statistics/PieChart';
import E404 from '../E404';

class MyBarChart extends PureComponent<{
	datas: Array<TimeResponse>;
}> {
	render() {
		function densityGroup(data: Array<TimeResponse>) {
			const datas = new Map<
				number,
				{
					time: number;
					total: number;
					toRecal: number;
					called: number;
					inprogress: number;
				}
			>();
			data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
			data.forEach(item => {
				const time = new Date(item.date).getTime();
				if (time == 0) return;

				const roundedTime = Math.floor(time / 1_800_000) * 1_800_000;
				if (!datas.has(roundedTime)) {
					datas.set(roundedTime, {
						time: roundedTime,
						total: 0,
						toRecal: 0,
						called: 0,
						inprogress: 0
					});
				}
				const data = datas.get(roundedTime);
				if (data) {
					data.total++;
					datas.set(roundedTime, data);
					data.called++;
					if (item.satisfaction == 'inprogress') data.inprogress++;
					if (item.response) data['toRecal']++;
				}
			});

			const values = new Array<{
				time: number;
				total: number;
				toRecal: number;
				called: number;
			}>();

			datas.forEach(val => {
				val['toRecal'] = parseFloat(((val['toRecal'] / val.total) * 100).toFixed(1));
				val.called = 100 - parseFloat(val['toRecal'].toFixed(1));

				if (val.total >= 10) values.push(val);
			});
			return values;
		}

		function toPercent(decimal: number) {
			return (decimal * 100).toFixed() + '%';
		}

		const cleanedData = densityGroup(this.props.datas);
		function CustomTooltip({ active, payload, label }) {
			if (active && payload && payload.length) {
				return (
					<div className="CustomTooltip">
						<span className="Phone">{new Date(label).toLocaleString()}</span>
						<div>
							Répondu: <span className="Phone">{payload[0].value}%</span>
						</div>
						<div>
							Pas répondu: <span className="Phone">{payload[1].value}%</span>
						</div>
						<div>
							Nombre d'appel:
							<span className="Phone">{payload[2].value}</span>
						</div>
					</div>
				);
			}
			return <></>;
		}

		return (
			<ResponsiveContainer width="90%" height={600}>
				<ComposedChart data={cleanedData} stackOffset="expand">
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="time"
						type="number"
						className="Phone"
						domain={['dataMin', 'dataMax']}
						tickFormatter={tick => new Date(tick).toLocaleString()}
					/>
					<YAxis className="Phone" tickFormatter={toPercent} yAxisId="left" />
					<YAxis className="Phone" yAxisId="right" orientation="right" stroke="#4775FF" />
					<Tooltip
						content={props => (
							<CustomTooltip active={props.active} label={props.label} payload={props.payload} />
						)}
					/>
					<Brush className="Phone" />
					<Area
						type="monotone"
						dataKey="called"
						name="Répondu"
						stackId={1}
						fill="#08A47C"
						stroke="#08A47C"
						yAxisId="left"
					/>
					<Area
						type="monotone"
						dataKey="toRecal"
						name="Pas répondu"
						stackId={1}
						fill="#E74855"
						stroke="#E74855"
						yAxisId="left"
					/>
					<Line
						type="monotone"
						dataKey="total"
						name="Nombre d'appel"
						fill="#4775FF"
						stroke="#4775FF"
						yAxisId="right"
						dot={false}
						strokeDasharray="3 3"
					/>
					<Legend />
				</ComposedChart>
			</ResponsiveContainer>
		);
	}
}

function ResponseByTime({ credentials }: { credentials: Credentials }) {
	const [callByDate, setCallByDate] = useState<Array<TimeResponse>>(new Array());
	function getStats() {
		return new Promise<Array<TimeResponse> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/stats/callByDate', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId
				})
				.then(res => {
					if (res.data) {
						resolve(res.data.data);
					} else {
						console.error(res.data);
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
		<div className="ResponseByTime">
			<h1>Heures de réponse</h1>
			{callByDate.length != 0 ? <MyBarChart datas={callByDate} /> : <h4>Récupération en cours...</h4>}
		</div>
	);
}

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
				res.callStatus.forEach(item => {
					newDatas.push({ name: item.status, value: item.count });
				});
				setRatios(newDatas);
			}
		});
		getProgress().then(res => {
			if (res) {
				const newDatas = new Array<{ name: string; value: number }>();
				newDatas.push({ name: 'Appelé·es', value: res.totalCalled });
				newDatas.push({ name: 'Pas répondu', value: res.totalNotRespond });
				newDatas.push({ name: 'Pas appelé·es', value: res.totalUser - res.totalNotRespond - res.totalCalled });
				setProgress(newDatas);
			}
		});
	}, []);

	return (
		<div className="GenericPage StatisticPage">
			<h1>Statistiques</h1>
			<div>
				<div>
					<div className="CallStatistics">
						{Ratios.length != 0 ? (
							<>
								<h4>Résultats des appels</h4>
								<MyPieChart colors={COLORS} datas={Ratios} />
							</>
						) : (
							<></>
						)}
					</div>
					<div className="CallStatistics">
						{Progress.length != 0 ? (
							<>
								<h4>Avancement des appels</h4>
								<MyPieChart colors={COLORS2} datas={Progress} />
							</>
						) : (
							<></>
						)}
					</div>
				</div>
				<ResponseByTime credentials={credentials} />
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
