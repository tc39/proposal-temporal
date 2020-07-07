# June 26, 2020

## Attendees
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Shane Carr (SFC)
- Richard Gibson (RGN)
- Jase WIlliams (JWS)
- Justin Grant (JGT)

## Agenda

### Update on publicity

- PFC: The blog post and survey have been released. I've tweeted an announcement, and DE retweeted it causing more engagement than I've ever had on any other tweet, so I think it reached a lot of people.
- JWS: I tweeted it this week as well, and got the same DE magic.
- PFC: I'm working on a blog post for my personal blog which has a much smaller audience but hopefully a different one. I encourage others to do the same if you think you can reach more people.

### Feedback from research call

- PFC: After thinking about the research question I came up with "Given the current set of features of Temporal, are there any APIs that tend to confuse people in practice?" Discussion thread is at https://es.discourse.group/t/temporal-survey/374 
- JGT: How about "is there anything that is hard to do?"
- RGN: One of the things Justin has been good at pointing out is "is it done correctly?" If the API sets up pitfalls then we should know about them.
- JGT: There are two kinds of user research that we would do. One is to get general feedback to see what kinds of areas we should look into. The other is specific questions that we should craft surveys around.
- RGN: I think the latter. We have a proposal and a polyfill, so the questions are about something specific and concrete.
- PFC: I think the former. This is the first contact of the proposal with actual JS developers who aren't involved in writing it. We also have specific questions about e.g. negative durations, but I think the generic feedback is the most important.
- JGT: I agree.
- RGN: I agree as well, that's not at odds with what I meant.
- JWS: We do also have the issue tracker where we can discuss with people if they want to raise specific issues.
- JGT: It seems like we are mostly in agreement, PFC do you have what you need to polish the survey?
- PFC: The tradeoff that I'm wondering how to make is whether we should pursue the course of splitting up the survey.
- JGT: I would wait until you have a few responses and consider changing things if we aren't getting the type of feedback we are looking for.
- (...missed a bit of the discussion...)
- SFC: We should encourage signing up to a mailing list (e.g. via Mailchimp), so we can communicate about updates to the polyfill and remind people to take the survey before it closes.
- JWS: I think it would be a great idea to have a changelog in the GitHub repo, so that even people who don't want to subscribe to something can see what's changed.
- USA: How do we get the info into people's mailboxes?
- JWS: I agree with the mail thing as well, but there should be something that allows people to get the information with low friction.
- JGT: You can include a Changelog with tags on GitHub.
- **Action:** USA to open an issue to discuss further ideas for promotion.

### Transition guide for Temporal (in the style of https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)

- USA: Maybe we could make a pull request to their You Don't Need Moment.js guide?
- JWS: There is already issue [#104](https://github.com/tc39/proposal-temporal/issues/104) in our tracker to develop a Moment.js shim with Temporal.
- USA: I agree that would be useful. After my talk at HolyJS I got questions from people who asked about such shims. There are a lot of people with huge codebases using Moment.js.
- JGT: date-fns is another, smaller, candidate for a shim.
- JWS: What do you think brings more value? Working on a shim for Moment.js, or having a page that shows how to transition from Moment.js to Temporal?
- USA: I would go for the shim because it drives adoption.
- DE: I disagree, I think the documentation is much more important, to drive people using Temporal directly. We can have conversion functions from Moment types to Temporal types, and a facility to avoid using Moment-timezone. But other TC39 APIs like Intl take years before we see uptake so...
- JGT: I agree, but there is also the point that these libraries are extensively tested so if we had a shim then we could test it and find bugs in Temporal.
- SFC: The Google internal TS team also needs a production ready polyfill. It could drive adoption if we could call the polyfill production-ready when we reach Stage 3.
- DE: There was an issue with es-abstract which is not ESM. The other thing is performance and size, e.g. how many calendar and time zone objects are allocated.
- SFC: There may be some changes that we need to make to the polyfill to make it production ready, indeed.
- JGT: I was wondering about tree-shaking.
- PFC: We currently ship the whole of es-abstract in the bundled polyfill.
- JGT: There's an issue for cross browser testing.
- PFC: One thing we had discussed earlier was to work with the larger JS shims / polyfills to make a production ready polyfill instead of changing this one.
- DE: I disagree, I think we need to have a purpose-built polyfill, not a JS-wide one.
- USA: On the one hand I see that point, but e.g corejs is very widely used.
- DE: We don't necessarily want to put Temporal through the maintainer bottleneck of something like corejs. It would be bad if the Temporal polyfill were bundled all over the web. It's very large, and we would rather get people to use the implementation of Temporal in browsers.
- SFC: The way Google does its polyfills, which is iffy, is user agent sniffing, so they don't have to ship unnecessary code to platforms which don't need it.
- JGT: From the app developer side, I'm not sure I can use Temporal in my own app, because it's so big. So I think Temporal is in a different class from most ES proposals which are, say, one method.
- SFC: Would the polyfill be much bigger than Moment.js if we were to optimize it? If so, I'd like to understand why.
- JGT: One of the reasons why date-fns exists is because Moment.js is so large.
- DE: Being the same size as Moment.js seems like a baseline for us to hit, but that still doesn't make it small enough to bundle everywhere.
- JGT: I'll open two issues, one for tree shaking and one for bundle size checking.
- JWS: Does anyone know the status of corejs? Have they been polyfilling new features recently?
- USA: I don't know.

### RFC 5545 compatibility "mini-proposals": Order of operations, ...?

- USA: DE, do you remember when I was talking about formats in my presentation?
- DE: I'm not sure which formats are important to support built-in.
- JGT: RFC 5545 is not a different format, it's a different semantics of what happens when the data is brought into the app, which is difficult to implement with Temporal today. The requirement of that RFC is that the order of operations is from largest to smallest, and that the date part of durations is treated like our DateTime and the time part is treated like Absolute. You can write Temporal code that is compatible with that RFC, but it's not trivial. It's possible there might be other competing instances out there that use the same format but do different things, but I haven't found them. Summary in [PR #700](https://github.com/tc39/proposal-temporal/issues/700).
- JGT: The impetus of putting together LocalDateTime was to recognize how it's difficult to do the right thing, as in the cookbook bug that I pointed out.
- PFC: I understood the problem a lot better after having that bug pointed out to me.
- JGT: Many libraries such as Moment.js do things this way. I don't know if it's because it's the only opinionated standard or because the libraries evolved in the same direction due to it being intuitive.
- JGT: You made the connection with the CalExt group, DE?
- DE: SFC made the connection, but I'm working to establish the liaison relationship with ECMA.
- JGT: Do you mind if I contact them to ask questions about RFC 5545?
- DE: CalExt and CalConnect might be different groups. I think it would be great to get them involved.
- JGT: I think CalExt is working on something called JSCalendar which I think is the JSON version of RFC 5545.
- DE: This seems really important. I don't know this space very well, but I'll look into what I can do.
- JGT: I just need an email introduction; I haven't managed to sign up to their mailing list.

### Work items
- DE: I would like to come back to these work items; there are these design issues but also things like writing this upgrade guide. Can we split these among us?
- JGT: Ask me in a few weeks if I have time.
- JWS: I'd rather have a checklist in an issue, I'm not sure of my availability synchronously.
- Upgrade guide / comparison with other libraries
  - USA: I did this research for my presentation, so I'll do this.
- Shim, to import tests or do conversions to and from other libraries' types
- Productionizing the polyfill
- Write documentation page for DST best practices
  - JGT is interested in this
- Finish the spec
  - USA
- Add other Intl-supported calendars
  - SFC and team members in Q3 or Q4
- **Action:** PFC to open an issue with a list of work items.

### “3 kinds of durations” discussion - [#559](https://github.com/tc39/proposal-temporal/issues/559), [#686](https://github.com/tc39/proposal-temporal/issues/686)
- Deferred until PDL is here.

### (The future of) Temporal.parse
- DE: I would like to hear from PDL about the use case of parsing ISO-like strings that have some numbers out of range.
- Deferred until PDL is here.
