import Button from '../Components/Button';

function Settings({ credentials, renderLogin }: { credentials: Credentials; renderLogin: () => void }) {
	function logOut() {
		localStorage.removeItem('credentials');
		renderLogin();
	}

	return (
		<div className="Settings">
			<h1>Paramètres</h1>
			<div>
				<div>
					<div>
						Organisation: <b>{credentials.areaName}</b>
					</div>
				</div>
				<div>
					<Button value="Changer le mot de passe" link="ChangePassword" />
					<Button value="Se déconnecter" onclick={logOut} />
				</div>
			</div>
		</div>
	);
}

export default Settings;
