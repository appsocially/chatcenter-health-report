export interface HealthReporterOptions {
    name: string;
    interval?: number;
    client: any;
}
export declare class HealthReporter {
    options: HealthReporterOptions;
    interval: number;
    constructor(options: HealthReporterOptions);
    start(): void;
    sendReportAndSchedule(): Promise<void>;
    schedule(): void;
    sendReport(): Promise<any>;
}
