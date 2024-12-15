import StatisticalDataSeries from '../src/StatisticalDataSeries';
import StatisticalDataSet from '../src/StatisticalDataSet';
import LinearRegression from '../src/LinearRegression';
import RegressionLine from '../src/RegressionLine';

export default class LeastSquaresLinearRegression extends LinearRegression {
    constructor(dataset: StatisticalDataSet) {
        super(dataset)
    }

    fit(varX: string, varY: string): RegressionLine {
        let [numerator,denominator] = [0,0,0,0];
        const xSeries: StatisticalDataSeries = (this as LinearRegression).dataset.series(varX) as StatisticalDataSeries;
        const ySeries: StatisticalDataSeries = (this as LinearRegression).dataset.series(varY) as StatisticalDataSeries;
        for (let i=0; i<(this as LinearRegression).dataset.data.length; i++) {
            numerator += (((this as LinearRegression).dataset as any).data[i][varX] - xSeries.mean) * (((this as LinearRegression).dataset as any).data[i][varY] - ySeries.mean);
            denominator += (((this as LinearRegression).dataset as any).data[i][varX] - xSeries.mean) ** 2;
        }
        return new RegressionLine(numerator / denominator, ySeries.mean - (numerator / denominator) * xSeries.mean);
    }
}