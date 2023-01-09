# March 3, 2022

## Attendees
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Ujjwal Sharma (USA)

## Agenda

### Planning for Stage 4
#### Prerequisites
- Iron out any remaining normative changes
- Implementations: two
- Test262
- Standardization of ISO 8601 extensions

#### Relevant schedules
- Plenaries in March, June, July, September, November
- ICU releases: freeze mid-August, ship September
- ICU4X releases every quarter, but Mozilla has it integrated and can pull in changes anytime
- IETF meetings in March, July, November

#### Discussion
- PFC: I'm investigating creating a timetable for going to Stage 4. Test262 is going well. I would expect to be presenting normative changes in March and June, and maybe in July depending on what implementations dig up in the meantime. Firefox has a full but rough implementation of Temporal, which is paused until we solve the normative issues. JSC has a partial implementation of Temporal.
- SFC: V8 has a large patch stack by FYT that is gradually being reviewed and landed. I'm not sure if the Firefox implementation includes the "interesting parts" yet of calendar calculations and formatting.
- RGN: Implementations reaching what Shane called the "interesting parts" would probably surface more bugs. If we have a tight feedback loop, it seems like it could be reasonable to move implementations along quickly.
- SFC: When we implement ECMA-402 proposals, we often have to fix bugs in ICU so we are somewhat tied to the ICU release cycle. We can have a bug open, and close it when ICU releases. This affects V8 and JSC. Mozilla hasn't decided yet whether to use ICU or ICU4X for Temporal. ICU4X has a stable API.
- USA: Does ICU4X have the constraint of not making breaking changes?
- SFC: It's not at 1.0 yet.
More on this in following weeks.

### IETF status
- Interim in December
- SEDATE in IETF 113 (21 March, Vienna)
```js
Temporal.ZonedDateTime
  .from('2022-03-21T13:00[Europe/Vienna]')
  .withTimeZone('America/Los_Angeles')
// => 2022-03-21T05:00:00-07:00[America/Los_Angeles]
```

#### ISO Liaison (ongoing, will ask for updates)
- USA: Pinged the chairs about this, waiting for an answer.

#### Offset and timezone: an error ([link](https://mailarchive.ietf.org/arch/msg/sedate/8AsY1vpqjwRK2-o77uBOvst8j2g/))
- JGT: My understanding is that there's not consensus on this? If the answer is "you can put a time zone or an offset but not both" that's really bad for us. If the answer is "the offset overrides the time zone" that's less bad. The best outcome is that it's up to the implementation to decide. Is that accurate?
- USA: I think the disagreement comes down to some people in IETF thinking about different environments where you don't have the options bag that we have in Temporal. Maybe we can specify a behaviour for what to do in that case, where the programmer has no control.
- JGT: The consensus on the IETF side should be that we can preserve the current behaviour of Temporal.
- USA: We can discuss this at the upcoming SEDATE in IETF 113.

SFC and JGT might attend if the time is not in the middle of the night. 

#### Floating and future times
- USA: Conclusion was reached that we don't need to be blocked on floating times.
- JGT: What was it again?
- USA: Date-time with a time zone and no offset. The calendar people want this, and we accept it in Temporal, but we don't emit it.
- JGT: What's the chance that a different format would be standardized eventually?
- USA: I'm fairly confident that this is a de-facto standard anyway and that either this format gets standardized, or nothing does.

#### The question re:"optional extra" ([link](https://mailarchive.ietf.org/arch/msg/sedate/c4LcppU5dXXqenyUef615tFxW2k/))
- USA: JGT replied to this thread with a position that I think everyone shares: not breaking compatibility with the Java syntax, but it's OK to namespace other things. This is still a discussion we need to settle but I'm confident we can do it this month.

#### Editorial issues like the calendar system
- USA: There are a few minor to-do items and a few PRs from my co-editor that I'm reviewing. I expect those will be done by the time of IETF 113.
- USA: I'm hoping that if the ISO liaison happens, we can go for publication in the IETF 113 meeting this month. If changes get added during the meeting, we can publish in between meetings with enough notice.

### ECMA 402 spec update ([#1928](https://github.com/tc39/proposal-temporal/issues/1928))
- USA: I saw the last change requests, hoping to get another patch in during the next week.
- JGT: Would love to wrap this up, it's close to the finish line.

### Big backlog of GitHub issues?
Some can be simply closed. Ecma-402 is the right location for some issues. Some are just waiting on execution. Some educational material. Plan to do a sweep through the backlog in 2 weeks. Prioritize “spec-text” issues? (currently 36 open issues)