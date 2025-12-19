import { StatisticalDataSeries } from '../src/StatisticalDataSeries.ts';
import { assertEquals, assertAlmostEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test('count of [1,2,3] to be 3', () => {
    assertEquals(new StatisticalDataSeries([1,2,3]).count, 3);
  });

Deno.test('sum of [1,2,3] to be 6', () => {
  assertEquals(new StatisticalDataSeries([1,2,3], 'some name').sum, 6);
});

Deno.test('mean of [1,2,3] to be 2', () => {
  assertEquals(new StatisticalDataSeries([1,2,3]).mean, 2);
});

Deno.test('count of [4,5,9] to be 3', () => {
  assertEquals(new StatisticalDataSeries([4,5,9]).count, 3);
});

Deno.test('min of [4,5,9] to be 4', () => {
  assertEquals(new StatisticalDataSeries([4,5,9]).min, 4);
});

Deno.test('max of [4,5,9] to be 9', () => {
  assertEquals(new StatisticalDataSeries([4,5,9]).max, 9);
});

Deno.test('sum of [4,5,9] to be 18', () => {
  assertEquals(new StatisticalDataSeries([4,5,9]).sum, 18);
});

Deno.test('mean of [4,5,9] to be 6', () => {
  assertEquals(new StatisticalDataSeries([4,5,9]).mean, 6);
});

Deno.test('mode of [1,2,3] to be []', () => {
  assertEquals(new StatisticalDataSeries([1,2,3]).mode, []);
});

Deno.test('mode of [1,2,2,3] to be [2]', () => {
  assertEquals(new StatisticalDataSeries([1,2,2,3]).mode, [2]);
});

Deno.test('mode of [1,2,2,3,3] to be [2,3]', () => {
  assertEquals(new StatisticalDataSeries([1,2,2,3,3]).mode, [2,3]);
});

Deno.test('mode of [1,1,1,2,244,2,3,3,44,44,44,44,44,44,23,23,23,23] to be 44', () => {
  assertEquals(new StatisticalDataSeries([1,1,1,2,2,2,3,3,44,44,44,44,44,44,23,23,23,23]).mode, [44]);
});

Deno.test('median of [1,2,3] to be 2', () => {
  assertEquals(new StatisticalDataSeries([1,2,3]).median, 2);
});

Deno.test('median of [1,2,3,4] to be 2.5', () => {
  assertEquals(new StatisticalDataSeries([1,2,3,4]).median, 2.5);
});

Deno.test('median of [342,532,6666,323,5541,45,1111] to be 532', () => {
  assertEquals(new StatisticalDataSeries([342,532,6666,323,5541,45,1111]).median, 532);
});

Deno.test('median of [1,2,3] to be 2', () => {
  assertEquals(new StatisticalDataSeries([1,2,3]).median, 2);
});

Deno.test('sumOfSquaredDeviationsFromMean of [44,55,6,666,111] to be 305289.2', () => {
  assertEquals(new StatisticalDataSeries([44,55,6,666,111]).sumOfSquaredDeviationsFromMean, 305289.2);
});

Deno.test('sumOfSquaredDeviationsFromMean of [11,22,33,44,55] to be 1210', () => {
  assertEquals(new StatisticalDataSeries([11,22,33,44,55]).sumOfSquaredDeviationsFromMean, 1210);
});

Deno.test('sample variance of [44,55,6,666,111] to be 76322.3', () => {
  assertEquals(new StatisticalDataSeries([44,55,6,666,111]).sampleVariance, 76322.3);
});

Deno.test('sample variance of [11,22,33,44,55] to be 302.5', () => {
  assertEquals(new StatisticalDataSeries([11,22,33,44,55]).sampleVariance, 302.5);
});

Deno.test('population variance of [44,55,6,666,111] to be 61057.84', () => {
  assertAlmostEquals(new StatisticalDataSeries([44,55,6,666,111]).populationVariance, 61057.84);
});

Deno.test('population variance of [11,22,33,44,55] to be 242', () => {
  assertEquals(new StatisticalDataSeries([11,22,33,44,55]).populationVariance, 242);
});

Deno.test('sample standard deviation of [44,55,6,666,111] to be 276.264909', () => {
  assertAlmostEquals(new StatisticalDataSeries([44,55,6,666,111]).sampleStandardDeviation, 276.264909, 0.000001);
});

Deno.test('sample standard deviation of [11,22,33,44,55] to be 17.3925271', () => {
  assertAlmostEquals(new StatisticalDataSeries([11,22,33,44,55]).sampleStandardDeviation, 17.3925271);
});

Deno.test('population standard deviation of [44,55,6,666,111] to be 247.098847', () => {
  assertAlmostEquals(new StatisticalDataSeries([44,55,6,666,111]).populationStandardDeviation, 247.098847, 0.000001);
});

Deno.test('population standard deviation of [11,22,33,44,55] to be 15.5563492', () => {
  assertAlmostEquals(new StatisticalDataSeries([11,22,33,44,55]).populationStandardDeviation, 15.5563492, 0.000001);
});