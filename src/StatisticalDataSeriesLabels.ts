import AbstractStatisticalDataSeries from '../src/AbstractStatisticalDataSeries.ts';

/**
 * A series of strings, usually to accompany a series of numbers in a {@linkcode StatisticalDataSeries}.
 */
export default class StatisticalDataSeriesLabels extends AbstractStatisticalDataSeries {

    /**
     * Constructs a new instance.
     * 
     * @param data An array of strings.
     * @param name The name of the series.
     */
    constructor(public data: string[], public name?: string) {
        super(false)
        this.data = data;
        if (name !== undefined) {
            this.name = name;
        }
    }
}