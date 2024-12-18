import { StatisticalDataSeries } from '../src/StatisticalDataSeries.ts';
import { expect, test } from '@jest/globals';

test('count of [1,2,3] to be 3', () => {
    expect(new StatisticalDataSeries([1,2,3]).count).toBe(3);
  });

test('sum of [1,2,3] to be 6', () => {
  expect(new StatisticalDataSeries([1,2,3], 'some name').sum).toBe(6);
});

test('mean of [1,2,3] to be 2', () => {
expect(new StatisticalDataSeries([1,2,3]).mean).toBe(2);
});

test('count of [4,5,9] to be 3', () => {
expect(new StatisticalDataSeries([4,5,9]).count).toBe(3);
});

test('min of [4,5,9] to be 4', () => {
expect(new StatisticalDataSeries([4,5,9]).min).toBe(4);
});

test('max of [4,5,9] to be 9', () => {
expect(new StatisticalDataSeries([4,5,9]).max).toBe(9);
});

test('sum of [4,5,9] to be 18', () => {
  expect(new StatisticalDataSeries([4,5,9]).sum).toBe(18);
});

test('mean of [4,5,9] to be 6', () => {
expect(new StatisticalDataSeries([4,5,9]).mean).toBe(6);
});

test('mode of [1,2,3] to be []', () => {
expect(new StatisticalDataSeries([1,2,3]).mode).toEqual([]);
});

test('mode of [1,2,2,3] to be [2]', () => {
expect(new StatisticalDataSeries([1,2,2,3]).mode).toEqual([2]);
});

test('mode of [1,2,2,3,3] to be [2,3]', () => {
expect(new StatisticalDataSeries([1,2,2,3,3]).mode).toEqual([2,3]);
});

test('mode of [1,1,1,2,244,2,3,3,44,44,44,44,44,44,23,23,23,23] to be 44', () => {
expect(new StatisticalDataSeries([1,1,1,2,2,2,3,3,44,44,44,44,44,44,23,23,23,23]).mode).toEqual([44]);
});

test('median of [1,2,3] to be 2', () => {
expect(new StatisticalDataSeries([1,2,3]).median).toBe(2);
});

test('median of [1,2,3,4] to be 2.5', () => {
expect(new StatisticalDataSeries([1,2,3,4]).median).toEqual(2.5);
});

test('median of [342,532,6666,323,5541,45,1111] to be 532', () => {
expect(new StatisticalDataSeries([342,532,6666,323,5541,45,1111]).median).toEqual(532);
});

test('median of [1,2,3] to be 2', () => {
expect(new StatisticalDataSeries([1,2,3]).median).toEqual(2);
});

test('sumOfSquaredDeviationsFromMean of [44,55,6,666,111] to be 305289.2', () => {
expect(new StatisticalDataSeries([44,55,6,666,111]).sumOfSquaredDeviationsFromMean).toEqual(305289.2);
});

test('sumOfSquaredDeviationsFromMean of [11,22,33,44,55] to be 1210', () => {
expect(new StatisticalDataSeries([11,22,33,44,55]).sumOfSquaredDeviationsFromMean).toEqual(1210);
});

test('sample variance of [44,55,6,666,111] to be 76322.3', () => {
expect(new StatisticalDataSeries([44,55,6,666,111]).sampleVariance).toEqual(76322.3);
});

test('sample variance of [11,22,33,44,55] to be 302.5', () => {
expect(new StatisticalDataSeries([11,22,33,44,55]).sampleVariance).toEqual(302.5);
});

test('population variance of [44,55,6,666,111] to be 61057.84', () => {
expect(new StatisticalDataSeries([44,55,6,666,111]).populationVariance).toBeCloseTo(61057.84);
});

test('population variance of [11,22,33,44,55] to be 242', () => {
expect(new StatisticalDataSeries([11,22,33,44,55]).populationVariance).toEqual(242);
});

test('sample standard deviation of [44,55,6,666,111] to be 276.264909', () => {
expect(new StatisticalDataSeries([44,55,6,666,111]).sampleStandardDeviation).toBeCloseTo(276.264909, 6);
});

test('sample standard deviation of [11,22,33,44,55] to be 17.3925271', () => {
expect(new StatisticalDataSeries([11,22,33,44,55]).sampleStandardDeviation).toBeCloseTo(17.3925271);
});

test('population standard deviation of [44,55,6,666,111] to be 247.098847', () => {
expect(new StatisticalDataSeries([44,55,6,666,111]).populationStandardDeviation).toBeCloseTo(247.098847, 6);
});

test('population standard deviation of [11,22,33,44,55] to be 15.5563492', () => {
expect(new StatisticalDataSeries([11,22,33,44,55]).populationStandardDeviation).toBeCloseTo(15.5563492, 6);
});