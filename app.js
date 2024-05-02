const API_KEY = process.env.API_KEY;

const ipInput = document.querySelector('#ip-tracker__input');
const ipSubmit = document.querySelector('#ip-tracker__submit');

const ipDisplay = document.querySelector('#result__ip-address');
const locationDisplay = document.querySelector('#result__location');
const utcDisplay = document.querySelector('#result__utc');
const ispDisplay = document.querySelector('#result__isp');

const URL_API = 'https://geo.ipify.org/api/v2/country,city';

const getIpInfos = async (apiKey, ipAddress) => {
	const res = await fetch(`${URL_API}?apiKey=${apiKey}&ipAddress=${ipAddress}`);
	const data = await res.json();
	return data;
};

const updateDisplays = (ipAddress, location, timezone, isp) => {
	ipDisplay.textContent = ipAddress;
	locationDisplay.textContent = location;
	utcDisplay.textContent = timezone;
	ispDisplay.textContent = isp;
};

ipSubmit.addEventListener('click', async (event) => {
	event.preventDefault();

	const ipAddress = ipInput.value;
	const data = await getIpInfos(API_KEY, ipAddress);

	data &&
		updateDisplays(
			data.ip,
			data.location.city +
				', ' +
				data.location.region +
				', ' +
				data.location.postalCode,
			'UTC ' + data.location.timezone,
			data.isp
		);
});
