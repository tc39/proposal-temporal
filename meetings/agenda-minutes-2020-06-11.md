# June 11, 2020

## Attendees

- Shane Carr (SFC)
- Justin Grant (JGT)
- Jase Williams (JWS)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Younies Mahmoud (YMD)

### Agenda

### "Exotic internal slot" hazard

- RGN: Fundamental concern: a reified getter that reads from a private slot containing an object is an object with a dangerous superpower—it can bypass deep freezing (forming a surreptitious communications channel) and breaks when the receiver is a proxy. If the intent is to mimic an own data property on instance objects, then why not just have the own data property in the first place? I haven’t checked the extent to which Temporal is affected.
- SFC: Probably the internal slots holding time zone and calendar references.
- PDL: We might just have own data properties, or possibly replace the getter with a method that returns a copy of the relevant object. We could also make the objects actually immutable.
- SFC: Would it work to reference common calendars by string rather than as objects?
- PDL: No, because that would break SES attenuation. We previously considered and rejected the concept of calendar registries. It’s also very distasteful to have the references sometimes be strings and sometimes objects.
- RGN: We don’t need a solution right now, but I encourage everyone to keep this hazard in mind. It will come up in the next TC39 plenary.

### [#608](https://github.com/tc39/proposal-temporal/issues/608) Negative Durations

- JGT: Most concerned about breaking changes is the negativity, I did a review of other platforms and libraries in JavaScript (plus C++ and Java), couldn't find any other libraries that did NOT have negative durations. I just wanted to understand the history of how we ended up with single-signed durations, what are the advantages I'm not aware of that countervailed every other library.
- PDL: I see JGT's argument as, everyone else is doing it, so why not me? That's a weak argument. I assume there's more arguments that I don't understand. About why durations are currently unidirectional, the idea was that a duration was not originally intended to be a thing in itself, an independently useful value. It's simply a consequence of doing date arithmetic. It follows the same rules that numbers do in JavaScript. There's no negative number literal in JavaScript, just a negative operator with a positive literal. I'm yet to see negative durations as an actual negative value break date arithmetic, because subtraction and addition of time units is a different order of operations, and because we don't have a duration contain just one number, as a property bag approach, what happens for the case when I now have differently signed parts? I have to make sure everything is either all positive or all negative, but then I still haven't resolved the order of operations: `plus(negative duration)` being different than `minus(positive duration)`. I think there are only a few people on the planet who understand all the nitty-gritties of date arithmetic. In my opinion, negative durations add an order of magnitude of complexity to something that could break things very badly. In my mind, negative durations need to carry significant weight on its own as a value-add to be worth it.
- JWS: If negative durations are so widely used, it would be good to understand why.
- PDL: When I did that, they were usually a case of, we have positives, so why not have negatives? But it actually causes issues in date arithmetic that go unresolved.
- JGT: I filed another issue around order of operations (https://github.com/tc39/proposal-temporal/issues/653). Why is the order between plus and minus different?
- PDL: It comes down to whether you balance before or after, what you expect the operations to do relative to one another. A date _A_ plus a duration _D_ that results in date _B_ should then be able to say, date _B_ minus duration _D_ results back in _A_. So, operations are commutative. If you want commutativity, it means you need to round and rollover and different points. And I think that commutativity of arithmetic is a key feature.
- JGT: How does commutativity relate to daylight saving time disambiguation?
- PDL: We don't have to ever disambiguate daylight saving time, because we either operate on the absolute time or on wall clock time. By eliminating ZonedDateTime, we removed the requirement to perform that disambiguation.
- JGT: That complexity still exists, but it's now pushed to user land. So I don't think that solves the problem, it just moves it.
- PDL: You are correct. The difference is that the user can make a value call. They know the problem set they are specifically facing. The user knows whether commutativity for them is a benefit, or how they want to resolve daylight savings time. The reason we can't make the solution isn't because we can't make a solution, it's because we don't know the problem the user is solving. So we push the problem explicitly up to the user.
- JGT: Your point that there are only a few people who really understand how datetime arithmetic work also says to me that we should be the ones who make those decisions.
- PDL: We should stop giving people footguns. Very few people will understand it. So then they will find plus and minus.
- JGT: Let me go over some more use cases for negative durations. If your app doesn't know in advance which time is first or second, a negative duration is helpful. If I want to measure the delta between when an event happened and when the event was expected to happen, like a flight tracker, you want to take the 5 most recent differences and take their average. Negative durations make that operation less complex. By extracting the sign out, you simply add more branches in your code, which means more need for test coverage, etc.
- PDL: That's precisely the reason I said not to have negative durations. Your example imagine you have a flight tracker that usually has flights delayed, so you're expecting (in your test coverage) that your intended time is earlier than your expected time, so you just do the difference between A and B and you expect the duration to be positive, you add that duration to somewhere else. Except now, you have the scenario where the flight arrives early, so your duration has the wrong sign and now you lose coverage for your test, and now you have the tricky situation where you're doing plus and negative arithmetic that you'll never be able to catch. So in my view, by introducing negative duration, to remove a few if statements, you are introducing subtle bugs that are difficult to debug.
- JGT: The specific error case I'm concerned about is, if you assume the flight is always going to be late, and sometimes it's not, it's more likely that getting a negative result where you expected a positive result would cause some downstream consequences. However, by getting back always a positive result, that also causes subtle problems, too. So you're trading one subtle issue for another.
- PDL: Yes, except I'm also making that choice close to where the problem is, and I want the problem to be as close to the source as possible. So the problem was that 1 flight was earlier than the other, so the problem is really that the difference method and the handling of data afterwards did not take into account the order of events. That's where my error is caused, and I want the error to manifest as close as possible to that point. Now if I treated "correctly" into my database except only when I add other days in my error. So where I agree with you, where I would be happy to go, would be if we required the difference method to always be called in the same direction. I'm happy to make it more strict, so that you get the surprise immediately, an error thrown.
- JGT: If you require the order, you find the problem immediately.
- PDL: The argument against that is that JavaScript itself is a very lenient language so that kind of strictness is not a thing. So then you ask "how can I make it as strict as possible while being fairly lenient?" If you ask me, we could throw at that point.
- JGT: It feels like there's two safe options to reduce the chance of unexpected, nonfatal problems. If it throws an error, and you find the problem right away, that's good. If it returns a strange value and passes it downstream, that is more problematic. Then we're back to talking about the ergonomics of having to pass a duration along with a sign bit.
- PDL: If you're now subtracting, you say A - B, now you're expecting something that has a sign, but by calling it difference, you're declaring that it is a positive scalar.
- RGN: It seems like the naming of difference implies an absolute value behavior, but what we might need is a replacement for difference that makes directionality clear.
- PDL: I think a signed duration is a problematic thing to begin with. A negative duration with plus just wreaks havoc.
- SFC: Can you make .plus(negative duration) have the order of operations semantics as .minus(positive duration), and remove the .minus method? And make duration.negate() perform any necessary transformations to retain the commutativity.
- PDL: so you're suggesting we do the order of operations depending on the sign of the duration?
- SFC: Yeah, choose the order of operations based on the sign of the duration.
- PDL: Yes we can, it comes down to whether we value the warning that people get by having to think about what they do with their durations, by stating "you can have a duration one way" is just a hint for people to be clear on what they're doing. We can hide that away, and if we ...
- JGT: The main thing for me is that `.difference()` doesn't produce positive durations in both directions, because that is unintuitive and can cause big bugs.
- PDL: We could rename that method to `.absoluteDifference()`, or something like that, and your problem goes away.
- JGT: Regardless of the name, if your purpose is to calculate a signed difference, it's hard to do that with the current API, and the name of the method doesn't help that.

### [#613](https://github.com/tc39/proposal-temporal/issues/613), `timeZone.prototype.getTransitions` mismatch with real-world use-cases

- JGT: I went through use cases for finding DST transitions. If I come into work on Monday and I open up my mission-critical logging application and I want to know why Saturday's activity is 7% higher than it usually is? It would be useful to know if there was a DST transition, both forward and backward. Second, the iterator is a nice trick, but I'm not aware of use cases if you need to look into the future for DST transitions. My suggestion would be to change that API to a getNext() and getPrevious().
- PDL: So the iterator does exactly what getNext() does, right? So the question is whether we have a reverse to that.
- JGT: I think the reverse is more important as that affects use-cases where as the forward is more about convenience and ergonomics.
- PDL: Ultimately, the reversal I understand, whether you do it as an iterator or as a next method with an argument (from when??), doesn't make much difference to me. It comes down to, I don't actually see the use-case. I see it more as a manual use-case. I don't see that as an actual use-case in code.
- JGT: If I'm building an application for people making those judgements, the users who come in on Monday morning they would like to see on their UI saying "guess what, there was a DST transition over the weekend"
- PDL: This isn't something that happens live, more like when I step through, like a mapReduce setup, then you get your DST transitions up to now, then you deal with it and properly mark it up. So I guess I'm unenthusiastic about this being a use-case, and I don't suppose exposing native DST transitions as a native thing is something we should be doing. I accept that that use-case exists, but I'm challenging the relevance.
