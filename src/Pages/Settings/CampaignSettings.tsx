import Button from '../../Components/Button';

function CampaignSettings() {
	return (
		<div className="Settings">
			<h1>Paramètres de la campagne</h1>
			<div>
				<Button link="ChangeName" value="Changer le nom" />
				<Button link="ChangeScript" value="Changer le script" />
				<Button link="ChangeKey" value="Changer la clé d'accès" />
				<Button link="ChangeHours" value="Changer les horaires d'appel" />
				<Button link="ChangeCallCount" value="Changer le nombre d'appel" />
				<Button link="ChangeCallTime" value="Changer le temps entre les appels" />
			</div>
		</div>
	);
}

export default CampaignSettings;
