import AbstractStatisticalDataSeries from '../src/AbstractStatisticalDataSeries';
import StatisticalDataSeries from '../src/StatisticalDataSeries';
import StatisticalDataSeriesLabels from '../src/StatisticalDataSeriesLabels';
import LeastSquaresLinearRegression from '../src/LeastSquaresLinearRegression';

export default class StatisticalDataSet {
    public metadata: string[] = [];
    public label_name: string = 'label';
    public label_name_hint_name: string = 'label_name';
    public dependent_variable_name: string = '';
    public max_dependent_variable_value: number = 0;
    public explanatory_value_name: string = '';
    public max_explanatory_value: number = 0;
    public isUniform: boolean;
    public labels: AbstractStatisticalDataSeries = new StatisticalDataSeriesLabels([]);
    constructor(public data: any) {
        if (Object.keys(data).includes('data')) {
            this.data = data['data'];
            this.metadata = data;
            this.dependent_variable_name = (this.metadata as any)['dependent_variable_name'];
            this.max_dependent_variable_value = this.maxKeyValue(this.dependent_variable_name);
            if (Object.keys(this.metadata).includes(this.label_name_hint_name)) {
                this.label_name = (this.metadata as any)[this.label_name_hint_name];
            }
            this.labels = this.series(this.label_name);
        } else {
            this.data = data;
        }
        this.isUniform = this.checkIsUniform();
    }

    public getDependentVariableName() {
        return this.dependent_variable_name;
    }
    public setDependentVariableName(dependent_variable_name: string) {
        this.dependent_variable_name = dependent_variable_name;
    }

    public getExplanatoryValueName() {
        return this.explanatory_value_name;
    }
    public setExplanatoryValueName(explanatory_value_name: string) {
        this.explanatory_value_name = explanatory_value_name;
    }

    public setMaxExplanatoryValue(max_explanatory_value: number) {
        this.max_explanatory_value = max_explanatory_value;
    }

    series(key: string): AbstractStatisticalDataSeries {
        let isAllSeriesNumeric: boolean = true;
        if (this.data.length == 0) return new StatisticalDataSeries([]);
        if (!this.isUniform) return new StatisticalDataSeries([]);
        for (let i: number=0; i<this.data.length; i++) {
            if (isNaN(+(this.data as any)[0][key])) {
                isAllSeriesNumeric = false;
                break;
            }
        }
        if (isAllSeriesNumeric) {
            const numberRet: number[] = [];
            for (let i: number=0; i<this.data.length; i++) {
                numberRet.push((this.data as any)[i][key]);
            }
            return new StatisticalDataSeries(numberRet, key);    
        } else {
            const stringRet: string[] = [];
            for (let i: number=0; i<this.data.length; i++) {
                stringRet.push((this.data as any)[i][key]);
            }
            return new StatisticalDataSeriesLabels(stringRet, key);    
        }
    }

    numericalSeries() {
        if (!this.isUniform) return [];
        const keys = {};
        const ret: StatisticalDataSeries[] = [];
        if (this.data.length > 0) {
            const current_series_keys = Object.keys(this.data[0]);
            for (const key_index in current_series_keys) {
                if (!(current_series_keys[key_index] in keys)) {
                    (keys as any)[current_series_keys[key_index]] = [];
                }
                (keys as any)[current_series_keys[key_index]].push(this.series(current_series_keys[key_index]));
                if (this.series(current_series_keys[key_index]).isNumeric) {
                    ret.push((keys as any)[current_series_keys[key_index]]);
                }
            }
        }
        return ret;
    }

    stringSeries() {
        if (!this.isUniform) return [];
        const keys = {};
        const ret: StatisticalDataSeriesLabels[] = [];
        if (this.data.length > 0) {
            const current_series_keys = Object.keys(this.data[0]);
            for (const key_index in current_series_keys) {
                if (!(current_series_keys[key_index] in keys)) {
                    (keys as any)[current_series_keys[key_index]] = [];
                }
                (keys as any)[current_series_keys[key_index]].push(this.series(current_series_keys[key_index]));
                if (this.series(current_series_keys[key_index]).isString) {
                    ret.push((keys as any)[current_series_keys[key_index]]);
                }
            }
        }
        return ret;        
    }

    /**
     * A Dataset is uniform if:
     * - it contains a single data series
     * - it is an array and all the elements of the array are dictionaries with the same keys
     * @returns true or false
     */
    private checkIsUniform(): boolean {
        let ret: boolean = true;
        if (this.data.length > 0) {
            const reference_keys = Object.keys(this.data[0]);
            for (const index in this.data) {
                if (JSON.stringify(reference_keys.sort()) != JSON.stringify(Object.keys(this.data[index]).sort())) {
                    ret = false;
                }
            }
        }
        return ret;
    }

    increaseDataPoint(index: number, key: string, delta: number) {
        (this.data as any)[index][key] += delta;
        this.max_dependent_variable_value = this.maxKeyValue(this.dependent_variable_name);
        this.max_explanatory_value = this.maxKeyValue(this.explanatory_value_name);
    }

    decreaseDataPoint(index: number, key: string, delta: number) {
        (this.data as any)[index][key] -= delta;
        this.max_dependent_variable_value = this.maxKeyValue(this.dependent_variable_name);
        this.max_explanatory_value = this.maxKeyValue(this.explanatory_value_name);
    }

    maxKeyValue(key: string) {
        let ret: number = 0;
        for (let i: number=0; i<this.data.length; i++) {
            if ((this.data as any)[i][key] > ret) {
                ret = (this.data as any)[i][key];
            }
        }
        return ret;
    }

    minKeyValue(key: string) {
        let ret: number = Number.MAX_SAFE_INTEGER;
        for (let i: number=0; i<this.data.length; i++) {
            if ((this.data as any)[i][key] < ret) {
                ret = (this.data as any)[i][key];
            }
        }
        return ret;
    }

    leastSquaresRegression(varX: string, varY: string) {
        const regression: LeastSquaresLinearRegression = new LeastSquaresLinearRegression(this);
        return regression.fit(varX, varY);
    }

    /**
     * 
     * @param {*} data in the form of an array of maps where each element of the array has values for keys names varX and varY
     * @param {*} varX the name of the key of the first value
     * @param {*} varY the name of the key of the second value
     * @returns the correlation coefficient of the two variables
     */
    correlationCoefficient(varX: string, varY: string) {
        if (!this.isUniform) throw new Error('Dataset is not uniform.  Unable to calculate coefficient.');
        if (!Array.isArray(this.data) || this.data.length < 2) {
            throw new Error("Data must be an array with at least two elements.");
        }
    
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
        for (let i = 0; i < this.data.length; i++) {
            const x = (this.data as any)[i][varX];
            const y = (this.data as any)[i][varY];
    
            if (typeof x !== "number" || typeof y !== "number") {
                throw new Error(`Invalid data: ${varX} and ${varY} values must be numbers.`);
            }
    
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
            sumY2 += y * y;
        }
    
        const numerator = this.data.length * sumXY - sumX * sumY;
        const denominator = Math.sqrt(
            (this.data.length * sumX2 - sumX * sumX) * (this.data.length * sumY2 - sumY * sumY)
        );
    
        if (denominator === 0) {
            throw new Error("Denominator is zero, correlation cannot be calculated.");
        }
    
        return numerator / denominator;
    }
}