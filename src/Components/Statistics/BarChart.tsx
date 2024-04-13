import { PureComponent } from 'react';
import {
	Area,
	Bar,
	BarChart,
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

const groupDataByGranularity = (data: statsResponse, granularity = 3_600_000) => {
	const groupedData = {};
	data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	data.forEach(item => {
		const time = new Date(item.date).getTime();
		if (time == 0) return;

		const roundedTime = Math.floor(time / granularity) * granularity;
		if (!groupedData[roundedTime]) {
			groupedData[roundedTime] = { time: roundedTime, count: 0, total: 0 };
		}
		groupedData[roundedTime].total++;
		if (item.response) {
			groupedData[roundedTime].count++;
		}
	});
	return Object.values(groupedData);
};

export default class MyBarChart extends PureComponent<{
	datas: statsResponse;
}> {
	render() {
		const groupedData = groupDataByGranularity(this.props.datas);
		return (
			<ResponsiveContainer width={'90%'} height={600}>
				<BarChart data={groupedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="time"
						type="number"
						domain={['dataMin', 'dataMax']}
						tickFormatter={tick => new Date(tick).toLocaleString()}
					/>
					<YAxis />
					<Tooltip labelFormatter={label => new Date(label).toLocaleString()} />
					<Legend />
					<Brush />
					<Bar dataKey="count" name="Responses" fill="#8884d8" />
				</BarChart>
			</ResponsiveContainer>
		);
	}
}
