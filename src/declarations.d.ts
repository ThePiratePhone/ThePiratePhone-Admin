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
			status: CallStatus;
			caller: string;
			satisfaction: Satisfaction;
			startCall: Date;
			endCall: Date;
		}>;
	};
};

type SearchClient = {
	_id: string;
	name: stirng;
	phone: string;
};

type Satisfaction = -2 | -1 | 0 | 1 | 2;

type CallStatus = 'called' | 'not called' | 'not answered' | 'inprogress';

type ClientInfos = {
	client: Client;
	callers: Array<Caller>;
};

type Caller = {
	id: string;
	name: string;
	phone: string;
};

type CallerInfos = {
	id: string;
	name: string;
	phone: string;
	totalTime: Date;
	nbCalls: number;
};

type LoginResponse = {
	areaName: string;
	actualCampaignId: string;
	actualCampaignName: string;
	actualCampaignCallStart: Date;
	actualCampaignCallEnd: Date;
	actualCampaignMaxCall: number;
	actualCampaignTimeBetweenCall: number;
	actualCampaignScript: string;
};

type Campaign = {
	areaName: string;
	_id: string;
	name: string;
	calls: {
		max: number;
		timeBetween: number;
	};
	hours: {
		start: Date;
		end: Date;
	};
	active: boolean;
	script: string;
};

type RatiosResponse = {
	clientCalled: number;
	converted: number;
	failure: number;
	notInterested: number;
	removed: number;
};

type ProgressResponse = {
	totalCalled: number;
	totalNotRespond: number;
	totalUser: number;
};

type TimeResponse = { date: Date; response: CallStatus };
