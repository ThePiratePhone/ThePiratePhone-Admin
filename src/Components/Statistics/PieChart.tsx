import { PureComponent } from 'react';
import { Cell, Pie, PieChart, Sector } from 'recharts';

const renderActiveShape = (props: any) => {
	const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

	const RADIAN = Math.PI / 180;

	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);

	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle">
				{payload.name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text className="Phone" x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}>
				{value}
			</text>
			<text
				className="Phone"
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill="#777"
			>
				{`${(percent * 100).toFixed(1)}%`}
			</text>
		</g>
	);
};

export default class MyPieChart extends PureComponent<{
	datas: Array<{ name: string; value: number }>;
	colors: Array<string>;
}> {
	state = {
		activeIndex: 0
	};
	onPieEnter = (_: any, i: number) => {
		this.setState({
			activeIndex: i
		});
	};

	render() {
		return (
			<PieChart width={500} height={500}>
				<Pie
					activeIndex={this.state.activeIndex}
					activeShape={renderActiveShape}
					data={this.props.datas}
					cx="50%"
					cy="50%"
					innerRadius={100}
					outerRadius={120}
					dataKey="value"
					onMouseEnter={this.onPieEnter}
					animationDuration={750}
					paddingAngle={3}
				>
					{this.props.datas.map((e, i) => {
						return <Cell key={i} fill={this.props.colors[i % this.props.colors.length]} />;
					})}
				</Pie>
			</PieChart>
		);
	}
}
