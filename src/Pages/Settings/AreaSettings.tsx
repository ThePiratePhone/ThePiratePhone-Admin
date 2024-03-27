import Button from '../../Components/Button';

function AreaSettings() {
	return (
		<div className="Settings">
			<h1>Paramètres de l'organisation</h1>
			<div>
				<Button link="ChangeName" value="Changer le nom" />
				<Button link="ChangePassword" value="Changer le mot de passe" />
			</div>
		</div>
	);
}

export default AreaSettings;
