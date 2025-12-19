import { StatisticalDataSeries } from '../src/StatisticalDataSeries.ts';
import { StatisticalDataSet } from '../src/StatisticalDataSet.ts';
import { assertEquals, assertAlmostEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test('count of inner series elements val1', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 22}];
    assertEquals((new StatisticalDataSet(data).series('val1') as StatisticalDataSeries).count, 2);
});

Deno.test('count of inner series elements val2', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 22}];
    const series = new StatisticalDataSet(data).series('val2') as StatisticalDataSeries;
    assertEquals(series.count, 2);
});

Deno.test('name of inner series val2', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 33}];
    assertEquals((new StatisticalDataSet(data).series('val2') as StatisticalDataSeries).name, 'val2');
});

Deno.test('sum of inner series elements val2', () => {
    const data = [{"val1": 11,"val2": 22},{"val1": 11,"val2": 33}];
    assertEquals((new StatisticalDataSet(data).series('val2') as StatisticalDataSeries).sum, 55);
});

Deno.test('mean of inner series elements val2', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    assertEquals((new StatisticalDataSet(data).series('val2') as StatisticalDataSeries).mean, 30);
});

Deno.test('increase data point simple case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    dataset.increaseDataPoint(0, 'val2', 3)
    assertEquals((dataset.data as any)[0]['val2'], 43);
});

Deno.test('decrease data point simple case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    dataset.decreaseDataPoint(0, 'val1', 2)
    assertEquals((dataset.data[0] as any)['val1'], 9);
});

Deno.test('decrease data point negative case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    dataset.decreaseDataPoint(1, 'val2', 34)
    assertEquals((dataset.data[1] as any)['val2'], -14);
});

Deno.test('maxKeyValue simple case', () => {
    const data = [{"val1": 5,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.maxKeyValue('val1'), 11);
});

Deno.test('maxKeyValue duplicate case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.maxKeyValue('val2'), 40);
});

Deno.test('maxKeyValue other simple case', () => {
    const data = [{"val1": 11,"val2": 50},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.maxKeyValue('val2'), 50);
});

Deno.test('minKeyValue simple case', () => {
    const data = [{"val1": 5,"val2": 40},{"val1": 11,"val2": 20}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.minKeyValue('val1'), 5);
});

Deno.test('minKeyValue duplicate case', () => {
    const data = [{"val1": 11,"val2": 40},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.minKeyValue('val2'), 40);
});

Deno.test('minKeyValue other simple case', () => {
    const data = [{"val1": 11,"val2": 50},{"val1": 34,"val2": 40}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.minKeyValue('val2'), 40);
});

Deno.test('leastSquaresRegression simple positive slope', () => {
    const data = [{"val1": 5,"val2": 1},{"val1": 10,"val2": 3},{"val1": 15,"val2": 5}];
    const dataset = new StatisticalDataSet(data);
    assertEquals(dataset.leastSquaresRegression('val1', 'val2').m, 0.4);
    assertEquals(dataset.leastSquaresRegression('val1', 'val2').b, -1);
});

Deno.test('leastSquaresRegression not so simple negative slope', () => {
    const data = [{"val1": 3,"val2": 7},{"val1": 6,"val2": 8},{"val1": 9,"val2": 9},{"val1": 12,"val2": 9},{"val1": 15,"val2": 11}];
    const dataset = new StatisticalDataSet(data);
    assertAlmostEquals(dataset.leastSquaresRegression('val1', 'val2').m, 0.3);
    assertAlmostEquals(dataset.leastSquaresRegression('val1', 'val2').b, 6.1);
});

Deno.test('correlationCoefficient simple case', () => {
    const data = [{"val1": 3,"val2": 7},{"val1": 6,"val2": 8},{"val1": 9,"val2": 9},{"val1": 12,"val2": 9},{"val1": 15,"val2": 11}];
    const dataset = new StatisticalDataSet(data);
    assertAlmostEquals(dataset.correlationCoefficient('val1', 'val2'), 0.95940, 5);
});

Deno.test('correlationCoefficient perfect case', () => {
    const data = [{"val1": 3,"val2": 3},{"val1": 6,"val2": 6},{"val1": 9,"val2": 9},{"val1": 12,"val2": 12},{"val1": 15,"val2": 15}];
    const dataset = new StatisticalDataSet(data);
    assertAlmostEquals(dataset.correlationCoefficient('val1', 'val2'), 1);
});

Deno.test('correlationCoefficient low case', () => {
    const data = [{"val1": 3,"val2": 5},{"val1": 6,"val2": 9},{"val1": 9,"val2": 1},{"val1": 12,"val2": 10},{"val1": 15,"val2": 5}];
    const dataset = new StatisticalDataSet(data);
    assertAlmostEquals(dataset.correlationCoefficient('val1', 'val2'), 0.04385, 0.00001);
});

Deno.test('correlationCoefficient negarive case', () => {
    const data = [{"val1": 3,"val2": 9},{"val1": 6,"val2": 7},{"val1": 9,"val2": 5},{"val1": 12,"val2": 3},{"val1": 15,"val2": 1}];
    const dataset = new StatisticalDataSet(data);
    assertAlmostEquals(dataset.correlationCoefficient('val1', 'val2'), -1, 0.00001);
});

Deno.test('numerical series 0', () => {
    const dataset = new StatisticalDataSet([{"val1": "r","val2": "t"},{"val1": "r","val2": "e"}]);
    assertEquals(dataset.numericalSeries().length, 0);
});

Deno.test('numerical series 1', () => {
    const dataset = new StatisticalDataSet([{"val1": "val1_1","val2": 9},{"val1": "val1_2","val2": 7}]);
    assertEquals(dataset.numericalSeries().length, 1);
});

Deno.test('numerical series 2', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val1": "2","val2": 7}]);
    assertEquals(dataset.numericalSeries().length, 2);
});

Deno.test('numerical series undefined', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val3": "a","val4": "f"}]);
    assertEquals(dataset.isUniform, false);
    assertEquals(dataset.numericalSeries().length, 0);
});

Deno.test('non uniform series 1', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val3": "a","val4": "f"}]);
    assertEquals(dataset.isUniform, false);
});

Deno.test('uniform series 2', () => {
    const dataset = new StatisticalDataSet([{"val1": "1","val2": 9},{"val1": "a","val2": "f"}]);
    assertEquals(dataset.isUniform, true);
});

Deno.test('load hints nonsense with 2 nonsense series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": "1","val2": 9},{"val1": "a","val2": "f"}]});
    assertEquals(dataset.isUniform, true);

});

Deno.test('load hints nonsense with 2 string series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": "r","val2": "g"},{"val1": "a","val2": "f"}]});
    assertEquals(dataset.isUniform, true);

});

Deno.test('load hints nonsense with 2 numerical series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": "1","val2": "9"},{"val1": "4","val2": "3"}]});
    assertEquals(dataset.isUniform, true);
    assertEquals(dataset.numericalSeries().length, 2);
});

Deno.test('load hints nonsense with 1 numerical series and 1 string series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": 1,"val2": "a"},{"val1": 2,"val2": "b"}]});
    assertEquals(dataset.isUniform, true);
    assertEquals(dataset.numericalSeries().length, 1);

});

Deno.test('load hints nonsense with 1 numerical series and 1 string series', () => {
    const dataset = new StatisticalDataSet({"nonsense key": "nonsense value", "data": [{"val1": 1,"val2": "a"},{"val1": 2,"val2": "b"}]});
    assertEquals(dataset.isUniform, true);
    assertEquals(dataset.numericalSeries().length, 1);
});

Deno.test('load hints metadata with dependent variable name happy path', () => {
    const dataset = new StatisticalDataSet({"dependent_variable_name": "val1", "data": [{"val1": 1,"val2": 2},{"val1": 3,"val2": 4}]});
    assertEquals(dataset.isUniform, true);
    assertEquals(dataset.numericalSeries().length, 2);
});

Deno.test('load hints metadata with dependent variable name and default label happy path', () => {
    const dataset = new StatisticalDataSet({"dependent_variable_name": "val1", "data": [{"val1": 1,"val2": 2, "label": "p1"},{"val1": 3,"val2": 4, "label": "p2"}]});
    assertEquals(dataset.isUniform, true);
    assertEquals(dataset.numericalSeries().length, 2);
});

Deno.test('load hints metadata with dependent variable name and non default label happy path', () => {
    const dataset = new StatisticalDataSet({"dependent_variable_name": "val1", "label_name": "notlabel", "data": [{"val1": 1,"val2": 2, "notlabel": "p1"},{"val1": 3,"val2": 4, "notlabel": "p2"}]});
    assertEquals(dataset.isUniform, true);
    assertEquals(dataset.numericalSeries().length, 2);
});

Deno.test('default labels because it is the only string series', () => {
    const dataset = new StatisticalDataSet([{"val1": 1,"val2": 2, "notlabelbutreallyis": "thelabel2"},{"val1": 3,"val2": 4, "notlabelbutreallyis": "thelabel2"}]);
});

Deno.test('should throw an error if called without an arg', () => {
    assertThrows(() => {
        new StatisticalDataSet([{"val1": "1","val2": 9},{"val3": "a","val4": "f"}]).correlationCoefficient('val1', 'val2');
    }, 'Dataset is not uniform.  Unable to calculate coefficient.');
})

Deno.test('should throw an error if called without an arg', () => {
    assertThrows(() => {
        new StatisticalDataSet([{"val1": "1","val2": 9},{"val1": "a","val2": "f"}]).correlationCoefficient('val1', 'val2');
    }, 'Invalid data: val1 and val2 values must be numbers.');
})

Deno.test('should throw an error if called without an arg', () => {
    assertThrows(() => {
        new StatisticalDataSet([]).correlationCoefficient('val1', 'val2');
    }, 'Data must be an array with at least two elements.');
})

Deno.test('should throw an error if called without an arg', () => {
    assertThrows(() => {
        new StatisticalDataSet([{"val1": 0,"val2": 0},{"val1": 0,"val2": 0}]).correlationCoefficient('val1', 'val2');
    }, 'Denominator is zero, correlation cannot be calculated.');
})