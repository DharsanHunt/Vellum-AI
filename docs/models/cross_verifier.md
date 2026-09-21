# Cross-Document Verification Engine Documentation

## 1. Purpose
Builds an entity knowledge graph across a candidate's submitted document portfolio (Degree Certificate, Transcript, Internship Certificate, LOR) to perform holistic cross-document reconciliation and detect subtle identity, date, or institutional contradictions.

## 2. Approach & Classification
- Analyzes pairwise entity relationships:
  - Student Names: Normalized string comparison with fuzzy token sort ratios.
  - Institutions: Token set similarity with abbreviation tolerance.
  - Degree & Course: Specialization title alignment.
- Classifies each field comparison into:
  - `MATCH`: Exact or fully consistent match.
  - `MINOR_VARIATION`: Acceptable spelling variation, initials, or minor title abbreviation.
  - `CONFLICT`: Direct contradiction requiring fraud investigation.
  - `UNKNOWN`: Missing or unextractable field.
- Generates node-edge entity graph and overall portfolio consistency score `[0.0 - 1.0]`.

## 3. License
- MIT
