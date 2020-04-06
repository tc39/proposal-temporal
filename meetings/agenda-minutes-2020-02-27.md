Feb 27, 2020

Attendees:

* Ujjwal Sharma (USA)
* Shane Carr (SFC)
* Philip Chimento (PFC)
* Ms2ger (MS2)
* Richard Gibson (RGN)

Agenda:

* [#401](https://github.com/tc39/proposal-temporal/pull/401) Any objections to breaking roundtripping for this case?
    * PFC: *Explains the issue*
    * SFC: (looks up syntax in 8601). LGTM
* [#24](https://github.com/tc39/proposal-temporal/issues/24#issuecomment-589898896) Any objections to the proposed range for each type?
    * SFC: What are we putting limits on?
    * PFC: The maximum values allowed to be represented by each type.  For example, it ends up being about 270 thousand years before and after 1970.
    * SFC: LGTM
* [#307](https://github.com/tc39/proposal-temporal/issues/307#issuecomment-588567138) Any objections to merging this now?
    * Default cutoff of hours instead of seconds for Absolute.difference()?
    * SFC: Is it an antipattern to allow DateTime.difference, since the result will not take any DST changes into account? Should we require converting to Absolute to take the difference?
    * PFC: Good question. I guess if your difference is in days or higher it'll be correct, though hours might be wrong
    * SFC: You can convert to Absolute in that case.
    * RGN: I can see dropping difference() or even plus and minus from DateTime
    * RGN: If you convert DateTime to Absolute in UTC, then how do you get a difference in days? Absolute doesn't support difference in days.
    * SFC: It seems we should allow days difference in Absolute after all
    * RGN: What's the use case that would require a difference that includes years/months and hours and seconds?
    * We can't think of one presently, that wouldn't be covered by years/months/days (Date.difference) or days/hours/minutes/seconds (Absolute.difference).
    * SFC: You can take both the Absolute difference and the Date difference and combine them, and in that case the programmer owns the inaccuracy instead of the library.
    * Consensus: merge this PR and open another issue ([#407](https://github.com/tc39/proposal-temporal/issues/407)) to remove DateTime.{plus, minus, difference} so that others can weigh in.
* Should Duration throw in 'balance' disambiguation mode if the total duration after balancing is still negative? E.g. {hours: 1, minutes: -90}.
    * PFC: Am I understanding the Duration type correctly that negative Durations are never allowed?
    * SFC: Yes, if this is possible then it's a bug.
    * SFC: What about {hours: 1, minutes: -30}? (or -20)?
    * PFC: It flips the sign.
    * SFC: Slightly odd but okay.
    * RGN: Does Duration support arithmetic?
    * PFC: No.
    * RGN: It seems like we'd want to support arithmetic and disallow any negative values at all as input. Duration.from(durationObj) should not be less powerful than Duration.from(propertyBag). If you want {hours: 1, minutes: -30} then you should use arithmetic methods.
    * PFC: Duration.difference doesn't seem useful but I can see plus and minus for this use case, now that we're moving disambiguation out of the constructor.
    * SFC: Would it be bad to clamp or take the absolute value in this balance case?
    * RGN: I think that would result in undetected bugs.
    * PFC: Constrain mode would no longer do anything, so we should remove it and pick a different default.
    * MS2: It could become a synonym for reject.
    * PFC: Or it could constrain infinity to Number.MAX_VALUE or something like that, but I don't know if that's a good idea.
    * SFC: We might pick a lower limit or not bother constraining, because adding Number.MAX_VALUE to any other type would exceed the limits of that type.
    * RGN: You might as well allow any integer, because otherwise the limit is arbitrary and hard to explain. You could say the limit is the difference between min Absolute and max Absolute, that's not MAX_VALUE but it's well past MAX_SAFE_INTEGER, and kind of arbitrary where it lands.
    * Summary: Change Duration.from to never allow negative values as input in fields, and add plus() and minus() methods. Open issue for this ([#408](https://github.com/tc39/proposal-temporal/issues/408))
* [#231](https://github.com/tc39/proposal-temporal/issues/231) Do we actually want to use internal slots in with(), plus(), minus()?
    * If yes, only internal slots of the type itself, or of other Temporal types too?
    * PFC: Passing DateTime.with(Date)
    * MS2: You could do DateTime.getTime().withDate(Date) in that case.
    * PFC: Close this for now?
    * MS2: OK.
    * SFC: No strong opinion.
* [#403](https://github.com/tc39/proposal-temporal/issues/403) Should field properties be enumerable?
    * RGN: Seems like it would be useful. It maps to the mental model of these types being like records.
    * MS2: This is something we could ask TC39 for advice on.
    * MS2 included a link in the thread showing that e.g. length and name are not enumerable.
    * RGN: "Unless otherwise specified."
    * SFC: If we have a reason, we can make them enumerable, and I think there may be a reason here. These types could be considered a "glorified struct" so it makes sense for them to be enumerable. We are saying there's an equivalence between a Temporal object and a plain object with the same fields as the Temporal object.

