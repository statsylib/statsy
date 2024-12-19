import { StatisticalDataSet } from './StatisticalDataSet.ts';
import { SingleExplanatoryVariableStatisticalDataSet } from './SingleExplanatoryVariableStatisticalDataSet.ts';

class SingleExplanatoryVariableCorrelationChart {

    /**
     * The size of the border on the left and right of the chart where nothing will be drawn except 
     * for the labels.
     */
    xBorder: number = 10;
  
    /**
     * The size of the border on the top and bottom of the chart where nothing will be drawn except 
     * for the labels.
     */
    yBorder: number = 40;
  
    #labelTextHeight: number = 20;
    #xPadding: number = this.xBorder + this.#labelTextHeight;
    #yPadding: number = this.yBorder + this.#labelTextHeight;
  
    textFontSize: number = 20;

    dataPointRadius: number = 5;

    mouseIsDown: boolean = false;
    mouseDownX: number = 0;
    mouseDownY: number = 0;
    isDraggingPoint: boolean = false;
    draggingPointIndex: number = NaN;
  
    constructor(public context: any, public dataset: StatisticalDataSet) {
        this.context = context;
        this.dataset = dataset;
        context.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        context.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        context.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        context.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
    }

    onMouseDown(event: any) {
        this.mouseIsDown = true;
        const canvasBoundingRect = this.context.canvas.getBoundingClientRect();
        const x = event.pageX - canvasBoundingRect.left;
        const y = event.pageY - canvasBoundingRect.top;
        this.mouseDownX = x;
        this.mouseDownY = y;
    }

    onMouseMove(event: any) {
        const canvasBoundingRect = this.context.canvas.getBoundingClientRect();
        const x = event.pageX - canvasBoundingRect.left;
        const y = event.pageY - canvasBoundingRect.top;
        const dataX = this.fromScreenWidthUnits(x);
        const dataY = this.fromScreenHeightUnits(y);
        if (this.mouseIsDown) {
            this.draw();
            if (this.dataset) {
                if (this.isDraggingPoint) {
                    this.dataset.setDataPoint(this.draggingPointIndex, this.dataset.getExplanatoryValueName(), dataX);
                    this.dataset.setDataPoint(this.draggingPointIndex, this.dataset.getDependentVariableName(), dataY);
                    this.draw();
                } else {
                    for (let i: number = 0; i < this.dataset.data.length; i++) {
                        const distance = Math.sqrt((dataX - this.dataset.data[i][this.dataset.explanatory_value_name]) ** 2 + (dataY - this.dataset.data[i][this.dataset.dependent_variable_name]) ** 2);
                        if (distance <= (this.dataPointRadius * 5)) {
                            console.log('you got a circle at (' + x + ',' + y + ')');
                            this.isDraggingPoint = true;
                            this.draggingPointIndex = i;
                        }
                    }
                }
            }
        }
    }

    onMouseUp(event: any) {
        this.mouseIsDown = false;
        const canvasBoundingRect = this.context.canvas.getBoundingClientRect();
        const x = event.pageX - canvasBoundingRect.left;
        const y = event.pageY - canvasBoundingRect.top;
        const dataX = this.fromScreenWidthUnits(x);
        const dataY = this.fromScreenHeightUnits(y);
        if (this.isDraggingPoint) {
            this.isDraggingPoint = false;
            this.dataset.setDataPoint(this.draggingPointIndex, this.dataset.getExplanatoryValueName(), dataX);
            this.dataset.setDataPoint(this.draggingPointIndex, this.dataset.getDependentVariableName(), dataY);
            this.draw();
        }
    }

    onMouseOut(event: any) {
        if (this.isDraggingPoint) {
            const dataX = this.fromScreenWidthUnits(this.mouseDownX);
            const dataY = this.fromScreenHeightUnits(this.mouseDownY);
            this.dataset.setDataPoint(this.draggingPointIndex, this.dataset.getExplanatoryValueName(), dataX);
            this.dataset.setDataPoint(this.draggingPointIndex, this.dataset.getDependentVariableName(), dataY);
        }
        this.draw();
        this.mouseIsDown = false;
        this.isDraggingPoint = false;
    }

    toScreenHeightUnits(value: number): number {
        const chartHeight = this.context.canvas.height - (this.#yPadding*2);
        return this.context.canvas.height - this.#yPadding - (value * chartHeight / this.dataset.max_dependent_variable_value);
    }
  
    fromScreenHeightUnits(value: number): number {
        const chartHeight = this.context.canvas.height - (this.#yPadding*2);
        return ((this.context.canvas.height - this.#yPadding - value) * this.dataset.max_dependent_variable_value) / chartHeight;
    }
  
    toScreenWidthUnits(value: number): number {
        const chartWidth = this.context.canvas.width - (this.#xPadding*2);
        return (value * chartWidth / this.dataset.max_explanatory_value) + this.#xPadding;
    }
  
    fromScreenWidthUnits(value: number): number {
        const chartWidth = this.context.canvas.width - (this.#xPadding*2);
        return ((value - this.#xPadding) * this.dataset.max_explanatory_value) / chartWidth;
    }
  
    drawDataPoints() {
        if (this.dataset) {
            for (let i: number = 0; i < this.dataset.data.length; i++) {
                const xValue = this.toScreenWidthUnits(this.dataset.data[i][this.dataset.explanatory_value_name]);
                const yValue = this.toScreenHeightUnits(this.dataset.data[i][this.dataset.dependent_variable_name]);
                this.drawCircle(xValue, yValue, this.dataPointRadius, 'white')
            }
        } else {
            console.log('no data points to draw');
        }
    }
  
    drawAxes() {
        this.drawSolidRectangle(0,0,this.context.canvas.width, this.context.canvas.height, 'black')
        this.drawLine(this.#xPadding, this.context.canvas.height - this.#yPadding, this.context.canvas.width - this.#xPadding, this.context.canvas.height - this.#yPadding, 'white', 2);
        this.drawLine(this.#xPadding, this.context.canvas.height - this.#yPadding, this.#xPadding, this.yBorder, 'white', 2);
        if (this.dataset && this.dataset.dependent_variable_name && this.dataset.getExplanatoryValueName()) {
            this.drawCenteredVerticalText(this.#xPadding-1, this.context.canvas.height, 0, 0, this.dataset.dependent_variable_name, this.textFontSize, 'white');
            this.drawCenteredHorizontalText(0, this.context.canvas.height, this.context.canvas.width, this.context.canvas.height - this.#yPadding + 1, this.dataset.getExplanatoryValueName(), this.textFontSize, 'white');
        }
    }
  
    drawLeastSquaresFitLine(varX: string, varY: string) {
        const regression = this.dataset.leastSquaresRegression(varX, varY);
        const leastSquaresX1 = this.toScreenWidthUnits(this.dataset.minKeyValue(this.dataset.explanatory_value_name));
        const leastSquaresY1 = this.toScreenHeightUnits(regression.m * this.dataset.minKeyValue(this.dataset.explanatory_value_name) + regression.b);
        const leastSquaresX2 = this.toScreenWidthUnits(this.dataset.max_explanatory_value);
        const leastSquaresY2 = this.toScreenHeightUnits(regression.m * this.dataset.max_explanatory_value + regression.b);
        this.drawLine(leastSquaresX1, leastSquaresY1, leastSquaresX2, leastSquaresY2, 'red', 2);
    }
  
    drawCorrelationCoefficient(varX: string, varY: string) {
        if (this.dataset) {
            const coefficient = (this.dataset as SingleExplanatoryVariableStatisticalDataSet).correlationCoefficient(varX, varY);
            const print_text = 'ρ:' + coefficient.toFixed(2);
            this.drawCenteredHorizontalText(50, this.yBorder, 200, 0, print_text, 14, 'white');
        }
    }
  
    drawCircle(x: number, y: number, radius: number, color: string) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2);  
        this.context.fillStyle = color;  
        this.context.fill();
    }
  
    drawSolidRectangle(x: number, y: number, width: number, height: number, color: string) {
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
  
    drawHollowRectangle(x: number, y: number, width: number, height: number, color: string) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.strokeRect(x, y, width, height);
    }
  
    drawLine(startX: number, startY: number, endX: number, endY: number, color: string, strokeWidth: number) {
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
    }
  
    drawCenteredHorizontalText(x1: number, y1: number, x2: number, y2: number, text: string, fontSize: number, color: string) {
        const measurement = this.context.measureText(text);
        const textWidth = measurement.width;
        const textHeight = measurement.fontBoundingBoxAscent - measurement.fontBoundingBoxDescent;
        const textX = ((x2 - x1) / 2) - (textWidth / 2);
        const textY = y1 - ((y1 - y2 - textHeight) / 2);
        this.context.fillStyle = color;
        this.context.font = fontSize + "px arial";
        this.context.fillText(text, textX, textY);
    }
  
    drawCenteredVerticalText(x1: number, y1: number, x2: number, y2: number, text: string, fontSize: number, color: string) {
        const measurement = this.context.measureText(text);
        const textWidth = measurement.width;
        const textHeight = measurement.fontBoundingBoxAscent - measurement.fontBoundingBoxDescent;
        const textX = x1 + ((x2 - x1 - textHeight) / 2);
        const textY = y1 - ((y1 - y2 - textWidth) / 2);
        this.context.fillStyle = color;
        this.context.font = fontSize + "px arial";
        this.context.save();
        this.context.translate(textX, textY);
        this.context.rotate(270 * Math.PI / 180);
        this.context.fillText(text, 0, fontSize / 2);
        this.context.restore();
    }

    draw() {
        this.drawSolidRectangle(0, 0, this.context.canvas.width, this.context.canvas.height, 'black');
        this.drawAxes();
        this.drawDataPoints();
        this.drawLeastSquaresFitLine(this.dataset.explanatory_value_name, this.dataset.dependent_variable_name);
        this.drawCorrelationCoefficient(this.dataset.explanatory_value_name, this.dataset.dependent_variable_name);
    }
}