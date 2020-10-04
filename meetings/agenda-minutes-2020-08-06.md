Aug 06, 2020

Attendees:

Ujjwal Sharma (USA)

Richard Gibson (RGN)

Philip Chimento (PFC)

Shane Carr (SFC)

Philipp Dunkel (PDL)

Justin Grant (JGT)

Agenda + Notes:

* [#703](https://github.com/tc39/proposal-temporal/issues/703) - What extended ISO string representation should be used when the time zone is an offset, not an IANA name? Should the offset be in brackets?

    * PDL: Can we agree that brackets are only for IANA names, and an absence of brackets means that it's an offset time zone?

    * SFC: JGT pointed out that that pattern leads to bug-prone code. That said, it's a circular argument, we have to compromise on one of these things.

    * PDL: I think splitting TimeZone into two classes would be bad. Second, bug-proneness to me is something that we should take into account when all else is equal.

    * USA: Does it mean 'prone to DST bugs' here, and therefore unexpected behaviour?

    * PDL: JGT is talking about round-trip bugs. If you pass a string through an external system that doesn't handle the bracket name, then you lose the DST. But that's life; if you throw away your data in an external system, then you lose something.

    * USA: We could output something that would throw. Furthermore, if we can confine the bracket name to LocalDateTime, then we can note that only that type can produce strings that have this problem.

    * SFC: Our philosophy that we decided on last week was "an event that happens / will happen in a particular place". Offset time zones aren't a real thing, so I would be fine with the changes to the data model.

    * PDL: Offset time zones are a real thing. They are used in maritime shipping, in international waters.

    * SFC: Another thing that JGT suggested was empty brackets.

    * PDL: I just don't buy the premise of the issue. I think if you get a string missing a bracket name from external data, that's a problem that we can't solve. Within Temporal you can't get a string without a bracket name that is intended to have one.

    * SFC: I can see the point that you have developers who find code on Stack Overflow, copy and paste it, and think they're done.

    * PDL: This is not that, though. To hit this error you would have to copy-paste some data from somewhere.

    * SFC: It's very common to have your data coming from some other source like SQL Server. I think it makes sense that if SQL Server is storing a time stamp, you would use Absolute to parse it.

    * PDL: I think if you get a timestamp from SQL Server with an offset and no bracket name, it's perfectly fine to put it in a LocalDateTime, and it works 100% of the time. The expectations of the programmer might not be right, but it's not incorrect.

    * USA: I do agree with PDL here, that if you put in a string without a bracket name, you should not expect DST behaviour from it.

    * JGT: I think there certainly are cases where people would do that, but we ought to have some way for programmers to opt in, whether it's blank brackets or something else.

    * PDL: I disagree. If your string is coming from Temporal, then all is well. If your string is coming from an external source, then I think it's not good for us to be in the business of helping people clean up their data. We should not prevent perfectly valid behaviour because we think that a lot of people will have bad data.

    * JGT: It's less about bad data than about not understanding the problem space well enough, so that they think they have good data, but they don't. We should alert them that they have to use an Absolute for that.

    * PDL: I disagree that an Absolute is always appropriate if a bracket name is missing.

    * JGT: What do you think the ratio is of cases where the type is appropriate versus where it's not, as in your maritime shipping example?

    * PDL: I think it's 100% correct, because if you've thrown away your time zone in an external system, then the error is somewhere else. We cannot presume what someone might have meant with data from an external system. I see this as the same as YYYY-DD-MM or something like that.

    * USA: I'm not sure what kind of system would do DST internally but then export strings with only an offset, anyway.

    * PDL: You might have a database with ISO string in one column, and time zone in another column.

    * JGT: To me it really depends on the percentage of developers who will correctly understand that the error is in their external data.

    * PDL: I really disagree, I think that trying to be smarter than external data is wrong in any case. Where I would agree is that if there's some common system out there, that gives you an Absolute string with a Z but does incorporate the IANA time zone somehow.

    * PFC: I think SFC is right that we cannot achieve all our objectives here. I agree with PDL's approach.

    * SFC: I think the worst thing that can happen with PDL's approach is that any DST math subsequently performed on strings from an external source is wrong. That's fairly minor. I have a slight preference for empty brackets, but if we decide not to mess with the IANA name then I think we will have to accept those bugs.

    * USA: I think the bugs will be rare because the prerequisite is using strings from an external source that does expect DST-awareness but not serialize it.

    * PDL: We are trying to get this bracket syntax to be more universally accepted, so another reason why I'm against the brackets is that no other user of that syntax does it.

    * JGT: Another possibility is to treat missing brackets as a conflict, so you have to specify in the disambiguation parameter that you prefer the offset.

    * PDL: I don't agree with that, missing brackets is correct in some cases. We should not treat something that's correct as a conflict.

    * JGT: To me the whole point of LocalDateTime is to do DST-safe math. We know that there are external systems that store strings without IANA names, so if they are read in, they will not be DST-aware. I think that people will understand the purpose of LocalDateTime and not understand that

    * PDL: We cannot cater to people who just throw strings into methods and hope they work.

    * PFC: If we can assume that maritime time zones are whole-hour, then we could use Etc/UTC+X as briefly discussed last week?

    * RGN: I don't think we can make that assumption.

    * JGT: Maybe .with and the math methods could throw if an IANA time zone wasn't specified?

    * SFC: This sounds a lot like the default calendar discussion. I'm saying that the calendar needs to be specified explicitly, otherwise it's error-prone, and JGT is saying that the IANA time zone needs to be specified explicitly, otherwise it's error-prone.

    * JGT: It comes down to what percentage of people are expecting one or the other thing.

    * PDL: I disagree with that. Requiring explicitly opting in to something that is already correct, breaks usability. That's the same problem we have with the default calendar.

    * USA: One place where this differs from the default calendar discussion is that here we would actually be penalizing people with a correct string if they had to opt in.

    * SFC: One other alternative; like with default calendar, I'm perfectly happy if there's some explicit intent in code, no matter how small, such as an extra option.

    * PDL: But the explicit intent is already communicated with their correct string.

    * USA: I would be open to reconsidering if we do find a system that expects DST awareness but does not serialize the IANA time zone name at all.

    * PDL: Many databases do have two columns for timestamp and time zone.

    * SFC: If we required explicit intent, then we could prevent people forgetting the second column.

    * PDL: That is not our mandate.

    * JGT: There's a wide variety of experience in the JavaScript world. Certainly people will make that mistake.

    * PDL: In practice the timestamp might be a string with a Z which would throw with LocalDateTime.

    * SFC: Does a string with a Z throw?

    * PDL: Yes, we decided it last week.

    * USA: Let's table this discussion and revisit it before Stage 3. Hopefully we can get more examples or feedback.

    * PDL: That sounds like a good compromise, but I honestly don't think we'll get much feedback on this.

    * SFC: It's unfortunate that we won't get much feedback either on this or on the default calendar. I do think that we should decide both issues in the same way: either in favour of ergonomics versus bug-free correctness.

    * PDL: I disagree. USA convinced me that there is a difference between these two. In the case of the default calendar it really is a choice between ergonomics and bug-proneness. Here, we would actually be requiring an explicit opt-in to use a string that is already correct. I do agree with the sentiment that we should be consistent in the philosophy we choose.

    * JGT: This is a relatively rare case so I don't think it matters that much to the overall success of Temporal. I don't think allowing a missing bracket is the right thing, but I don't think it's a disaster either, we just need to document the hell out of it.
