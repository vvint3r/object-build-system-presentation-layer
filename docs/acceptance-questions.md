# Acceptance questions

Questions a reader of each acceptance document must be able to answer from the page alone.

Status, 2026-10-31: the questions match the three documents at their version 1.0.

## Documents

The set covers one document of each kind. A reviewer hands a reader one document, or two for a
question marked as spanning two, and asks the questions in order.

| Kind | Document | File |
| --- | --- | --- |
| Report | Customer support operations review, Q3 2026 | `kit/Sample Report - Q3 Support Review.html` |
| Guide | Billing ticket escalation to specialists | `kit/Guide - Billing Escalation.html` |
| Reference | First response time | `kit/Reference - First Response Time.html` |

## Scoring

A question passes when the reader gives the **expected answer** and can point to where it sits. Each
row also names the wrong answer a skimming reader is likely to give. That answer misses an exception,
an exclusion or a limit of the evidence.

- A question marked "Citation" needs the reader to follow a source marker (S1, S2 and so on) to its
  entry under Notes & sources.
- A question marked "Two documents" needs the reader to follow a link from one document into another.

## Report

Customer support operations review, Q3 2026.

| Question | Expected answer | Likely wrong answer | Where the answer sits |
| --- | --- | --- | --- |
| Which targets in the executive summary's KPI strip did support meet in Q3 2026? | Only first response: a median of 2h 14m against 2h 30m, marked Met. Resolution within SLA reached 91.2% against 95%, and satisfaction 87.4% against 88%; both are marked Missed | All of them, since every measure improved on Q2 | Part 01 Executive summary: the foot of each KPI card with a target, which names it and reads Met or Missed |
| Would hiring six billing specialists close the SLA gap? | No. Hiring and email intent routing together close an estimated 2.9 of the 3.8-point gap, and neither closes it alone | Yes, since billing holds the largest share of the gap | Part 07 Recommendations: the callout after the actions |
| Which of the three recommended actions has a measured effect rather than an estimate? | Only APAC weekend coverage: Monday APAC first response fell 45 minutes over the pilot's first two Mondays, citing S1. The other two effects carry "est." | All three, since each carries an effect figure | Part 07 Recommendations: each action's chips; Part 06 Initiatives: the pilot's timeline entry |
| Which team was slowest to first response? | Technical escalations: the tickets it resolved had a median of 4h 41m to the first reply, whoever sent it. Billing specialists had the lowest share within SLA, 82.6%, but a faster median of 2h 58m | Billing specialists, the team flagged Breach | Part 04 Team performance: Table 1; Appendix A Methodology: Team status |
| Citation. What does the satisfaction finding rest on, and how current is it? | S2, the CSAT survey export for Q3 2026 from Customer Experience: 10,317 rows, exported 2026-10-05 | The helpdesk warehouse, the source of the other findings | Part 01 Executive summary: the fourth key finding's S2 marker, then the S2 entry under Appendix B Notes & sources |

## Guide

Billing ticket escalation to specialists.

| Question | Expected answer | Likely wrong answer | Where the answer sits |
| --- | --- | --- | --- |
| A customer asks for a $400 refund on one invoice. Can the Tier 1 agent issue it? | No. Tier 1 approves up to $250 per invoice; the agent escalates with the reason code Refund approval, and a billing specialist approves up to $2,500. The refund is never split to fit under a limit | Yes, as two refunds of $200 | Part 04 Exceptions and recovery: Refund above the agent limit |
| A customer has disputed a charge with the bank. What does the agent do? | Issue no refund or credit, with or without the Dispute open banner. Skip step 3 and escalate at step 5 with the reason code Dispute; the disputes desk takes the ticket | Refund the charge to settle the dispute | Part 03 Steps: step 2; Part 04 Exceptions and recovery: Disputed charge |
| The account renews in 45 days. Does the escalation change? | No. The renewal case applies only within 30 days, so the standard escalation runs | Yes: add the account manager and set priority High | Part 03 Steps: step 2; Part 04: Customer in renewal |
| An escalated email ticket passes its due time. What was its due time, and what does the agent do? | 24 business hours from the ticket's creation, the due time for email, web form and social; business hours are 08:00 to 18:00 on weekdays, in the time zone of the Tier 1 region that takes the ticket. The agent adds the billing specialists lead as a follower | 4 hours, the chat and phone due time | Part 04 Exceptions and recovery: Returned or overdue escalation |
| Two documents. Which step stops the first response time clock, and how is the wait for the specialist counted? | Step 6, the reply to the customer, on a ticket with no earlier reply. The wait for the specialist counts as specialist queue wait, which runs from the escalation at step 5, not as first response time | Step 7, when the specialist answers | Guide Part 03 Steps: steps 5 and 6; then the reference's Part 06 Examples: Escalated billing ticket, and Part 05 Relationships: Specialist queue wait |

## Reference

First response time.

| Question | Expected answer | Likely wrong answer | Where the answer sits |
| --- | --- | --- | --- |
| A chat gets an automatic acknowledgement at 10:02 and an agent's reply at 10:09. What is its first response time? | 7 minutes. An automatic acknowledgement does not stop the clock; a reply sent with a macro does | 0 minutes, from the acknowledgement | Part 04 Measurement: Clock stop; Part 06 Examples |
| An email arrives at 14:00 on Saturday and an agent replies at 09:30 on Monday. What is its first response time? | 43h 30m. The clock runs through nights and weekends | About 30 minutes of business time | Part 02 Properties: the metric's definition; Part 06 Examples: Email over a weekend |
| Did every team meet the target in Q3 2026? | The target is support-wide, and the support-wide median of 2h 14m met it. Only 2 of the 5 team medians were within 2h 30m; three were slower | Yes, every team, since the median met the target | Part 02 Properties: Target; Part 03 Status |
| Which tickets does the median leave out? | Tickets created by internal staff, spam, merged duplicates, and any ticket with no reply from a person yet | None; every ticket created in the period counts | Part 04 Measurement: Excluded tickets |
