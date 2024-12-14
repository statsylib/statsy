import StatisticalDataSet from './StatisticalDataSet';

export default class DualAdditiveExplanatoryVariableStatisticalDataSet extends StatisticalDataSet {
    optimal_explanation_ratio: number = 0;
    explanatory_variable_name_1: string = '';
    explanatory_variable_name_2: string = '';
    explanatory_value_name: string = '';
    
    constructor(data: any) {
        super(data)
        this.explanatory_variable_name_1 = data['explanatory_variable_name_1'];
        this.explanatory_variable_name_2 = data['explanatory_variable_name_2'];
        this.explanatory_value_name = "explanatory_value";
        this.calculate();
    }

    calculate() {       
        this.optimal_explanation_ratio = this.get_optimal_explanation_ratio();
        this.calculate_explanatory_value(this.optimal_explanation_ratio);
    }

    calculate_explanatory_value(explanation_ratio: number) {
        for (let i: number=0; i<super.data.length; i++) {
            super.data[i][this.explanatory_value_name] = super.data[i][this.explanatory_variable_name_1]*explanation_ratio + super.data[i][this.explanatory_variable_name_2]*(1-explanation_ratio);
        }
        super.setMaxExplanatoryValue(super.maxKeyValue(this.explanatory_value_name));
    }

    get_optimal_explanation_ratio() {
        let ret = 0;
        let max_correlation_coefficient = 0;
        for (let i: number = 0; i<=1; i+=0.00001) {
            this.calculate_explanatory_value(i);
            const calculated_correlation_coefficient = super.correlationCoefficient(super.getDependentVariableName(), this.getExplanatoryValueName());
            if (calculated_correlation_coefficient > max_correlation_coefficient) {
                max_correlation_coefficient = calculated_correlation_coefficient;
                ret = i;
            }
        }
        return ret;
    }
}
