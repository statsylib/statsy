import AbstractStatisticalDataSeries from '../src/AbstractStatisticalDataSeries';

export default class StatisticalDataSeriesLabels extends AbstractStatisticalDataSeries {
    constructor(public data: string[], public name?: string) {
        super(false)
        this.data = data;
        if (name !== undefined) {
            this.name = name;
        }
    }
}