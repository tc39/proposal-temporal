# Oct 29, 2020

## Attendees:
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Shane F Carr (SFC)
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)

## Agenda:

### Calendar.prototype.fields feedback [#1054](https://github.com/tc39/proposal-temporal/issues/1054)
- PFC: There isn't room for this to change at this point, without delaying the proposal. We can discuss the reasons why it is the way it is.
- JGT: Do calendars ever remove fields, or do they only add them?
- SFC: I think that's a possibility that we shouldn't close the door on without a good reason.
- JGT: It seems to open the door for bugs in custom calendars. Client code may not anticipate fields being removed on the return value of getFields(), e.g.
- USA: I have thought about this regarding time calendars, I think it's likely that people using such calendars would be using subclasses of Date and Time.
- JGT: Is there a reason why types might have different fields in between different invocations of fields()?
- PFC: No, but it does need to be dynamic because you may ask for fields from non-builtin types.
- SFC: Agreed, this method looks weird at first glance but it has the right amount of flexibility.
- JGT: But what about different results for the same type?
- SFC: Let's say no. That's not possible with the status quo, nor any of the proposals. I see how the proposal is clear about what it's doing, but I think returning data is not necessarily easier. For example, the Japanese calendar's method is quite easy.

### `TimeZone.from()` and ISO `Z` strings [#1075](https://github.com/tc39/proposal-temporal/issues/1075)
- USA: I generally believe that accepting `Z` is a good idea, but based on the fact that we just ignore everything else this seems like a good idea.
- SFC: `Z` is equivalent to `+00:00`.
- PFC: I've been thinking of `Z` as equivalent to `+00:00[UTC]`.
- JGT: `Z` is not a time zone, it's a particular point on the timeline. It doesn't give you access to fields like months and years.
- RGN: In ISO 8601 it's not a time zone, but it is an offset. We should not treat it specially relative to other offsets.
- JGT: If I were to parse a string with an offset using `TimeZone.from()`, what would happen?
- PFC: You'd get an offset time zone. I feel that `Z` is consistent with how we treat other offsets.
- JGT: Is this consistent with how we require an explicit decision about calendars?
- SFC: The user is doing something explicit here, so I think this is consistent with that.
- PDL: I think `ZonedDateTime.toString()` should render the string with `+00:00[UTC]`.
- PFC: It does.
- PDL: We can therefore argue that `Z` is only for instants, but thinking about interoperability, this is what happens when you have data in the `Z` format and you parse it in with Temporal. You'll render it out with `ZonedDateTime.toString()`, and get the explicit bracketed zone, but this code is an upgrade path, not a bug. I think `ZonedDateTime.from()` shouldn't accept this, but in `TimeZone.from()` it is an explicit choice from the programmer.
- JGT: The case that brought this up came up in ZonedDateTime, where you have a string with a `Z` and a bracketed time zone. Java does support this format.
- PFC: It seems kind of iffy, because where are you going to get that string?
- PDL: I'd say it should be supported.
- RGN: It needs the same treatment as `1976-11-18T14:23:30.123+00:00[Asia/Tokyo]`.
- USA: This came up in a conversation I had with SFC, and it aligns with how we deal with calendars.

### Convenience comparison methods: lessThan(), greaterThan(), lessEquals(), greaterEquals() [#1074](https://github.com/tc39/proposal-temporal/issues/1074)
- JGT: After RGN convinced us about since() and until(), I've been writing a lot of sample code and found that they are so much easier to use. The same goes for compare().
- PFC: We did decide earlier not to have these since they can easily show up in userland. Given that it's a finished pull request I'm not opposed to having them if they can be merged right away.
- USA: My preference is to have them as a follow up.
- PDL: I think we shouldn't be making this part of this proposal at this point in time.
- SFC: We're not really shooting for a small API surface.
- PDL: I don't like the names as they are right now. I have no issue with us returning to that, and spending time to define them properly, but I don't think they belong in the proposal at this point.
- USA: The committee is considering operator overloading, and it would be unfortunate if this became a relic, so I don't think we should add it now. This might even come up later in the review in which case we could revisit this.
- RGN: I see the value but I'm not sure about the priority. It's probably worth brainstorming on the names, continuing to talk about it, but not considering it a blocker.
- SFC: Agreed, it wouldn't be a disruptive change if we were to add this during Stage 3 review.
- We'll keep considering this but it won't be considered a blocker.

### withCalendar / withTimeZone [#906](https://github.com/tc39/proposal-temporal/issues/906)
- First: what is the actual proposal here?  Behavior needs to be clarified. At least 3 different understandings of what was decided. See comment above for code examples of each.
- Second: is that proposed behavior OK?
- PFC: I propose option D as fallback, the most conservative option, if we don't reach a decision here.
- PDL: I don't think that's a good choice even for an interim solution. It succeeds in a developer's environment where the time zone and calendar are always the same, but fails in the real world.
- SFC: If ISO and Gregorian were compatible, then I'd see that, but we have decided that they are not, so the most likely mismatch that you'll have is ISO and a human calendar, not two human calendars. That mismatch will happen even in the developer's environment. You won't have two human calendars in the same piece of code.
- PDL: You can get two human calendars from two different data sources.
- JGT: I've just added an option E where it always throws if timeZone and calendar are present.
- PDL: That removes the utility of with().
- SFC: It wouldn't be unreasonable to adopt the same "if calendar doesn't match, then throw" behaviour that we have elsewhere. I think it's unlikely that you'll get two different human calendars, so even if the exception is data-driven I think that's OK.
- PDL: I think that calendars and time zones are the same kind of thing and should be treated equally. In that case, the consequence is that passing them to with() should result in the same thing. Passing different human time zones to with() is much more likely than passing different human calendars to with(). But the chances of it happening in the programmer's environment are smaller than it happening in the real world.
- SFC: I can make the same argument with human time zones and UTC.
- PDL: A different argument, is that we're aiming for treating property bags the same as Temporal objects. What about ignoring the `timeZone` and `calendar` properties altogether, as if they were nonsense properties?
- JGT: The challenge there is that if you put in another Temporal object, you're guaranteed to have the wrong result without an exception.
- PDL: That's a programmer error.
- JGT: The point you made earlier, that it would be surprising to have the developer write code that throws an exception in the real world; this is the same, only you get garbage data instead of an exception, which is worse.
- PDL and JGT to come up with a proposal after this meeting, and present it in the overflow slot tomorrow.

### An example of a simple calendar with irregular time units
- USA: I've almost finished the implementation of time calendars, and the last test I could use some help with is an example of a custom calendar with irregular time units.
- PDL: The ones I came up with way back when, are e.g. 1 second is 1 ISO second, 1 minute is 10 seconds, 1 hour is 10 minutes, etc.
- PFC: It doesn't have to be self-consistent, it just has to exercise the methods that we have.
- JGT: Is there an npm package with a calendar where the length of a day is different? And we could just use it?
- PDL: That would be a good example but it's more complicated to write a test out of. There isn't such an npm package that I'm aware of.
