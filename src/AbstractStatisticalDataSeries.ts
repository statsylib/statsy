export default abstract class AbstractStatisticalDataSeries {
    count: number = 0;
    isString: boolean = false;
    constructor(public isNumeric: boolean) {
        this.isNumeric = isNumeric;
        this.isString = !isNumeric;
    }
}