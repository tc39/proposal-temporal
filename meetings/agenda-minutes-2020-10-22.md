# Oct 22, 2020

## Attendees: 
- Justin Grant (JGT)
- Ujjwal Sharma (USA)
- Shane F Carr (SFC)
- Philip Chimento (PFC)
- Daniel Ehrenberg (DE)
- Richard Gibson (RGN)
- Jason Williams (JWS)
- Philipp Dunkel (PDL)

## Agenda: 

### [NodeConf Temporal workshop](https://www.nodeconfremote.com/) help 
Friday 6th November - 14:00Z
- JWS: One thing that will be part of this workshop is that people get to play around with the polyfills for Temporal and Record/Tuple. We shouldn't see it as a review, but we can get feedback by observing people using these polyfills. There will be a task assigned that participants solve with Temporal. We aren't sure how many to expect but it's maybe about 70 people. We'd like help answering questions about Temporal, e.g. in the chat.

### 3-minutes about removing subtract() in favour of `add(d.negated())`
- PDL: Wanted to get the temperature of the room about this.
- JGT: It's helpful for me to have the subtract() method, because it sends a message that I intended something to be reversed.
- PDL: Do we want to implement it under the hood like that?
- PFC: That's how it's done in Duration.subtract.

### After ZonedDateTime lands, what should `Instant.prototype.toLocaleString` output? [#1025](https://github.com/tc39/proposal-temporal/issues/1025)
- JGT: We saw some feedback where some users of Instant were confused between whether Instant has a time zone. The confusion is that you can call toLocaleString() on Instant and get something that has a time zone. Users are not sure where the time zone comes from. This is the same with legacy Date.
- SFC: I replied to the issue.
	1) Instants have a localized format, and the format tends to have the user's time zone, e.g. in log output.
	2) It's confusing to convert to a ZonedDateTime only for the purpose of displaying it.
	3) I think the confusion in that issue was not confusion over Instant, but confusion over how to format a PlainDateTime with a time zone.
- PDL: I second SFC.
- PFC: I'm convinced especially by reason 1.
- SFC: It would be good to document this.
- USA: JGT already made a PR to document this.

### Consider removing Instant-DateTime conversion methods [#1026](https://github.com/tc39/proposal-temporal/issues/1026)
- SFC: We've discussed this before and can just close it if people don't want to revisit it, but I opened this as a result of the confusion that prompted [#1025](https://github.com/tc39/proposal-temporal/issues/1025). If we were to have people go through ZonedDateTime first, instead of Instant to PlainDateTime, then the point at which the time zone is thrown away would be much clearer.
- PDL: My understanding from last time, while I agree about the transformational purity, it's a brevity argument. If I'm not dealing in ZonedDateTime then why should I be forced to use ZonedDateTime?
- USA: If I want to convert PlainDateTime X to PlainDateTime Y in another time zone, I'd go from PlainDateTime to Instant and back, which would be four operations in this case.
- JGT: It's only two operations in any case, because you can go from PlainDateTime to ZonedDateTime and back. I don't think there's a lot of value in having these direct conversions.
- JWS: I agree with that. A common operation I could see people doing is converting to Instant and getting the epochSeconds, can you do that on ZonedDateTime?
- JGT: Yes.
- JWS: Are there any examples where you'd have to do three jumps?
- PDL: If what you want to store is Instant and you have PlainDateTime, or vice versa.
- SFC: In some of the earlier calendar proposals, I had made a proposal where the calendar is used once and thrown away. We ended up with the model we have now because people objected to that, and I see this as analogous. I think this is the only place in Temporal where we throw this argument away. This would be good to get developer feedback on, but we're a bit late for that. And I think it's a lot easier to add methods later than remove methods.
- PDL: I have a preference for keeping it but I don't feel strongly.
- USA: Same.
- SFC: If there is still opportunity for feedback from developers, we should highlight this.
- Consensus: Remove these methods.

### withCalendar / withTimeZone [#906](https://github.com/tc39/proposal-temporal/issues/906)
- JGT: I think that the decision we made of not persisting timeZone and calendar in with could lead to confusion and I'd rather always throw if the time zones or calendars don't agree.
- PDL: I don't buy the ambiguity part. The conclusion we reached was that we'd use the time zone exclusively to interpret the input. If you want to set the output time zone, there is a separate method for that.
- PFC: I think you two are using the word "ambiguity" in different ways. It's literally not ambiguous because we decided on the behaviour, but JGT means that it's not obvious what will happen in the with() method unless you read the documentation.
- PDL: I don't buy that either. If with() doesn't work like this, then it's extremely unergonomic to replicate that behaviour in userland.
- JGT: I actually think it would be beneficial to require that behaviour to be explicit.
- PFC: I'm not sure about this, this is another place where we'd take a TimeZone argument and throw it away; but I think ultimately I'm convinced by PDL's argument that this would be difficult and error-prone to do in userland.
- PDL: Use case: In a calendaring app, I would want to change the time of a meeting with a ZonedTime. But going one step further, I would say that we need to treat calendars and time zones the same here.
- JGT: I have some concerns about the calendar one, but I'd like to resolve the time zone one first and then see what we can do about the calendar one. In your example, what is the data model of what you put in and what is the data model of what you get out?
- PDL: I start with this meeting being organized in Pacific Daylight Time, and so the event is a ZonedDateTime. I want to set the time because the latest I can do is 5 PM my time, with a ZonedTime. So I want a ZonedDateTime still in the original time zone as the output.
- JGT: The previous 5 PM or the next 5 PM?
- PDL: That's always an ambiguity regardless.
- JGT: That's my point. The simplicity of with() is that you pass fields in, and you set those fields, and nothing else. If I pass in a ZonedTime as an argument to with(), then I might change the date as well.
- PDL: I disagree with that. The way you describe with(), it still works like that. You don't flip over by passing in a ZonedDateTime.
- SFC: What exactly is the algorithm to modify the receiving ZonedDateTime in that case?
- PDL: You convert it to a PlainDateTime in the receiving time zone. So the date never changes.
- SFC: I proposed a different algorithm which may be the source of this confusion. I need to think this through some more.
- JGT: If you _don't_ change the date, then the result may be unexpected. If a meeting is pushed back 3 hours, then I may end up with a local time of 1:00 in the morning. I think this introduces a lot of confusion in a rare case.
- SFC: I'm also not convinced that PDL's algorithm works near DST transitions.
- We'll revisit this tomorrow in the overflow meeting.

### Add a note about precision to SystemInstant [#997](https://github.com/tc39/proposal-temporal/issues/997)
- USA: We have a pull request by MS2, does the wording sound fine to everyone?
- RGN: I think this is fine. Although there has been some disagreement about this in plenary, I think that ES hosts are not required to have a clock, and I don't want Temporal to change that requirement. "Implementation-dependent" is the basic method that we want to get across here.

### Rollup issue about custom time zones [#1037](https://github.com/tc39/proposal-temporal/issues/1037)
- JGT: What is the data type of the timeZone property on ZonedDateTime? TimeZone or TimeZoneProtocol? What do you do if (missing) ???
- DE: If you implement a protocol poorly, then it will throw somewhere down the line.
- PDL: Some of the methods are optional.
- DE: I think it makes sense if TimeZone.from is a constructor for the built-in time zone, as Jordan was suggesting in the issue tracker. We don't wrap custom iterators in built-in iterators. You can either supply a custom object or a subclass of the built-in iterator. So I think that TimeZone.from should construct a built-in TimeZone if given a string, and otherwise assume that it's a time zone protocol object. The price of having a protocol is that everything can always fail, everywhere, and that's why I was opposed to it in the first place. I can't think of a way to paper over that, other than making it a data-based protocol rather than a function-based one.
- JGT: There are two issues. One is that the protocol may be implemented incorrectly, the other is that you can't count on the optional methods being present.
- PFC: You have to do e.g. .`Temporal.TimeZone.prototype.getInstantFor.call(timeZoneProtocol, ...)` and TypeScript will enforce that.
- RGN: Whether it is appropriate for these to be optional or not, depends on what the operations specified inside Temporal would do.
- JGT: The optional operations aren't needed by Temporal, but they are expected by other users, e.g. library writers who aren't using TypeScript.
- DE: This is just how JavaScript works.
- RGN: There is a weak pattern that has emerged, that if the built-in implementations of these operations exist, then you should subclass, so that the defaults are present in the prototype.
- PDL: `getNextTransition` and `getPreviousTransition` might just not be available for a particular custom time zone.
- RGN: So there is no internal use of `getNextTransition` within Temporal.
- PDL: Correct, it's just something that built-in time zones have as an extra. If you require them, then you're making it hard, or impossible, for someone to implement them.
- RGN: What we're talking about here is not relevant to ECMA-262. If there is no internal use of `getNextTransition`, then it does not appear in the TimeZone protocol. It's irrelevant to ECMA-262 whether these methods are defined in TypeScript.
- JGT: How do we prevent ???
- DE: There are two options: either you don't have custom time zones, or you accept that things can fail everywhere.
- PFC: You can also say that custom time zones can only subclass the built-in time zone.
- DE: When subclassing you could still delete methods, or replace them with a Number.
- JGT: The question for me is should the value of the timeZone property be a TimeZone or a TimeZoneProtocol? Can we wrap a TimeZoneProtocol in a TimeZone so that the optional methods are available?
- PDL: There is no other option than TimeZoneProtocol. You cannot assume all the data for getNextTransition and getPreviousTransition are available.
- USA: That would be the case for a TAI timezone.
- DE: The choices are that we have a protocol with this craziness, or that we don't have a protocol. I argued against protocols for exactly this reliability reason, but the tradeoff is that you can't implement TAI in that case.
- JGT: What do I do if I'm a library author?
- PDL: You either document that your library takes a TimeZone and not a TimeZoneProtocol, or you take a TimeZoneProtocol and deal with the case where the methods are not present.
- DE: (missing) ???
- PDL: (missing) ???
- DE: Are there any cases where you don't have the data for transitions?
- PDL: I could build a time zone that gets its data via the network.
- DE: It's a synchronous protocol.
- JGT: Why isn't the name a required part of the protocol?
- PFC: It is required. But you provide it via toString() and not via the .id property.
- JGT: Then why have the property?
- RGN: I think the protocol should not include both. If the internal operations call toString(), then that is part of the protocol.
- JGT: What am I missing?
- PDL: You're approaching this from a TypeScript point of view. What we should have done is not add the optional methods into the protocol in the TypeScript bindings file, and make the value of the property everywhere a TimeZoneProtocol.
- (some discussion about protocols that went too fast for me to note down, below notes are summaries)
- PFC: The onus is currently on the custom time zone author. You don't get custom time zones from anywhere else than your own code. So for all practical purposes, you _can_ call getOffsetStringFor on the timeZone property of a ZonedDateTime, unless you personally have screwed it up by including a custom time zone that doesn't implement that method. If you make a custom time zone, but you also want to call getOffsetStringFor, or use a library that does so, then you deal with the consequences.
- JGT: We should therefore mark the type of that property as Temporal.TimeZone in the TypeScript bindings.
- PDL: No, that's not correct. The type of that property should be TimeZoneProtocol.
- PFC: Technically it's a TimeZoneProtocol but as RGN pointed out, the TypeScript bindings are irrelevant to the proposal we are making to TC39. Either we give it the type Temporal.TimeZone, or give it the type TimeZoneProtocol and require you to do `as Temporal.TimeZone` to explicitly signify that you are making the choice. I don't have enough TypeScript experience to say which it should be.
- JGT and PDL to hash out separately how the TypeScript bindings should do this.
