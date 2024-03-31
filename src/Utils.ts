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
			return 'Pas voté pour nous';
		case 2:
			return 'Voté pour nous';
	}
}

function getCallDuration(start: Date, end: Date) {
	const duration = Math.abs(end.getTime() - start.getTime());

	return new Date(1970, 0, 1, 0, Math.floor(duration / 60_000), Math.floor(duration / 1000));
}

function clearAccents(value: string) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function startWithVowel(value: string) {
	return ['a', 'e', 'i', 'o', 'u', 'y'].includes(clearAccents(value[0].toLowerCase()));
}

export { cleanNumber, cleanSatisfaction, cleanStatus, getCallDuration, mobileCheck, startWithVowel };
