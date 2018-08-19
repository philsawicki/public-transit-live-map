import * as L from 'leaflet';
import { Direction, Service } from '../constants/direction';
import AbstractBus from '../models/abstract-bus';


/**
 * Create an icon instance for the given Service.
 *
 * @param color Color of the icon.
 * @param size Size of the icon (in pixels).
 * @return The data:uri of the Icon for the given Service.
 */
function createServiceIcon(color: string, size: number = 20): string {
    const svgIcon = `<?xml version="1.0"?>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 100 100"
                enable-background="new 0 0 ${size} ${size}" xml:space="preserve" height="${size}" width="${size}">
            <g>
                <circle cx="${size}" cy="${size}" r="${size / 2}" fill="${color}" />
            </g>
        </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svgIcon);
}


/**
 * Abstract Transport Service.
 */
export default abstract class TransportService<T extends AbstractBus> {
    /**
     * Transport Service identifier.
     */
    protected readonly Service: Service;
    /**
     * Map marker icon.
     */
    protected readonly Icon: any;
    /**
     * Reference to the Map Element.
     */
    protected readonly Map: any;

    /**
     * List of markers for the Service, representing buses on the Map.
     */
    protected markers: Map<string, any> = new Map<string, any>();
    /**
     * List of Polylines for the Bus, representing a bus's path on the Map.
     */
    protected polyLines: Map<string, any> = new Map<string, any>();


    /**
     * Constructor.
     *
     * @param service Identifier of the Transport Service.
     * @param mapReference Reference to the Map Element.
     */
    constructor(service: Service, mapReference: L.Map) {
        this.Service = service;
        this.Map = mapReference;

        this.Icon = L.icon({
            iconUrl: createServiceIcon(this.getColor())
        });
    }

    /**
     * Fetch information about the Service's buses and draw them on the Map.
     */
    public fetchAndRender(): void {
        for (const busLine of this.getAllLines()) {
            for (const lineDirection of this.getDirectionsForLine(busLine)) {
                // tslint:disable-next-line:no-floating-promises
                this.fetchLine(busLine, lineDirection);
            }
        }
    }

    /**
     * Return the icon of the Marker for the Service.
     *
     * @return any.
     */
    protected getIcon(): any {
        return this.Icon;
    }

    /**
     * Draw a marker for the given Bus.
     *
     * @param bus A reference to the Bus to draw.
     */
    protected drawBus(bus: T): void {
        if (this.markers.has(bus.getID())) {
            const marker = this.markers.get(bus.getID());
            marker.setLatLng(new L.LatLng(bus.getLatitude(), bus.getLongitude()));
            marker.setPopupContent(bus.getPopupContent());
        } else {
            const marker = L.marker([bus.getLatitude(), bus.getLongitude()], {
                icon: this.Icon
            });

            marker.bindTooltip(bus.getTitle());
            marker.bindPopup(bus.getPopupContent());

            this.markers.set(bus.getID(), marker);
            this.Map.addLayer(marker);
        }
    }

    /**
     * Draw a path segment for the given Bus.
     *
     * @param bus A reference to the Bus for which to draw the path.
     */
    protected drawPolyLine(bus: T): void {
        if (this.polyLines.has(bus.getID())) {
            const polyLine = this.polyLines.get(bus.getID());
            polyLine.addLatLng([bus.getLatitude(), bus.getLongitude()]);
        } else {
            const vertices: L.LatLngExpression[] = [
                [bus.getLatitude(), bus.getLongitude()]
            ];
            const polyLine = L.polyline(vertices, {
                color: this.getColor(),
                lineCap: 'butt',
                opacity: 0.2,
                weight: 2
            });

            this.polyLines.set(bus.getID(), polyLine);
            this.Map.addLayer(polyLine);
        }
    }

    /**
     * Return the Service's Marker and Polyline color.
     *
     * @return The Service's Marker and Polyline color.
     */
    protected abstract getColor(): string;

    /**
     * Return the list of all bus lines for the Service.
     *
     * @return The list of all bus lines for the Service.
     */
    protected abstract getAllLines(): number[];

    /**
     * Return the list of directions for the given bus number.
     *
     * @param lineNumber Number of the bus line for which to get the list of
     * directions.
     * @return The list of directions for the given bus number.
     */
    protected abstract getDirectionsForLine(lineNumber: number): Direction[];

    /**
     * Fetch information about the given Bus number along the given direction.
     *
     * @param lineNumber Number of the bus for which to fetch information.
     * @param direction Direction of the bus for which to fetch information.
     * @return Information about the given Bus number along the given direction.
     */
    protected abstract async fetchLine(lineNumber: number, direction: Direction): Promise<void>;
}
