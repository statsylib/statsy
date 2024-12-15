import AbstractStatisticalDataSeries from '../src/AbstractStatisticalDataSeries.ts';

/**
 * Holds a number of numbers.  Used to count how many of each number appears
 * in a {@linkcode StatisticalDataSeries}.
 */
interface Bucket {
    [key: number]: number;
}

/**
 * A series of numbers on which a variety of descriptive statistics attributes 
 * will be calculated.
 */
export default class StatisticalDataSeries extends AbstractStatisticalDataSeries {
    /**
     * The sum of all the elements in the series.
     */ 
    sum: number = 0; 

    /*
     * The highest number in the series.
     */
    max: number = Number.NEGATIVE_INFINITY; 

    /*
     * The lowest number in the series.
     */
    min: number = Number.POSITIVE_INFINITY; 

    /**
     * The sample variance of series as described in {@link https://en.wikipedia.org/wiki/Variance}.
     */
    sampleVariance: number = NaN;

    /**
     * The population variance of series as described in {@link https://en.wikipedia.org/wiki/Variance}.
     */
    populationVariance: number = NaN;

    /**
     * The sample standard deviation as described in {@link https://en.wikipedia.org/wiki/Standard_deviation}.
     */
    sampleStandardDeviation: number = NaN;

    /**
     * The population standard deviation as described in {@link https://en.wikipedia.org/wiki/Standard_deviation}.
     */
    populationStandardDeviation: number = NaN;

    /**
     * The mode of the series as described in {@link https://en.wikipedia.org/wiki/Mode_(statistics)}.
     */
    mode: number[] = [];

    /**
     * The mean of the series as described in {@link https://en.wikipedia.org/wiki/Mean}.
     */
    mean: number = NaN;

    /**
     * The median of the series as described in {@link https://en.wikipedia.org/wiki/Median}.
     */
    median: number = NaN;

    /**
     * The sum of squared deviations from the mean for the series as described in 
     * {@link https://en.wikipedia.org/wiki/Squared_deviations_from_the_mean}.
     */
    sumOfSquaredDeviationsFromMean: number = NaN;

    /**
     * The number of elements in the series.
     */
    count: number = 0;

    /**
     * 
     * @param data An array of numbers.
     * @param name An optional name for the series.
     */
    constructor(public data: number[], public name?: string) { 
        super(true)
        this.data = data;
        this.#calculateValues();
        (this as AbstractStatisticalDataSeries).isNumeric = true;
        (this as AbstractStatisticalDataSeries).isString = false;
        this.count = this.data.length;
    }

    buckets: Bucket = {};

    #calculateValues() {
        let candidateModes: number[] = [];
        let candidateModeCount = 0;
        for (let i: number=0; i<this.data.length; i++) {
            if (!isNaN(this.data[i])) {
                this.sum += this.data[i];
                if (!Object.keys(this.buckets).includes(this.data[i].toString())) {
                    this.buckets[this.data[i]] = 1;
                } else {
                this.buckets[this.data[i]] ++;
                    if (this.buckets[this.data[i]] > candidateModeCount) {
                        candidateModes = [this.data[i]];
                        candidateModeCount = this.buckets[this.data[i]];
                    } else if (this.buckets[this.data[i]] == candidateModeCount) {
                        candidateModes.push(this.data[i]);
                    }
                }
                if (this.data[i] > this.max) this.max = this.data[i];
                if (this.data[i] < this.min) this.min = this.data[i];
            }
        }

        this.mode = candidateModes;
        this.mean = this.sum / this.data.length;

        // median
        const sorted = Array.from(this.data).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            this.median = (sorted[middle - 1] + sorted[middle]) / 2;
        } else {
            this.median = sorted[middle];
        }
        // sum of squares
        let sumOfDifferencesFromMeanSquared = 0;
        for (let i: number=0; i<this.data.length; i++) {
            sumOfDifferencesFromMeanSquared += ((this.data[i] - this.mean) ** 2);
        }
        this.sumOfSquaredDeviationsFromMean = sumOfDifferencesFromMeanSquared;

        // variance and standard deviation
        this.sampleVariance = sumOfDifferencesFromMeanSquared / (this.data.length - 1);
        this.populationVariance = sumOfDifferencesFromMeanSquared / this.data.length;
        this.sampleStandardDeviation = Math.sqrt(this.sampleVariance);
        this.populationStandardDeviation = Math.sqrt(this.populationVariance);        
    }
}