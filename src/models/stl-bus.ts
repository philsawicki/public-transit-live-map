import { Direction, Service } from '../constants/direction';
import AbstractBus from './abstract-bus';


/**
 * STL Vehicle.
 */
export default class STLBus extends AbstractBus {
    /**
     * Vehicle Heading.
     */
    public readonly Heading: number;
    /**
     * Vehicle ID.
     */
    public readonly VehicleRef: string;
    /**
     * Vehicle Latitude.
     */
    public readonly VehicleLat: number;
    /**
     * Vehicle Longitude.
     */
    public readonly VehicleLon: number;
    /**
     * Vehicle speed (in km/h).
     */
    public readonly Speed: number;


    /**
     * Constructor.
     *
     * @param lineNumber Line Number of the vehicle.
     * @param direction Direction of the vehicle.
     * @param data Data buffer about the vehicle.
     */
    constructor(lineNumber: number, direction: Direction, data: any) {
        super(lineNumber, direction);

        this.VehicleRef = data.vehicleID;
        this.VehicleLat = data.vehicleLat;
        this.VehicleLon = data.vehicleLon;
        this.Heading = data.vehicleHeading;
        this.Speed = data.vehicleSpeed;
    }

    /**
     * Return the vehicle's ID.
     *
     * @return The vehicle's ID.
     */
    public getID(): string {
        return `${this.getService()}:${this.VehicleRef}`;
    }

    /**
     * Return the vehicle's Title, to be displayed in Popups.
     *
     * @return The vehicle's Title, to be displayed in Popups.
     */
    public getTitle(): string {
        return `<strong>${this.getService()}</strong> ${this.LineNumber}${this.Direction}`;
    }

    /**
     * Get the content to be displayed on the popup for the given bus.
     *
     * @return Content of the popup for the given Bus.
     */
    public getPopupContent(): string {
        return `
            <p>${this.getTitle()}</p>
            <strong>Heading:</strong> ${this.Heading}&deg;
            <br><strong>Speed:</strong> ${this.Speed} km/h`;
    }

    /**
     * Return the vehicle's Latitude.
     *
     * @return The vehicle's Latitude.
     */
    public getLatitude(): number {
        return this.VehicleLat;
    }

    /**
     * Return the vehicle's Longitude.
     *
     * @return The vehicle's Longitude.
     */
    public getLongitude(): number {
        return this.VehicleLon;
    }

    /**
     * Return the vehicle's Service.
     *
     * @return The vehicle's Service.
     */
    public getService(): Service {
        return Service.STL;
    }
}
