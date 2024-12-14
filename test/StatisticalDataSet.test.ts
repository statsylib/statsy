import StatisticalDataSeries from '../src/StatisticalDataSeries';
import StatisticalDataSet from '../src/StatisticalDataSet';
import {expect, test} from '@jest/globals';

test('count of inner series elements val1', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 22}];
    expect((new StatisticalDataSet(data).series('val1') as StatisticalDataSeries).count).toBe(2);
});

test('count of inner series elements val2', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 22}];
    const series = new StatisticalDataSet(data).series('val2') as StatisticalDataSeries;
    expect(series.count).toBe(2);
});

test('name of inner series val2', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 33}];
    expect((new StatisticalDataSet(data).series('val2') as StatisticalDataSeries).name).toBe('val2');
});

test('sum of inner series elements val2', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 33}];
    expect((new StatisticalDataSet(data).series('val2') as StatisticalDataSeries).sum).toBe(55);
});

test('mean of inner series elements val2', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    expect((new StatisticalDataSet(data).series('val2') as StatisticalDataSeries).mean).toBe(30);
});

test('increase data point simple case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    dataset.increaseDataPoint(0, 'val2', 3)
    expect((dataset.data as any)[0]['val2']).toBe(43);
});

test('decrease data point simple case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    dataset.decreaseDataPoint(0, 'val1', 2)
    expect((dataset.data[0] as any)['val1']).toBe(9);
});

test('decrease data point negative case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    dataset.decreaseDataPoint(1, 'val2', 34)
    expect((dataset.data[1] as any)['val2']).toBe(-14);
});

test('maxKeyValue simple case', () => {
    const data = [{"val1": 5,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.maxKeyValue('val1')).toBe(11);
});

test('maxKeyValue duplicate case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.maxKeyValue('val2')).toBe(40);
});

test('maxKeyValue other simple case', () => {
    const data = [{"val1": 11,"val2": 50},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.maxKeyValue('val2')).toBe(50);
});


test('minKeyValue simple case', () => {
    const data = [{"val1": 5,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.minKeyValue('val1')).toBe(5);
});

test('minKeyValue duplicate case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.minKeyValue('val2')).toBe(40);
});

test('minKeyValue other simple case', () => {
    const data = [{"val1": 11,"val2": 50},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.minKeyValue('val2')).toBe(40);
});

test('leastSquaresRegression simple positive slope', () => {
    const data = [{"val1": 5,"val2": 1},{"val1": 10,"val2": 3},{"val1": 15,"val2": 5}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.leastSquaresRegression('val1', 'val2').m).toBe(0.4);
    expect(dataset.leastSquaresRegression('val1', 'val2').b).toBe(-1);
});

test('leastSquaresRegression not so simple negative slope', () => {
    const data = [{"val1": 3,"val2": 7},{"val1": 6,"val2": 8},{"val1": 9,"val2": 9},{"val1": 12,"val2": 9},{"val1": 15,"val2": 11}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.leastSquaresRegression('val1', 'val2').m).toBeCloseTo(0.3);
    expect(dataset.leastSquaresRegression('val1', 'val2').b).toBeCloseTo(6.1);
});

test('correlationCoefficient simple case', () => {
    const data = [{"val1": 3,"val2": 7},{"val1": 6,"val2": 8},{"val1": 9,"val2": 9},{"val1": 12,"val2": 9},{"val1": 15,"val2": 11}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.correlationCoefficient('val1', 'val2')).toBeCloseTo(0.95940, 5);
});

test('correlationCoefficient perfect case', () => {
    const data = [{"val1": 3,"val2": 3},{"val1": 6,"val2": 6},{"val1": 9,"val2": 9},{"val1": 12,"val2": 12},{"val1": 15,"val2": 15}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.correlationCoefficient('val1', 'val2')).toBeCloseTo(1, 5);
});

test('correlationCoefficient low case', () => {
    const data = [{"val1": 3,"val2": 5},{"val1": 6,"val2": 9},{"val1": 9,"val2": 1},{"val1": 12,"val2": 10},{"val1": 15,"val2": 5}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.correlationCoefficient('val1', 'val2')).toBeCloseTo(0.04385, 5);
});

test('correlationCoefficient negarive case', () => {
    const data = [{"val1": 3,"val2": 9},{"val1": 6,"val2": 7},{"val1": 9,"val2": 5},{"val1": 12,"val2": 3},{"val1": 15,"val2": 1}];
    const dataset = new StatisticalDataSet(data);
    expect(dataset.correlationCoefficient('val1', 'val2')).toBeCloseTo(-1, 5);
});

test('numerical series 0', () => {
    const dataset = new StatisticalDataSet([{"val1": "r","val2": "t"},{"val1": "r","val2": "e"}]);
    expect(dataset.numericalSeries().length).toBe(0);
});

test('numerical series 1', () => {
    const dataset = new StatisticalDataSet([{"val1": "val1_1","val2": 9},{"val1": "val1_2","val2": 7}]);
    expect(dataset.numericalSeries().length).toBe(1);
});

test('numerical series 2', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val1": "2","val2": 7}]);
    expect(dataset.numericalSeries().length).toBe(2);
});

test('numerical series undefined', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val3": "a","val4": "f"}]);
    expect(dataset.isUniform).toBe(false);
    expect(dataset.numericalSeries().length).toBe(0);
});

test('non uniform series 1', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val3": "a","val4": "f"}]);
    expect(dataset.isUniform).toBe(false);
});

test('uniform series 2', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val1": "a","val2": "f"}]);
    expect(dataset.isUniform).toBe(true);
});

test('load hints nonsense with 2 nonsense series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": "1","val2": 9},{"val1": "a","val2": "f"}]});
    expect(dataset.isUniform).toBe(true);

});

test('load hints nonsense with 2 string series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": "r","val2": "g"},{"val1": "a","val2": "f"}]});
    expect(dataset.isUniform).toBe(true);

});

test('load hints nonsense with 2 numerical series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": "1","val2": "9"},{"val1": "4","val2": "3"}]});
    expect(dataset.isUniform).toBe(true);
    expect(dataset.numericalSeries().length).toBe(2);
});

test('load hints nonsense with 1 numerical series and 1 string series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": 1,"val2": "a"},{"val1": 2,"val2": "b"}]});
    expect(dataset.isUniform).toBe(true);
    expect(dataset.numericalSeries().length).toBe(1);

});

test('load hints nonsense with 1 numerical series and 1 string series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": 1,"val2": "a"},{"val1": 2,"val2": "b"}]});
    expect(dataset.isUniform).toBe(true);
    expect(dataset.numericalSeries().length).toBe(1);

});

test('load hints metadata with dependent variable name happy path', () => {
    const dataset = new StatisticalDataSet({"dependent_variable_name": "val1", "data": [{"val1": 1,"val2": 2},{"val1": 3,"val2": 4}]});
    expect(dataset.isUniform).toBe(true);
    expect(dataset.numericalSeries().length).toBe(2);

});

test('load hints metadata with dependent variable name and default label happy path', () => {
    const dataset = new StatisticalDataSet({"dependent_variable_name": "val1", "data": [{"val1": 1,"val2": 2, "label": "p1"},{"val1": 3,"val2": 4, "label": "p2"}]});
    expect(dataset.isUniform).toBe(true);
    expect(dataset.numericalSeries().length).toBe(2);

});

test('load hints metadata with dependent variable name and non default label happy path', () => {
    const dataset = new StatisticalDataSet({"dependent_variable_name": "val1", "label_name": "notlabel", "data": [{"val1": 1,"val2": 2, "notlabel": "p1"},{"val1": 3,"val2": 4, "notlabel": "p2"}]});
    expect(dataset.isUniform).toBe(true);
    expect(dataset.numericalSeries().length).toBe(2);

});

test('default labels because it is the only string series', () => {
    const dataset = new StatisticalDataSet([{"val1": 1,"val2": 2, "notlabelbutreallyis": "thelabel2"},{"val1": 3,"val2": 4, "notlabelbutreallyis": "thelabel2"}]);

});

test('should throw an error if called without an arg', () => {
    expect(() => {
        new StatisticalDataSet([{"val1": "1","val2": 9},{"val3": "a","val4": "f"}]).correlationCoefficient('val1', 'val2');
    }).toThrow('Dataset is not uniform.  Unable to calculate coefficient.');
})

  test('should throw an error if called without an arg', () => {
    expect(() => {
        new StatisticalDataSet([{"val1": "1","val2": 9},{"val1": "a","val2": "f"}]).correlationCoefficient('val1', 'val2');
    }).toThrow('Invalid data: val1 and val2 values must be numbers.');
})

  test('should throw an error if called without an arg', () => {
    expect(() => {
        new StatisticalDataSet([]).correlationCoefficient('val1', 'val2');
    }).toThrow('Data must be an array with at least two elements.');
})

  test('should throw an error if called without an arg', () => {
    expect(() => {
        new StatisticalDataSet([{"val1": 0,"val2": 0},{"val1": 0,"val2": 0}]).correlationCoefficient('val1', 'val2');
    }).toThrow('Denominator is zero, correlation cannot be calculated.');
})