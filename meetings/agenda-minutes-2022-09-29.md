# September 29, 2022

## Attendees
- Daniel Ehrenberg (DE)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)

## Agenda

### Frozen built-in calendars ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
Discuss PDL/DE's new proposal for this.
- DE: I think frozen objects is going to cause problems and I have a counterproposal. Use strings internally for built-in calendars.
- RGN: On the face, seems fine. Would the calendar getter return the string?
- DE: The calendar accessors would disappear, to get the calendar you would use `Temporal.Calendar.from(plainDate)`. The optimizations described at the beginning of the thread are awkward for implementors.
- RGN: I'd like to put aside any discussion of optimizations if we're talking about observable behaviour.
- DE: Happy to discuss it second, but optimizations are why I'm proposing this.
- RGN: `Temporal.Calendar.from('gregory')` always returns the same value or a new value?
- DE: A unique value every time, as in tip of tree. The difference is that if you create a PlainDate via `Temporal.Now.plainDateISO()`, for example, the internal slot will contain a string.
- RGN: So every time I do `Temporal.Calendar.from(string)` I'll get a new instance which will never compare equal to each other. There is no privileged calendar instance, but there are privileged calendar identifiers. And if I do `Temporal.Calendar.from(plainDate)`, the same behaviour holds? I'll get a new instance regardless of whether that `plainDate` has been used before?
- DE: Yes. But if you constructed your PlainDate with a custom calendar, you'll get the same instance each time. If it's a built-in calendar, you'll get a new one each time.
- RGN: A little bit weird, but workable.
- PDL: Basically if you pass in an object to `Temporal.Calendar.from()`, you get that object. If you pass in a string, you get a new object. This is the status quo. It would be extended to calendar-carrying objects.
- DE: A variation would be to keep the calendar accessor, but have it return either the string or the object.
- RGN: Before we discuss variations, I'd like to understand the original proposal. Every [[Calendar]] internal slot contains either a string, or an instance. If it's an instance, it maintains its identity. If it's a string, it doesn't. The string is privileged, I can't come up with my own string.
- PDL: If we had a getter, I don't think it should have a variable return type.
- RGN: If I wanted to instantiate a built-in calendar, make some modifications to it, and construct a PlainDate with it, that would work?
- PDL: Yes, it would maintain its identity.
- RGN: Privileging strings that identify built-in calendars seems OK.
- PFC: This would go for time zones as well.
- PDL: This is why I'm OK not having the accessor. The only reason I can see for the accessor is to determine calendar similarity. Is there a way that avoids constructing calendars that answers the question "do these two objects have the same calendar"?
- RGN: That would be fulfilled by a getter returning string-or-instance.
- PDL: Is it too rigid to say that getters shouldn't have multiple return types?
- RGN: It's an emergent property.
- PFC: There is a use case for answering the question whether two objects have the same calendar. Taking the Duration difference between two dates, for example, requires them to have the same calendar. Internally we check if the ToString of the [[Calendar]] slot is the same. In userland you could do `Temporal.Calendar.from(...).toString()`.
- PDL: That requires an allocation.
- PDL: If we do this I would avoid using the ToString. Internally compare strings if they are both strings, and compare identity if they are objects.
- DE: That sounds reasonable.
- PFC: I'm not sure I agree with that. It means if you construct two PlainDates each with `Temporal.Calendar.from('gregory')`, they have distinct instances, and you can't do operations on them.
- DE: I see how that would break.
- PFC: Keeping the ToString semantics wouldn't be worse than the status quo.
- RGN: What would be the problem with having the getter return the contents of the internal slot? What code are you imagining that would be a problem?
- PDL: Custom calendar as a polyfill until a standard calendar comes along.
- DE: I'm not convinced by this hazard case.
- RGN: Where do you think the hazard lies?
- PDL: Calendar is being standardized in some browser. I test if it's present and if not I inject my polyfill. Now, on running code, the result of your getter changes to an instance, where it would be a string if the browser supported it natively.
- RGN: If you have polyfilled it correctly, the getter should return a string for your custom calendar. I don't think the interface should be design to minimize the negative consequences of incomplete polyfills.
- DE: If people have to make such sweeping changes to polyfill custom calendars, then we didn't design our API correctly.
- PFC: You have to make sweeping changes if you are polyfilling a built-in calendar that's not yet supported in a browser. You don't have to if it's just a custom calendar.
- RGN: We shouldn't care about ease of polyfilling a built-in calendar.
- DE: Agreed.
- RGN: Then are there any other hazards of the getter returning a string-or-instance?
- PDL: I don't like it, but I don't have one right now. I do think we should then switch to comparing calendars by identity.
- RGN: That's what I wanted in the first place.
- PFC: I don't like that for the reason I gave earlier - having two PlainDate instances that don't interoperate with one another. I'd find that confusing for developers learning Temporal.
- PDL: We should avoid use of Calendar.from in our documentation and cookbook. Don't use Calendar objects if you can use strings.
- PFC: I agree that using strings is better. But people learning a complicated API will probably end up with these objects anyway, that are 'poisoned' with no obvious way of seeing it. I'm thinking of Stack Overflow questions like "I have two PlainDates which are both `2022-09-29[u-ca=gregory]`, why do they throw 'can't compare dates with gregory and gregory calendars' when I do `until()` on them?"
- RGN: The obvious way to tell is `a.calendar === b.calendar`.
- DE: I don't think that's obvious. Let's treat this change of comparison semantics as orthogonal to the proposal of using strings for built-in calendars internally. We should open a different issue for changing the semantics.

**Conclusions:**
- DE to write the proposal on issue [#1808](https://github.com/tc39/proposal-temporal/issues/1808), with a calendar accessor that returns string-or-instance, keeping calendar equality semantics the same.
- If we want to change calendar equality semantics, discuss on a new issue.
