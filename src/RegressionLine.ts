
/**
 * Represents a regression line in two dimensions with the equation y = mx + b.
 */
export class RegressionLine {

    /**
     * The slope of the line.
     */
    m: number;

    /**
     * The y intercept of the line.
     */
    b: number;
    /**
     * Construct a new instance
     * 
     * @param m The slope of the line.
     * @param b The y intercept of the line.
     */
    constructor(m: number, b: number) {
        this.m = m;
        this.b = b;
    }
}