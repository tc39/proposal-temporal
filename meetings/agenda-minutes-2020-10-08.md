# Oct 8, 2020

## Attendees:

- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Justin Grant (JGT)
- Matt Johnson-Pint (MJP)
- Philipp Dunkel (PDL)

## Agenda:

### Python 3.9 time zone support
- MJP: Python 3.9 added time zone support to date times, and they are using a comma instead of brackets.
- SFC: See also C++20: Documentation, Design Doc (example output of `chrono::zoned_time`: `"2016-05-29 07:30:06.153 JST"`)

### TypedArray API [#964](https://github.com/tc39/proposal-temporal/issues/964)
- JGT: Not about this specific request, but I think an important question is how does Temporal interoperate with WASM?
- PFC: That is a good question to answer! As for the requests in this issue I think they should be cookbook examples.
- USA: I agree that these things are not impossible in Temporal as it is.
- PFC: I don't know the answer to the WASM question, but I would guess that since WASM isn't specific to JS it wouldn't have any specific Temporal types. Anything specific to Temporal would be done when compiling JS to WASM and interoperating with WASM code.
- PDL: WASM works with TypedArray buffers, and nothing else. So we could provide facilities to convert Temporal objects into TypedArray buffers, but I don't think that makes sense because there isn't one standardized way.
- MJP: Seconded, this is best done in userland. There are many different ways that WASM code could expect the binary data to be serialized.
- SFC: Strings are our recommended serialization format.
- PDL: Strings are always going to be the most compatible serialization. We don't want an ISO 8601 binary format.
- JGT: Are the strings ASCII? Can time zone and calendar names be Unicode?
- MJP: Time zone names are max 14 ASCII characters per slashed component.
- SFC: Calendar names are BCP 47 subtags, or (2/3)-8 ASCII.
### toString() precision [#329](https://github.com/tc39/proposal-temporal/issues/329)
This is actually the same as [#703](https://github.com/tc39/proposal-temporal/issues/703).

### LocalDateTime name [#707](https://github.com/tc39/proposal-temporal/issues/707)
- JGT: I've been holding the Twitter poll because of the discussion we've been having with JHD. I'm not sure how to proceed.
- PDL: It's clear that NaiveDateTime is not going to pass JHD. I think arguing that point will waste time.
- JGT: If nothing else I'd like to include Naive in the poll in order to capture people's second choices.
- USA: JHD mentioned he was OK with Local, Plain, and Civil.
- PDL: We ruled out Local.
- MJP: I think Local should be in the poll because it's in use in other platforms.
- PDL: I think Local is confusing.
- MJP: I agree it's confusing, but I think it's important to include it as a choice.
- PDL: It's also easily confused with Locale for non-native-English speakers.
- MJP: It sounds like we have good reasons for having a prefix and for the prefix not to be Local, then.
- JGT: So, we will put Plain, Civil, and Floating in the poll. Is there a fourth? Why did we rule out Unzoned again?
- PDL: It's defined in terms of a negative rather than a positive.
- SFC: I have been reading C++ `chrono` in the meantime, and they are using the name `localtime` for a zoneless DateTime. I don't like Local, but given that there's wide precedence, maybe we should put it on the poll?
- PDL: LocalDateTime suggests a use for the class. Date/Time APIs have been doing things badly since the 1970s. If we always added things according to precedent, we'd never move beyond that. We wouldn't be doing anyone any favours.
- SFC: So, three options, and the fourth is "other, please reply?"
- MJP: Detached?
- JGT: No.
- PDL: Unmoored? Drifting?
- SFC: I like Drifting better than Floating because it can't be confused with floating point arithmetic.
- JGT: Plain, Civil, Floating, and Other Please Reply.
- USA: OtherPleaseReplyDateTime

### ISO string with bracketed time zone and no offset [#933](https://github.com/tc39/proposal-temporal/issues/933)
- JGT: My concern is that this format can't represent the second repeated hour in a DST change.
- PDL: If you want to represent an unzoned DateTime and TimeZone, without the disambiguation of the offset, then you shouldn't be using ZonedDateTime.
- JGT: If you have a string like this, then you are probably going to turn it into a ZonedDateTime. Why should you need two steps for that?
- PDL: You might want to keep it as a DateTime and TimeZone, as we do in Bloomberg's scheduling application, for example.
- JGT: This is the data type that iCalendar uses for its data model. I don't necessarily agree that that's so different from ZonedDateTime that we shouldn't parse it.
- PDL: It's bug prone. It sometimes throws and sometimes doesn't. It leads you to use the wrong type.
- PFC: For me it should depend on how common these strings are and where they are used. I've never seen one before. In addition, it would be backwards compatible to leave it out and add support for it in a future revision.
- PDL: We do support parsing it into a DateTime and a TimeZone right now, so it's not impossible to deal with these strings in Temporal.
- JGT: When would it not be correct to use a ZonedDateTime in this case?
- PDL: In any calendar app. By making it a ZonedDateTime, you are suggesting that it's related to DST.
- MJP: The risk is that the government changes DST rules before the appointment comes around, shifting your appointment time. This happened recently with the Yukon time zone in Canada.
- PDL: In that case the appointment is not a fixed point in time, so ZonedDateTime is not appropriate.
- JGT: I disagree with the preceding arguments, but nonetheless it feels appropriate to wait until this format is standardized.
- PDL: I'm not saying it cannot be a ZonedDateTime, I'm just saying it often isn't. So I'm reaching the same conclusion but from a different perspective.
