import { Direction, Service } from '../constants/direction';
import STMBus from '../models/stm-bus';
import TransportService from './abstract-service';


/**
 * Montreal Transport Service.
 */
export default class STMService extends TransportService<STMBus> {
    /**
     * Bus lines along the North/South Direction.
     */
    protected readonly NORTH_SOUTH_LINES = [
        // Local lines:
        10, 12, 13, 14, 17, 21, 25, 28, 30, 31, 32, 33, 37, 44, 45, 53, 55, 63, 64,
        66, 67, 71, 74, 75, 80, 94, 107, 109, 116, 117, 119, 123, 124, 128, 129,
        131, 135, 136, 139, 165, 166, 168, 170, 178, 179, 196, 207, 209,
        // Night lines:
        355, 357, 359, 361, 363, 365, 369, 371,
        // Express lines:
        401, 409, 428, 432, 439, 449, 467,
        // Shuttle lines:
        769];
    /**
     * Bus lines along the East/West Direction.
     */
    protected readonly EAST_WEST_LINES = [
        // Local lines:
        11, 15, 16, 18, 19, 22, 24, 26, 27, 29, 34, 36, 39, 40, 41, 43, 46, 47, 48,
        49, 51, 52, 54, 57, 58, 61, 68, 69, 70, 72, 73, 76, 77, 78, 85, 86, 90, 92,
        93, 95, 97, 99, 100, 101, 102, 103, 104, 105, 106, 108, 110, 112, 113, 115,
        121, 125, 138, 140, 141, 144, 146, 150, 160, 161, 162, 164, 171, 174, 175,
        177, 180, 183, 185, 186, 187, 188, 189, 191, 192, 193, 195, 197, 200, 202,
        203, 204, 205, 206, 208, 211, 212, 213, 215, 216, 217, 218, 219, 220, 225,
        // Night lines:
        350, 353, 354, 356, 358, 360, 362, 364, 368, 370, 372, 376, 378, 380, 382,
        // Express lines:
        405, 406, 407, 410, 411, 419, 420, 425, 427, 430, 435, 440, 448, 460, 468,
        469, 470, 475, 485, 486, 487, 491, 495, 496,
        // Shuttle lines:
        711, 715, 747, 767, 777, 968];
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
        super(Service.STM, mapReference);
    }

    /**
     * Return the Service's Marker and Polyline color.
     *
     * @return The Service's Marker and Polyline color.
     */
    protected getColor(): string {
        return '#FF9800';
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

        if (!data.error) {
            const results: any[] = Object.values(data.result);
            for (const result of results) {
                if (result.vehicle_ref) {
                    const bus = new STMBus(lineNumber, direction, result, data.line)
                    this.drawBus(bus);
                    this.drawPolyLine(bus);
                }
            }
        }
    }
}
