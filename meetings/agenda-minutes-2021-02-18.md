# Feb 18, 2021

## Attendees
- Ujjwal Sharma (USA)
- Jase Williams (JWS)
- Philip Chimento (PFC)
- Shane F Carr (SFC)
- Richard Gibson (RGN)
- Cam Tenny (CJT)
- Philipp Dunkel (PDL)

## Agenda

### from() discussion [#1293](https://github.com/tc39/proposal-temporal/issues/1293)
- PFC: The solution they're proposing is self-consistent, so we could still go to Stage 3 while having it work like that, but I don't think the opinion of anyone in this group (i.e., that the status quo is better) has changed.

We'll dedicate next week's meeting to this and invite JHD and KG. PFC to create an issue in the Reflector and ask one of the champions to lead the discussion.

### IETF draft
- USA: Bron Gondwana and I are chartering a working group called Serializing Extended Data about Times and Events, or SEDATE, to deal with the new drafts. Hopefully with this strategy, things will move along smoothly and we would be able to advance this into an RFC.
- SFC: Does Bron feel that this is the best way to get the format adopted aside from the CalExt group?
- USA: There is some opposition to the format, more than I initially expected. CalExt folks are all positive about it, but the idea is now that we don't necessarily need to obsolete RFC 3339. I've made another repo which is RFC 3339 but with obsolete things removed. Then the second RFC is going to be an extension of that with our new additions for calendars and time zones, and people can stick to that if they prefer.
- SFC: A distinction I made in the thread is between human dates with calendars and time zones, and computer dates. I think this division reflects that. I'm not sure that RFC 3339 needs to be updated, but we're the experts on human dates. But for example, for logging (computer dates), you don't need negative years etc. Maybe it would be less objectionable to the people objecting, to keep RFC 3339 as it is.
- USA: Those people also pointed out that they would not oppose updating RFC 3339. They seemed focused on the extensions we were proposing, which is why Bron proposed that we move in this direction. That said I wouldn't mind leaving RFC 3339 as is. I'll bring this idea to Bron.

### [#711](https://github.com/tc39/proposal-temporal/issues/711) Work items
Nothing to address today in these.

### GitHub issue triage
We spent the rest of the meeting time on cleaning up the GitHub issue tracker.
