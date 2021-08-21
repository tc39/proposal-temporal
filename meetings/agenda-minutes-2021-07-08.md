# July 8, 2021

## Attendees
- Richard Gibson (RGN)
- James Wright (JWT)
- Ujjwal Sharma (USA)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)

## Agenda
### IETF update
- USA: Good news. After another round of reviews of the draft and the charter, the charter has been adopted. The SEDATE (Serializing Extensions to Date And Time Events) working group is chartered. We'll be talking about the extensions in a dedicated session in the next IETF meeting. There's also a group for binary format, SEBOR (sp?) that is interested in these extensions and may adopt them as well. The plan is to have the draft be adopted by the working group, which is our signal to implementations that they can unflag Temporal; and to have it published as an RFC.
- PFC: Do you think the discussions we've had with IETF mean that it goes smoothly from here on, or do you expect a lot more discussions?
- USA: I think by limiting the scope of the draft we addressed those concerns and it should go smoothly from here on. The controversial part was going to be updating RFC 3339, which we are no longer aiming to do — we're aiming to publish a separate RFC extending it.
- PDL: What's your best guess for it being removed as a roadblock for TC39?
- USA: Adoption by the working group means that IETF has committed to it. For me personally, that would be enough of a signal.
- PDL: In that case we need to make sure that our communications are clear and that the champions endorse it.

### Old polyfill deprecation process
- [x] PR Readme changes in old repo - JGT
- [ ] Port over any changes in the old polyfill to the new - JGT
- [ ] Cut new release of new polyfill - PFC
- [ ] PR to add runtime console warning - JGT
- [ ] Cut new release of old polyfill - PFC
- [ ] npm deprecate old polyfill - PFC
- [x] npm deprecate other random modules - PDL
- [ ] Update issues #1447 and #1446 - JGT
- PDL: Note that you should deprecate all versions, not just the latest version. Otherwise installs will use the previous version. Also note that there's a bug in npm when deprecating multiple versions, you have to wait a few minutes in between each version for their cache to expire.

### Production polyfill
- PDL: I've been trying to put some time in on TypeScript-ification of the new polyfill. It's very intertwined, not as easy as I was hoping. I will do it all at once.
- JWT: I was also planning on doing the exact same thing. There aren't too many files so it makes sense to do them all at once.
- JWT and PDL to coordinate by email on this.
- JGT: Don't forget to check the box in the new repo's readme.

### `Temporal.PlainMonthDay.compare`? [#1547](https://github.com/tc39/proposal-temporal/issues/1547)
- PDL: I am wary of adding features that don't come from implementation. This is an additional feature. That would require relitigating stage 3. I'd rather the criterion be that we only make changes without which the implementation wouldn't make sense, or that fix mistakes that are clearly contrary to the intention of the proposal.
- PFC: I agree with that criterion. I think this should be a Temporal V2 feature.
- PDL: An argument to the contrary might be that it's easier if browsers don't partially implement V2 features and so it might be worth having it from the beginning, but personally I don't prefer that.
- JGT: I don't find it that important.
- Conclusion: Open a V2 feature.

### `Temporal.Now`? [#1583](https://github.com/tc39/proposal-temporal/issues/1583)
- PFC: I think the time for naming bikesheds has passed, but SYG seems to have a preference for this as an editor, and says there are precedents for renamings in Stage 3, so I guess we could consider it.
- PDL: I don't care one way or the other.
- JGT: I suggest that we consider it if the editors will make a rule about it, so that the guidance is there in the future.
- Conclusion: We'll do that.
