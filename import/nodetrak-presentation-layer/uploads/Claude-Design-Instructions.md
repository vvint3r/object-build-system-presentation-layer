# Claude Design Implementation Brief

## Objective

Create the initial design-system foundation for a structured knowledge and learning content platform.

A separate Claude Code workflow will analyze, consolidate, classify, and restructure the source documents. You are not responsible for performing that content-analysis work.

Your role is to design and implement an initial set of reusable interface components, templates, and visualization patterns that can support the content structures already identified.

The current content model is provisional. It will expand as Claude Code analyzes the source materials. Build the system so that new content types, modules, labels, and visual patterns can be added without requiring a fundamental redesign.

## Responsibility Boundaries

### Claude Code will handle

- Source-document analysis

- Knowledge architecture

- Content consolidation

- Taxonomy development

- Content-type definitions

- Module definitions

- Source traceability

- Requirements extraction

- Final content-model specifications

### Claude Design should handle

- Interface architecture

- Visual system

- Reusable components

- Page and content templates

- Component composition

- Variants and states

- Responsive behavior

- Accessibility

- Visualization patterns

- Prototype implementation

- Design-system documentation

Do not attempt to infer or reconstruct the complete source corpus.

Use the provisional structures in this brief as the initial implementation scope.

## Design Goal

Design a flexible system capable of presenting structured educational, instructional, operational, analytical, and reference content.

The experience should support content such as:

- Frameworks

- Models

- Methods

- Processes

- Workflows

- Roadmaps

- Implementation guidance

- Applications

- Standards

- Requirements

- Tools

- Metrics

- Evaluations

- Comparisons

- Examples

- References

- Learning content

These examples are not exhaustive.

Treat them as representative content families that the system must support initially.

## Core Design Principles

The system should be:

- Modular

- Composable

- Content-driven

- Visually consistent

- Accessible

- Responsive

- Suitable for dense and complex information

- Scalable across content types

- Easy to extend

- Appropriate for both overview and detailed content

- Suitable for expert and non-expert audiences

Avoid designing a separate visual system for every content type.

Prefer shared foundations with meaningful structural variants.

## Initial Implementation Scope

Begin with the following layers:

1. Design foundations

2. Core content components

3. Structured-content components

4. Visualization components

5. Page templates

6. Navigation and discovery patterns

7. Interaction patterns

8. Documentation and examples

## Design Foundations

Establish the initial foundation for:

- Typography

- Spacing

- Layout grids

- Content width

- Surface hierarchy

- Borders

- Elevation

- Iconography

- Color semantics

- Interaction states

- Focus states

- Motion

- Responsive breakpoints

The visual language should support long-form reading and structured information rather than resemble a marketing website.

Prioritize clarity, hierarchy, legibility, and efficient information scanning.

## Semantic Styling

Create semantic styles for content meaning rather than arbitrary decoration.

Initial semantic categories may include:

- Informational

- Conceptual

- Instructional

- Required

- Recommended

- Optional

- Warning

- Risk

- Success

- Example

- Reference

- Definition

- Metric

- Evidence

- Draft

- Reviewed

- Deprecated

These categories are provisional.

Implement them so labels and styles can be extended or remapped later.

Do not assign a unique color to every content type.

Use color selectively and ensure that meaning does not depend on color alone.

## Core Content Components

Implement reusable components for common content modules.

### Content Header

Support:

- Title

- Short description

- Content-type label

- Status

- Audience

- Difficulty or maturity

- Last-reviewed information

- Estimated reading or completion time

- Primary actions

- Breadcrumbs

Provide compact and full variants.

### Section Header

Support:

- Heading

- Introductory text

- Section label

- Anchor link

- Optional action

- Collapsible behavior where appropriate

### Overview Block

Support:

- Purpose

- Scope

- Intended audience

- Key outcomes

- Estimated effort

- Related content

### Definition Block

Support:

- Term

- Definition

- Alternate terms

- Context

- Example

- Related concepts

- Source or evidence reference

### Key-Concept Card

Support:

- Concept name

- Short explanation

- Category or label

- Supporting visual

- Related concepts

- Link to detail

### Summary Card

Support:

- Title

- Summary

- Metadata

- Status

- Optional metric

- Optional action

### Callout

Include initial semantic variants for:

- Note

- Tip

- Important

- Warning

- Requirement

- Example

- Limitation

### Prerequisite Block

Support:

- Required knowledge

- Required tools

- Required tasks

- Dependency links

- Completion status

### Example Block

Support:

- Example title

- Scenario

- Explanation

- Input

- Output

- Key takeaway

- Expandable detail

### Use-Case Block

Support:

- User or context

- Problem

- Application

- Process

- Outcome

- Related method or framework

### Checklist

Support:

- Required and optional items

- Completion state

- Grouping

- Notes

- Dependencies

- Progress summary

### Reference List

Support:

- Internal resources

- External sources

- Related content

- Citations

- Downloadable assets

- Source metadata

### Related-Content Module

Support:

- Relationship type

- Content type

- Title

- Description

- Metadata

- Navigation action

## Structured-Content Components

Implement components for content that has explicit internal structure.

### Process Component

Support:

- Ordered steps

- Step title

- Step description

- Inputs

- Outputs

- Owner or role

- Duration

- Dependencies

- Decision points

- Completion status

- Supporting resources

Provide:

- Vertical stepper

- Horizontal overview

- Compact summary

- Detailed view

### Workflow Component

Support:

- Stages

- Actions

- Actors

- Transitions

- Conditions

- Branches

- Inputs and outputs

- Exceptions

- Status

Provide both a structured card-based view and a diagram-compatible view.

### Framework Component

Support:

- Framework name

- Purpose

- Core elements

- Relationships

- Application guidance

- Assumptions

- Limitations

- Examples

- Supporting visual

Provide variants for:

- Pillar framework

- Layered framework

- Cyclical framework

- Matrix framework

- Sequential framework

### Model Component

Support:

- Model purpose

- Variables or elements

- Relationships

- Assumptions

- Inputs

- Outputs

- Interpretation

- Limitations

### Method Component

Support:

- Objective

- When to use

- Prerequisites

- Steps

- Inputs

- Outputs

- Decision criteria

- Risks

- Examples

### Roadmap Component

Support:

- Phases

- Milestones

- Time periods

- Goals

- Deliverables

- Dependencies

- Owners

- Status

- Risks

Provide timeline and phase-based variants.

### Requirement Component

Support:

- Requirement statement

- Requirement level

- Rationale

- Acceptance criteria

- Dependencies

- Evidence

- Status

- Owner

- Related standards

### Metric Component

Support:

- Metric name

- Definition

- Formula

- Unit

- Directionality

- Target

- Current value

- Data source

- Interpretation

- Limitations

- Related metrics

Provide compact card, detailed definition, and comparison variants.

### Comparison Component

Support:

- Compared items

- Comparison dimensions

- Recommended use

- Tradeoffs

- Strengths

- Limitations

- Selection guidance

Support tables, cards, and compact responsive layouts.

### Evaluation Component

Support:

- Evaluation objective

- Criteria

- Scoring method

- Evidence

- Result

- Interpretation

- Recommendations

- Confidence

## Learning Components

Implement an initial set of learning-oriented components.

### Learning Objectives

Support:

- Objective

- Expected capability

- Bloom-style level or equivalent metadata

- Completion criteria

Do not hard-code one learning taxonomy.

### Knowledge Check

Support:

- Question

- Answer options

- Feedback

- Correct and incorrect states

- Explanation

- Retry behavior

- Progress

Begin with:

- Single choice

- Multiple choice

- True or false

- Reflection prompt

### Comprehension Summary

Support:

- Key takeaways

- Concepts covered

- Common misconceptions

- Suggested next steps

### Learning Progress

Support:

- Module completion

- Section progress

- Current position

- Prerequisite status

- Next recommended item

### Concept Map Container

Provide a structured area for displaying relationships between concepts.

Support:

- Nodes

- Relationship labels

- Hierarchy

- Grouping

- Selection

- Detail inspection

- Text alternative

## Labeling and Metadata Components

Create reusable presentation patterns for metadata.

### Taxonomy Label

Support:

- Label name

- Label category

- Optional icon

- Optional tooltip

- Selected and unselected states

### Metadata Group

Support:

- Multiple metadata dimensions

- Compact and expanded modes

- Wrapping

- Overflow behavior

- Responsive collapse

### Status Indicator

Initial statuses may include:

- Draft

- In review

- Approved

- Published

- Deprecated

- Archived

### Requirement-Level Indicator

Initial levels may include:

- Required

- Recommended

- Optional

### Difficulty or Maturity Indicator

Create a flexible scale component that does not assume a fixed number of levels.

## Visualization Components

Create an initial visualization library for structured content.

Do not treat these as static decorative illustrations. They should communicate content relationships clearly.

### Process Diagram

Support:

- Sequential flow

- Branches

- Loops

- Decision points

- Inputs and outputs

- Roles

### Workflow Diagram

Support:

- Actors

- Swimlanes

- Actions

- Transitions

- Conditions

- Exceptions

### Framework Diagram

Support:

- Pillars

- Layers

- Cycles

- Matrices

- Nested structures

### Hierarchy and Taxonomy

Support:

- Parent-child relationships

- Expand and collapse

- Selected nodes

- Long labels

- Deep structures

### Concept Map

Support:

- Many-to-many relationships

- Relationship labels

- Grouping

- Focused exploration

- Accessible alternate representation

### Decision Tree

Support:

- Questions

- Branches

- Outcomes

- Backtracking

- Selected path

### Roadmap and Timeline

Support:

- Time periods

- Milestones

- Dependencies

- Status

- Parallel tracks

### Matrix

Support:

- Two-axis classification

- Cell labels

- Cell details

- Highlighting

- Responsive alternative

### Maturity Model

Support:

- Stages

- Criteria

- Current state

- Target state

- Progression guidance

### Metric Visualization

Support initial patterns for:

- Single metric

- Trend

- Comparison

- Progress toward target

- Distribution

- Composition

For every visualization, provide:

- Responsive behavior

- Keyboard interaction where applicable

- Screen-reader description

- Text or table alternative

- Empty state

- High-density behavior

- Print or export treatment

## Page Templates

Implement reusable page templates rather than fixed pages.

### Topic Overview

Purpose:

- Introduce a domain

- Show major subtopics

- Surface key frameworks, methods, and related materials

Include:

- Header

- Overview

- Topic navigation

- Featured content

- Content-type groups

- Related topics

### Framework Detail

Include:

- Framework overview

- Diagram

- Core elements

- Relationships

- Applications

- Implementation guidance

- Examples

- Limitations

- Related content

### Process or Workflow Detail

Include:

- Overview

- Preconditions

- Structured steps

- Diagram

- Roles

- Inputs and outputs

- Exceptions

- Checklist

- Related guidance

### Method Detail

Include:

- Purpose

- When to use

- Prerequisites

- Steps

- Decision criteria

- Examples

- Risks

- Outputs

### Implementation Guide

Include:

- Objective

- Prerequisites

- Phases

- Tasks

- Roles

- Deliverables

- Risks

- Metrics

- Checklist

- Related tools

### Roadmap Detail

Include:

- Roadmap overview

- Phases

- Timeline

- Milestones

- Dependencies

- Owners

- Risks

- Progress

### Metric Detail

Include:

- Definition

- Formula

- Interpretation

- Target

- Data source

- Limitations

- Related metrics

- Visualization

### Comparison Page

Include:

- Compared items

- Selection criteria

- Comparison matrix

- Tradeoffs

- Recommendation guidance

### Learning Module

Include:

- Objectives

- Prerequisites

- Content sections

- Examples

- Concept map

- Knowledge checks

- Summary

- Progress

- Related learning

### Reference Page

Include:

- Definition

- Structured metadata

- Examples

- Related concepts

- References

- Change history

## Navigation and Discovery

Design initial patterns for:

- Global navigation

- Breadcrumbs

- Local table of contents

- Previous and next navigation

- Related-content navigation

- Content-type filtering

- Taxonomy filtering

- Search results

- Faceted browsing

- Recently viewed content

- Saved content

- Learning-path navigation

Support long pages with persistent or context-aware section navigation.

Do not allow navigation patterns to overwhelm the primary reading experience.

## Interaction Patterns

Implement reusable patterns for:

- Expand and collapse

- Progressive disclosure

- Tabs

- Accordions

- Step navigation

- Filtering

- Sorting

- Comparing

- Switching between overview and detail

- Showing definitions

- Exploring diagrams

- Completing checklists

- Viewing dependencies

- Displaying source details

- Opening related content

Avoid hiding core information behind interaction unless information density requires it.

## Component Architecture

Use a composable hierarchy.

For example:

```text
Page template
  -> Layout regions
    -> Content modules
      -> Design-system components
        -> Primitive components
```

Separate:

- Content structure

- Layout

- Visual styling

- Interaction behavior

- Data bindings

Avoid building large monolithic components that only work for one page.

## Content Schema Awareness

Design components around explicit content fields.

For each component, document:

- Required fields

- Optional fields

- Repeatable fields

- Supported content lengths

- Empty states

- Overflow behavior

- Nested content

- Supported media

- Invalid combinations

Use sample content for implementation, but avoid coupling components to the exact wording or number of items in the examples.

## Variants

Create variants only when there is a meaningful difference in:

- Content structure

- Information density

- User task

- Interaction

- Responsive behavior

- Accessibility

- Context

Do not create variants for minor decorative differences.

Initial variant dimensions may include:

- Compact versus detailed

- Static versus interactive

- Overview versus full

- Single item versus collection

- Linear versus branching

- Read-only versus progress-enabled

- With visual versus text-only

## States

Support applicable states such as:

- Default

- Hover

- Focus

- Active

- Selected

- Expanded

- Collapsed

- Complete

- Incomplete

- Disabled

- Empty

- Loading

- Error

- Warning

- Draft

- Reviewed

- Deprecated

Use states only where they are meaningful to the component.

## Responsive Requirements

Design for:

- Desktop

- Tablet

- Mobile

- Large-screen reading

- Print or export where practical

Pay particular attention to:

- Long tables

- Diagrams

- Timelines

- Matrices

- Deep navigation

- Dense metadata

- Long labels

- Nested components

- Multi-column layouts

Provide alternative mobile representations rather than simply shrinking complex desktop visuals.

## Accessibility Requirements

Build accessibility into the initial implementation.

Include:

- Semantic HTML

- Logical heading order

- Keyboard navigation

- Visible focus states

- Screen-reader labels

- Accessible names and descriptions

- Sufficient contrast

- Color-independent meaning

- Text alternatives for diagrams

- Data-table alternatives for charts

- Reduced-motion support

- Zoom and reflow support

- Accessible error and feedback states

- Touch-target sizing

- Predictable interaction behavior

Do not use a diagram or interactive visual as the only way to access information.

## Initial Prototype Content

Use representative sample content to demonstrate the system.

Create examples for at least:

1. A framework

2. A process

3. A workflow

4. A method

5. A roadmap

6. A metric

7. A comparison

8. A learning module

The sample content should demonstrate structural differences between content types.

Do not spend substantial effort perfecting the subject matter. The purpose is to test the design system.

## Initial Deliverables

Produce:

### 1. Design Foundations

- Tokens

- Typography

- Spacing

- Layout

- Semantic styles

- Interaction states

### 2. Component Library

Implement the initial core and structured-content components.

### 3. Visualization Library

Implement representative versions of the highest-priority visualization patterns.

### 4. Page Templates

Implement the initial reusable templates.

### 5. Prototype Views

Create representative pages demonstrating how components compose together.

### 6. Component Documentation

For each component, document:

- Purpose

- Anatomy

- Fields

- Variants

- States

- Usage guidance

- Content guidance

- Accessibility

- Responsive behavior

- Known limitations

### 7. Expansion Notes

Maintain a section documenting:

- Assumptions

- Provisional decisions

- Components awaiting content-model validation

- Areas requiring additional source-derived requirements

- Opportunities for later expansion

## Initial Priority

Start with the components that are likely to be broadly reusable.

### Foundation

- Typography

- Layout

- Semantic styles

- Metadata

- Status

- Content headers

- Section headers

- Callouts

- Cards

- Lists

- Tables

### High Priority

- Process

- Workflow

- Framework

- Method

- Roadmap

- Metric

- Comparison

- Prerequisites

- Checklist

- Related content

### High-Priority Visualizations

- Process flow

- Workflow

- Framework diagram

- Timeline

- Matrix

- Concept map

### Initial Templates

- Topic overview

- Framework detail

- Process detail

- Implementation guide

- Learning module

Do not wait for the final content architecture before establishing these reusable foundations.

## Implementation Guidance

Build the system so that future specifications from Claude Code can be incorporated through:

- New configuration

- New schema fields

- Additional component variants

- Additional composition rules

- New templates

- New semantic labels

- New visualization mappings

Avoid requiring a redesign of the primitives or foundational layout system when the content model expands.

Where requirements remain uncertain:

- Choose the most reusable default

- Document the assumption

- Avoid hard-coded limits

- Keep schemas extensible

- Mark the decision for later validation

## Output

Provide:

1. The implemented design or prototype

2. A concise Markdown design-system specification

3. A component inventory

4. A template inventory

5. A visualization inventory

6. A list of assumptions and unresolved questions

7. A prioritized list of recommended next components

The Markdown documentation should be suitable for later comparison against the content-model output produced by Claude Code.

## Success Criteria

The initial system is successful when:

- Multiple content types can be represented without bespoke page designs

- Components can be recombined across templates

- Structured and long-form content remain readable

- Complex processes and relationships can be visualized accessibly

- Metadata and labels can expand without redesigning the system

- The system supports both overview and detailed views

- Mobile layouts remain usable

- Future Claude Code outputs can map cleanly to components and templates

- Provisional assumptions are clearly documented

- The implementation establishes a credible foundation for continued expansion
