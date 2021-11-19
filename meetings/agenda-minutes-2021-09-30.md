# September 30, 2021

## Attendees:
- Shane F. Carr (SFC)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Ujjwal Sharma (USA)
- Philipp Dunkel (PDL)

## Agenda:

### Temporal.PlainYearMonth.compare ([#1846](https://github.com/tc39/proposal-temporal/issues/1846))
- SFC: A weird side effect of the change that we made. We made the change for a good reason.
- PFC: My preference is the status quo. It makes the semantics of the method 'compare the first day of the month'.
- RGN: That's my preference as well. The first day exists on a timeline, so can be compared.
- SFC: If you have a list of PlainYearMonths with different calendar systems and you sort them, you end up with a list of months ordered by start date. That's a reasonable result.

### How much from non-ISO calendars to specify in ECMA-402?
- USA: We could specify a lot, or nothing at all, and it would still work. I think we should have a minimum set of calendars that ought to be implemented, and work from there. This minimum list should include 'gregory' but also any non-ISO, non-Gregorian calendars that are used as the official calendar of at least one country. We could increase the scope later.
- RGN: What would specification look like for these included calendars?
- USA: We'd specify the various operations as we do for the ISO calendar, things like arithmetic.
- SFC: The context for this is there was an issue about whether the Japanese calendar should throw in a particular situation and what kinds of strings they should accept as era identifiers. If this isn't specified, that's an opportunity for browsers to make different choices. So at least we should clearly specify the user interface surface of these. We could still leave the calendrical calculations as an open question for implementors.
- USA: We could specify the data types of fields like leapDay.
- RGN: Makes sense. There are some aspects that we'd hope were defined external to ECMA-402, but the exhaustive list of fields that should exist per calendar seems like a good thing to specify. I also agree with the criterion for including them.
- PFC: I like the criterion as well, but 'official calendar' can be a fuzzy definition.
- SFC: I used to agree with that, but a calendar can be in daily use but not 'official'.
- USA: I proposed it as a bar for the first cut, it's a place to start.
- RGN: It would be a problem if a calendar that was official somewhere was not specified in 402, but it would not be a problem if a daily-use-but-not-official calendar was specified.
- SFC: I feel strongly we need to have all the CLDR calendars' API surfaces specified. That's not to say that implementors must implement all of them. We've had feedback from polyfill authors that they don't want to be required to implement all of them. Should we have a ranking? Or say that they are all optional? Maybe the normative requirement is that calendars that are supported for formatting must also be supported for calculations.
- PFC: I agree particularly with that last requirement.
- USA: It seems we agree.
- SFC: We've been handwaving a bit about where and how. I've been advocating that some calculations are specified. Should we do that? Does it go in a new section of 402? Who is going to write it?
- RGN: I think it would be the case, that it would be a new section.
- USA: That might be novel for ECMA-402 but it's typical in IETF.
- RGN: It looks analogous to section 6 to me. We already have the reference to measurement unit identifiers and the list of acceptable units, and the external reference to currency codes and language tags.
- USA: We could reference this section in the constructor, to tell implementors where to find how the shape of the API should be.

### IETF update
- USA now has a co-author of the draft, Carsten Bormann.
- USA: Great progress. A co-author is exactly what I needed. There is a new repository and the source files are now in Markdown which makes it much easier for people to contribute. The idea is to continue having discussions, and publish it by the end of the year.
- PFC: What discussions are open currently?
- USA: The only syntactic discussion that we have open is about namespacing. John C. Klensin opposes namespacing but hasn't been responding to the thread. His concern is that not specifying the exact set of accepted keys incentivizes people to include private information within timestamps. E.g. avoiding time zone problems by including the coordinates, which leaks private information. Nobody is against our calendar annotation, though.
- SFC: That argument is a bit theoretical. No matter what you do, there are going to be ways for people to abuse it.
