import assert from 'assert';

/**
 * Gets the first Tuesday of the month and returns its date
 *
 * @param {Temporal.YearMonth} queriedMonth YearMonth instance to query
 * @returns {Temporal.Date} Temporal.Date Instance which gives first tuesday
 */
function getFirstTuesday(queriedMonth) {
  // We first need to convert to a date
  let date = Temporal.Date.from({
    year: queriedMonth.year,
    month: queriedMonth.month,
    day: 1
  });

  // We have Monday = 1, Sunday = 7, and we want to add a positive number smaller than 7 to get to the first Tuesday.
  // If we're already on a Tuesday (2) then we want to add 0.
  // So for the first of the month being a Monday through Sunday the additions are:
  //    1, 0, 6, 5, 4, 3, 2 which is given by that formula.
  date = date.plus({ days: [1, 0, 6, 5, 4, 3, 2][date.dayOfWeek - 1] });

  return date;
}

const myMonth = Temporal.YearMonth.from('2020-02');
const firstTuesdayOfMonth = getFirstTuesday(myMonth);
assert.equal(firstTuesdayOfMonth.toString(), '2020-02-04');
assert.equal(firstTuesdayOfMonth.dayOfWeek, 2);
