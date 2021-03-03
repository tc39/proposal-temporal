# Feb 4, 2021

## Attendees
- Shane F Carr (SFC)
- Justin Grant (JGT)
- Cam Tenny (CJT)
- Dan Ehrenberg (DE)
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Manish Goregaokar (MG)
- Philipp Dunkel (PDL)

## Agenda

### Month code discussion
Consensus for polyfill purposes: “M” + zero-padded iCal. Will get ICU calendars implementation in this week, then go back and add zero-padding. Leaving further specification to Unicode/iCal, e.g. for Hindu calendar support.

### [Chromium bug 1173158](https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
- JGT: Incorrectly marked as duplicate, can a Googler look at it?
- SFC: Will look into this.
- JGT: Causes exception in current implementation for pre-1582 dates and has tests verifying them; Chromium fixing the bug will break our tests to tell us to update.

### Administrivia
- Getting CJT and PDL into the google chat room
- Getting SFC and MG into the federated matrix room

Rest of the meeting slot given to Intl.DurationFormat group.
