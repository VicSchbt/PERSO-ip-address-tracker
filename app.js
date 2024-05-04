import markerUrl from './assets/images/icon-location.svg';

const API_KEY = import.meta.env.VITE_API_KEY;

const ipInput = document.querySelector('#ip-tracker__input');
const ipSubmit = document.querySelector('#ip-tracker__submit');

const ipDisplay = document.querySelector('#result__ip-address');
const locationDisplay = document.querySelector('#result__location');
const utcDisplay = document.querySelector('#result__utc');
const ispDisplay = document.querySelector('#result__isp');

// INIT MAP

const markerIcon = L.icon({
	iconUrl: markerUrl,
	iconSize: [46, 56],
	iconAnchor: [23, 56],
});

const map = L.map('map', {
	zoomControl: false,
	attributionControl: false,
}).setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
}).addTo(map);

// GET IP INFOS

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

const updateMap = (lat, lng) => {
	L.marker([lat, lng], { icon: markerIcon }).addTo(map);
	map.panTo([lat, lng]);

	const offset = map.getSize().y * 0.15;
	map.panBy(new L.Point(0, -offset), { animate: false });
};

// UI LISTENER

ipSubmit.addEventListener('click', async (event) => {
	event.preventDefault();

	const ipAddress = ipInput.value;
	const data = await getIpInfos(API_KEY, ipAddress);

	if (data) {
		const {
			ip,
			location: { city, region, postalCode, timezone, lat, lng },
			isp,
		} = data;

		updateDisplays(
			ip,
			`${city}, ${region}, ${postalCode}`,
			`UTC ${timezone}`,
			isp
		);

		updateMap(lat, lng);
	}
});
