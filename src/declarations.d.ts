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

type Call = {
	status: string;
	caller: string;
	satisfaction: Satisfaction;
	startCall: Date;
	duration: number;
	comment: string;
};

type Client = {
	_id: string;
	name: stirng;
	phone: string;
	area: string;
	data: {
		[key: string]: Array<Call>;
	};
};

type SearchClient = {
	_id: string;
	name: string;
	phone: string;
};

type CallStatus = {
	name: string;
	toRecall: boolean;
};

type ClientInfos = {
	client: Client;
	call: Array<{ call: Call; caller: Caller }>;
};

type ClientError = { name: string; phone: string; error: string };

type Caller = {
	id: string;
	name: string;
	phone: string;
};

type CallerInfos = {
	id: string;
	name: string;
	phone: string;
	totalTimeCampaign: Date;
	nbCallsCampaign: number;
	rank:number;
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
	actualCampaignStatus: Array<CallStatus>;
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
	status: Array<CallStatus>;
	active: boolean;
	script: string;
};

type RatiosResponse = {
	callStatus: [{ name: string; count: number }];
	clientCall: Number;
};

type ProgressResponse = {
	totalCalled: number;
	totalToRecall: number;
	totalUser: number;
};

type TimeResponse = { date: Date; response: boolean; satisfaction: string };
