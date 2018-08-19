import { Direction, Service } from '../constants/direction';


/**
 * Abstract Bus Vehicle.
 */
export default abstract class AbstractBus {
    /**
     * Line Number of the vehicle.
     */
    public readonly LineNumber: number;
    /**
     * Direction of the vehicle.
     */
    public readonly Direction: Direction;


    /**
     * Constructor.
     *
     * @param lineNumber Line Number of the vehicle.
     * @param direction Direction of the vehicle.
     */
    constructor(lineNumber: number, direction: Direction) {
        this.LineNumber = lineNumber;
        this.Direction = direction;
    }

    /**
     * Return the vehicle's ID.
     *
     * @return The vehicle's ID.
     */
    public abstract getID(): string;

    /**
     * Return the vehicle's Title, to be displayed in Popups.
     *
     * @return The vehicle's Title, to be displayed in Popups.
     */
    public abstract getTitle(): string;

    /**
     * Get the content to be displayed on the popup for the given bus.
     *
     * @return Content of the popup for the given Bus.
     */
    public abstract getPopupContent(): string;

    /**
     * Return the vehicle's Latitude.
     *
     * @return The vehicle's Latitude.
     */
    public abstract getLatitude(): number;

    /**
     * Return the vehicle's Longitude.
     *
     * @return The vehicle's Longitude.
     */
    public abstract getLongitude(): number;

    /**
     * Return the vehicle's Service.
     *
     * @return The vehicle's Service.
     */
    public abstract getService(): Service;
}
