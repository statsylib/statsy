import AbstractStatisticalDataSeries from '../src/AbstractStatisticalDataSeries';

interface Bucket {
    [key: number]: number;
}

export default class StatisticalDataSeries extends AbstractStatisticalDataSeries {
    sum: number = 0;
    max: number = Number.NEGATIVE_INFINITY;
    min: number = Number.POSITIVE_INFINITY;
    sampleVariance: number = NaN;
    populationVariance: number = NaN;
    sampleStandardDeviation: number = NaN;
    populationStandardDeviation: number = NaN;
    mode: number[] = [];
    mean: number = NaN;
    median: number = NaN;
    sumOfSquares: number = NaN;

    constructor(public data: number[], public name?: string) { 
        super(true)
        this.data = data;
        this.calculateValues();
        (this as AbstractStatisticalDataSeries).isNumeric = true;
        (this as AbstractStatisticalDataSeries).isString = false;
    }

    buckets: Bucket = {};

    private calculateValues() {
        let candidateModes: number[] = [];
        let candidateModeCount = 0;
        for (let i: number=0; i<this.data.length; i++) {
            this.count ++;
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
        this.mean = this.sum / this.count;

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
        this.sumOfSquares = sumOfDifferencesFromMeanSquared;

        // variance and standard deviation
        this.sampleVariance = sumOfDifferencesFromMeanSquared / (this.data.length - 1);
        this.populationVariance = sumOfDifferencesFromMeanSquared / this.data.length;
        this.sampleStandardDeviation = Math.sqrt(this.sampleVariance);
        this.populationStandardDeviation = Math.sqrt(this.populationVariance);        
    }
}