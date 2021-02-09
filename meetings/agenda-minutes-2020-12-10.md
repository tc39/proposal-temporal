# Dec 10, 2020

## Attendees
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Ujjwal Sharma (USA)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)

## Agenda

### Progress towards Stage 3
- USA shows draft of RFC to be submitted to IETF: https://ryzokuken.dev/draft-ryzokuken-datetime-extended/documents/rfc-3339.html
- JGT: Can we see a diff from the published RFC?
- USA: Currently, the best way is to use git.
- RGN: It's customary to include an appendix of the changes when replacing an RFC, but those aren't exact. If you want to see the exact changes then git is probably best.
- USA: The website where it's submitted also stores successive drafts.
- JGT: Is the goal of the revision to add IANA time zone name support?
- USA: IANA time zone names, calendars, and in general to have a way to represent arbitrary information (of which time zone and calendar are specific cases.) For example, Ronald [Tse] would also like to be able to use an annotation to represent time scales.

### `calendar.month` should not be required to be a number [#1203](https://github.com/tc39/proposal-temporal/issues/1203)
- JGT: I'm busy implementing calendars beyond Hebrew as well. They aren't feature complete but nonetheless this has been really helpful. The hardest part has been learning about the actual calendars. Let's walk through some of these issues.

  For this issue, I've learned that a lunisolar calendar means that you add months to align the lunar and solar cycles. The Islamic calendar is lunar, meaning that the months don't occur at the same time every year, which is fairly simple. A solar calendar like the Gregorian calendar is fairly simple too. The Hebrew calendar is lunisolar, but it's one of the simpler of the lunisolar calendars because there's only a possibility to add a month. A more complicated one is the Hindu calendar, where months can be both added and removed. Many of these calendars can also add days to months as we do in February in the Gregorian calendar, but that's relatively simple. In the Chinese calendar, intercalary months can be added anywhere in the year with limited predictability. It seems like the Hindu calendar might be a superset of all the adjustments that other lunisolar calendars do.
- RGN: If it truly is a superset, that would be really valuable.
JGT: On to month numbering. If you only look at the Hebrew calendar then it seems straightforward that the answer should be "month number 6 is sometimes there and sometimes not", just like February 29 is sometimes there and sometimes not. It's more complicated in the Hindu and Chinese calendars. There are various solutions discussed in the issue.
- RGN: Note https://tools.ietf.org/html/rfc7529#section-4.2
- JGT: Louis-Aimé's feedback has been helpful as well. He's quite passionate about calendars!

  In the Hebrew calendar, month 6 (Adar I) is the skipped month. In the Chinese calendar, the inserted month is added before a regular month, with the same number. ICU displays it as e.g. "4bis".
- RGN: Is there any possibility of a second inserted month?
- JGT: No, but you do have to differentiate a combined month from an added month. 
- RGN: I suspect that a suffix like "4L" on its own is enough to be unambiguous within the context of a given year, even if it's not unambiguous by itself.
- JGT: Summarize options in https://github.com/tc39/proposal-temporal/issues/1203#issuecomment-742251527:
  1. `month` is non-numeric
  2. `month` is a numeric index and only applies to the current year
  3. `month` is a numeric index into a sparse list of all possible months, ordered chronologically
  4. `month` is a numeric index into a sparse list of all possible months, with the "normal" months ordered first, followed by the "special" months
  5. `month` is the numeric index of the associated "normal" months, "special" months are indicated with an additional property
- SFC: I disagree with the statement "you can compare year, month, day, for equality". As soon as the year changes, the properties described in option 2 break down.
- JGT: That's right, you need extra calendar fields as soon as you do anything cross-year.
- SFC: Re. option 5, why do you care about year-month-day equality when we have both compare() and equals() methods?
- JGT: We can document that until the end of time, but developers are still going to do it. There are a few situations where it's intuitive to do it that way (e.g. incrementing the day and checking when the month rolls over), and developers would need to know that they can't do that.
- SFC: I think the best thing that we can do is figure out what are the key invariants that we care about. For example, I find it more important to have month numbers be consistent across years. Another one is being able to compare months to see if one is greater or lesser than the other. A nice-to-have is being able to take a month and map that to a human-readable string, e.g. as an index into a resource bundle, which is something that's important related to ICU4X. For these reasons I think we should use option 1, but if for some reason we have to have a numeric month field, then option 3 is advantageous.
- JGT: My preference for option 2 is based on dividing developers into two groups: those who understand the calendar and those who don't, who just stumble on it. The latter group is much larger. I think we should minimize the number of things that developers have to successfully learn in order to deal with a date in someone else's calendar. My view isn't based on particular invariants, but on optimizing the simplicity of explaining what developers have to know about calendars.
- SFC: Why do you see option 2 as easier to comprehend than option 3?
- JGT: There's more to understand: some months don't exist, you essentially can't loop through them or predict which one is next, there could be up to 60 potential month numbers.
- SFC: I don't think option 2 is viable.
- PFC: My opinion is that explainability to developers who don't care about calendars is a good thing to optimize for. That said, we are not experts on this, I don't think we should run the risk of deriving something from first principles, while experts (e.g. the ones at Google who don't have time to look at this right now) might have done this work already and already have good information about tradeoffs.
- SFC: I think we should decide what we want to optimize for. JGT and PFC prefer optimizing learnability by Western developers, and I think that should be a low priority.
- PFC: That's not what I said.
- JGT: I don't care about optimizing learnability by Western developers, the place where this matters is making software work for non-Western end users. I think if option 2 doesn't work out somehow, option 3 is a good second choice.
- We decide to make a list of the possible priorities in a new explainer file in the repo.
- RGN: I'm concerned about the relative isolation of this discussion. I posted a link to how this is handled in iCalendar which is an `L` suffix on the number.
- JGT: I'm not sure that will work for the Hindu calendar where months can be combined.
- USA: Maybe JGT and I can talk asynchronously about this.
- RGN: I'd also prefer not to output human-readable information in this position because that risks bypassing localization.
