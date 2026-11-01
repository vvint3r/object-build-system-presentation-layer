# Acceptance fixes and KPI standing

- **Date:** 2026-10-31
- **Source:** the answers of two independent readers to `docs/acceptance-questions.md`, given from the
  three acceptance documents alone, and a blind visual review, through the orchestrating session's
  brief; choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

One rule joins the kit. The rest of the change is content, settled by the agreement rules and the
trust order of record 091.

| Rule | Spec | Check |
| --- | --- | --- |
| A KPI with a target names the target in its foot, and the foot's `<b>` states the standing in words: `Met`, or `Missed by` and the gap (`Missed by 3.8 pp`) | §8.2 | `kpi-standing`, failure |
| A KPI whose delta or meter names a target carries that foot too | §8.2 | `kpi-standing`, failure |
| Against an earlier value or a comparison, the `<b>` gives the change in percent, or is left out when the delta states it | §8.2 | None |

A KPI has a target when its foot's reference opens with "Target", its meter sets `--t` or its delta
names a target. A template placeholder in the foot is not judged, so each template keeps its expected
failures. `checks/test.mjs` holds a copy of the sample report with a bare `−3.8 pp` foot, which fails
`kpi-standing` and no other check.

The 1.2 sample report and gallery fail `kpi-standing` on their missed-target cards, so section 15's
migration from 1.2 lists the repair as item 9.

## Agreement calls

| Decision | Reason |
| --- | --- |
| Every document follows the guide's order: escalate at step 5, reply at step 6. Specialist queue wait runs from the escalation | The guide is the procedure. The reference's Relationships, the glossary and the service levels reference already start the wait at the escalation |
| The dispute and renewal check moves to step 2, ahead of Tier 1's own resolution at step 3. A dispute is the Dispute open banner or the customer's report of one | A disputed charge is never refunded, so the check must come before any refund. Either trigger blocks it. Steps 5 to 7 keep their numbers, so links from other documents stay true |
| A dispute skips step 3 and escalates at step 5 with the reason code Dispute; "before step 5" goes | The dispute exception is itself an escalation with a reason code, so it runs as step 5 rather than before it |
| The SLA due time is the deadline for resolving a ticket, counted from creation. Business hours are 08:00 to 18:00 on weekdays in the time zone of the Tier 1 region that takes the ticket | The glossary, the service levels reference and the report already use this meaning and cite SLA policy v3; the guide's "latest answer time" was the one outlier. The hours are the glossary's, cited to the same policy, which the report now lists as S6 |
| The SLA gap sits in email and the web form; among teams, billing specialists hold its largest share | With email and the web form at 95%, attainment reaches 95.1%. By team, tickets times points short of 95% give billing specialists 37% of the shortfall and Tier 1 APAC 35%, so "largest share" holds but no single team is the cause |
| 48,210 is tickets created, and the support-wide first response median counts them; tickets resolved are 48,964, and SLA, team and satisfaction figures count them | Figure 1's weekly points sum to 48,210 and Q2's to 44,870, so the created count is fixed. Resolved = created + opening backlog − closing backlog = 48,210 + 1,940 − 1,186 |
| Table 1's team counts scale by 48,964 ÷ 48,210 | Every share, every cell bar, the ticket-weighted 91.2% and 87.4%, and Billing's 58.7% of specialist tickets hold unchanged. The response rate becomes 21.1% of resolved tickets, in the report and the quality pillars reference |
| "Tickets handled" becomes "Tickets created" in the report, the gallery and the spec's specimen | One name for one population; "handled" read as resolved beside Table 1 |
| The SLA query uses a half-open date range and drops merged duplicates | `between` on a timestamp stops at the first second of 30 September; Methodology excludes merged duplicates as well as spam |
| Support shipped two changes in Q3 and started one pilot, beside the Billing v4 launch | The timeline tags two items Shipped, one External event and one Pilot |
| The 27% compares Q3's all-channel median with the 3h 05m median before 8 July, whose start is not recorded, and says both periods include 1 to 7 July. It credits no channel | Chat carries 31% of volume and Q3 includes seven days before routing. The routing recommendation and the email routing roadmap rest on chat's 96.1% within SLA instead |
| The figure stays 27% | Both medians are rounded to the minute, so the unrounded fall lies between 27.1% and 28.0%, and the part below 27.5% rounds to 27% |
| Table 1's All teams first response is the support-wide median over tickets created, and a caption note says so | The first response reference defines the reported value over tickets created and team medians over tickets resolved; no median over resolved tickets is recorded |
| "Missed by" goes on the SLA and satisfaction cards; their deltas name Q2 | The deltas compared with Q2 without saying so, and an upward badge on a missed target read as good news |
| The email routing roadmap's cards put the 95% target in the foot and compare with chat in the delta: −7.8 pp and −9.2 pp | The cards named their target in the delta; the rule needs the standing in the foot. The gaps to chat are 96.1% less each channel's rate |
| "Doubled" and "31%" both compare with the pre-launch level: twice in launch week alone, 31% above over the rest of the quarter. The pilot report follows | The two figures measured different spans and read as a conflict. "Raised billing contacts by 31%" stated an effect |
| The backlog limit is a target | The report's other limits are targets, and "ceiling" named the same 1,200 |
| Table 1's flags read the share within SLA on the bands of record 091: 90% or more on track, 85% to 89.9% at risk, below 85% breach. Technical escalations, at 89.9%, is at risk, and the grey watch flag goes | The bands are the set's; the watch flag had no threshold, and its row carried no flag mark |
| A team's median first response times the first reply on its resolved tickets, whoever sent it | On an escalated ticket the first reply can be Tier 1's, so a specialist team's median can time a Tier 1 reply |
| "Billing specialists lead" replaces "billing duty lead" | The guide's byline names that role; no rota appears in any source of the set. The billing operations lead keeps its name, defined by its refund authority |
| S3 is cited where the report uses the pilot's shifts, S4 where Q2 comparisons are re-run, and S1 at the pilot's −45 minutes. The action's chip reads Monday APAC FRT | The sources were listed but never cited; the shift schedule supports the staffing, and the helpdesk data the response time. The chip widened a Monday result |
| The reference's lineage runs from `tickets_fact` to the median query | No figure, query or source in the set reads `frt_daily` |
| The Q3 value is fixed at the 06:00 UTC refresh on 1 October, stated in the status block and cited to the refresh schedule | The reported-value rule fixes a quarter at the first refresh after it closes, and the schedule runs at 06:00 UTC. A dated value sits in the status block, not in a definition |
| The first response target is support-wide; team medians are counted against the same 2h 30m | The report holds the support-wide median to the target and gives teams no target of their own |
| "Three measures the quarterly review reports" replaces "three metrics in the quarterly review" | The review defines two of the three and reports the third, specialist queue wait |
| "Slower than the target" replaces "above" | Lower is better for first response time |
| The spec's table example and the gallery's demonstrations take the sample's new values | A fact has one value everywhere in the set (record 091) |
| Version strings stay 1.0 for the documents and 2.0 for the kit | The fixes land before the 2.0 release |
