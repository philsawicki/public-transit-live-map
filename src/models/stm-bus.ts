import { Direction, Service } from '../constants/direction';
import AbstractBus from './abstract-bus';


/**
 * STM Vehicle.
 */
export default class STMBus extends AbstractBus {
    /**
     * Aimed arrival time.
     */
    public readonly AimedArrivalTime: Date;
    /**
     * Aimed departure time.
     */
    public readonly AimedDepartureTime: Date;
    /**
     * Index trace.
     */
    public readonly IndexTrace: number;
    /**
     * Vehicle is at stop.
     */
    public readonly IsAtStop: boolean;
    /**
     * Stop is cancelled.
     */
    public readonly IsCancelled: boolean;
    /**
     * Vehicle is affected by congestion.
     */
    public readonly IsCongestion: boolean;
    /**
     * Is last vehicle of the line.
     */
    public readonly IsLast: boolean;
    /**
     * Vehicle is on a planified course.
     */
    public readonly IsPlanified: boolean;
    /**
     * Is vehicle ramp cancelled.
     */
    public readonly IsRampCancelled: boolean;
    /**
     * Is real.
     */
    public readonly IsReal: boolean;
    /**
     * Journey reference ID.
     */
    public readonly JourneyRef: string;
    /**
     * Is this the last stop of the course.
     */
    public readonly LastStop: string;
    /**
     * Next stop identifier.
     */
    public readonly NextStop: string;
    /**
     * Timestamp when the information was recorded.
     */
    public readonly RecordedAtTime: Date;
    /**
     * Second aimed arrival time.
     */
    public readonly SecondAimedArrivalTime: Date;
    /**
     * Second aimed departure time.
     */
    public readonly SecondAimedDepartureTime: Date;
    /**
     * Second next stop identifier.
     */
    public readonly SecondNextStop: string;
    /**
     * Stop is accessible.
     */
    public readonly StopIsAccessible: boolean;
    /**
     * Stop name.
     */
    public readonly StopName: string;
    /**
     * Time.
     */
    public readonly Time: string;
    /**
     * Trace.
     */
    public readonly Trace: string;
    /**
     * Vehicle at stop.
     */
    public readonly VehicleAtStop: string;
    /**
     * Vehicle is accessible.
     */
    public readonly VehicleIsAccessible: boolean;
    /**
     * Vehicle latitude.
     */
    public readonly VehicleLat: number;
    /**
     * Vehicle longitude.
     */
    public readonly VehicleLon: number;
    /**
     * Vehicle identifier.
     */
    public readonly VehicleRef: string;
    /**
     * Bus line category.
     */
    public readonly LineCategory: string;
    /**
     * Bus line description.
     */
    public readonly LineDescription: string;
    /**
     * Bus line direction.
     */
    public readonly LineDirectionName: string;
    /**
     * Bus line identifier.
     */
    public readonly LinePublicIdentifier: string;


    /**
     * Constructor.
     *
     * @param lineNumber Line Number of the vehicle.
     * @param direction Direction of the vehicle.
     * @param data Data buffer about the vehicle.
     * @param lineData Line data.
     */
    constructor(lineNumber: number, direction: Direction, data: any, lineData: any) {
        super(lineNumber, direction);

        this.AimedArrivalTime = new Date(data.aimed_arrival_time);
        this.AimedDepartureTime = new Date(data.aimed_departure_time);
        this.IndexTrace = data.index_trace;
        this.IsAtStop = data.is_at_stop;
        this.IsCancelled = data.is_cancelled;
        this.IsCongestion = data.is_congestion;
        this.IsLast = data.is_last;
        this.IsPlanified = data.is_planified;
        this.IsRampCancelled = data.is_ramp_cancelled;
        this.IsReal = data.is_real;
        this.JourneyRef = data.journeyRef;
        this.LastStop = data.last_stop;
        this.NextStop = data.next_stop;
        this.RecordedAtTime = new Date(data.recorded_at_time);
        this.SecondAimedArrivalTime = new Date(data.second_aimed_arrival_time);
        this.SecondAimedDepartureTime = new Date(data.second_aimed_departure_time);
        this.SecondNextStop = data.second_next_stop;
        this.StopIsAccessible = data.stop_is_accessible;
        this.StopName = data.stop_name;
        this.Time = data.time;
        this.Trace = data.trace;
        this.VehicleAtStop = data.vehicle_at_stop;
        this.VehicleIsAccessible = data.vehicle_is_accessible;
        this.VehicleLat = parseFloat(data.vehicle_lat);
        this.VehicleLon = parseFloat(data.vehicle_lon);
        this.VehicleRef = data.vehicle_ref;
        this.LineCategory = lineData.category;
        this.LineDescription = lineData.description;
        this.LineDirectionName = lineData.direction_name;
        this.LinePublicIdentifier = lineData.public_identifier;
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
        return `<strong>${this.getService()}</strong> ${this.LinePublicIdentifier} ${this.LineDescription} (${this.LineDirectionName})`;
    }

    /**
     * Get the content to be displayed on the popup for the given bus.
     *
     * @return Content of the popup for the given Bus.
     */
    public getPopupContent(): string {
        return `
            <p>${this.getTitle()}</p>
            <strong>Next stop:</strong> ${this.StopName}
            <br><strong>Aimed arrival time:</strong> ${this.AimedArrivalTime.toLocaleTimeString()}
            <br><strong>Recorded at:</strong> ${this.RecordedAtTime.toLocaleTimeString()}`;
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
        return Service.STM;
    }
}
