import { Direction, Service } from '../constants/direction';
import STLBus from '../models/stl-bus';
import TransportService from './abstract-service';


/**
 * Laval Transport Service.
 */
export default class STLService extends TransportService<STLBus> {
    /**
     * Bus lines along the North/South Direction.
     */
    protected readonly NORTH_SOUTH_LINES = [17, 27, 31, 33, 37, 39, 41, 43, 45,
        46, 55, 61, 63, 65, 73, 151, 360, 901, 902, 903, 925];
    /**
     * Bus lines along the East/West Direction.
     */
    protected readonly EAST_WEST_LINES = [2, 12, 20, 22, 24, 26, 36, 40, 42, 48,
        50, 52, 56, 58, 60, 66, 70, 74, 76, 144, 222, 252, 402, 404];
    /**
     * Bus lines along all Directions.
     */
    protected readonly ALL_LINES = [
        ...this.NORTH_SOUTH_LINES, ...this.EAST_WEST_LINES
    ];


    /**
     * Constructor.
     *
     * @param mapReference Reference to the Map Element.
     */
    constructor(mapReference: any) {
        super(Service.STL, mapReference);
    }

    /**
     * Return the Service's Marker and Polyline color.
     *
     * @return The Service's Marker and Polyline color.
     */
    protected getColor(): string {
        return '#EB3D3D';
    }

    /**
     * Return the list of all bus lines for the Service.
     *
     * @return The list of all bus lines for the Service.
     */
    protected getAllLines(): number[] {
        return this.ALL_LINES;
    }

    /**
     * Return the list of directions for the given bus number.
     *
     * @param lineNumber Number of the bus line for which to get the list of
     * directions.
     * @return The list of directions for the given bus number.
     */
    protected getDirectionsForLine(lineNumber: number): Direction[] {
        if (this.NORTH_SOUTH_LINES.includes(lineNumber)) {
            return [Direction.NORTH, Direction.SOUTH];
        }
        return [Direction.EAST, Direction.WEST];
    }

    /**
     * Fetch information about the given Bus number along the given direction.
     *
     * @param lineNumber Number of the bus for which to fetch information.
     * @param direction Direction of the bus for which to fetch information.
     * @return Information about the given Bus number along the given direction.
     */
    protected async fetchLine(lineNumber: number, direction: Direction): Promise<void> {
        const response = await fetch(`/api/bus/location/${this.Service}/${lineNumber}/${direction}`);
        const data = await response.json();

        if (!data.error && data.vehicleID && data.vehicleLat && data.vehicleLon) {
            const bus = new STLBus(lineNumber, direction, data);
            this.drawBus(bus);
            this.drawPolyLine(bus);
        }
    }
}
