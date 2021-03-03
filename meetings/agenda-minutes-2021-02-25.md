# Feb 25, 2021

## Attendees
- Daniel Ehrenberg (DE)
- Cam Tenny (CJT)
- Bradley Farias (BFS)
- Philipp Dunkel (PDL)
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Philip Chimento (PFC)

## Agenda

### Delegate reviews
- PFC: While we have the three reviewing delegates here, is there anything we need to do for these reviews? Do we need some kind of explicit sign off?
- BFS: The process for delegate reviews is to create a github issue and make check boxes for the process items, then tag the delegates.
- DE: I will start on mine.
- BFS: A lot is well-documented with explainer text. We have to read the spec text and make sure that it matches. 

### IETF draft
- USA: I received an email about the agenda for the IETF meeting, chartering the working group is scheduled for Monday 8 March.
- RGN: Can others in this group participate in that meeting and are there instructions?
- USA: It's optional, but you are welcome to.
from() discussion #1293 — planned for 3 March
- PFC: RGN, as the person most familiar with the SES and virtualization use cases, would you be willing to lead this discussion?
- RGN: OK.
- SFC: I've added it to the TC39 calendar.

### BFS's review, live
- "Time zone information" being updated: ambiguous whether this means the information about which time zone the system is in, or the time zone database.
- NormalizeOptionsObject: in case it's passed to a non-ISO calendar (implementation defined), there's no guarantee in which order the properties are read or if they're read twice.
  - DE: There are a few ways to do this. The ECMA 402 approach is to intersperse reads of the properties with computations.
  - RGN: The 402 approach has been a source of bugs (e.g., https://github.com/tc39/ecma402/pull/493#discussion_r465537106). I prefer eager reading into a dictionary.
  - BFS: I don't have a recommendation on the best way to fix it, that's up to the champion.
  - DE: The problem with reading fields eagerly is that you can't pass through options anymore.
  - BFS: You can still pass the whole object, but all the properties should be converted to data properties.
  - DE: I'm a bit uncomfortable with this. Would we basically do the equivalent of `{ ...options }` to clone it?
  - BFS: I'm just saying that the host has to define when it accesses the properties.
  - DE: So this is purely about the implementation-defined steps having a defined point in time when they read the properties.
  - BFS: And that it doesn't call back later if it's a getter.
- Calendar and TimeZone objects in slots
  - PFC: Due to a review comment from JHD we are planning to change this somewhat. The idea is to eagerly get the methods from the object and store those in a Record.
  - BFS: I'll wait for that change.
- RejectDate etc.?
  - PFC: These operations are on ISO year/month/day of the internal data model.
  - SFC: Maybe we should change the name of the variables?
  - PFC: Or the abstract operations, e.g. RejectISODate?
  - BFS: I'll take a look.
- Operations where property reads are interwoven with operations that may throw
  - BFS: RGN, what was your concern about this?
  - RGN: One bad pattern in 402  is with creating a new object and putting the old object in the prototype chain. That doesn't apply here. Another is that it will read a thing, perform some processing, and then read another thing.
- "Is an immutable Object"
  - BFS: Is there a definition of immutable here? The .prototype properties are not configurable, @@toStringTag are configurable. So "immutable" doesn't mean frozen. This should be cleaned up.
  - PFC: Maybe "immutable" just needs to be removed? It's immutable from a user code point of view.
  - USA: Alternatively should we define the term? What it means here is that all the data is in internal slots and provided by getters.
  - PDL: I think we should remove it. What we should think about is do we want to be able to configure the getters?
  - BFS: You absolutely want to make them configurable. It's an uphill battle to make them non-configurable. People polyfill prototype properties for virtualizability.
  - PDL: I agree with that sentiment, but that's the closest we could come to making things immutable. In reality we don't need it.
- Get vs GetOwnProperty, e.g. MergeLargestUnitOption
  - BFS: GetOwnPropertyNames may fire a proxy handler which could delete the properties, then the subsequent Get could fall through to the prototype instead of getting an own property.
  - RGN: Generally we don't care when reading a property whether it is an own property or a prototype property.
  - BFS: We should probably avoid own properties then. Do we do that in ECMA-262?
