import gql from 'graphql-tag';

export interface HealthReporterOptions {
  name: string;
  interval?: number;
  client: any;
}

export class HealthReporter {
  options: HealthReporterOptions;
  interval: number;

  constructor(options: HealthReporterOptions) {
    this.options = options;
    this.interval = this.options.interval || (1000 * 60);
  }

  start() {
    console.log(`Start sending status report every ${this.interval}ms`);
    this.sendReportAndSchedule();
  }

  async sendReportAndSchedule() {
    return this.sendReport()
      .then((reportedData) => {
        this.schedule();
      })
      .catch(e => {
        console.error('Failed to send report:', e);
        this.schedule();
      });
  }

  schedule() {
    setTimeout(() => this.sendReportAndSchedule(), this.interval);
  }

  async sendReport() {
    let mutation = gql`
      mutation reportStatus(
        $name: NonEmptyString!
        $status: NonEmptyString!
      ) {
        reportStatus(
          name: $name
          status: $status
        ) {
          name
          ip
          status
          createdAt
        }
      }`;
    let variables = {
      name: this.options.name,
      status: 'normal'
    };
    return this.options.client.mutate({
      mutation,
      variables
    }).then(data => {
      let reportedStatus = data.data.reportStatus;
      console.log(`Status reported at ${reportedStatus.createdAt}, for [${reportedStatus.name}], with status [${reportedStatus.status}]`);
      return reportedStatus;
    });
  }
}