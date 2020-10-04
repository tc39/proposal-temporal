July 16, 2020

Attendees:

* Ujjwal Sharma (USA)

* Philip Chimento (PFC)

* Shane Carr (SFC)

* Richard Gibson (RGN)

* Justin Grant (JGT)

* Philipp Dunkel (PDL)

* Daniel Ehrenerg (DE)

Agenda:

* Timeline for proposal (context of NodeConf.eu workshop) (PDL)

    * At NodeConf.eu workshop in November we have a chance to present Temporal as part of a session introducing all of the proposals that Bloomberg is involved in.

    * PDL: Do we want to use that for feedback gathering?

    * PFC: I would be very surprised if we were still in the feedback gathering stage at that point.

    * DE: Agreed, I would like to have frozen the spec and be in the 2-month review period.

    * SFC: We can still change anything that's really broken at that point.

    * DE: I hope that anything really broken would have been noticed by then.

    * SFC: We can also be open to renaming things still.

    * PDL: OK, let me know closer to the time if there is anything particular we want out of these sessions.

* [#759](https://github.com/tc39/proposal-temporal/issues/759) – Proposed Temporal changes required to adopt RFC 5545 (iCalendar) meaning of durations

    * JGT: In this issue I tried to flesh out a full proposal for what we had tentative agreement on last week. The goal as RGN put it was to pave the cowpath of RFC 5545, the idea was to make it impossible to use a Duration that didn't have RFC 5545 semantics in a Temporal API. I think PDL disagreed with some of it.

    * PDL: I think we are still on the same page.

    * JGT: We already restrict Absolute math to days or smaller, we would have to change that to hours or smaller.

    * PDL: Alternatively, we can eliminate the restriction altogether if you say that the time zone of an Absolute is UTC without any daylight saving. This reminds me of a conversation with MPT and MAJ almost two years ago. One of the things that was important to MPT was to clearly distinguish between objects that are attached to a specific point in time, and objects that are abstract concepts. Therefore, because types like DateTime are zoneless, so it doesn't matter whether the durations are RFC 5545 or not. On the other hand, Absolute does refer to a specific point in time, but it is locked to UTC, so there is no DST. The only situation when the RFC 5545 semantics need to apply is when you want to do the arithmetic in the context of a time zone, in other words in the LocalDateTime object that we are proposing.

    * JGT: What I was mostly concerned about is people who have an Absolute or DateTime, and a Duration gotten from one type that they apply to the other type. The idea was that it would be impossible to apply the wrong kind of duration either by restricting the duration units that may apply to each type, or by defining one kind of duration.

    * PDL: I'm arguing for the second of those options, just with certain defaults.

    * JGT: I'm not sure that programmers will understand these concepts, and I want to prevent bugs that will show up only twice a year.

    * PDL: The reason I'm in favour of RFC 5545 is that they ignore DST altogether. They are making life easier.

    * SFC: I'm a bit more aligned with JGT here although I understand PDL's point. I agree that DateTime shouldn't have an implicit time zone. A null time zone means that anything where a time zone could apply, should be disallowed on DateTime.

    * PDL: But DateTimes don't have DST changes.

    * SFC: And therefore the math should be disallowed.

    * PDL: What I'm saying is not that it should be disallowed, but that it just doesn't apply. It doesn't prevent you from doing math.

    * SFC: What happens if you have a DateTime at 1 AM on a spring-forward day, and you add 10 hours to it?

    * PDL: There is no spring-forward day in DateTime because it has no time zone. So you get 11 AM. The result would be different in LocalDateTime, which is why I think we should have LocalDateTime.

    * JGT: So, a DateTime has a null time zone, and SFC is saying that therefore any math that might consult a time zone should be disallowed, and PDL is saying that they should continue to have different meanings depending on what type you're doing the math on.

    * PDL: Think of it like performing a floating-point addition vs. an integer addition. You may add the same number and get a different result due to the nature of the type.

    * JGT: It sounds like we don't have agreement on points 1 and 2 from the issue.

    * PDL: You have to be explicit in choosing the realm that you want to operate on, by converting to the correct type.

    * JGT: Whereas you could also choose the realm by choosing the kind of duration via an option.

    * PDL: Choosing the type has precedent in programming, for example floating point vs. integer vs. decimal arithmetic.

    * JGT: I disagree a bit, because you would use e.g. Math.floor.

    * JGT: Let's see if we can make progress on 3 and 5.

    * PFC: I think the bugs mentioned before would be somewhat mitigated if we had LocalDateTime because it would be the encouraged type for most of these operations and it is the least ambiguous as to how arithmetic should apply.

    * SFC: I agree; I think we need to see these issues together.

    * JGT: So, number 3, negative durations; do we want negative durations?

    * PFC: At this point, seeing how many people have been surprised by the lack of them, yes.

    * USA: There were some concerns about how to notate them since they aren't present in ISO 8601.

    * JGT: RFC 5545 specifies a notation, a leading minus sign.

    * USA: I don't think we should get rid of months and years, which is also expressed in RFC 5545.

    * JGT: I agree, but the notation for the sign makes sense.

    * USA: I'd have a concern about having something in between the two standards.

    * PDL: If we have negative durations they need to be internally consistent. So we should not be able to have +1 year, –2 months.

    * JGT: I agree, that is ugly and not needed. My proposal is to only make the change that the duration as a whole may be negative.

    * PDL: I agree and additionally think we should remove balancing.

    * USA: Tentatively, but I do have concerns: we should not remove subtraction and comparison, and I'm not sure about having a hybrid format between ISO 8601 and RFC 5545.

* [#716](https://github.com/tc39/proposal-temporal/issues/716) Should Absolute.from() have an option to resolve offset vs. timezone conflicts?

    * JGT: This is about resolving the conflicts for when the time zone offset and name don't agree in a string, since time zone legislation changes may render previously valid strings invalid.

    * PDL: The comment I made was, don't we already have that disambiguation in the format itself? We only get such a string if we pass an IANA time zone to Absolute.toString(), and I would only do that if the IANA identifier were the more important part of the string.

    * PFC: I agree, but would that still apply to LocalDateTime?

    * JGT: We know that these conflicts will happen, we know that they will be uncommon. The thing is that previously ambiguous strings can become unambiguous.

    * PDL: It would only yield a different result if the offset no longer exists in the time zone.

    * JGT: I agree with PFC that it's less clear cut in the case of LocalDateTime.

    * PDL: I think with LocalDateTime it's still not ambiguous. With LocalDateTime you can set an IANA time zone, in which case you still think the IANA identifier is more important, or you can set an offset time zone if you don't. That's why I'm OK with not having parse().

    * USA: We don't have parse() in this draft though. I do think it's useful for salvaging these kinds of almost-valid ISO strings.

    * PDL: I would actually see this as an issue for the TimeZone parse method. Do you want an offset time zone or IANA time zone from a given string?

    * JGT: Is this conflict the main use case for Temporal.parse?

    * PDL: Yes.

    * RGN: You wouldn't be able to detect when you have that issue?

    * PDL: You would because Absolute.from would throw.

    * USA: Because of the precedent of ignoring irrelevant parts, I think it makes less sense to have TimeZone.from parse a whole Absolute string.

    * PDL: I'm talking about doing this in TimeZone parsing rather than having a Temporal.parse

    * USA: But the offset is extraneous in this case.

    * PDL: Not if the date/time exists twice in that time zone.

    * JGT: So the proposal is that TimeZone.from would get this disambiguation option?

    * (Discussion about how we resolved #428)

    * RGN: There are many gradations of, do we throw or not? What about a 60 in the seconds part? What about a 99? What about junk followed by an IANA name in brackets?

    * PDL: I think we need to be syntactically correct but not semantically correct.

    * RGN: That constrains it, but doesn't nail it down entirely. Is 99:99 syntactially correct?

    * PDL: No, the syntax incorporates numerical bounds.

    * USA: That's how the polyfill works now.

    * PDL: That differentiation happens in the polyfill because it happens in two different parts of code; the regex and assembling the components into something meaningful.

    * JGT: And what about LocalDateTime.from. Should it also get a disambiguation option?

    * PDL: I would say it should be the same as Absolute. If you have a string with an IANA name then you have already decided that that is the more important information.

    * JGT: Not sure I agree. You could have gotten that string from a server somewhere.

    * PDL: There is still a decision to be made, and one that needs to be made in the context of your application. So I think it should throw just as in Absolute, but I'm not opposed to having a disambiguation option so that you can say "In my app this is always more important"

    * USA: I agree, and I think that reject should be the default.

    * RGN: I think there's a split in user expectations that depends on the problem the user is attempting to solve. In some cases the end-user would want to be made aware of the issue. In other cases, which I suspect is more common, the IANA time zone name should win out.

    * JGT: I had another use case in mind where the consequence of getting an Absolute using a different offset than it was saved with, is that a scheduled task might not be run.

    * PDL: That's why I think that throwing should be the default, because we can't agree on what otherwise the default should be.

    * Consensus is that this issue only appears when IANA time zone name and offset disagree, and the default should be to throw in that case. We should have a disambiguation option in all places where this might occur so that you can specify what to do instead of throwing.

* LocalDateTime

    * PDL: We removed LocalDateTime before, because it wasn't clear how to do math on it. Now that JGT has introduced RFC 5545 the math is unambiguous. Do we have consensus that this is something that we want to do, and we should spend time specifying it?

    * Yes.

    * RGN: Do we additionally have consensus regarding an Absolute type independent of LocalDateTime?

    * JGT: I think Absolute is necessary for all sorts of applications.

    * PDL: I would go further and specify that Absolute should be explicitly defined to have UTC and ISO calendar.

    * JGT: That is quite a departure from how we do Absolute. I think you should open a separate issue for that.

    * PDL: I additionally think we should remove the time zone parameter from Absolute.toString. If you want to serialize it with a time zone then you should convert to LocalDateTime.

    * JGT: Does that render the previously discussed issue moot?

    * RGN: I don't think so. We want the ability to serialize any type from a completely specified string, so the problem still occurs.
