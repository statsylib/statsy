
/**
 * Common ancestor to {@linkcode StatisticalDataSeries} and {@linkcode StatisticalDataSeriesLabels}
 * to help identify if the series contains numbers or strings.
 */
export default abstract class AbstractStatisticalDataSeries {
    isString: boolean = false;
    constructor(public isNumeric: boolean) {
        this.isNumeric = isNumeric;
        this.isString = !isNumeric;
    }
}