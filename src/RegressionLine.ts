
/**
 * Represents a regression line in two dimensions with the equation y = mx + b.
 */
export default class RegressionLine {

    /**
     * Construct a new instance
     * 
     * @param m The slope of the line.
     * @param b The y intercept of the line.
     */
    constructor(public m: number, public b: number) {
        this.m = m;
        this.b = b;
    }
}