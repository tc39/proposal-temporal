# Oct 1–2, 2020

## Attendees

- Ujjwal Sharma (USA)
- Jase Williams (JWS)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)
- Matt Johnson-Pint (MJP)
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)

## Agenda:

* Call for volunteers in the Temporal/Records & Tuples workshop in Nodeconf Remote, probably 5 November

* How did Plenary go?

    * USA: Well. People seemed positive about Temporal. Jordan brought up the need for review time, but I think we have adequately addressed that. I talked about some major changes such as LocalDateTime. It seems the committee has mostly split into two camps, one that is willing to leave all the design decisions to the champions group, and a few other people who don't want to review the design decisions piecemeal, but want to review the whole design of the proposal at once, like Jordan.

    * JWS: What is the timeline now?

    * USA: We intend to be ready for review in October, which leaves more than two months for review until the January meeting.

* Are we on schedule?

    * PFC: We have a GitHub milestone of design decisions, which was very short at the time of the plenary, but longer now: [https://github.com/tc39/proposal-temporal/milestone/5](https://github.com/tc39/proposal-temporal/milestone/5) So we do have to get through all of these today.

    * USA: We're on track for mid-October.

    * JGT: Jordan mentioned that he wasn't going to use the polyfill.

    * USA: As editor of 262 Jordan's really good at editing spec text, so it's fine if he concentrates on that.

    * JWS: What happens after mid-October?

    * PFC: They asked us to announce very clearly when the materials were ready for review, so we send an email to the whole committee.

* Improve documentation of DateTime ([#948](https://github.com/tc39/proposal-temporal/issues/948))

    * JGT: Any other major use cases for this?

    * MJP: Countries with one time zone and no DST, the mental model matches DateTime.

* [https://github.com/tc39/proposal-temporal/issues/329](https://github.com/tc39/proposal-temporal/issues/329)

    * Action for PDL this week.

* [https://github.com/tc39/proposal-temporal/issues/703](https://github.com/tc39/proposal-temporal/issues/703)

    * PDL: The idea would be that you specify which components you want in an options bag. If you specify the options bag, then only the components you have specified are output.

    * MJP: In general we'd prefer to use positive forms in the options bags, saying what you want rather than what you don't want.

    * SFC: I think the default should be to show all the information.

    * PDL: Indeed, if you don't specify the options bag, then the default is to show all the information.

    * JGT: Is there a concern about opting-in to outputting the calendar?

    * SFC: One twist relative to how this works in Intl.DateTimeFormat; there, if you request hours and minutes, it will also include AM/PM because you need that in order to correctly display the requested information.

    * MJP: That makes sense, there should be a set of defaults, and when you specify options you have to take into consideration how it changes the default.

    * SFC: The new model for DateTimeFormat is `dateStyle: 'long', year: false`, so you can get a starting set of fields and remove the ones you don't want. Based on the feedback we've had, it's more common to start from a long list and remove fields, than start from a short list and add them. I wouldn't follow the additive model just for the sake of following it.

    * PDL: It's not just for the sake of following it. Because we have a good default, and I'd expect this feature is very rare, it seems like a good model for specifying what you want in your ISO string.

    * SFC: What use cases are we talking about exactly? If you want to omit the time zone, you can convert to DateTime, etc.

    * PDL: It's if you want the time zone but not the offset.

    * SFC: If that's the only use case, then we should support just that use case.

    * PDL: It's not the only one, just the most common one.

    * SFC: We're not building a full formatting API for ISO strings. There's nothing that stops people from calling getISOFields() and interpolating the fields manually. This is a really uncommon use case.

    * PDL: If you ask me, it's fine to only output one kind of ISO string. But we have received feedback about these use cases, and it makes a difference because some other systems couldn't read the string that we would output by default.

    * JGT: The idea is also to be future proof if we later decide to output ordinal or week dates. The idea of dateStyle from which we can subtract fields seems to fit that model very well.

    * Action for JGT to write up this proposal in the issue.

* [https://github.com/tc39/proposal-temporal/issues/702](https://github.com/tc39/proposal-temporal/issues/702)

    * JGT: A characteristic of DateTime arithmetic is that it's always reversible. I don't think we can make the same guarantee with LocalDateTime because of DST. Is that okay?

    * PDL: Yes, given that the arithmetic is well-defined according to the calendar spec people. We should do the same thing as them, for interoperability.

    * Move the issue to Stage 3 milestone.

* [What should be the long-term name of `LocalDateTime` ?](https://github.com/tc39/proposal-temporal/issues/707)

    * Discussion about locking the thread

    * Discussion about process for making the decision

    * Action for JGT, to resummarize, and write up the options that meet certain criteria.

    * MJP: There were suggestions in the thread to change the API design to match the naming, e.g. to remove one of the types. I think those suggestions are out.

    * We'll talk about JGT's summarized options tomorrow and either make a call or gather feedback on a shortlist.

    * SFC: I got three criteria from this morning's TC39 research call: 1. Think about what can help experienced users and new users. 2. Other programming languages matter. 3. Unique names are better for searchability.

* [https://github.com/tc39/proposal-temporal/issues/703](https://github.com/tc39/proposal-temporal/issues/703) (continued)

    * JGT has proposed a scheme for options in the issue.

    * PDL: I think this proposal, with SFC's suggestions, is the closest we'll get to a good solution.

    * JGT: Is it weird that 'false' would have different behaviour than 'undefined'?

    * SFC: I don't find that weird. In NumberFormat v3 it ended up that way because the booleans were implemented first. If we want to stick with a string enumeration then that would be okay too. If we adopt this precedent here then we'd use it elsewhere in other emerging proposals.

    * USA: I think it would be slightly nicer if we had 'hide', and 'false' was a synonym for it.

    * SFC: I can bring the idea of 'false' as a value up in 402 to make sure that it will have wider adoption outside of Temporal.

    * JGT: timeZoneOffsetString or timeZoneOffset?

    * PDL: offset seems fine.

    * PFC: String should be implicit, since this is the toString method.

    * JGT: fractionalSecondDigits values other than 0, 3, 6, 9?

    * SFC: In toLocaleString it can be 0, 1, 2, 3, and Temporal should extend it to 4 through 9.

    * PDL: They should truncate.

    * PFC: Currently toString only outputs 0, 3, 6, or 9 digits.

    * PDL: That was a choice that I made, but I made it arbitrarily. If we wanted, the 'auto' option could still keep that behaviour, and even drop the seconds as it currently does.

    * USA: What if text units, like 'milliseconds' etc., round, but digits truncate?

    * PDL: I would appreciate that.

    * SFC: Double-check what fractionalSecondDigits do in ECMA-402, and be consistent with that. Then we can do the opposite for the string option.

    * (fractionalSecondDigits seems to truncate)

    * JGT: Any other options?

    * PDL: No, those are fine for V2, but I like that this proposal allows for such expansion.

    * PDL: Does 'auto' always display seconds?

    * PFC: +1 to always displaying seconds.

    * JGT: Is 'nearest' the rounding mode?

    * PDL: +1

    * Consensus.

* [What should be the long-term name of `LocalDateTime` ?](https://github.com/tc39/proposal-temporal/issues/707) (continued)

    * PDL: I wrote down 3 principles to choose from and JGT added 2 more. My conclusion is that we shouldn't have any naming advantage from prefixless DateTime. JGT believes that LocalDateTime should be DateTime, and I believe that DateTime should be DateTime. Given that, I think we should have a prefix on both. I propose ZonedDateTime and NaiveDateTime. NaiveDateTime has had objections due to inclusivity, and although I don't see the objection I'm not the best posed to make that call. I suggest we have a twitter poll between NaiveDateTime and PlainDateTime, and explicitly call out the inclusivity concern.

    * SFC: I'd like to add Civil as a third choice to the poll.

    * USA: I find brevity more important for Date and Time. I don't think e.g. CivilDateTime implies that we must rename those. Then you'd have things like Instant.toCivilDateTime().toCivilTime().

    * PDL: In the context of converting one Civil type to another we could leave out the prefix.

    * JGT: The justification for adding prefixes to DateTime, Date, and Time as a whole is that they are importantly and closely related. I agree with that principle, but I don't agree with the conclusion. The only things that are so closely related are the two DateTime types.

    * PDL: They are in the same class buckets.

    * USA: The two toFooDateTime methods need to be named with prefixes, but I agree with PDL that the trio of DateTime, Date, Time are closely related.

    * We have consensus on ZonedDateTime.

    * PDL: Do we have consensus on picking one prefix from Civil, Naive, or Plain, and prefixing DateTime, Time, and Date with them?

    * JGT: I don't see how the consistency argument outweighs the brevity argument.

    * PDL: For me, clarity outweighs brevity every time.

    * SFC: Do we have consensus on both DateTime types having a prefix?

    * USA: I don't like it but there is an overwhelming majority to have prefixes on both. I would like to rename all three types, and shorten the conversion methods when you are in the civil realm.

    * JGT: I don't agree with having conversion methods that are called the same thing but convert to different types.

    * PDL: That's not the case. Instant has toZonedDateTime and toNaiveDateTime, NaiveDateTime has toDate, toTime, and toZonedDateTime, NaiveDate has toDateTime, and NaiveTime has toDateTime.

    * (Discussion about renaming conversion methods)

    * JGT: ???

    * PDL: The NaiveDateTime should have a conversion method toDate, which doesn't need a prefix because you're in the same realm. ZonedDateTime should not have a cross-realm toDate method.

    * JGT: I think the perspective of realms is irrelevant to most developers. The two most similar types are ZonedDateTime and NaiveDateTime.

    * SFC: I disagree, I think they are the most distantly related Temporal types.

    * JGT: That's because you know the API. Coming to Temporal, they look almost exactly the same, with almost all the same methods and fields.

    * USA: But you expect the same methods to do different things.

    * PDL: Do we have consensus on the types sharing a common prefix, and can discuss the conversion methods later?

    * JGT: It doesn't make sense to me for them to have a common prefix. The two DateTime types can be ambiguous, but Date and Time are not.

    * PFC: +1.

    * SFC: 1) The two DateTime types are in different realms but do similar things, while Date and Time are in the same realm but do different things, so it makes sense for them to share a prefix. 2) It's always been a paper cut that we have a type named Date, we've worked around it by consistently referring to Temporal.PlainDate and legacy Date, but a prefix would be better.

    * PDL: A third argument is that it ought to be possible to have a ZonedDate or a ZonedTime.

    * JGT: If we wanted to be Java and add classes for every possible permutation, then I'd agree with that.

    * SFC: I'm not suggesting we add it now, but I could see it being useful as a follow-up proposal.

    * PFC: I'm actually convinced by the ZonedDate and ZonedTime argument.

    * JGT: What would a ZonedTime be without a date?

    * SFC: We're sort of brushing that under the rug here, but it would make sense with an offset time zone, not so much with a named time zone.

    * PDL: For example, we have a TC39 meeting in Tokyo, starting at 10:00, but we haven't picked a date yet.

    * RGN: What problem would that help you solve that you couldn't solve with just Time? I agree it's a concept, but I don't see a benefit.

    * PDL: I'm not arguing to add it to Temporal, just that it's a valid concept. I'd write it in user code.

    * JGT: What's the justification for not renaming YearMonth and MonthDay?

    * PFC: They are not ambiguous, ZonedYearMonth and ZonedMonthDay are not valid concepts.

    * SFC: I'm OK with those types being less powerful, they also don't have withCalendar, for example.

    * JGT: What's the backup plan if the reviewers don't like the prefixes?

    * PDL: The reviewers haven't had problems with prefixes, it's feedback-givers.

    * SFC: Feedback-givers have had problems with brevity, not with prefixes specifically. The feedback on the twitter poll was overwhelmingly that both types should have prefixes. Looking through the cookbook examples, it's unusual to cross realms.

    * JGT: It seems common to go from NaiveDate to ZonedDateTime, which is cross-realm. I don't think the concept of realms will be noticed by most novice developers. They'll see there are two DateTime types, and pick one to use.

    * USA: That's exactly what we're trying to avoid, where it's not clear which realm Date and Time belong to.

    * PDL: If these types all have the prefixes, then we make it harder for novice developers to ignore the distinction between realms.

    * JGT: If we go with that approach, how do we prevent users with the common use case of having a NaiveDate to a ZonedDateTime, from accidentally using NaiveDateTime instead? There's an implicit assumption that NaiveDateTime is closer so that's the type they would want to use.

    * PDL: I don't agree that that implicit assumption exists.

    * SFC: One possible alternative is making the unzoned type DateAndTime, that could let us get around the prefix issue?

    * PDL: I'm with JGT on that, DateAndTime doesn't eliminate the likelihood of choosing that by default when it's the wrong thing. It's a distinction that may not be apparent to non-native English speakers.

    * JGT: Asking a question from earlier, what's our backup plan if TC39 reviewers don't like the prefixes? Jordan has said that he doesn't.

    * USA: Then we explain to them why we believe that the prefixes are better than other options.

    * PDL: Jordan has said on this thread that he likes ZonedDateTime/DateTime, and that CivilDate etc would be confusing, but we have good reasons.

    * JGT: If we do prefix all three, although I like NaiveDateTime a lot, I don't like NaiveDate and NaiveTime.

    * (More discussion on which prefix to use)

    * JGT: There was another name Floating that came up, could that be a fourth option?

    * SFC: I could live with Floating or Abstract, which was also suggested by the community.

    * PDL: I would veto Abstract since it implies that you have to inherit from it, but let's put Floating in the poll.

    * SFC: Floating is long, it's 8 characters while all the others are 5. But I like the mental model behind it.

    * (Discussion on which options to put on the Twitter poll)

    * SFC: Naive is Eurocentric design as well, because it's not naive in China or India to ignore the time zone.

    * Consensus on a twitter poll with Plain, Naive, Civil, and Floating.

    * JGT: As for conversion methods, I feel strongly that we continue the pattern that we have now.

    * PDL: I'm happy with that, I only suggested the shorter version to address the brevity argument.

    * Consensus on keeping the current pattern for conversion methods.

    * JGT: How about the brevity argument? How are we going to address those concerns?

    * PFC: I propose that we take a look at the diff of the cookbook examples when we implement this, to see how bad it really is, and maybe open an issue to hear feedback.

    * PDL: Disagree on opening an issue. We just need to make the call.

    * PFC: I agree, but feedback is not binding. If I were doing it over again I'd not invite feedback on the issue tracker, but open a separate website for it such as uservoice. But we are doing this, and I think it's fine to allow replies.

    * Consensus:

        * ZonedDateTime

        * (prefix)DateTime, (prefix)Date, (prefix)Time

        * (prefix) to be determined by twitter poll between Plain, Naive, Civil, Floating.

        * Conversion methods follow the current pattern.

* [Conversions to/from LocalDateTime and what that implies about the mental models that Temporal supports](https://github.com/tc39/proposal-temporal/issues/887)

    * PFC: What is actually the open question on this one?

    * JGT: We can close it.

* [https://github.com/tc39/proposal-temporal/issues/935](https://github.com/tc39/proposal-temporal/issues/935)

    * PDL: No.

    * RGN: Why such a strong negative?

    * PDL: Usually by default you want the string. It's not like you're doing maths with the offset. You get the string in order to store it.

    * RGN: You jumped into the time zone class, but I'm talking about ZonedDateTime, where you would want to have it as a Duration. If it's not a Duration then we have a convenience method that's not very convenient, in which case it should be deleted.

    * PDL: I agree with deleting it.

    * JGT: What is exactly to be deleted?

    * RGN: ZonedDateTime and other types that aren't TimeZone don't expose the time zone offset as a number.

    * JGT: I made it a number originally because it would be unambiguous in e.g. ZonedDateTime.with(). What would you do with "+02" for example?

    * PDL: That should be allowed.

    * RGN: What was motivating this was that the raw nanosecond numbers are not convenient, so Duration might be more convenient. But if we remove the API then the problem is solved as well.

* [https://github.com/tc39/proposal-temporal/issues/938](https://github.com/tc39/proposal-temporal/issues/938)

* [https://github.com/tc39/proposal-temporal/issues/935](https://github.com/tc39/proposal-temporal/issues/935) (re-review)
