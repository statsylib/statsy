export default abstract class AbstractStatisticalDataSeries {
    isString: boolean = false;
    constructor(public isNumeric: boolean) {
        this.isNumeric = isNumeric;
        this.isString = !isNumeric;
    }
}