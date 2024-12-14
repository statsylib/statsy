import StatisticalDataSet from '../src/StatisticalDataSet';

export default class LinearRegression {
    constructor(public dataset: StatisticalDataSet) {
        this.dataset = dataset;
    }
}