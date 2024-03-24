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
	data: {
		[key: string]: Array<{
			status: Satisfaction;
			caller: string;
		}>;
	};
};

type Satisfaction = 'called' | 'not called' | 'not answered' | 'inprogress';

type ClientInfos = {
	client: Client;
	callers: Array<{ id: string; name: string; phone: string; nbCall: number; calls: any }>;
};

type LoginResponse = {
	actualCampaignId: string;
	actualCampaignName: string;
	actualCampaignCallStart: Date;
	actualCampaignCallEnd: Date;
	actualCampaignMaxCall: number;
	actualCampaignTimeBetweenCall: number;
};

type Campaign = {
	id: string;
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
