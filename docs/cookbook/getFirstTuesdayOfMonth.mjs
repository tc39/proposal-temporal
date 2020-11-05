/**
 * Gets the first Tuesday of the month and returns its date
 *
 * @param {Temporal.PlainYearMonth} queriedMonth - YearMonth instance to query
 * @returns {Temporal.PlainDate} Temporal.PlainDate Instance which gives first tuesday
 */
function getFirstTuesday(queriedMonth) {
  // We first need to convert to a date
  const firstOfMonth = queriedMonth.toPlainDate({ day: 1 });

  // We have Monday = 1, Sunday = 7, and we want to add a positive number
  // smaller than 7 to get to the first Tuesday.
  // If we're already on a Tuesday (2) then we want to add 0.
  // So for the first of the month being a Monday through Sunday the additions are:
  //    1, 0, 6, 5, 4, 3, 2 which is given by that formula.
  // This lookup table makes this example easier to read, but you can also
  // calculate the answer: (7 + desiredWeekday - firstOfMonth.dayOfWeek) % 7
  return firstOfMonth.add({ days: [1, 0, 6, 5, 4, 3, 2][firstOfMonth.dayOfWeek - 1] });
}

const myMonth = Temporal.PlainYearMonth.from('2020-02');
const firstTuesdayOfMonth = getFirstTuesday(myMonth);
assert.equal(firstTuesdayOfMonth.toString(), '2020-02-04');
assert.equal(firstTuesdayOfMonth.dayOfWeek, 2);

// Similarly, to get the second Tuesday:
const secondWeek = myMonth.toPlainDate({ day: 8 });
const secondTuesday = secondWeek.add({ days: [1, 0, 6, 5, 4, 3, 2][secondWeek.dayOfWeek - 1] });
assert.equal(secondTuesday.day, firstTuesdayOfMonth.day + 7);

// And the last Tuesday:
const lastOfMonth = myMonth.toPlainDate({ day: myMonth.daysInMonth });
const lastTuesday = lastOfMonth.subtract({ days: [6, 0, 1, 2, 3, 4, 5][lastOfMonth.dayOfWeek - 1] });
assert.equal(lastTuesday.toString(), '2020-02-25');
assert.equal(lastTuesday.dayOfWeek, 2);
// or:
const lastTuesday2 = lastOfMonth.subtract({ days: (7 + lastOfMonth.dayOfWeek - 2) % 7 });
assert.equal(Temporal.PlainDate.compare(lastTuesday, lastTuesday2), 0);
