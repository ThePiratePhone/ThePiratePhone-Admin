function cleanStatus(status: CallStatus) {
	switch (status) {
		case 'called':
			return 'Appelé·e';
		case 'not called':
			return 'Pas appelé·e';
		case 'not answered':
			return 'Pas de réponse';
		case 'inprogress':
			return 'En cours';
	}
}

function cleanSatisfaction(satisfaction: Satisfaction) {
	switch (satisfaction) {
		case -2:
			return 'À retirer';
		case -1:
			return 'Pas interessé·e';
		case 0:
			return 'Pas de réponse';
		case 1:
			return 'Ne compte pas voter';
		case 2:
			return 'Compte voter';
		default:
			return 'Appel en cours';
	}
}

function cleanNumber(number: string) {
	const numberArray = number.split('');
	let newNumber = '';
	if (number.length % 2) {
		newNumber += numberArray.splice(0, 4).join('');
	} else {
		newNumber += numberArray.splice(0, 3).join('');
	}
	newNumber += ' ' + numberArray.splice(0, 1);
	for (let i = 0; i < numberArray.length; i = i + 2) {
		newNumber += ' ' + numberArray[i] + numberArray[i + 1];
	}

	if (newNumber.startsWith('+33 ')) {
		newNumber = newNumber.replace('+33 ', '0');
	}

	return newNumber;
}

export { cleanNumber, cleanSatisfaction, cleanStatus };
