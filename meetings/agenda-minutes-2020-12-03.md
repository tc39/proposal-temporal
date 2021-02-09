# Dec 3, 2020

## Attendees
- Shane F. Carr (SFC)
- Matt Johnson-Pint (MJP)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)
- Richard Gibson (RGN)

## Agenda

### Progress towards Stage 3
- MJP: Really happy with the progress I've seen.
- PFC: To-do list for Stage 3:
  - Communicate with IETF and get ISO string extensions on a standards track (#293) (USA is working on this)
  - Get Intl.DurationFormat ready for Stage 3
  - Clean up GitHub issues and complete all the editorial spec text ones
  - Start proposal-temporal-v2
  - Request a W3C TAG review (#102) (DE is working on this)
  - Write spec text for structured cloning Temporal objects (#548) (DE is working on this)
- MJP: Were there any objections to the Plain naming?
- SFC: It seems that people consider that the champions group has thought about this stuff.
- PDL: Are there any other things that we need to do in order to facilitate advancement to Stage 3?
- MJP: We should be doing some more public relations, get some blog posts and tweets out there. I've been deliberate about answering Stack Overflow questions about dates and times with a note that says "this will be better with Temporal in the future". When implementations start to appear, it makes sense to start telling people "you can try this solution in X browser".
- PDL: Should we try reworking the polyfill to integrate with Babel?
- MJP: That sounds like a good idea.
- PDL: How about our test262 suite?
- MJP: I've been talking to BT and I know for a fact that test262 doesn't let you change the time zone in a process on Windows. That will affect us.
- SFC: Have you talked to FYT about this? He's been working on it.
- PDL: Even if we can't test this under Windows in the current state, we can still write these tests and run them with the Node runner.
- PFC: We do need to make the test262 suite cover at least as much as the Demitasse suite, but that isn't something I've been considering as a prerequisite for Stage 3.
- PDL: It's not, but it may facilitate reaching Stage 3.
- PDL: What else belongs on this list? What I'm envisioning is that when we land in January, people might not be happy with the reviews they've done — not because of something we are lacking, but because they haven't spent the time doing it yet. What can we do to increase the confidence in that?
- MJP: There was something in the deck about standards ratification?
- PFC: USA is working on that.
- SFC: Should we change this meeting to biweekly or monthly?
- PFC: If not now, then probably soon.
- PDL: I think that's a bit premature, there's probably still a lot of shepherding to do. We'll skip Dec 24th and Dec 31st anyway. In January we have 7th, 14th, and 21st, and the 21st is right before the meeting, which will be our last chance to make any last minute changes to our request for Stage 3. We'll need to have extensive slides with the appropriate FAQs and whatnot.
- Conclusion: We'll keep the weekly meetings, skip US federal holidays, and revisit changing the frequency after the January TC39 plenary.
### Work items ([#711](https://github.com/tc39/proposal-temporal/issues/711))
We'll start tracking the status of these items again after January.
