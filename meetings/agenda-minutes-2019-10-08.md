October 8, 2019

Attendees:

Agenda (proposed):

* Review feedback from TC39
    * Everyone's happy, right?
* Collectively review the current proposal in detail
    * High level set of classes -- already reviewed, but any concerns?
    * Details of namespace object and Local sub-object
    * Examine each method/constructor and its detailed semantics, including
        * Behavior when the day is re-adjusted (e.g., January 31st, 2019 + 1 month)
        * Type overloading semantics
        * Negative duration/comparison design
* Take action items on next steps -- ideally shared among multiple people
    * Documentation updates
        * Reference documentation in the polyfill repo
        * Update each document in the main repository
        * Low priority: prepare MDN-style documentation, to post in MDN when we reach Stage 3
        * Owners: Philipp, Jase
    * Spec text
        * Update to the new API
        * Fix existing issues with precision
        * Update Intl connection, based on conclusions of meeting
        * Owners: Ms2ger, Ujjwal
    * Polyfill
        * Merging the polyfill into the main repository (performance?)
        * Fixing polyfill bugs
        * Uploading new version of the polyfill to npm
        * Owners: Philipp, Jase
* Schedule going forwards
    * October 24th: finalize all semantics issues
    * October 31st: Completed the polyfill and docs
    * December 31st: Finalize the spec text
    * February 2020 TC39 meeting: Stage 3

