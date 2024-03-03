import { Link } from 'react-router-dom';
import Button from '../Components/Button';

function Settings({ renderLogin }: { renderLogin: () => void }) {
	function logOut() {
		localStorage.removeItem('credentials');
		renderLogin();
	}

	return (
		<div className="Settings">
			<h1>Paramètres</h1>
			<div>
				<div className="SettingsList">
					<Link to="/">Paramètres de l'organisation</Link>
					<Link to="/">Paramètres de la campagne</Link>
				</div>
				<div>
					<Button value="Se déconnecter" onclick={logOut} />
				</div>
			</div>
		</div>
	);
}

export default Settings;
