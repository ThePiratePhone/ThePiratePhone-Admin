import axios from 'axios';
import { PureComponent, useEffect, useState } from 'react';
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

class MyBarChart extends PureComponent<{
	datas: Array<TimeResponse>;
}> {
	render() {
		function DensityGroup(data: Array<TimeResponse>) {
			const datas = new Map<
				number,
				{
					time: number;
					total: number;
					'not answered': number;
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
						'not answered': 0,
						called: 0,
						inprogress: 0
					});
				}
				const data = datas.get(roundedTime);
				if (data) {
					data.total++;
					data[item.response]++;
					datas.set(roundedTime, data);
				}
			});

			const values = new Array<{
				time: number;
				total: number;
				'not answered': number;
				called: number;
				inprogress: number;
			}>();

			datas.forEach(val => {
				val['not answered'] = parseFloat(((val['not answered'] / val.total) * 100).toFixed(1));
				val.called = parseFloat((100 - val['not answered']).toFixed(1));

				if (val.total >= 10) values.push(val);
			});

			return values;
		}

		const toPercent = (decimal: number) => (decimal * 100).toFixed() + '%';

		const cleanedData = DensityGroup(this.props.datas);

		function CustomTooltip({ active, payload, label }) {
			if (active && payload && payload.length) {
				return (
					<div className="CustomTooltip">
						<u>{new Date(label).toLocaleString()}</u>
						<div className="Phone">Réponse: {payload[0].value}%</div>
						<div className="Phone">Pas de réponse: {payload[1].value}%</div>
						<div className="Phone">Nombre d'appel: {cleanedData.find(val => val.time == label)?.total}</div>
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
						dataKey="not answered"
						stackId={1}
						name="Pas de réponse"
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
		<div className="GenericPage ResponseByTime">
			<h1>Réponses en fonction des heures</h1>
			{callByDate.length != 0 ? <MyBarChart datas={callByDate} /> : <h4>Récupération en cours...</h4>}
		</div>
	);
}
export default ResponseByTime;
