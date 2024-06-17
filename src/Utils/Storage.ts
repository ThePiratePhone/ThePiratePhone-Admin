function getCredentials() {
	return JSON.parse(window.localStorage.getItem('credentials') as string) as Credentials;
}

function setCredentials(credentials: Credentials) {
	window.localStorage.setItem('credentials', JSON.stringify(credentials));
}

function clearCredentials() {
	window.localStorage.removeItem('credentials');
}

export { clearCredentials, getCredentials, setCredentials };
