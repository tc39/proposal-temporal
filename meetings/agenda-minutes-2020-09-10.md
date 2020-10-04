# Sept 10, 2020

Attendees:

Agenda:

* Brevity:

    * JGT: We should identify which patterns within Temporal are the least brief. I suggest getFields() and spreading, so we can look for ways in which to avoid spreading getFields(), like accepting strings in toDateTime (#747) and allowing { date, time } in fields bags.

* Brevity of converting legacy Date to Absolute

    * [https://github.com/tc39/proposal-temporal/issues/751](https://github.com/tc39/proposal-temporal/issues/751)

    * SFC: Method on the prototype of legacy Date?

    * SFC: Legacy Date carries an offset, so we should decide whether we want to have the time zone come from the environment. ([https://github.com/tc39/proposal-temporal/issues/515](https://github.com/tc39/proposal-temporal/issues/515)). I'll post a comment on #751

* Parsing user-supplied string formats

    * [https://github.com/tc39/proposal-temporal/issues/796](https://github.com/tc39/proposal-temporal/issues/796)

    * PFC: So far, we've considered this out of scope.

    * SFC: This is certainly a pain point. I ran into it myself. It's a bit weird that for this one thing people have to go into legacy Date.

    * RGN: The legacy Date parser is not specified. This feels like a follow up to me. This is an area of risk, and Temporal is already enormous.

    * PFC: My feeling is that if we release Temporal someone will split the parsing code out of Moment.js into a separate library before too long.

    * SFC: It's a few lines of code to write a simple regex.

    * RGN: MM/DD/YYYY is probably easy to parse using split('/'), the difficulty scales with the complexity of the format.

    * SFC: That would have worked for my use case. Maybe the resolution is to add cookbook examples for common formats.

    * RGN: It's not clear what Temporal would actually give you besides yet another microsyntax.

    * JGT: There are also ten or so predefined formats, like HTTP header dates, that would encompass probably 90% of the use cases for this.

    * PFC: We should list out those formats and see which ones we do support with our ISO string parser, and which ones we don't.

    * RGN: The two I'm aware of that we don't support are the HTTP and the SMTP ones.

    * SFC: I'm concerned about adding another microsyntax, but if we can find an appropriate microsyntax that's specified, we could just implement that algorithm.

    * JGT: I believe date-fns just redid theirs according to a specified standard.

    * Conclusion: Examine the problem further on the thread.

* Brevity of from vs constructors

    * SFC: I've been one of the biggest advocates of constructors being low-level things that we don't want people to use, but maybe if we're getting all this feedback we should bite the bullet and change it.

    * PFC: I'm fine with fleshing out a proposal for this.

    * SFC: On the other hand, we would not allow omitting the 'new' keyword like the person in the thread is suggesting, so it wouldn't be that much shorter. Only one character.

    * PFC: That wouldn't make it past the committee.

    * JGT: I suspect the issue is actually more with discoverability than brevity.

    * Conclusion: We should examine if there is If we come up with a better idea, we could do this, but not a high priority.

* Brevity of get current timestamp

    * JGT: Seems like a 'may address'. Seems popular and not contrary to the goals of Temporal

    * PFC: My only concern is do we want to be encouraging getting it as a Number rather than an Absolute?

    * SFC: We should think about the pattern that we want here. The OP gave a link to a GItHub search showing 2.9M code results for Date.now, but a quick look at a few of them shows that in many cases they ought to be strongly typed. Maybe one thing we could do is change all occurrences of milliseconds to ms throughout the API.

    * JGT: I like the idea of a Temporal.now.something function, e.g. Temporal.now.seconds(), Temporal.now.milliseconds(), Temporal.now.nanoseconds(). It's useful for timing.

    * RGN: Most of those cases are probably wrong, because Temporal.now and Date.now are not monotonic clocks. You would probably want to use performance.now.

    * Conclusion: Needs additional discussion.

* Interval type

    * JGT: This is something that many libraries have, but it would be a huge addition.

    * SFC: It's something that has come up a few times with Temporal.Duration, making it an interval instead. That could solve some of the problems we've had with Duration, but I think if we wanted to add this or change Temporal.Duration we'd have to delay Stage 3 by several months.

* atEndOfX/atStartOfX

    * JGT: What's the "end" of an hour? The last nanosecond or the last second?

    * We've addressed one of these concerns, but probably the other one we won't address.
