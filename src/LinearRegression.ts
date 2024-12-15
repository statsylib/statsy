import StatisticalDataSet from '../src/StatisticalDataSet';

/**
 * A common ancestor to all implementations of linear regressions, such as
 * {@linkcode LeastSquaresLinearRegression} for example.
 */
export default class LinearRegression {

    /**
     * Construct a new instance.
     * @param dataset The data set to be used calculate the regression line.  It must contain at least 
     * two numeric series with each at least two data points.
     */
    constructor(public dataset: StatisticalDataSet) {
        this.dataset = dataset;
    }
}