declare module '*.svg';

type Credentials = {
	areaName: string;
	onlineCredentials: {
		areaId: string;
		password: string;
	};
};

type Area = {
	_id: string;
	name: string;
};
