# Apr 23, 2020

## Attendees:

- Ujjwal Sharma (USA)
- Shane F Carr (SFC)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)

## Agenda:
### How did the NearForm podcast go?
Not out yet.

### [#428](https://github.com/tc39/proposal-temporal/issues/428), design of parsing methods
- Background: Kevin Gibbons recommends against allowing extraneous fields at all. PDL prefers ignoring extraneous fields and moving the splitting functionality into `Temporal.parse()`. Pro/Con summary at <https://github.com/tc39/proposal-temporal/blob/main/docs/parse-draft.md#pros-and-cons>
- SFC: Is it possible to have a string such as `2020-04-15T24:00:00`, parse out a Date and a Time, and get back a different DateTime than if you had parsed out a DateTime in the first place?
- RGN: 24:00 seems problematic in every proposal, and is the best practical argument I’ve heard for rejecting it.
- PFC: That's the case in proposal 3. In proposal 1 you get the same DateTime. In proposal 2 it doesn't happen because you can't parse a Date and Time out of that string.
- RGN: 24:00 is only valid in either end of a range (formally “time interval”) according to ISO 8601, not in a regular date and time representation.
- SFC: Is 24:01 allowed?
- RGN: No.
- SFC: Are proposal 1 and 3 the same except for 24:00?
- PFC: No, if you have an invalid ISO string such as `2020-99-99T10:15:30`, then that would throw in `Temporal.PlainTime.from()` in proposal 1, but the invalid date part would be chopped off in proposal 3.
- SFC: Why do we care about invalid ISO strings?
- PDL: They are so easily and commonly generated.
- SFC: But in proposal 3 we'd only be allowing out-of-range number values anyway, not gobbledygook.
- PDL: It's very common to generate invalid ISO strings by having the time zone data change on you.
- PFC: Specifically that case is taken into account by proposal 1 though, because you don't validate the time zone unless parsing Absolute.
- RGN: I like that parsing parts is identified as a use case, and having an interface to specifically do so also inclines me towards proposal 1.
- USA: in the ideal case you would have good data anyway. That proposal 1 separates out parsing parts is a good thing.
- SFC: Maybe not having to have `Temporal.parse()` is a good thing and we should go for proposal 3. Why make an exception for incorrect data?
- RGN: There are also cases where you have incorrect data and don't know it, like out-of-date tzdata.
- PDL: That's the case that I'm concerned about as well. Because you know people are not going to take changing tzdata into account, and assume the strings written out by Temporal will always be valid.
- USA: Agreed, `Temporal.parse()` is the escape hatch.
- PDL: I'd go even further and say that my default would be `Temporal.parse()` when parsing an Absolute, it's more failure-tolerant because I can make an explicit choice about what to do in the case of invalid data.
- USA: You can write code that is strict by default if you choose, instead of having an always-strict `from()` method. I don't favor the third option for that reason.
- PDL: I'm not opposed to having more than one way to do something.
- SFC: If we care about giving developers lots of tools for dealing with invalid data, then I can see why we need `Temporal.parse()`. It makes that use case easier than proposal 3.
- USA: Yes, agreed.
- SFC: If needed we can put even more facilities for invalid data in Temporal.parse().
- Consensus is to use `Temporal.parse()` for dealing with invalid strings, and go with proposal 1.

### [#294](https://github.com/tc39/proposal-temporal/issues/294), `idToCalendar`/`idToTimeZone`
- SFC: Where we were last week, we had considered that someone implementing a custom calendar could override `Temporal.{Calendar,TimeZone}.from()`. PFC noted that that method does more than converting IDs to objects, so I suggested making a separate method `fromId()`. That would take an ID and return a Calendar or TimeZone object respectively.
- RGN: What else does the `from()` method do?
- PFC: It returns the object if it's already a `Temporal.TimeZone` object, and converts the argument to a string otherwise.
- RGN: That doesn’t sound so bad. And if we do it, then it should come with a cookbook recipe anyway. There are other places where you have to do something like this when overriding.
- SFC: If you pass in a string such as `+01:00`, what happens?
- PFC: You get a fixed-offset time zone.
- SFC: It seems that putting the functionality in a clean string-only method would give us the most flexibility. Maybe we don't have to plan for that, but it seems cleaner. On the other hand, the `fromId()` method makes the API more muddy.
- RGN: That is the more prominent concern for me.
- PDL: Can we put an optional "resolver" argument into `from()` for ID strings?
- SFC: That's what I had originally proposed. We had eliminated it because it requires you to pass the resolver in for every call, and you could get inconsistencies if you forgot one. So it seemed like some global thing would be better, but that's untenable for SES.
- PDL: Overriding a function is just as bad for SES, though. They have to freeze objects.
- RGN: There's an SES call later today and I'll bring that up. SES wants to take advantage of that live-patching capability. They do it for `Date.now()` and they'll do it for `Temporal.now` if they don't cut Temporal out entirely. But you're right about the subsequent freezing. It'll be problematic if something in the sandbox wants to do this patching as well.
- PDL: Isn't the point of the whole override time zones feature that it happens in a sandbox?
- RGN: SES is actually going beyond virtualization. As soon as they freeze things, they are presenting a virtual environment that is more tightly constrained than just booting up the host. My opinion is that virtualization is worth upholding. The freeze-compatible virtualization might not be. I don't know if SES has documented that distinction and whether they intend to uphold it. What that means here is that there's a little bit of a loose thread, but I do support virtualization, so I'd expect a consumer to be able to replace a method and make use of the primordial that they're covering up.
- SFC: A question we can answer separately, is do we want a single resolver function override or a call-site-by-call-site override? We can choose to do both or only one.
- Action: RGN to talk to Mark and figure out the SES side of this.

### [#262](https://github.com/tc39/proposal-temporal/issues/262), calendar priority for `toLocaleString()`
### [#293](https://github.com/tc39/proposal-temporal/issues/293), calendar serialization in `toString()`
Everyone please take a look at these.
