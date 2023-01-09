# May 11, 2022

## Attendees
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- Aditi Singh (ADT)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)

## Agenda

### Recursive calendar/timeZone property bag edge case ([#2104](https://github.com/tc39/proposal-temporal/issues/2104))
Recommendation from JGT and PFC: do nothing, close issue
- PFC: The code example in my comment from March 18 is a bit of a red herring because it uses `toString()`.
- SFC / JGT explain the issue.
- RGN: I think this is worth fixing.

Come back to this next time.

### Calendar annotation in Instant string ([#2143](https://github.com/tc39/proposal-temporal/issues/2143))
- JGT: I feel strongly that this should be supported.
- SFC: Do we currently ignore time zones in this function?
- JGT: No.
- SFC: Then that's inconsistent.
- PFC: It's not clear-cut because Instant uses the time zone offset.
- SFC: What does it do if the offset disagrees with the IANA annotation?
- JGT: It ignores it.
- PDL: I agree, this is a spec bug.
- SFC: We should either ignore both IANA and calendar, or reject both IANA and calendar.
- RGN: Does "fixing it" mean that anything syntactically valid is accepted and ignored?
- PDL: Yes.

**Consensus:** This is a spec bug and should be fixed. 

### Special-case -00:00 offset ([#2113](https://github.com/tc39/proposal-temporal/issues/2113))
- PFC: I'm skeptical of this because it conflicts with ISO 8601 and I wonder how many applications actually treat -00:00 as what RFC 3339 says.
- PDL: What is the practical difference? It seems to me there may not be any. We can parse this into an Instant either way.
- JGT: The main question is when you are parsing a PlainDateTime from an ISO string with UTC offset -00:00. According to RFC 3339 we wouldn't know what the local datetime is.
- PDL: That's why we called it PlainDateTime rather than LocalDateTime.
- JGT: I don't have a strong opinion. It makes us less compatible with RFC 3339 but I'm not sure how often -00:00 is used.
- PDL: Agree, and I'm not sure there actually is an implication for us.
- JGT: Another case where it might be different is using `offset: "reject"` in `ZonedDateTime.from()`.
- SFC: Can you get that behaviour with Z?
- JGT: Yes. My proposal if we do want to change anything is to treat -00:00 like Z.
- SFC: The text from RFC 3339 mentions that -00:00 differs from Z and +00:00, but you're proposing to treat +00:00 different from Z and -00:00.
- JGT: We do treat Z differently because in practice many apps and environments (like Java) use Z to represent what RFC 3339 says -00:00 represents.
- SFC: If we can fix this in USA's RFC I think that'd be the best place to solve it. Specify Z to mean what Java uses it to mean, and keep -00:00 and +00:00 meaning the same thing.

**Consensus:** Not change this in Temporal, but see whether it's possible to standardize the Temporal behaviour in IETF.

- JGT: If the IETF draft ends up saying that -00:00 has this special meaning for legacy reasons, would we change it?
- PDL: I would say no because we are primarily parsing ISO 8601 strings.
- SFC: I'm slightly in favour of retaining -0 for future-proofing but I don't feel strongly.

### Instant.toString with UTC time zone ([#2057](https://github.com/tc39/proposal-temporal/issues/2057))
- SFC: This is kind of like the last issue. If we see a Z, is it considered an offset time zone or an IANA time zone?
- JGT: It's considered an offset in every case except when we are trying to get a local time.
- SFC: Note the behavior:
```js
Temporal.TimeZone.from("2022-02-28T03:06:00Z").toString()
  // => 'UTC'
Temporal.TimeZone.from("2022-02-28T03:06:00+00:00").toString()
  // => '+00:00'
Temporal.TimeZone.from("2022-02-28T03:06:00[UTC]").toString()
  // => 'UTC'
instant.toString({ timeZone: "America/Chicago" })
  // => '2022-02-27T21:06:00-06:00'
instant.toString({ timeZone: "UTC" })
  // => '2022-02-28T03:06:00+00:00'
Temporal.Instant.from('2022-02-27T21:06:00-06:00').toString()
  // => '2022-02-28T03:06:00Z'
```
- SFC: We consistently output "Z" on no-argument Instant.prototype.toString, even if the string contained a non-Z time zone, and we consistently output an offset when toString has an argument. I like that consistency.
- PDL: I think this is behaviour that we already talked about. We chose the current behaviour because it was flexible.
- JGT: What do you expect would be the output of `{ timeZone: "UTC" }`?
- PDL: `+00:00[UTC]`
- RGN: Instant.toString never outputs brackets.
- PDL: Still, `+00:00`. Having the option leaves the developer the choice of which one to get.
- RGN: I agree because there are a number of aliases to UTC.
- JGT: The aliases to UTC are all canonicalized to UTC.
- RGN: Even `Etc/Zulu` and `Etc/Universal`?
- PFC: I think they are only canonicalized in ECMA-402.

**Consensus:** Keep the current behaviour.

### Follow up to options bags in Duration.round ([#1876](https://github.com/tc39/proposal-temporal/issues/))
- JGT: The idea here was that you only get one "bite at the optional apple". JHD is saying that because either the string or the property bag is required, if you use the property bag, the option that the string represents should be required.
- PFC: This doesn't make sense to me because JHD was the one who objected to options bags with required properties in the first place.

We'll come back to this. JGT will try to read up on it.

### Access of era and eraYear fields ([#1789](https://github.com/tc39/proposal-temporal/issues/1789))
- SFC: How about specifying that the fields must be accessed in alphabetical order and only the ones you need? This is related to [#2169](https://github.com/tc39/proposal-temporal/issues/2169). There are going to be other fields than era and eraYear.
- JGT: This is only about ECMA-402 text?
- PFC: I think so. How about I take an action to come up with some language that admits other calendar-specific fields.

### Break from ToIntegerOrInfinity precedent ([#2112](https://github.com/tc39/proposal-temporal/issues/2112))
- RGN: This was very surprising to me and seems like a bug factory. I think we should throw a TypeError in these cases.
- JGT: Would you still want to accept "6" as a string?
- RGN: Yes.
- JGT: So we'd essentially have to have our own version of ToIntegerOrInfinity.
- RGN: Temporal already does have ToIntegerWithoutRounding.
- JGT: So you're suggesting we change ToIntegerWithoutRounding to reject `NaN`?
- RGN: I don't have a particular solution in mind.
- PFC: Are you also concerned about e.g. ToIntegerOrInfinity in the PlainDate constructor?
- RGN: Less so, because ToIntegerOrInfinity doesn't treat fractions specially. But e.g. `new Date(2022, "foo")` returns an invalid date, and Temporal should not be _worse_. Anywhere a number is expected, non-numeric input should not be coerced to zero.
