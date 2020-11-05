# May 7, 2020

## Attendees:
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Philip Chimento (PFC) 
- Daniel Ehrenberg (DE)
- Shane F Carr (SFC)

## Agenda:
### [#294](https://github.com/tc39/proposal-temporal/issues/294), idToCalendar / idToTimeZone; follow up after discussing with SES?
- RGN: I brought this up at an SES meeting. It was difficult to get a yes or no answer, but I believe as long as Temporal is virtualizable it meets the requirements.
- USA: So, the fromId mechanism would work?
- RGN: from as well, they are the same from their perspective.
- PFC: What does virtualizable mean in this context?
- RGN: The ability to present something that from the code's perspective is indistinguishable. So, if Temporal is virtualizable, the host can spin up a compartment and hand it a Temporal object with which it cannot distinguish whether it's running on the host or not.
- USA: Does from vs. fromId have implications for other APIs such as with or withCalendar?
- SFC: I think the time zone and calendars are the only pieces of Temporal that are implementation-dependent. If you override Temporal.TimeZone.from and Temporal.Calendar.from and Temporal.now, is that everything that 
- PFC: `Temporal.TimeZone[Symbol.iterator]` as well.
- RGN: Presumably `Temporal.Calendar[Symbol.iterator]`?
- PFC: That doesn't currently exist, but I'm not sure why the TimeZone one exists in the first place.
- DE: That would be good to ask PDL.
- RGN: Through these discussions it's become clear to me that Temporal.Calendar and Temporal.TimeZone should mirror each other.
- SFC: If you add a custom calendar or time zone, then you'd want it to show up in that method.
- PFC: If you override the Symbol.iterator method, then it will.
- DE: We have discussed many times about one from vs. multiple fromSomething methods. In the absence of any preference from monkeypatching customers, I think we should do whatever is simpler in light of our previous discussions, which is from.
- RGN: Agreed with that preference.
- PFC: I'm fine with from as well.
- SFC: I'm fine with it, but I don't want to conflate this with the withCalendar discussion.

### [#517](https://github.com/tc39/proposal-temporal/issues/517), comparison operators
- USA: DE requested to give opinion here.
- DE: I was initially skeptical of using operators because it violates our strong typing discipline. We had separate types for a reason. By casting to numbers we're subverting that. I'd prefer to add a feature like this if we had a way of operator overloading, and otherwise not. If we make valueOf throw, then we'll be open to adding operator overloading in the future, but if we make them cast to strings or numbers then we'll always be stuck with that. I have a hunch that people don't use the ability of legacy Date to cast to number all that much. What does everyone else think?
- USA: I agree, strong typing is a motivation from the beginning of the proposal. There's nothing stopping anyone from revisiting this once the proposal has landed in the spec and overload the operators. I'd rather not be stuck forever with a weaker comparison mechanism.
- DE: I do want to be clear that we don't know whether operator overloading will ever happen.
- USA: If we reach a point where there's no operator overloading and people really want that feature, then we can go back and add the functionality in a separate proposal.
- RGN: Right, the compare functionality already exists, it's just a question of whether we lock down comparison with operators by defining a valueOf that throws. Personally, I'm fine with that.
- SFC: Given the choice between valueOf returning undefined or throwing, I think throwing is fine since it keeps the possibility open for the future. That said, the way comparison has always worked in JavaScript is converting to numbers, and a lot of other types have this conversion to numbers. You lose the ability to find the provenance of that number, but the functionality has some value. I don't see much risk in that behaviour. It seems hostile to break binary comparison operators for the sake of what's basically a theoretical safety argument. I think a reasonable approach is to pick one, and highlight that in our next presentation at plenary, and see if anyone objects.
- DE: I like that approach. In addition, I think it'd be good to ask existing JavaScript date library authors whether there this comparison is a requested feature.
- SFC: What does moment.js do?
- PFC: I think library authors don't have the same considerations as we do. If we knew for sure that operator overloading would never happen, I think we'd be more open to adding the binary comparison operators.
- SFC: We're also assuming that built-in modules would never exist.
- DE: I disagree, even if we knew operator overloading would never exist I think the other reasons for not casting to a number are still sound.
- USA: Since we have a compare method, I don't see how exploding the binary operators would be that hostile.
- DE: We've gotten people writing into the issue tracker asking for `+` to work, for example.
- SFC: It does appear that moment.js has a valueOf.
- DE: So the question to ask MPT is, do people run into problems with this, and what does she recommend.
- RGN: We're in an interesting situation where, for all the types currently in the library, it's possible to define a valueOf with meaningful results for comparison within the same type. The problem is cross-type comparison and that's the tradeoff of convenience vs. correctness. I think we'll be directing people to use the compare method anyway, so this decision is relatively unconsequential.
- SFC: Why would we need the compare method if we have valueOf?
- DE: We added it when we decided not to have valueOf.
- RGN: It's useful for passing to Array.sort.
- DE: I'm not convinced it's that useful, you can write your own arrow function.
- RGN: Sure, code authors can do it, but that's a burden that we've opted to relieve them from. We could remove it, but it is more than just a replacement for comparison operators.
- DE: I like SFC's idea of highlighting the choice in the next committee update. In the meantime, let's ask MPT and MAJ what their recommendation for the default is and make the decision based on that.
- Consensus with the above.
- Action for USA: Ask MPT and MAJ about this before the next meeting.

### [#293](https://github.com/tc39/proposal-temporal/issues/293), calendar serialization in toString()
- SFC: I think there's some renewed relevance for this particular issue. Currently the string returned from toString doesn't capture calendar information, so you lose information when roundtripping through a string. The problem is YearMonth and MonthDay; it's not possible to convert them to an ISO string if you're not in the ISO calendar.
- PFC: As I learned yesterday we actually removed withCalendar from YearMonth and MonthDay for exactly this reason.
- DE: Can we give some ugly output like `[object YearMonth]` which can definitely not represent an ISO string?
- SFC: Even if we take the suggestion of separating out the toString and toISOString, do we delete toISOString from YearMonth and MonthDay?
- DE: I can understand that there's not a lot of appetite for separating out those methods. It seems the options are have toString return undefined, return a special string e.g. in square brackets, have it throw an exception, or declare YearMonth and MonthDay to have reached a fatal flaw and remove them.
- SFC: It could also return a calendar-dependent string that is able to roundtrip.
- DE: What happens then if you call toString on a YearMonth in the Hebrew calendar?
- SFC: The Hebrew calendar would decide what to output.
- DE: So it would return an ISO string sometimes?
- SFC: I've avoided crossing this bridge until now, because I don't think Temporal should be in the business of defining serialization formats for all calendars. But it's an option.
- USA: Are we going to change from to accept non-ISO strings then?
- PFC: Technically, `MonthDay.from('MM-DD')` is in a gray area already as to whether it's an ISO string.
- USA: I think for interchange people should generally use ISO strings.
- SFC: Another option is to use the refIsoYear / refIsoDay data model. It would be weird, but it's worth writing down.
- PFC: In addition, the calendar-dependent string could either be roundtrippable or not.
- USA: Did we decide to use the Temporal object's calendar in toLocaleString()?
- SFC: We'd still need to discuss that.
- USA: Let's post this list of options on the issue tracker and continue discussing it there.
- SFC: I wanted to add one more variant on returning a string according to the refIsoYear / refIsoDay data model. You can either return a plain ISO string using that data model or you can return it including the `[c=...]` comment that we had previously discussed.
- RGN: If we did that I'd definitely want a toISOString, because then the output of toISOString is really not an ISO string.
- SFC: Now that we've solved the problem of converting calendar IDs to calendars I think it's worth revisiting the `[c=...]` notation.

### List of champions in the README
- USA: The list of champions is out of date.
- SFC: I opened a PR to add myself. You can go ahead and do the same.

### [#522](https://github.com/tc39/proposal-temporal/issues/522), alternative time-telling systems
- PFC: This is about whether Temporal.PlainTime should have a calendar slot. Two questions, 1) Do any current 402 calendars have alternate time-telling systems? 2) If the answer to 1) is no, do we want it in (at least the first) edition of Temporal? I don't know the answer to 1) but my preference for 2) would be no.
- DE: The answer to 1) is no, or  isn't it?
- SFC: I don't know for sure. I don't think ICU has implemented alternate time-telling systems. It may be that there are systems in use that haven't been implemented yet.
- USA: The Shaka calendar has alternate units of time that are used sometimes.
- SFC: It would be good to ask PDL about this.
- PFC: Next steps are to find out the answer to 1) and see if anyone would like to argue for a yes answer in 2).
- SFC: What would be the harm of supporting it? It's consistent with all the other types.
- DE: I'm not comfortable with adding the indirection just because we might need it. I'd rather have a use case for including an indirection for Time calculations.
- SFC: In a DateTime addition, we'd have to put the date addition part through the calendar and then add the time separately.
- PFC: I've implemented it that way in my work-in-progress branch and haven't seen any issues with it so far.
- USA: Would it not be possible to implement this in a follow-up proposal?
- SFC: If we changed the names of calendar methods to have 'date' in the name, then we could add 'time' methods later, and call them if the calendar implements them. That would be a way to be future-proof.
- USA: SFC, are you comfortable with a future-proof approach?
- SFC: I agree with DE that I don't currently see a compelling use case, but I wouldn't rule it out, so I like the future-proof approach.
- DE: I've heard somebody mention a 'trading hours' calendar where if you add an hour to 5 minutes before market close, you get 9:55 the next morning. But I'm not sure why Temporal should be the tool for that.
- USA: As I mentioned above there are also religious rituals where it could be important.
- DE: I see this as different from, say the Hijri calendar which people do use in everyday life and have been using in computers for a long time.
- USA: DE, do you see any objections to the future-proof approach?
- DE: I don't see the reason to add indirection by default without a use case. I'm fine with the proposed future-proof approach.
- Action for SFC: Make a pull request that makes this change in the calendar explainer.
