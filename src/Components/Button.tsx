import { Link } from 'react-router-dom';

function Button({
	value,
	link,
	type,
	onclick
}: {
	value: string;
	type?: '' | 'RedButton' | 'ButtonDisabled';
	link?: string;
	onclick?: () => void;
}) {
	if (link) {
		return (
			<Link className={type !== '' ? 'Button ' + type : 'Button'} to={link} onClick={onclick}>
				<button>{value}</button>
			</Link>
		);
	} else {
		return (
			<div className={type ? 'Button ' + type : 'Button'} onClick={onclick}>
				<button>{value}</button>
			</div>
		);
	}
}

export default Button;
