# Jan 21, 2021

## Attendees
- Manish Goregaokar (MG)
- Shane F Carr (SFC)
- Cam Tenny (CJT)
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Daniel Ehrenberg (DE)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)

## Agenda

### `Calendar.mergeFields()` to solve the problem of `with(monthCode)` [#1307](https://github.com/tc39/proposal-temporal/issues/1307)
- SFC: First, `PlainDate.with()` calls `mergeFields()` and then `dateWithFields()`?
- PFC: Yes, and first `fields()`.
- SFC: Validation happens before or after `mergeFields()`?
- PFC: The Temporal core validation happens before all of that, and the calendar-specific validation happens in `dateWithFields()`.
- SFC: Wouldn't the validation happen after `fields()` so you know which fields you need to implement? First call `fields()`, copy them from the input object into the filtered object while validating the types, then `mergeFields()`, then `dateFromFields()`.
- CJT: That is how it currently works.
- JGT: There's no separate second validation that needs to be done.

### JHD's objection to plain object calendars [#1294](https://github.com/tc39/proposal-temporal/issues/1294)
- RGN: There's an incomplete thought around brand-checking on one hand vs. virtualizability on the other. I’ll be looking at this in detail during full review, but don’t have anything right now.
- PFC: Is this something we should discuss at plenary?
- JGT: Let's start by getting clear about when this would be used.
- SFC: The question about when brand checking is needed vs when it isn't is something that the plenary might be interested in. That said, it might just rehash the same discussions again.
- DE: When you're making a protocol, by default you don't check the brand of the protocol, unless you have some internal state. Like iterators. Calendar and TimeZone don't have any internal state so they don't need to check the brand.
- JGT: That's the reason why plain object calendars are OK, but what's the reason why they are needed?
- DE: I've argued that we don't need custom calendars, but if we do have them, then I don't think it's necessary to force people to subclass uselessly if they don't want anything from the base class.
- JGT: I mean, is there any case that plain object calendars would cover and subclassing wouldn't?
- DE: No, you can always subclass Temporal.Calendar, even if in a vestigial way.
- RGN: There might be a case where the builtin calendar is denied to code.
- DE: That's not really our problem, in any case it shouldn't be the keystone rationale for including plain object calendars. 
- JGT: I agree that there's no reason to make that restriction.
- DE: Something that I care about is TC39 sticking to established conventions. I don't think an established convention that protocols must be brand-checked would be good.
- Action for DE to discuss this with JHD.
- JGT: What about [#1293](https://github.com/tc39/proposal-temporal/issues/1293), the objection to monkeypatching `from()`?
- DE: The proposal there is that if you want to patch in your own calendars, you should patch everything from PlainDate on down. I could see this go either way. I don't feel strongly about having this, just as I don't feel strongly about having calendar and time zone protocols in the first place.
- JGT: Could this be added in a v2?
- DE: It _might_ be web compatible to call the current value of `from()` instead of the builtin value. I don't really like these kinds of changes. I compare it to some of the changes made by ES6 where existing builtins were made subclassable in useless ways. This kind of smells like that.
- RGN: But doesn't it smell like that either way? If you want calendars identified by strings, and you want to be able to add calendars, then the options are limited. You can have a global registry, you can monkeypatch every method that takes a calendar, or you can monkeypatch a central point like Calendar.from(). All of those have the same vague unease to me.
- DE: It's on a spectrum, right?
- RGN: Is there an approach that feels particularly safe to you against that kind of future issue resulting from an improper affordance for customization?
- DE: That's why my impulse is to give as few affordances for customization as possible. I accept that that's not the consensus of this group.
- JGT: As a group we should figure out how strongly we feel about this. As a group, would we even want to release a Temporal without custom time zones and calendars being deserializable?
- DE: You can replace the Temporal.PlainDate constructor etc.
- PFC: I think the solution we have is the least bad.
- JGT: To summarize, our opinion is that monkeypatching `from()` is the preferred way to deserialize calendar strings?
- RGN: Being even more specific: anything that deserializes should call the current value of `{TimeZone,Calendar}.from()`?
- SFC: I'm not a fan of this, it can cause bugs, I hold my nose but in the end I agree. I'd rather have a method that purely looks up the string, but we previously agreed to remove that due to surface area concerns.
- RGN: That's another reason to acknowledge that the other option exists.
- DE: We could acknowledge SFC's option as a fourth option.
- RGN: It's a variation, still a single monkeypatch point but it's been narrowed down.
- JGT: Should it be a Symbol as opposed to a regular method?
- RGN: That's also just a variation in the specifics of what gets overwritten and what does it look like.
  - 1a. Calendar/TimeZone deserialization funnels down to  `{Calendar,TimeZone}.from()`; override that to customize
  - 1b. Deserialization funnels down further; override `{Calendar,TimeZone}.fromName()` to customize
  - 2. Deserialization has no user-exposed convergence point; override all deserialization entry points to customize
  - 3. Deserialization is a lookup on a user-exposed object or map such as `{Calendar,DateTime}.registry`; manipulate or override that to customize

### TC39 presentation
- PFC: Anyone want to see anything in particular in this presentation?
- JGT: A section on "here's what's going to happen in the next few months, here's what we will do, here's what we won't do"
- JGT: Would it make sense to parcel up the reviews and share it between different people?
- RGN: I don't know that you could do that formally, but it might make sense to identify the least controversial and most controversial sections and point people accordingly.
- JGT: Should people review the least controversial ones first, or vice versa?
- RGN: I don't know. Maybe it makes sense to get the least controversial ones out of the way first.
- JGT: Calling out some part specifically, saying we could use extra eyeballs.
- Action for PFC to suggest a division of topics in the presentation.
- RGN: We could use this meeting time to invite delegates to give feedback about these topics.

### Is `daysInMonth` the count of all days or the number of the last day? [#1315](https://github.com/tc39/proposal-temporal/issues/1315)
- PFC: I wouldn't want to count days skipped by time zone transitions. That would mean that `zdt.daysInMonth` might give a different answer than `zdt.toPlainDateTime().daysInMonth`.
- JGT: Agreed, and I think days skipped by calendars should be treated the same as days skipped by time zones.
- DE: In some places the skipped dates from a Julian-Gregorian transition might cross a month boundary anyway.
- PFC: On further thought, people will use `x.with({ day: x.daysInMonth })` as a way to get to the last day of the month anyway. It would be bad if that would break in rare cases.

### `from()` and `with()` must set canonical reference day (for PlainYearMonth) or reference year (for PlainMonthDay) [#1316](https://github.com/tc39/proposal-temporal/issues/1316)
This seems like a bug report that doesn't need to be discussed.

### [IETF Draft](https://github.com/ryzokuken/draft-ryzokuken-datetime-extended) status update (hopefully final)
- USA: After the last meeting we discussed with Mark Davis what would be the best way to register extensions. I iterated on something that Mark was happy with. RGN and SFC made a bunch of suggestions as well. If you could review those PRs today I'd appreciate it. Did everyone get a chance to look at the draft?
- JGT: I haven't yet, but I will today.
- USA: My understanding is that people more or less like it. I'd like to merge these last two PRs by the end of this week and talk to the CalExt people to get this adopted. I'd like to get it done before we present the status update at the TC39 meeting.
