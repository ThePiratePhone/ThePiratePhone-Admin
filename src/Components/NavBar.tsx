import { Link } from 'react-router-dom';

import Gear from '../Assets/Images/Gear.svg';
import Headphone from '../Assets/Images/Headphone.svg';
import Logo from '../Assets/Images/Logo.svg';
import People from '../Assets/Images/People.svg';
import Statistic from '../Assets/Images/Statistic.svg';

function NavBar() {
	const links = [
		{
			value: '/',
			image: Logo
		},
		{
			value: '/Statistics',
			image: Statistic
		},
		{
			value: '/Clients',
			image: People
		},
		{
			value: '/Users',
			image: Headphone
		},
		{
			value: '/Settings',
			image: Gear
		}
	];

	return (
		<div className="NavBar">
			{links.map((element, i) => {
				return (
					<Link key={i} className="NavBarElement" to={element.value}>
						<img src={element.image} alt="Navigation" />
					</Link>
				);
			})}
		</div>
	);
}

export default NavBar;
