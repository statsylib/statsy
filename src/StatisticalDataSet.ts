import { AbstractStatisticalDataSeries } from '../src/AbstractStatisticalDataSeries.ts';
import { StatisticalDataSeries } from '../src/StatisticalDataSeries.ts';
import { StatisticalDataSeriesLabels } from '../src/StatisticalDataSeriesLabels.ts';
import { LeastSquaresLinearRegression } from '../src/LeastSquaresLinearRegression.ts';
import { RegressionLine } from '../src/RegressionLine.ts';
/**
 * A dataset consisting of multiple {@linkcode StatisticalDataSeries} and possibly some loading hints.
 * The data is an array of observations with an optional label and a series of measurements.  This array 
 * may either be at the top level of the data structure as in the example below which has two observations, 
 * each containing a label and three data series.
 * 
 * ``` ts
 * [
 *   {
 *     "label": "Q1 2020",
 *     "instrument_revenue": 4024,
 *     "consumable_revenue": 8269,
 *     "cost_of_revenue": 5421
 *   },
 *   {
 *      "label": "Q2 2020",
 *      "instrument_revenue": 8934,
 *      "consumable_revenue": 4822,
 *      "cost_of_revenue": 8225
 *   }
 * ]
 * ```
 * 
 * Or the data can be nested in a data key in a top level map that also includes loading hints to describe the 
 * dataset.  In this example, the loading hints further describe the above example by identifying which of the
 * series contains the labels, which is considered a dependent variable and which are considered explanatory
 * variable for the purpose of performing statistical analysis of the dataset.
 * 
 * ``` ts
 * {
 *   "dependent_variable_name": "cost_of_revenue",
 *   "explanatory_variable_name_1": "instrument_revenue",
 *   "explanatory_variable_name_2": "consumable_revenue",
 *   "label_name": "label",
 *   "data": [
 *     {
 *       "label": "Q1 2020",
 *       "instrument_revenue": 4024,
 *       "consumable_revenue": 8269,
 *       "cost_of_revenue": 5421
 *     },
 *     {
 *       "label": "Q2 2020",
 *       "instrument_revenue": 8934,
 *       "consumable_revenue": 4822,
 *       "cost_of_revenue": 8225
 *     }
 *   ]
 * }
 * ```
 */
export class StatisticalDataSet {
    public metadata: string[] = [];
    public label_name: string = 'label';
    public label_name_hint_name: string = 'label_name';
    public dependent_variable_name: string = '';
    public max_dependent_variable_value: number = 0;
    public explanatory_value_name: string = '';
    public max_explanatory_value: number = 0;
    public isUniform: boolean;
    public labels: AbstractStatisticalDataSeries = new StatisticalDataSeriesLabels([]);

    /**
     * Constructs a new instance.
     * 
     * @param data The dataset.
     */
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
        this.isUniform = this.#checkIsUniform();
    }

    /**
     * Get the dependent variable name.
     * @returns the name of the variable
     */
    public getDependentVariableName(): string {
        return this.dependent_variable_name;
    }

    /**
     * Set the dependent variable name.
     * @param dependent_variable_name the name of the variable.
     */
    public setDependentVariableName(dependent_variable_name: string) {
        this.dependent_variable_name = dependent_variable_name;
    }

    public getExplanatoryValueName(): string {
        return this.explanatory_value_name;
    }
    public setExplanatoryValueName(explanatory_value_name: string) {
        this.explanatory_value_name = explanatory_value_name;
    }

    public setMaxExplanatoryValue(max_explanatory_value: number) {
        this.max_explanatory_value = max_explanatory_value;
    }

    /**
     * Returns a {@linkcode AbstractStatisticalDataSeries} for a given label from the data set.
     * 
     * @param key the label of the series you want returned
     * @returns an instance of a {@linkcode AbstractStatisticalDataSeries} or the series labeled by the specified key.
     */
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

    /**
     * Returns all the numerical data series in the dataset, ignoring any string series.
     * 
     * @returns an array of {@linkcode StatisticalDataSeries} instances.
     */
    numericalSeries(): StatisticalDataSeries[] {
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

    /**
     * Returns all the string data series in the dataset, ignoring any numerical series.
     * 
     * @returns an array of {@linkcode StatisticalDataSeriesLabel} instances.
     */
    stringSeries(): AbstractStatisticalDataSeries[] {
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
    #checkIsUniform(): boolean {
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

    /**
     * Increase the value of one of a data point in a series by a given amount.
     * 
     * @param index The zero based index of the element to increase within the series.
     * @param key The key of the series containing the element to increase.
     * @param delta The amount to be added to the value of the element.
     */
    increaseDataPoint(index: number, key: string, delta: number) {
        (this.data as any)[index][key] += delta;
        this.max_dependent_variable_value = this.maxKeyValue(this.dependent_variable_name);
        this.max_explanatory_value = this.maxKeyValue(this.explanatory_value_name);
    }

    /**
     * Decrease the value of one of a data point in a series by a given amount.
     * 
     * @param index The zero based index of the element to decrease within the series.
     * @param key The key of the series containing the element to decrease.
     * @param delta The amount to be removed from the value of the element.
     */
    decreaseDataPoint(index: number, key: string, delta: number) {
        (this.data as any)[index][key] -= delta;
        this.max_dependent_variable_value = this.maxKeyValue(this.dependent_variable_name);
        this.max_explanatory_value = this.maxKeyValue(this.explanatory_value_name);
    }

    maxKeyValue(key: string): number {
        let ret: number = 0;
        for (let i: number=0; i<this.data.length; i++) {
            if ((this.data as any)[i][key] > ret) {
                ret = (this.data as any)[i][key];
            }
        }
        return ret;
    }

    minKeyValue(key: string): number {
        let ret: number = Number.MAX_SAFE_INTEGER;
        for (let i: number=0; i<this.data.length; i++) {
            if ((this.data as any)[i][key] < ret) {
                ret = (this.data as any)[i][key];
            }
        }
        return ret;
    }

    leastSquaresRegression(varX: string, varY: string): RegressionLine {
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
    correlationCoefficient(varX: string, varY: string): number {
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