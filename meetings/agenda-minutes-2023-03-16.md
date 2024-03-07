# March 16, 2023

## Attendees

- Daniel Ehrenberg (DE)
- Frank Yung-Fong Tang (FYT)
- Jase Williams (JWS)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Shane F. Carr (SFC)


## Agenda

### TC39 plenary [presentation](https://docs.google.com/presentation/d/1b74GI-zHrG0wDzmwFs_yPWRli24KyVUNx3GeZt8JouA/edit#slide=id.g14f8417e789_0_36)
- JWS: I have feedback from presenting these internally at Bloomberg. Slide 7 was confusing to many people, maybe some of the edge cases should be removed from the code sample. The nanoseconds should make clear how we plan to solve that.
- DE: With Slide 7 the important case is the one on the third line. For nanoseconds, I think we should put the solution that we came up with on the slide, and ask for comments. We don't have a solution that's validated, but we do have a framework for a solution, and we should present that.

### ZonedDateTime in Intl.DateTimeFormat.format ([#2479](https://github.com/tc39/proposal-temporal/pull/2479))
- DE: SFC made an interesting argument on the thread, that now we have `Temporal.Now.timeZoneId()` to get the default time zone, so we don't need to consider undefined as the way to specify the current time zone.
- FYT: Currently there are only two ways to construct a DateTimeFormat. With a timeZone parameter, or without one, which does not mean "random time zone", it means "current time zone". I think changing the semantics of undefined here is dangerous. This exists for at least 10 years, probably 25, that people know that the only way to ask for a formatter with the user's current time zone is an undefined timeZone parameter.
- PDL: I see what you're saying, but until now there wasn't the opportunity for the thing you're formatting to carry a time zone. Legacy Date always carries the current time zone.
- FYT: That's not correct. You could have a JSON object with a time zone.
- PDL: That's not a form of data that the formatter understands though. ZonedDateTime is new in that it includes its own time zone.
- FYT: Let's assume that we do what you're saying. I create a Date, then a formatter, then change the time zone and create another Date. Then I format both dates and they'd have the latter time zone.
- PFC: I don't think that's correct. What we want to do should change nothing about how Date is formatted.
- JGT: Can we agree that we don't want to change anything about the behaviour of formatting Date?
- (Agreement)
- SFC: PFC opened an issue on the 402 repo about considering to adopt this delayed-resolution of the time zone. We discussed it and closed the issue, so we're definitely keeping the current semantics.
- SFC: I found FYT's argument compelling that there is existing documentation that talks about the semantics of undefined timeZone.
- FYT: I'd rather that DateTimeFormat not accept ZonedDateTime at all.
- PDL: We can do that, that would be the cleanest solution! Then we'd have to create a ZonedDateTimeFormatter. The question here is, can we justify saving ourselves some time by combining the two.
- JGT: I spent a lot of time last week on understanding FYT's use cases. I'd like to share my screen and talk about those.
    1. Use DateTimeFormat to create one formatter for formatting multiple ZonedDateTime.
- JGT: For (1), I think an important requirement is that `zdt.toLocaleString(...args)` has the same behaviour as `new Intl.DateTimeFormat(...args).format(zdt)`. If it's not, then it's painful to port code using toLocaleString to a formatter. I think the other requirement is that it's faster. 
- FYT: How do you get the ZonedDateTime there, and why do you not want to display it in the user's time zone?
- DE: It'll be pretty common to get a ZonedDateTime using a time zone dropdown. You'll want to display it in the time zone of the datum.
- PDL: Example is getting the departure time of a flight, you'll be leaving at HH:MM in London time and arriving HH:MM in Seattle time. You use ZonedDateTime when the time zone information is relevant. It doesn't help me if both of the times on my airline ticket are printed in my local time zone.
- FYT: I disagree. I book a ticket to London, but I want to tell my wife when she can call me when I land. I need local time for that.
- PDL: That's another use case. Both are valid use cases.
- FYT: I appreciate hearing this use case rather than the technical information of which API we call.
- FYT: Another remark about this, `zdt.toLocaleString(...args)` has the same behaviour as `new Intl.DateTimeFormat(...args).format(zdt)` was never guaranteed even for Date.
- JGT: That's correct, but it can still be a requirement for this case.
- DE: People make false assumptions all the time, and I'd like to concentrate on what a normal programmer might assume. We have an ideological decision to make, about conforming exactly to a mental model even in the extremes, or being practical about how developers are likely to use the new API.
- PDL: I agree. The mental model doesn't apply to something that doesn't exist yet.
- FYT: My frustration is that I provided hard evidence, in the form of a printed book, that the current mental model is documented. Believing that programmers have a different mental model without evidence is like a religious belief.
- DE: We all have intuition about what programmers believe.
- FYT: I'm working with hard evidence, not intuition.
- JGT: Maybe I can short circuit this a bit. I think we all agree that the mental model of Date's interaction with DateTimeFormat doesn't change, and shouldn't. I'd really like to go through these use cases, because I think it'd be helpful.
    2. An app that formats flight departure times in the user's local time zone, wants to add another column of departure times in the departing airport's time zone: zdt.withTimeZone(...).toLocaleString(...), zdt.toLocaleString(...).
- FYT: I'd rather see a use case where you don't go from code that uses toLocaleString to DateTimeFormat.
- JGT: The most ergonomic way to format something in a locale-aware way is toLocaleString. Then if you want to make it faster, the only way to do that is DateTimeFormat.
- FYT: That's not a good basis to design the API on. I wouldn't use ZonedDateTime.withTimeZone for this case.
- PDL: DateTimeFormat changing the time zone automatically gets into dangerous territory.
- FYT: You're assuming that people will use toLocaleString. Many more people understand DateTimeFormat.
- DE: I'd like to cut this short and make a decision.
- JGT: I think we're all agreed that the option where DateTimeFormat.format doesn't accept ZonedDateTime is our fallback option.
- DE: What is the Google Intl team's position on this question? Both FYT and SFC have made some arguments. Can you come to a common conclusion about what you want to push forward?
- SFC: We don't really have a coordinated position. We could come to one if that would help.
- DE: I think it would. It would be good to know if we need to resort to the fallback option. SFC, you've argued that all the Temporal types need to be formattable, so I imagine that would factor into it.
- JGT: Back to the discussion about how to write toLocaleString. I think it's OK that there are multiple ways for people to write their code. Once Temporal is available, toLocaleString will be right there in VSCode's autocomplete. 
- FYT: You're assuming Temporal will be big and shiny. I can assume Intl will be even bigger and shinier.
- SFC: If we can't come to an agreement on what's best for the user, I'll return to a performance footgun that I raised earlier in the thread. If the format() call needs to look up the localized time zone name at call time, that's a very complicated algorithm that can't be amortized over many calls to format(). The other complicated operation is the date-time pattern generation, which still could be amortized. If we can't agree on the semantics, we can still use a performance-based argument to come to a conclusion.
- DE: Using performance here seems a little suspect.
- PDL: I'd like to cut out the things that are not options. I think magic conversions are not options. Could we compromise on throwing if the time zones don't match? [option 3?]
- SFC: I've made an argument before against that solution which I thought was convincing to people: we try to avoid data-driven exceptions, and this would be a data-driven exception.
- PDL: So the only thing remaining is to use toInstant().
- DE: I want to propose that we send this task off to the Google Intl team, and adopt the outcome.
- SFC: I'd have to prepare a doc for the rest of the team, and we'd discuss it in the next couple of weeks.
- PDL: Do you foresee any aha-moments coming out of that discussion?
- DE: A common answer would be great, as we've been spinning on this for a long time.
- SFC: I think a lot of the same positions are going to come out of that discussion. There are going to be people looking at this from the implementor position, and from the i18n correctness position.
- PDL: I question whether anything different will come out of that conversation.
- SFC: I can do the exercise, but I share PDL's question.
- DE: The value is having a common position.
- SFC: Can we just make DateTimeFormat format() throw for a ZonedDateTime? That allows us to kick the can down the road.
- DE: Can we agree on that?
- PFC: I'd like to make sure that toLocaleString at least works.
- DE: What would timeZone do in the options bag for toLocaleString?
- SFC: It would throw an exception if it's present.
- FYT: What about undefined?
- JGT: Undefined is treated as not present.
- Conclusion: format() throws if given a ZonedDateTime. ZonedDateTime.p.toLocaleString() continues to work, but throws if a timeZone option is given.

### Feedback requested: [proposal-canonical-tz](https://github.com/justingrant/proposal-canonical-tz) (for Stage 1) [slides](https://docs.google.com/presentation/d/13vW8JxkbzyzGubT5ZkqUIxtpOQGNSUlguVwgcrbitog/edit#slide=id.p).
- DE: Looking forward to what TG2 says about the proposal. I think you and they have the right set of people to make a recommendation, and I'll probably agree with that recommendation.
- SFC: It has as much to do with Temporal and date-time handling as internationalization, even though it will land in the ECMA-402 spec.
- JGT: I'd appreciate anyone's feedback if you have it.