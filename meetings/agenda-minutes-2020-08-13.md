Aug 13, 2020

Attendees:

Ujjwal Sharma (USA)

Richard Gibson (RGN)

Justin Grant (JGT)

Philipp Dunkel (PDL)

Philip Chimento (PFC)

Shane Carr (SFC)

Agenda + Notes:

* Next marathon design meeting-- when?

    * 28th of August, same time as before.

* [#810](https://github.com/tc39/proposal-temporal/issues/810) Conflict between docs and polyfill for cloning using TimeZone.from and Calendar.from

    * USA: The original intention behind passing an object to from() was to turn a property bag into an instance. Do we need to accept objects in this method at all?

    * PFC: The use case I can think of is if you have a function that accepts either a time zone object or a string. Temporal.TimeZone.from(argument)

    * USA: You can do typeof(argument)

    * RGN: How do you create a custom time zone and what does from() do now?

    * PFC: Either inherit from Temporal.TimeZone or create a plain object with the correct methods. Currently, from() returns the same object if it's passed an object, which is inconsistent with the other Temporal from methods.

    * JGT: Agreed, that's why I opened this issue.

    * PDL: We want to have the ability for Temporal.TimeZone.from and Temporal.Calendar.from to take objects as well as strings.

    * PFC: We do have to solve this problem for custom calendars as well, which have demonstrated use cases. I think the use cases for custom time zones are more tenuous.

    * RGN: I disagree. Testing, virtualization, corrections.

    * PDL: I think the way to solve this would be to create a proxy that wraps the time zone methods of the passed-in object, and only passes through the time zone methods.

    * RGN: And deny access to it.

    * PDL: Is there any precedence to this?

    * RGN: There's Array.from.

    * PDL: That's maybe not quite the same. The new object returned from Array.from doesn't keep a reference to the argument that's passed in, and we do have to.

    * RGN: It does keep a reference to the values of the array. The other parallel that I see is Promise.resolve, which will return the same promise if a promise is passed in, but constructs a new promise if a thenable is passed in.

    * PDL: That keeps a reference to the thenable?

    * RGN: Maybe; in any case to its then method.

    * PFC: Could we remove the plain-object custom time zones and calendars? If they were inherited we could construct a new one.

    * PDL: That would not work if the methods operated on non-inherited data.

    * RGN: I don't think it's problematic to hold a reference.

    * PDL: How sure are we that this would pass the committee?

    * JGT: What if you create a Temporal.PlainDate with a custom calendar, and pass it across a realm boundary?

    * PDL: That's a side channel communications ability.

    * RGN: It's no difference than if you pass a function with closed-over internal state. You have then intentionally created that channel. The SES concern is different. This is trivial to do within the source text, so it makes sense to expose it in the standard library.

    * JGT: What is the concern then?

    * RGN: A property accessor that lets you manipulate an internal slot, for example. Proxy doesn't let you intercept internal slot accesses, but they do let you intercept property gets. Then there are also legacy things provided by the language, that are problematic for authors to do, such as the legacy RegExp flags that update data on the global RegExp object. SES patches these out. In this case, objects from different realms are going to flow through code paths that you yourself created, but they won't affect the Temporal.Calendar object itself, for example.

    * JGT: Is the general idea of this the ability to optimize?

    * RGN: The idea is that the implementation invokes system calls on the host. You can't do that yourself from JavaScript.

    * JGT: It sounds like custom calendars are not a problem, then. What happens if I create a Temporal.Calendar object and then I stick my own properties and methods on that object and create a Temporal.PlainDate with it. Is it a problem that we retain that object?

    * RGN: I don't think so, because it doesn't affect the Temporal.Calendar builtin. All the activities are local to that object.

    * USA: This sounds good but do we need it in the first place? I still don't see a use case for converting a plain object into another object.

    * RGN: I find that persuasive, actually. You already have all the methods, there's no benefit to converting an object that already has the methods, into an actual Temporal.TimeZone instance.

    * JGT: Is it a problem to store the passed-in object in a Temporal object's internal slot?

    * RGN: I don't believe so.

    * JGT: And is there any concern about the cross-realm communication channel that this could set up?

    * USA: It doesn't create any channels that are not previously allowed by the JS language.

    * JGT: PFC mentioned an ergonomic benefit of ensuring that a function argument is a TimeZone.

    * PFC: It's a small benefit, I don't think it outweighs the inconsistency or complexity of the alternatives.

    * Consensus is that Temporal.Calendar.from and Temporal.TimeZone.from should no longer accept objects.

* [#607](https://github.com/tc39/proposal-temporal/issues/607) - Suggestion: split option name into disambiguation (for DST) vs. overflow (for ranges)

    * USA: The proposal is to have two option names, because in LocalDateTime you may need to pass both at once.

    * PFC: I'm in favour of this.

    * JGT: +1

    * RGN: It may be good to align the names with iCal.

    * JGT: So you are in favour of splitting the options, and secondarily renaming the options to correspond with iCal if there is anything to correspond with? That sounds like it should be out of scope for this.

    * RGN: Agreed.

    * SFC: There's overflow of a calendar field, and overflow of the representable range for the type. Do we need to take that into account?

    * PFC: For all the other types except Duration, we always throw if the value is outside the representable range, and we had planned on doing the same for Duration. But making this change would make it natural to add a differently-named option in the future.

    * PDL: I don't have strong feelings. Disambiguation is always an edge case.

* [#724](https://github.com/tc39/proposal-temporal/issues/724) - Should parameterless toFoo & getFoo methods be property getters instead?

    * PFC: It seems there was generally agreement not to do this, does anyone want to argue in favour of property getters?

    * USA: JHD pointed out some problems with property getters. I would be fine with changing the getEpochNanoseconds to a property getter.

    * PDL: The reason we had property getters was to enable passing Temporal objects in as property bags. We didn't do this with Absolute.getEpochNanoseconds because that use case didn't apply, and you have multiple representations of the same information. getEpochSeconds and getEpochNanoseconds give you the same piece of information.

    * JGT: It sounds like the consensus is 'no'. I'll make the alternative case for completeness, but I'm fine with that. The reason is that brevity is important for a certain class of developers, and we're talking about data that doesn't change, so it could be a getter. We have had a certain amount of feedback on this topic, so there is a constituency for this.

    * SFC: I agree with keeping the status quo. My mental model is that a type conversion should be a function, and a property access should be a getter. Although under the hood that's not always the case (LocalDateTime.toAbsolute), it acts like a type conversion.

    * PDL: My mental model goes a bit farther than property access; if it feels like a constituent part of the object then it should be a getter.

    * USA: Thanks for proposing it though!
