import { StatisticalDataSet } from './StatisticalDataSet.ts';

/**
 * A {@linkcode StatisticalDataSet} with a single explanatory variable, a dependent variable
 * and hints for which is which.
 */
export class SingleExplanatoryVariableStatisticalDataSet extends StatisticalDataSet {
    explanatory_variable_name: string = '';
    constructor(data: any) {
        super(data)
        this.explanatory_variable_name = data['explanatory_variable_name_1'];
        super.setExplanatoryValueName(this.explanatory_variable_name);
        super.setMaxExplanatoryValue(super.maxKeyValue(this.explanatory_variable_name));
    }
}