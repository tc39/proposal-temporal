/**
 * getSortedLocalDateTimes will sort an array of zoneless Temporal.PlainDateTime instances by the
 * corresponding local date and time of day (e.g., for building a conference schedule).
 *
 *
 * @param {Temporal.PlainDateTime[]} dateTimes - This is a DateTime instance
 * @param {boolean} [reverse=false] - Return in reversed order
 * @returns {Temporal.PlainDateTime[]} the array from dateTimes, sorted
 */
function getSortedLocalDateTimes(dateTimes, reverse = false) {
  let newDateTimes = Array.from(dateTimes).sort(Temporal.PlainDateTime.compare);

  return reverse ? newDateTimes.reverse() : newDateTimes;
}

// Sorting some conferences without timezones for example vue.js Amsterdam 2020
let a = Temporal.PlainDateTime.from({
  year: 2020,
  day: 20,
  month: 2,
  hour: 8,
  minute: 45
}); // Introduction
let b = Temporal.PlainDateTime.from({
  year: 2020,
  day: 21,
  month: 2,
  hour: 13,
  minute: 10
}); // Lunch Break
let c = Temporal.PlainDateTime.from({
  year: 2020,
  day: 20,
  month: 2,
  hour: 15,
  minute: 30
}); // Coffee Break
const results = getSortedLocalDateTimes([a, b, c]);
assert.deepEqual(
  results.map((x) => x.toString()),
  ['2020-02-20T08:45:00', '2020-02-20T15:30:00', '2020-02-21T13:10:00']
);
