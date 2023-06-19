# May 28, 2020

## Attendees

- Ujjwal Sharma (USA)
- Shane Carr (SFC)
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Daniel Ehrenberg (DE)
- Jase Williams (JWS)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)

## Agenda

### Status of any [polyfill blockers](https://github.com/tc39/proposal-temporal/milestone/4)
- **Parse:** USA plans to complete this on Friday
  - JGT: Concern about naming, will Temporal.parse suggest that this is the only way to parse strings in Temporal?
  - DE: Let's follow up about that on the issue tracker, but it doesn't block shipping the polyfill.
  - (returning to the topic later)
  - DE: What do people think about leaving out parse() from the initial polyfill based on the issue Justin raised and the fact that it's not done yet?
  - SFC: I think that's fine.
- **Weeks:** (see below) PFC will do this after calendars

### [#532](https://github.com/tc39/proposal-temporal/issues/532) data model of Duration.weeks
- USA: The champion group decided to include weeks but the question is whether it appears in the data model or not. 
- DE: What did we decide here last week?
- JWS: Didn't we decide not to ship weeks in the polyfill?
- PDL: We decided to ship weeks in the polyfill, but not in the data model.
- SFC: It's a blocker for Intl.DurationFormat if it's not in the data model.
- DE: The discussion last time stopped at the fact that if we don't assume weeks are 7 days, then we can't balance them.
- SFC: We don't balance between days and months either. If we don't force weeks to be 7 days, then we can treat weeks like months and years, where we just don't allow them in balance methods.
- PDL: I agree with that, and that's an argument in favour of not forcing weeks to be 7 days.
- DE: Is anyone not in favour of adding it to the data model, then?
- PDL: I agree with SFC now, yes.
- JGT: If you have a Duration that you obtain from difference(), how would you get weeks in there?
- PFC: You would pass `largestUnit: 'weeks'` to the options.
- PDL: We cannot put weeks in the Duration if largestUnit is months or years.
- JGT: Essentially weeks and months are mutually exclusive.

### [#292](https://github.com/tc39/proposal-temporal/issues/292) Default calendar
- SFC: Last week I updated the document with the new pros and cons. Thanks PFC, DE, JGT for posting responses. I have reached out to some Intl folks. I think we should pick an option to ship with the polyfill. I'm in favour of shipping option 2, not because I think it's the best, but I think it's the most likely one that we would get feedback from. I think if we shipped option 1, then we'd likely get no feedback. Option 2 is also the least disruptive in terms of API surface.
- PDL: I haven't written out my analysis yet, I still plan to do that. I think your point about feedback is right. The only problem I see with option 2 is that we're already proposing a complex API surface, and I think adding more complexity actually reduces the quality of feedback for other things. While it's always good to get more feedback from Intl folks, I also think we should be getting more feedback from folks who don't care about Intl, which is 99%. I think we are making a category error in the list of things that we value highly. I do value i18n correctness, but I think it's one of 20 or 30 concerns and we need to hear more from the others.
- SFC: I think the typical response from i18n experts is that you shouldn't value what programmers care about, since programmers generally don't care about i18n, accessibility, etc. The person who cares about those things is the end user. It's definitely a philosophical question.
- PDL: "Who is our customer" is definitely a question to answer.
- JGT: Intl.NumberFormat works across cultures without developers needing domain knowledge about each culture. Calendar isn’t like that. There is no “default calendar” for users in a realistic sense, because ISO and non-ISO calendars are both used depending on context. Some apps may show both calendars side by side. Others may have a user toggle. Others may have some parts of the app (e.g. government forms) in the local calendar and other parts in ISO. Unlike number formatting, this isn’t mainly an API problem. It’s a business logic problem that exists on paper too, e.g. my elementary school yearbook had dates in both calendars side by side! So it can’t be solved even with a perfect Calendar API. Also, developers in these markets still will need to use both ISO and non-ISO calendars, so an ISO default won’t be a big deal. What’s more important for users is providing a good API that developers with non-ISO domain knowledge can use to build apps that gracefully handle any dual-calendar complexity.  What’s not realistic, however, is “it just works” expectations for developers without non-ISO domain knowledge. Non-ISO should be an ergonomic opt-in for developers who have the business context to be successful, not a magic default for random developers in Toronto.
- DE: I do want to disagree with "programmers shouldn't care about Intl."
- JGT: I think the only way to get feedback on this is to find developers who were working in these markets like DE did.
- SFC: My expertise is more on the backend/platform so I appreciate hearing about these experiences.
- JWS: I didn't have a chance to reply to the thread either, and I will do that before next week. I'm a bit dubious about choosing an option based on what provokes more feedback, because we haven't really done that with anything else. There could be a proportion of people who think it's the decision we've made.
- DE: What do we think about this claim that we'll get the best feedback from reaching out to developers individually? In that sense it doesn't matter much what we do in the polyfill.
- SFC: What is the scope of feedback we're looking for in the polyfill? Is there a list of questions?
- DE: We could make a survey or pose programming puzzles, but I do think we want feedback on everything.
- SFC: If we were to ship the polyfill with option 1, does that still leave the door open to moving to another option based on feedback? I don't want to have the discussion in a couple of months that it's too risky to change it since we already shipped with it.
- DE: Nothing that we're shipping in the polyfill locks us in to the API.
- PFC: I would suggest that everyone think about what sort of feedback would make them change their minds.
- SFC: Same question for ZonedAbsolute. I don't think this type will ship in the initial polyfill, but I would really like to consider it for Stage 3.
- JGT: On that note, I have a prototype of ZonedAbsolute that I've been working on. I don't think it will ship in the polyfill but I definitely still want to have that discussion.
- DE: I think the whole point of shipping the polyfill now is to be able to revise the API. Otherwise we should just propose it for stage 3 now.
- SFC: I'm okay with shipping the polyfill with option 1 as long as we are committed to evaluating the options again based on feedback. I'd still prefer shipping the polyfill with option 2, but we can still get feedback by having a survey with scenarios about the calendar API.
- JGT: I think a survey is a really good idea. It will certainly be possible to approach developer meetups in Saudi Arabia, Iran, etc. Will the API in the polyfill get updated?
- USA: I do intend to release updates.
- PDL: It depends on how forceful the feedback is. If we really need to change something, then I imagine we'd release an update of the polyfill sooner.

### [#337](https://github.com/tc39/proposal-temporal/issues/337) Round Duration to nearest small unit
- PFC: I put this on the agenda because it was marked as a polyfill blocker. My question is, is everyone happy with the API suggested in the comments, a balance() method with largestUnit and smallestUnit options?
- PDL: I don't see the value so much in this. A balance method will never be adapted to the kind of rounding that was mentioned earlier in the thread, such as round to the nearest 15 minutes. But I don't feel strongly about it.
- JGT: It sounds like the design is still up in the air on this one, it sounds like something that can be done later.
- JWS: I agree.
- SFC: If we can agree that we do want this in Temporal, we can postpone designing what it actually looks like. It's in this milestone more because it's a blocker for Intl.DurationFormat for stage 2, which is also next week.
- PDL: What's the Intl.DurationFormat use case?
- SFC: The Intl.DurationFormat case is "I have some number of milliseconds and I want to format that as hours and minutes".
- PDL: And is there a use case in Intl.DurationFormat for units like "5 minutes" or "a quarter of an hour"? If so, how do we want to specify that?
- SFC: Good question. UTS-35 has no support for those kinds of units. Since we lack prior art, it's unlikely to be part of Intl.DurationFormat at this time.
- JGT: Those cases feel more about business logic than about formatting. For example, rounding billing time to 6 minutes.
- PDL: Then, can we have consensus on a balance() method?
- RGN: I think just the balance() method does an injustice to the other use cases, and invites commentary on what method you're using to get rid of the smaller units. That's rounding logic, not balancing logic.
- DE: Can we agree we want to add something to Duration, and it's not polyfill blocking, but it needs more design?
- JGT: I agree, Duration seems like it needs the most work, so adding an API at the last minute without much thought doesn't seem like a good idea.

### [#517](https://github.com/tc39/proposal-temporal/issues/517) Comparison operators - follow up from MPT and MAJ?
- DE: We discussed two strategies here, throw in valueOf() or convert to a BigInt.
- USA: I talked to MPT and her opinion was to prefer the strongly typed nature of compare(). It leaves less room for error in general, and she would have preferred that moment.js did this, although it doesn't.
- DE: Do we have any concerns about shipping the polyfill based on MPT's recommendation?
- PDL: The complaint was unwieldy syntax, so I'd ship the polyfill with that and see if we get feedback about unwieldy syntax.
- RGN: Agree, if we ship without the exception then we'll never know whether the syntax was a problem.
- JGT: There are choices in between, e.g. a lessThan() or greaterThan() method that is more ergonomic than compare().
Consensus is to make valueOf() throw an exception in the initial version of the polyfill.

### [Slides for TC39](http://ptomato.name/temporal-2020-06), in progress
- PFC: We don't need to talk about these now, but I put the link here in case anyone has time to look through and give feedback.
- PDL: Please archive them when you're done at https://github.com/pipobscure/pipobscure.github.io/ 

### Any other blockers for the polyfill or slides?
- PFC: Code review on the open pull requests would be helpful for moving the polyfill along. There's a lot of code accumulating.
- JGT: The issue with the most potential for breakage would be negative durations, so I'd suggest considering that sooner rather than later.
- DE: We could consider allowing reversing the arguments of difference()?
- PDL: I'm fine with that but we should discuss it later.
- JGT: My point is that when we consider revising the API we should order the things that are most likely to cause breakage first.
