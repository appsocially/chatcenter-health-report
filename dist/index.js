"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
class HealthReporter {
    constructor(options) {
        this.options = options;
        this.interval = this.options.interval || (1000 * 60);
    }
    start() {
        console.log(`Start sending status report every ${this.interval}ms`);
        this.sendReportAndSchedule();
    }
    sendReportAndSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendReport()
                .then((reportedData) => {
                this.schedule();
            })
                .catch(e => {
                console.error('Failed to send report:', e);
                this.schedule();
            });
        });
    }
    schedule() {
        setTimeout(() => this.sendReportAndSchedule(), this.interval);
    }
    sendReport() {
        return __awaiter(this, void 0, void 0, function* () {
            let mutation = graphql_tag_1.default `
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
        });
    }
}
exports.HealthReporter = HealthReporter;
//# sourceMappingURL=index.js.map