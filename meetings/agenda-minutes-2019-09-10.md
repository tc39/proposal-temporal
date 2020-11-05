September 10, 2019

Attendees:

	Shane Carr - Google i18n (SC)
	Jeff Walden - Mozilla SpiderMonkey (JW)
	Richard Gibson - OpenJS Foundation (RG)
	Philipp Dunnkel (PD)
	Daniel Ehrenberg (DE)

PD: Update: I was looking over feedback from the C++ side, the polyfill itself, and the repetitive nag/desire for something that resembles a timezone API directly.  As a consequence of that, a lot of the things that came out of the C++ review work better if we have a timezone object.  So what I've done with the timezone object in the polyfill is you say TimeZone.for(name) and you get a TimeZone object that is the same across GC cycles (always the same object), so this way we don't create a billion of them.  That object gives you several pieces of information: the time zone name, the list of offsets within a year, and a list of all the instants when a new offset takes effect (DST changes).  It also gets you the instants for datetime, and the datetime for an instant.  And based on that you have the full data accessible.  So with TimeZone, you no longer need ZonedDateTime, and you can use OffsetDateTime.  That's one collection of changes.

PD: The second set of changes is that Instant was, don't expose the value of the instant.  Having epoch seconds, milliseconds, etc., sounds bad.  It never felt quite right.  So rather than exposing the instant as value, it has methods to extract the epoch seconds, etc., which means Instant is OK.  I've put all this into the PR, and I'll be adding more.

DE: Those APIs that took a string for the timezone.  Are those in place, so you can put a string or TimeZone, or do you have to make a TimeZone?

PD: Both are in place; spec-wise, toString is called on the argument, and then TimeZone gets created from it.

PD: Duration gets an ISO 8601 method for string round-trip.

PD: The last big change is the local namespace, which I think is the most controversial.  The Local namespace, Temporal.Local, contains Instant, the current time in hi-fidelity, Instant.TimeZone, the current system timezone, and Date, DateTime, ZonedDateTime, etc.  That gets filed with the current value.  Because they're not in any constructors, like new Date, I think that's a good compromise between the ergonomics and the needs of SES/Security, because you can mock those out with less-precise needs, in a single spot.

DE: Where are those accessed from?

PD: Temporal.Local.Instant

DE: The other option would be to just not provide those methods?

PD: Yes, except a lot of the feedback from the polyfill is that people expect a starting point.  A lot of apps start with "today".  You would have to go through a lot of steps to convert from Date.now(), which is painful for users.  If we put the system information in one specific spot, then hopefully that is OK.  I hope to have that discussion with Mark, etc., at TC39.

DE: Did you talk about being an object without the Civil prefix?

PD: Yes; the Civil prefix has been dropped since they are in the Temporal namespace: Temporal.PlainDate, Temporal.PlainDateTime, etc.

PD: On ZonedDateTime, we removed withZone, since it is ambiguous about whether it keeps the Instant or the DateTime form.  So now you have to be explicit.

PD: The last big addition is Instant.compare, DateTime.compare, etc., which are static functions that you can use in Array.sort, which sort those types.

PD: The polyfill already reflects these changes.  I hope to involve Ms2ger to write the spec.  My goal for TC39 is to have the spec, polyfill, docs, etc., all done, asking for a full Stage 3 review at that point, since that is the first point when we have all our ducks in a row.

SC: What form is the time zone name?

PD: It could be an IANA string (America/New_York), or "+HH:MM".

SC: How does it round-trip?  If you give America/Miami, do you get America/New_York back?

PD: The polyfill goes off Intl.  I used the resolvedOptions.

DE: Temporal should call into Intl canonicalizeTimeZone.

SC: Since TimeZone is becoming a first-class object, should we revisit adding time zone names to Intl.DisplayNames?  Users might expect a toLocaleString function.

PD: I feel it's a can of worms that I don't want to be a part of this proposal.

DE: I'm OK with the status quo.

JW: When you said that you want to get the list of offsets within a year, that is a list of instants.  Should that be a list of DateTime or something else?

PD: They have to be Instants because it reflects the exact time when the shift happens.  For example, for a DateTime, there might be more or less than one instant that reflects that (2am skips to 3am, or 3am rewinds to 2am).

JW: The way that people are used to thinking about offset changes is, "March 15 at 2am".  So it seems weird to map that onto an instant.  I see that in the timezone database.

PD: Those strings are used for you to calculate the instant at which the change takes place.  They are not used in the implementation.

RG: I wanted to bring up Duration.  I saw some spec text that indicated that negative durations are not supported.  I think that's a necessary capability.

PD: Negative durations are not supported by ISO 8601 strings either.  We support them secondarily, because you can use the + or - operations on them, taking differences, etc.  But the difference between two times is never going to be negative.  If you have a date, say August 1, 2018, 12:00:00, and August 2, 2018, 8:00:00, which is afterwards, you have the time part, which is negative, and the date part is positive, and now you have a mix.  So you really want the difference between two dates and times, which is a length of time, a duration.  With + and -, we can do the addition and subtract, and you can do it explicitly, but the duration value is always positive.  It makes life simpler, but you can still do the math you need.

RG: I agree it's possible to recover it, but that's the nature of my objection.  + and - are operations, but Duration is state.  Before we introduced compare, you couldn't even tell the order.

PD: That's why compare is important, but for me, I think going with ISO 8601, saying durations are never negative (there's no syntax to express negative durations), I would rather follow that route.  We need compare anyhow for list sorting, and I would rather go down that route.

DE: Would it be possible to throw an exception if you ask for the difference in the wrong order?  That would follow what we did with Intl.DateTimeFormat.prototype.formatRange.

PD: It makes sense to subtract the smaller from the bigger.  Throwing an exception makes it not as nice as a usability issue.

DE: It seems weird to be handling dates where you don't know which one is greater.

PD: It seems like the expected behavior to me to just get the difference.

DE: Would this fix your issue, RG?

RG: I think it would highlight the issue for authors.  This solution doesn't solve it.  The solution in user code is an object that has a Duration as well as a sign.

PD: I have DateTime A and B, and I get the difference between them.

RG: I'm working on an issue to collect use cases that people want to be able to do with Temporal, which would provide a reference point to help discussions like this.  For example, the introduction of compare means that users now have all the tools, so now the question is whether the tools are clear and easy to use.

PD: My suggestion would be (a), let's leave it as-is for now, and remember that this is something we need to discuss, and (b), we can have a meeting in New York where we hash this out.

DE: I have some more bikeshedding issues.  When you do toString on a timezone, we should follow what we decided for Intl.Locale, where in cases where you can take multiple types, you should check the internal slot, and use the object directly.  Because we don't want to create vectors where you override the toString method.

PD: For TimeZone, I agree.  For others, maybe not, …

DE: This is just a way to say, if you mess up your environment, you don't get these weird effects.

RG: To dig in on that a little bit.  If you have an input where duration is expected, there are 3 cases: you have a real Duration, you have an object which has the same fields as Duration, or you have something else.  You have a string that can be deserialized into a Duration.  If you have an object that could be a string, or something exotic like an object that has a toString method, which takes priority?

PD: You both said about the same thing, and I think you're both right on it.

DE: So we never call toString?

PD: No, you get in an argument.  If it has a duration slot, use it straight on.  If no, does it have year/month/day/hours/etc?  If it has at least one of those, create a duration using what it has.  Else, use toString.

DE: That sounds more complex than what we normally do in JS standard libraries.  Checking whether a property exist doesn't really happen.  We read from a property, and undefined turns into NaN.

PD: I would be getting year/month/day/hour/minute/second, etc.

DE: This is kind-of an anti-pattern.

RG: We should first make sure we preserve Duration, and then go through the details about whether you choose something is string-like or object-like.  Where else has this come up in the web platform?

DE: WebIDL overloads in restricted, limited ways.

RG: I'm specifically referring to a case where the overload is object or string.

DE: Generally, overloads are difficult.  If we do overload, it should be in a limited way.

DE: Next topic.  About using the same TimeZone object, that's a big no.  It's like document.getElementsByTagName.  We added WeakRef, which makes GC visible.

PD: The heuristic I wanted is, basically TimeZone.for() gives you a TimeZone object.  You don't construct an object.

DE: Oh, OK.

PD: If you do TimeZone.for() 5 times in a row, you should get the same object.

DE: Yeah, but I think you shouldn't do that, because of standards across the web.  You could say that within the TimeZone object, you could say that you have an internal structure used within other classes.  And you never actually construct a TimeZone unless the user specifically asks for it.

DE: Finally, you mentioned you have methods to getEpochSeconds, etc., instead of getters.  It just sounds like it doesn't accomplish anything.

PD: To me, two different properties of an object should not have the same semantic meaning.  If I am at epoch absolute zero, the meaning of getEpochSeconds and getEpochMilliseconds is the same thing, just at different granularity.  Different properties to get the same thing with different granularity seems bad.

SC: Could you have a getEpochDuration, and let the Duration handle whether you have seconds, milliseconds, etc?

PD: I don't get it.

RG: Non-method properties should be orthogonal from each other.

SC: I'd also like to iterate on Intl integration offline.

DE: And publishing the polyfill before the TC39 meeting, does that sound good?

SC: For TC39, the global object route may be controversial, even more so than the other details we've been discussing today.  We should be prepared with several arguments in favor of global object, not just the timeline problem.

DE: Built-in modules are stuck at Stage 1.  Let's not bikeshed on any other issues.

PD: Let's sync in New York to go over the presentation.

