# Nov 5, 2020

## Attendees:
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Shane F Carr (SFC)
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)

## Agenda:

### Progress towards TC39 meeting
We will intend to deliver the proposal to reviewers by the start of the November meeting, and see if we can go to Stage 3 in January. If not (the reviewers need more time, or the IETF RFC work or Intl.DurationFormat take longer) then March is the fallback.

### What to present at November TC39 meeting
- PFC: DE strongly suggested that we do a tour of the final API in the November meeting.

### Nodeconf Remote workshop, Nov, 6
- PDL: JWS will give a presentation about Temporal. We'll be presenting that, and records/tuples. The main task for volunteers during the first part is to be in the chat and answer questions that come along. The second part is a workshop where people start playing with the polyfills and building apps. Depending on the numbers, we'll use Zoom breakout rooms, so volunteers can join those and help out with explanations. This will be valuable for us to observe developers working with Temporal. The third item is to give general TC39 information and outreach, e.g. telling the story of how Justin was onboarded. There is an optional pre-discussion one hour before the workshop starts.

### `with()` issue [#906](https://github.com/tc39/proposal-temporal/issues/906)
- PFC: I'd like to reiterate our commitment to freezing the API and asking for Stage 3 as soon as possible. This issue needs to be resolved, with a minimum of API additions and changes, or that goal is at risk. I would prefer that any new API additions go to a Temporal v2 proposal which I'm willing to put together and attempt to take to Stage 1 in January.
- PDL: If I look at the latest proposal, we are basically where we were two weeks ago, with `calendar` and `timeZone` throwing. While I don't like that outcome, I still believe strongly that throwing here is a mistake, I don't believe this is an issue that can ever be resolved on the merits of the case. I don't want to hold this up indefinitely. I like `withFields()` but note that `getFields()` does include the calendar and time zone, so that parallel doesn't help us. I'm okay to keep it named `with()`. I'd prefer not having `withPlainDate()` and `withPlainTime()`, I see less of a use case, because you can destructure `getFields()`. That leaves SFC's use case of setting a full PlainTime, and JGT rightfully pointed out to me that this use case is covered by `round()`. So, I propose we throw, not rename, and not add `withPlainDate()` and `withPlainTime()`.
- PFC: Entirely agreed.
- SFC: As I said in my post, I think it's fine that we narrow the use of the `with()` method in this way. Since we are narrowing the use, it's no longer the Swiss army knife that it previously was, and I think it would benefit the learnability of the API if you had to pick from three methods, `withCalendar()`, `withTimeZone()`, and `withFields()`. I have a medium strong preference towards renaming it.
- PDL: I do have that preference as well, but is it so relevant that it's worth the extra effort? I would rename it if everybody felt strongly.
- JGT: Agreed.
- PFC: I don't want to rename it, both for avoiding delay, and because I think that it actually makes the API less clear. `with()` is a pattern that occurs elsewhere in the JS ecosystem, `withFields()` is not.
- PDL: Would people agree to removing `withCalendar()` and `withTimeZone()`, and accepting `calendar` and `timeZone` in `with()` but not Temporal objects?
- JGT: I do feel strongly about keeping those separate. It solves a lot of problems.
- PDL: We could also remove `withCalendar()` and `withTimeZone()`, and throw when `calendar` and `timeZone` are mixed with other fields. That way `with()` remains the Swiss army knife.
- SFC: The calendar knows which fields it knows about, so you could say that if the property bag contains calendar and any fields the calendar is aware of, it would throw.
- PFC: That seems fine.
- JGT: I'd mildly prefer keeping the current split between `with()`, `withCalendar()`, and `withTimeZone()`. It's slightly confusing.
- PDL: But it's only confusing at compile time, because the shape of the object determines whether it throws or not.

#### Summary of options for voting
**"`with()` scalar-only"**, also known as **`withFields()`**: Only scalar fields (year, month, day, hour, …) are allowed.  Unconditionally throw when timeZone or calendar is present in the argument.

**"`with()` Swiss army knife"**:
Scalar fields are allowed without `timeZone` or `calendar`.  `timeZone` and `calendar` are allowed by themselves without scalar fields. Throw if both scalar fields and `timeZone`/`calendar` are present at the same time.

**Options:**
- Option 1: `withFields()`, `withCalendar()`, `withTimeZone()`
- Option 2: `with()` scalar-only, `withCalendar()`, `withTimeZone()`
- Option 3: `with()` Swiss army knife
- Option 4: `with()` Swiss army knife, `withFields()`, `withCalendar()`, `withTimeZone()`
- Option 5: `with()` Swiss army knife, `withCalendar()`, `withTimeZone()`
- Option 6: Twitter poll between method named `with` or `withFields`, `withCalendar()`, `withTimeZone()`

**Ranked-choice voting:**

| Initials | Favourable | Neutral | Unfavourable | Objectionable |
|----------|------------|---------|--------------|---------------|
| **USA**  | 1, 4, 3    | 5, 2    |
| **PFC**  | 2, 3       | 5, 4    |              | 1, 6
| **SFC**  | 1, 4, 2    | 3       | 5, 6
| **JGT**  | 1, 2, 6    | 5, 4    |              | 3
| **PDL**  | 3, 1       | 4, 5    | 2
| **RGN**  | abstain

Some discussion about people's preferences. 4 seems to be positive or neutral for everyone. PDL considers it a 'lazy' solution because it's a consensus meaning we couldn't agree on a more consistent solution, but PFC and USA disagree with this. PFC thinks it's the most work but USA disagrees with that.

Some discussion about accepting strings. PFC wants this to go into Temporal v2.

- JGT: Propose option 2, it's everyone's first or second choice except for PDL and USA, and it's the closest to how it's currently implemented.
- USA: In option 2, can it potentially be expanded to option 4 in Temporal v2? `withFields()` would be a new method, and `with()` would accept cases that it would previously throw on. I am more positive about it in that case.
- We agree to do option 2.
