declare module '*.svg';

type Credentials = {
	areaName: string;
	URL: string;
	content: {
		areaId: string;
		password: string;
	};
};

type Area = {
	_id: string;
	name: string;
};

type Client = {
	_id: string;
	name: stirng;
	phone: string;
	area: string;
};

type ClientInfos = {
	client: Client;
	callers: Array<{ id: String; name: string; phone: string; nbCall: string; timeInCall: number }>;
};

type LoginResponse = {
	actualCampaignName: string;
	actualCampaignCallStart: Date;
	actualCampaignCallEnd: Date;
	actualCampaignMaxCall: number;
	actualCampaignTimeBetweenCall: number;
};

type Campaign = {
	name: string;
	calls: {
		max: number;
		timeBetween: number;
	};
	hours: {
		start: Date;
		end: Date;
	};
};
