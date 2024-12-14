import { default as StatisticalDataSet } from './StatisticalDataSet';

export default class SingleExplanatoryVariableStatisticalDataSet extends StatisticalDataSet {
    explanatory_variable_name: string = '';
    constructor(data: any) {
        super(data)
        this.explanatory_variable_name = data['explanatory_variable_name_1'];
        super.setExplanatoryValueName(this.explanatory_variable_name);
        super.setMaxExplanatoryValue(super.maxKeyValue(this.explanatory_variable_name));
    }
}