# May 13, 2021

## Attendees:
- Jase Williams (JWS)
- Justin Grant (JGT)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)

## Agenda:
### Consensus PRs for May plenary meeting: [#1509](https://github.com/tc39/proposal-temporal/issues/1509) and [#1510](https://github.com/tc39/proposal-temporal/issues/1510)
- PFC: The plan is to ask for consensus on these two normative pull requests.
- JGT: We can go through my questions now. What's the right process to get the slides into the agenda, and to request a pre-1:30 time?
- PFC: I can send a pull request to tc39/agendas.
- JGT: I can send it, if it's really just a pull request to this page. Other than #1508 and #1509, is there any other content needed for slides?
- PFC: I haven't done a normative pull request before in the plenary. Does anyone else know? Can we look at another proposal for reference? Do we want to provide an implementation update? Anything else?
- JWS: There's nothing significant enough to bring up at plenary.
- JGT: What portion of the meeting agenda does this go in? In the "Proposals" section, in the "Short Discussions" section, or somewhere else?
- PFC: I've been assuming it goes under "Needs Consensus PRs".
- SFC: I think it'd make more sense to add a 15-minute item to the agenda in the "Proposals" section. I think there isn't a formal process for making changes to Stage 3 proposals, but they are just presentations. When a proposal goes to Stage 4 people generally give an overview of what changed during Stage 3.
- JGT: Should we ask on the delegates channel to make sure?

### Hosting/publishing production polyfill
- PFC: It's published at https://github.com/js-temporal/temporal-polyfill. What are the next steps? They should include deprecating the existing polyfill and publishing the new one to NPM.
- JWS: Do we need to decide on the name? @js-temporal/polyfill?
- (discussion about deprecation plan)

Deprecation plan:
1. Merge the currently-known normative PRs
1. Publish one last version of the current NPM package
1. Deprecate the newly-deployed NPM package
1. Add a note to the README explaining the polyfill in the tc39 repo is for convenience developing test262 tests
1. Publish a new NPM package from @js-temporal/polyfill

### Updating [TC39 proposals page](https://github.com/tc39/proposals#stage-3) with correct champions
- JGT: Can we make this current?
- PDL: Let's make a champions category and a contributors category.
- PFC: Let's put a link to the proposal-temporal README instead.
- JGT: We can just copy the content that we currently have there, and make the Authors column the same.
- PDL: OK.
- JGT: We'll just have the full complement in both columns. It's like a 70s supergroup.

