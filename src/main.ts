import * as L from 'leaflet';
import STLService from './transport-services/stl-service';
import STMService from './transport-services/stm-service';


const mapReference = L.map('mapContainer', {
    attributionControl: false,
    zoomControl: false
}).setView([45.5415373, -73.7242081], 11);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    variant: 'dark_nolabels',
    detectRetina: true
}).addTo(mapReference);


/**
 * Bootstrap the Application.
 */
(function bootstrap() {
    const transportServices = [
        new STMService(mapReference),
        new STLService(mapReference)
    ];

    const tick = () => {
        for (const transportService of transportServices) {
            transportService.fetchAndRender();
        }
    };

    tick();
    setInterval(tick, 20 * 1000);
})();
