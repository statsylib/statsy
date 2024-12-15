import StatisticalDataSeries from '../src/StatisticalDataSeries.ts';
import LinearRegression from '../src/LinearRegression.ts';
import RegressionLine from '../src/RegressionLine.ts';

/**
 * Implements the least squares method of calculating a linear regression line from a 
 * {@linkcode StatisticalDataSet} as described in {@link https://en.wikipedia.org/wiki/Linear_least_squares}.
 */
export default class LeastSquaresLinearRegression extends LinearRegression {

    /**
     * Fit the least squares line to the given dataset.  
     * @param varX The x axis variable name to be found in the data set.
     * @param varY The y axis variable name to be found in the data set.
     * @returns A {@linkcode RegressionLine} object with the properties of computed regression line.
     */
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