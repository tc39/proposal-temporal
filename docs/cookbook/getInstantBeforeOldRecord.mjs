/**
 * Retrieve an exact time at which to give advance notice of a record that
 * is potentially about to be broken.
 *
 * @param {Temporal.Instant} start - Starting exact time of the event
 * @param {Temporal.Duration} previousRecord - Existing record to be broken
 * @param {Temporal.Duration} noticeWindow - Advance notice time
 * @returns {Temporal.Instant} Exact time at which to give advance notice of
 *  breaking the record
 */
function getInstantBeforeOldRecord(start, previousRecord, noticeWindow) {
  return start.add(previousRecord).subtract(noticeWindow);
}

// Start of the men's 10000 meters at the Rio de Janeiro 2016 Olympic Games
const raceStart = Temporal.Instant.from('2016-08-13T21:27-03:00[America/Sao_Paulo]');
// Kenenisa Bekele's world record set in 2005
const record = Temporal.Duration.from({ minutes: 26, seconds: 17, milliseconds: 530 });
const noticeWindow = Temporal.Duration.from({ minutes: 1 });
// Time to send a "hurry up, can you finish the race in 1 minute?" push
// notification to all the runners
const reminderAt = getInstantBeforeOldRecord(raceStart, record, noticeWindow);

assert.equal(reminderAt.toString(), '2016-08-14T00:52:17.53Z');
