/**
 * Gets the first Tuesday of the month and returns its date
 *
 * @param {Temporal.YearMonth} queriedMonth - YearMonth instance to query
 * @returns {Temporal.Date} Temporal.Date Instance which gives first tuesday
 */
function getFirstTuesday(queriedMonth) {
  // We first need to convert to a date
  const firstOfMonth = queriedMonth.withDay(1);

  // We have Monday = 1, Sunday = 7, and we want to add a positive number
  // smaller than 7 to get to the first Tuesday.
  // If we're already on a Tuesday (2) then we want to add 0.
  // So for the first of the month being a Monday through Sunday the additions are:
  //    1, 0, 6, 5, 4, 3, 2 which is given by that formula.
  // This lookup table makes this example easier to read, but you can also
  // calculate the answer: (7 + desiredWeekday - firstOfMonth.dayOfWeek) % 7
  return firstOfMonth.plus({ days: [1, 0, 6, 5, 4, 3, 2][firstOfMonth.dayOfWeek - 1] });
}

const myMonth = Temporal.YearMonth.from('2020-02');
const firstTuesdayOfMonth = getFirstTuesday(myMonth);
assert.equal(firstTuesdayOfMonth.toString(), '2020-02-04');
assert.equal(firstTuesdayOfMonth.dayOfWeek, 2);
