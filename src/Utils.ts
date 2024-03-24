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

function mobileCheck() {
	const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

	return toMatch.some(toMatchItem => {
		return navigator.userAgent.match(toMatchItem);
	});
}

function cleanStatus(status: CallStatus) {
	switch (status) {
		case 'called':
			return 'Appelé';
		case 'not called':
			return 'Pas appelé';
		case 'not answered':
			return 'Pas de réponse';
		case 'inprogress':
			return 'En cours';
	}
}

function cleanSatisfaction(satisfaction: Satisfaction) {
	switch (satisfaction) {
		case -2:
			return 'A retirer';
		case -1:
			return 'Pas interessé';
		case 0:
			return 'Pas de réponse';
		case 1:
			return 'Pas voté pour nous';
		case 2:
			return 'Voté pour nous';
	}
}

function getCallDuration(start: Date, end: Date) {
	const duration = Math.abs(end.getTime() - start.getTime());
	const date = new Date(1970, 0, 1, 0, Math.floor(duration / (1000 * 60)), Math.floor(duration / 1000));

	return date;
}

export { cleanNumber, cleanSatisfaction, cleanStatus, getCallDuration, mobileCheck };
