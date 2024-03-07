# April 27, 2023

## Attendees
- Chris de Almeida (CDA)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)

## Agenda

### Status reports
- IETF document progress
    - RGN: Cherry-picking of Justin's changes but no movement in the past week or two since that happened.
- Duration upper bound progress
    - PFC: I think we might need to bound the calendar units as well, or at least days. I found a code sample that will get you back into unbounded arithmetic unless days are bounded:
    ```js
    const d = Temporal.Duration.from({
      days: Number.MAX_SAFE_INTEGER,
      seconds: Number.MAX_SAFE_INTEGER,
    });
    const d2 = Temporal.Duration.from({
      days: Number.MAX_SAFE_INTEGER,
      seconds: Number.MAX_SAFE_INTEGER - 86400,
    });
    Temporal.Duration.compare(d, d2)  // => 0
    ```
    - RGN: I'm not too surprised.
    - RGN: We could probably make this work by working with [days, daysFromSeconds, secondsRemainder] tuples, but that would be harder if it also shows up outside of `compare`.
    - RGN: I could see including days within the seconds-and-smaller constraint, with the justification that days are _sometimes_ convertible so are _always_ checked.
    - Summary of discussion: we'll consider days to be part of the time units and therefore subject to the upper bound. Days can be 24 hours when determining whether a duration fits within the bound, because even if the days are different lengths, it averages out for such large numbers of days.
- Other progress towards May meeting
    - PDL: I've been in touch with a tech journalist who would like to do a piece on Temporal. Just verifying that after the May meeting, we intend it to be true that we're just waiting for implementations and have gotten all the feedback into the spec that we're aware of from implementors.
    - PFC: Current status is that we will present 3 things: Duration upper bounds, the change from the IETF on multiple calendar annotations, and a request from Anba on duplicated fields in CalendarFields for implementation efficiency.

### Another duration rounding bug? ([#2563](https://github.com/tc39/proposal-temporal/issues/2563))
- PFC: This seems like a real bug. We should investigate whether it's a problem in the spec text or just in the polyfill.
- CDA: Was the related issue a bug in the spec?
- PFC: Yes.
- PFC: If it's really a bug in the spec, then it's a clear enough bug that I think we should present it in May.
- RGN: Agreed.

### ABL's feedback on validation of non-integer values ([#2528](https://github.com/tc39/proposal-temporal/issues/2528))
- PFC: To me this seems like a situation where you have to pick one or the other, and we picked one. I don't think this needs to be changed.
- RGN: I'm inclined towards changing it but I wouldn't be upset if we didn't.
- CDA: There's no substantive difference.
- RGN: Right, this will never be encountered by practical code, it's just a sharp edge.
- RGN: If the ECMA-402 issue ([#691](https://github.com/tc39/ecma402/issues/691)) is possible to change, it's probably possible to change this as well in the future. This is probably the way that 262 and 402 are headed, and may be changed after the fact, only with Temporal we have a chance to change it before the fact.
- PFC: I prefer the current behaviour, I think `fractionalSecondDigits: -0.5` should throw. And I'd prefer to change it after the fact if 402 and 262 end up aligning on the opposite behaviour, because it's easier to change from throwing to not throwing than vice versa, regarding web compatibility.
- RGN: Which properties does this apply to?
- PFC: Only fractionalSecondDigits; roundingIncrement is only positive integers.
- RGN: Since 402 does not yet truncate before range validation, I think we can close this and resolve to make a minor normative change in the future if/when 402 makes a similar change.
- PFC: Agreed.

### ABL's feedback on date difference order of operations ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- PFC: This one also seems to me like equally valid options and we picked one.
- RGN: I don't think we picked it arbitrarily.
- PFC: Agreed, the principle we were using is reversibility. I'm not sure if the Java behaviour preserves that principle.
- RGN: There are multiple ways to define reversibility, though.
- PDL: The definition of reversibility, if I have two dates A and B, if A.difference(B) is D, then A.add(D) is B and B.subtract(D) is A. Addition and subtraction need to be commutative.
- RGN: There are other definitions of reversibility that could be useful.
- PDL: I find commutativity important and other than that I'm fine with 'doing what everyone else does'.
- RGN: Why the insistence on commutativity though? That definition of reversibility might not be as useful as other definitions.
- PDL: Those are basic calendaring operations. A + D == B ⇔ B - D == A
- RGN: A definition could also be A + D == B ⇔ B + (-D) == A.
- PFC: In all the add() and subtract() methods we currently define subtraction as addition of the negated duration.
- PFC: Although I'm not sure if commutativity is preserved in the example Anba gave, because it uses `overflow: "constrain"`. We have `overflow: "reject"` so that you can weed out the cases where commutativity is not possible.
- RGN: Looking at the examples, I think the Java behaviour might be more useful.
- PDL: Why?
- RGN: It compares January 28, 29, 30, and 31, to February 28. Temporal gives 1 month for all of those, Java only gives 1 month for 01-28--02-28 and otherwise days. Temporal also behaves differently when we compare the 27th of the month, which suggests there is an issue with consistency.
- PFC: Could this just be a bug in the spec?
- RGN: It could be.