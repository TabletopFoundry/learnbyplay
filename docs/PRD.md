# LearnByPlay — Enhanced Product Requirements Document

## Gap Analysis

| Gap Area | Gap in Original PRD | Why It Matters | Resolution in This Version |
|---|---|---|---|
| Scope definition | Feature list spans curriculum search, PD, community, procurement, PnP, school library, and district reporting without a v1 boundary | Engineering cannot size or sequence delivery | Defines v1 in-scope, out-of-scope, and v2+ roadmap with explicit scope boundaries |
| User stories | Features are described at a concept level, not as actor-specific jobs to be done | Teams cannot trace implementation to user value | Adds role-specific user stories for teachers, admins, homeschool users, and program staff |
| Acceptance criteria | No testable acceptance criteria are provided | QA and engineering cannot verify completeness | Adds Given/When/Then acceptance criteria for each functional requirement |
| Edge cases | No guidance for empty search results, oversized classes, unavailable games, sync failures, or partial data | Classroom use is operationally sensitive; edge cases will happen in real lessons | Adds explicit edge cases per requirement and flow |
| Prioritization | Original PRD lists many features but does not rank them | Teams risk building low-value features early | Adds MoSCoW priority to every requirement and narrows v1 to the highest-value workflow |
| Non-functional requirements | No performance, availability, accessibility, browser, or scalability targets are defined | Platform cannot be engineered or operated with clear quality bars | Adds p95 targets, SLA, scale assumptions, WCAG target, browser matrix, security, i18n, and retention |
| Data/privacy model | FERPA is mentioned, but data minimization, PII boundaries, retention, and role access are not defined | Product serves minors; privacy mistakes create legal and trust risk | Adds conceptual data model, PII flags, RBAC, retention defaults, and compliance constraints |
| Contradictory focus | Product vision is primarily B2B, but roadmap and pricing also optimize for homeschool, district, and after-school simultaneously | Go-to-market and product design can become fragmented | Keeps long-term segments, but focuses v1 on teacher-led school adoption [INFERRED] |
| Implicit assumptions | Assumes rights to create rules summaries, PnP content, and branded exports without stating licensing boundaries | Can create legal and operational risk | Calls out licensing assumptions and open questions with proposed defaults |
| Metrics | Metrics are mostly annual business outputs, not product behavior metrics with definitions | Product teams cannot manage activation, engagement, and retention | Adds KPI definitions and targets for activation, usage, conversion, and renewal |
| Content operations | Lesson plans and mappings are core value, but no authoring/review/publish workflow is defined | Content quality and freshness become a bottleneck | Adds content operations requirement and versioning expectations |
| Integration depth | Integrations are listed but not scoped by v1 vs later phases | External dependency work can consume roadmap unexpectedly | Separates required v1 integrations from future integrations and defines fallback behavior |

---

## 1. Overview

- **Product Name:** LearnByPlay
- **One-liner:** A curriculum-aligned board game teaching platform that helps educators discover, plan, run, and measure standards-based game lessons.
- **Problem:** Teachers already see educational value in board games, but today they must manually determine curriculum fit, create lesson plans from scratch, justify purchases, and prove learning outcomes. That makes game-based learning inconsistent, hard to defend administratively, and difficult to scale.
- **Solution:** LearnByPlay provides a curated game catalog mapped to standards, ready-to-run lesson plans, classroom facilitation tools, lightweight assessment capture, and evidence reports so teachers can confidently use board games as structured instructional experiences.

### Product Goals
1. Reduce teacher planning time for game-based lessons by at least 75% versus manual preparation [INFERRED].
2. Make standards-aligned board game lessons usable in a normal class period (30, 45, or 60 minutes).
3. Give school leaders auditable evidence that gameplay maps to instructional goals.
4. Create a repeatable pilot-to-school-license motion for K-8 classrooms.

### KPIs

| KPI | Definition | Target |
|---|---|---|
| Teacher activation | % of newly registered teachers who save or launch a lesson within 7 days | >= 40% by Month 6 [INFERRED] |
| Time to first lesson | Median time from signup to first saved lesson | <= 10 minutes [INFERRED] |
| Lesson-to-session conversion | % of saved lesson plans that result in a logged classroom session within 14 days | >= 30% [INFERRED] |
| Weekly active teachers | % of monthly active teachers active in the last 7 days | >= 45% [INFERRED] |
| Pilot school renewal intent | % of pilot schools indicating renewal or expansion after pilot | >= 70% [INFERRED] |
| Teacher NPS | NPS from teachers after 30+ days of use | > 50 [INFERRED] |
| Catalog coverage | Number of games mapped to at least one supported standard | 300 by end of Year 1 |
| Content depth | Number of published lesson plans | 500 by end of Year 1 |

---

## 2. Users & Personas

### Persona A — Olivia, Elementary Classroom Teacher
- **Goals:** Find standards-aligned games quickly, run engaging lessons without losing classroom control, and document evidence for administrators/parents.
- **Pain Points:** Limited prep time, uncertainty about curriculum alignment, difficulty adapting commercial game rules to classroom constraints.
- **Tech Comfort:** Medium; comfortable with Google Classroom, PDFs, and simple web tools, but not willing to configure complex software.

### Persona B — Marcus, Curriculum Coordinator / Principal
- **Goals:** Approve instructional programs with clear standards alignment, track adoption across teachers, and justify spending.
- **Pain Points:** Needs evidence, consistency, and compliance; skeptical of tools that look like enrichment but not instruction.
- **Tech Comfort:** Medium to high; comfortable with dashboards, exports, and SSO-managed products.

### Persona C — Priya, Homeschool Parent
- **Goals:** Turn family game time into structured learning with minimal curriculum-planning effort.
- **Pain Points:** Needs age-appropriate lesson guidance, simple progress tracking, and lower-cost options.
- **Tech Comfort:** Medium; expects consumer-grade onboarding and mobile-friendly usage.

### Persona D — Talia, After-School / Library Program Lead
- **Goals:** Run structured group activities with staff who may not be licensed teachers.
- **Pain Points:** Needs turnkey facilitation, simplified instructions, and low training overhead.
- **Tech Comfort:** Medium to low; values clarity over configurability.

### Primary v1 User
- **Primary v1:** Classroom teachers in K-8 schools.
- **Secondary v1:** School administrators who review usage and evidence reports.
- **Deferred emphasis:** Homeschool and after-school buyers remain supported conceptually, but are not the primary workflow owner for v1 [INFERRED].

---

## 3. Scope

### In Scope for v1
1. Teacher/admin account creation and role-based access.
2. Curated catalog of board games with structured metadata.
3. Standards browsing and filtering for initial supported frameworks.
4. Search that matches games and lesson plans to grade, subject, standard, class size, and duration.
5. Published lesson plans with pre-game, gameplay, and post-game activities.
6. Printable/exportable teacher materials.
7. Classroom roster management (manual CSV + Google Classroom import) [INFERRED].
8. Session run mode with grouping guidance, timer, and facilitation prompts.
9. Basic observation-based assessment and student reflection capture.
10. Teacher and admin evidence reports.
11. Internal content authoring/review/publish workflow.

### Out of Scope for v1
1. Native mobile apps.
2. Real-money game purchasing or affiliate checkout.
3. Hosting copyrighted print-and-play assets unless separately licensed.
4. Teacher community forum and user-generated lesson marketplace.
5. Automated grade passback into LMS gradebooks.
6. District SIS integrations beyond roster import.
7. Full school library inventory management.
8. Formal PD certification and credit issuance.
9. AI-generated lesson plans in production.

### Future v2+
1. Expanded standards coverage across more grades and subjects.
2. Homeschool-optimized plans and family accounts.
3. Community lesson sharing and moderation.
4. Procurement workflows, grants templates, and budget kit builder enhancements.
5. Canvas/Schoology assignment integration and grade passback.
6. School/district analytics benchmarks and multi-school rollups.
7. Multilingual UI and translated lesson content.

### Scope Assumptions
- v1 should prioritize teacher time savings and proof of classroom value over commerce or community features [INFERRED].
- Initial standards coverage should focus on Common Core Math K-5 and CASEL K-8, with limited NGSS pilot coverage if content capacity allows [INFERRED].

---

## 4. Functional Requirements

### FR-01 — Authentication, Organization Setup, and Role-Based Access
- **Priority:** Must
- **User Story:** As a teacher or school admin, I want to sign in securely and access only the data relevant to my organization and role.
- **Description:** Support secure login for teachers and admins with email/password and Google/Microsoft SSO [INFERRED]. Users belong to an organization (school or homeschool organization) and are assigned a role. Roles control access to classrooms, lesson usage, student data, and reports.
- **Dependencies:** None
- **Acceptance Criteria:**
  - **Given** a user with a valid invite or approved domain, **when** they sign in for the first time, **then** an account is created and linked to the correct organization and role.
  - **Given** a teacher account, **when** the teacher attempts to access school-wide admin reporting, **then** access is denied and an explanatory message is shown.
  - **Given** an admin account, **when** the admin views classrooms in their organization, **then** they can see aggregate classroom usage but not edit another teacher's lesson content unless granted permission.
- **Edge Cases:** Duplicate email across organizations, SSO provider unavailable, invite expired, role changed after account creation.

### FR-02 — Standards Catalog
- **Priority:** Must
- **User Story:** As a teacher, I want to browse and search standards so I can start from instructional goals instead of from a game title.
- **Description:** The platform shall store standards as structured records with framework, version, subject, grade band, code, and description. Users can browse by framework or search by keyword/standard code.
- **Dependencies:** FR-01
- **Acceptance Criteria:**
  - **Given** a teacher on the standards page, **when** they filter by framework, grade, and subject, **then** only matching standards are shown.
  - **Given** a teacher searching by standard code or keyword, **when** a matching standard exists, **then** the result shows the standard title, description, and linked lesson/game count.
  - **Given** a standard with no published mappings, **when** the teacher opens it, **then** the UI states that no mapped games are available yet and offers nearby alternatives.
- **Edge Cases:** Versioned standards with similar codes, standards retired in later framework versions, no mappings yet for a searched standard.

### FR-03 — Game Catalog and Metadata
- **Priority:** Must
- **User Story:** As a teacher, I want a trustworthy game profile so I can decide if a game fits my class constraints.
- **Description:** Each game record shall include title, publisher, player count, typical classroom setup time, duration, age range, mechanics, skill tags, supported standards, materials needed, accessibility notes, and classroom-fit flags. Metadata may be enriched from external sources and curated internally.
- **Dependencies:** FR-01
- **Acceptance Criteria:**
  - **Given** a published game, **when** a teacher views the game detail page, **then** they can see classroom-relevant metadata and linked lesson plans.
  - **Given** a game that is recommended for fewer players than a class has, **when** the game is displayed in results, **then** the UI shows that multiple copies/groups are required.
  - **Given** a game without a published lesson plan, **when** the teacher opens the game page, **then** the page still shows metadata and explicitly labels lesson support as unavailable.
- **Edge Cases:** Missing images/licensed assets, conflicting player-count data, game unavailable for purchase, multiple editions of the same game.

### FR-04 — Game-to-Standards Search and Recommendation Engine
- **Priority:** Must
- **User Story:** As a teacher, I want to find the best-fit games and lessons using my classroom constraints so I can plan quickly.
- **Description:** Users can search/filter by grade, subject, standard, class size, time available, group size, skill focus, and available games. Results shall rank by standards alignment strength, operational fit, and lesson availability [INFERRED].
- **Dependencies:** FR-02, FR-03
- **Acceptance Criteria:**
  - **Given** a teacher who selects a grade, subject, duration, and class size, **when** they run a search, **then** the system returns ranked games with explanation badges such as "matches standard," "fits 30 minutes," and "supports groups of 4."
  - **Given** multiple matching games, **when** results are shown, **then** the teacher can sort by duration, player fit, popularity, or preparation effort [INFERRED].
  - **Given** no exact match, **when** the teacher searches, **then** the system offers near matches and clearly explains which constraint was relaxed.
- **Edge Cases:** Conflicting filters (e.g., 35 students and single-copy 2-player game), unsupported standard, no in-stock classroom-friendly games, duplicate results from multiple mappings.

### FR-05 — Lesson Plan Detail, Variants, and Export
- **Priority:** Must
- **User Story:** As a teacher, I want a ready-to-run lesson plan with timing options so I can use a game in a real class period.
- **Description:** Each published lesson plan shall include objectives, required materials, setup, vocabulary, pre-game activity, facilitation guide, reflection prompts, rubric, differentiation notes, and 30/45/60-minute variants where available. Teachers can print/export lesson materials.
- **Dependencies:** FR-03, FR-04, FR-10
- **Acceptance Criteria:**
  - **Given** a lesson plan page, **when** the teacher selects a duration variant, **then** the plan updates to show the correct sequence and timing.
  - **Given** a teacher exports a lesson, **when** export succeeds, **then** a printable PDF is generated including objectives, materials, facilitation notes, and rubric.
  - **Given** a lesson plan revision is published, **when** a teacher returns to a saved lesson, **then** they see the latest version and a version change note if content changed materially.
- **Edge Cases:** Missing duration variant, branded export assets unavailable, lesson unpublished after being saved, game rules update requiring lesson revision.

### FR-06 — Classroom and Roster Management
- **Priority:** Must
- **User Story:** As a teacher, I want to create a class and maintain a roster so I can assign groups and track sessions.
- **Description:** Teachers can create classrooms, add students manually or by CSV, and optionally import from Google Classroom [INFERRED]. Student records should support minimal PII by default.
- **Dependencies:** FR-01
- **Acceptance Criteria:**
  - **Given** a teacher with no classrooms, **when** they create one, **then** they can define class name, grade, subject, and expected student count.
  - **Given** a CSV with supported columns, **when** the teacher imports it, **then** valid students are created and invalid rows are surfaced with row-level errors.
  - **Given** a connected Google Classroom account, **when** the teacher imports a class, **then** roster data is created without duplicating existing students already matched by external ID.
- **Edge Cases:** Duplicate student names, student transfer between classrooms, class larger than supported single-session group count, partial sync failure.

### FR-07 — Session Planning and Live Run Mode
- **Priority:** Must
- **User Story:** As a teacher, I want help running a live session so classroom gameplay stays organized and aligned to the lesson.
- **Description:** A teacher can start a session from a lesson plan, select the classroom, mark absent students, generate group suggestions based on player count, launch a timer, and view facilitation prompts/checkpoints.
- **Dependencies:** FR-05, FR-06
- **Acceptance Criteria:**
  - **Given** a teacher starts a session, **when** they choose a classroom and lesson, **then** the system suggests the number of groups/copies required and allows manual adjustment.
  - **Given** a live session is running, **when** the teacher advances phases, **then** the timer, facilitation prompts, and observation checklist update accordingly.
  - **Given** the teacher refreshes the browser during an active session, **when** they reopen the session, **then** the current phase and elapsed timing state are restored within the same session.
- **Edge Cases:** Too few game copies, absent students causing odd group counts, session interrupted by lost connectivity, session started without roster data.

### FR-08 — Assessment and Reflection Capture
- **Priority:** Must
- **User Story:** As a teacher, I want to capture observations and reflections so I can document what students practiced and learned.
- **Description:** During or after a session, teachers can record rubric scores, checklist observations, and notes at class, group, or student level. Students can complete short reflection prompts when enabled.
- **Dependencies:** FR-06, FR-07
- **Acceptance Criteria:**
  - **Given** an active or completed session, **when** the teacher records rubric scores and notes, **then** the data is saved against the session and can be edited later.
  - **Given** student reflection is enabled, **when** a student reflection form is submitted, **then** it is stored with the session and visible to the teacher.
  - **Given** a teacher has no student-level roster, **when** they complete assessment, **then** class-level evidence capture is still supported.
- **Edge Cases:** Incomplete rubric submission, duplicate reflections, anonymous sessions, students absent for part of the session.

### FR-09 — Evidence Reports for Teachers and Admins
- **Priority:** Must
- **User Story:** As an administrator or teacher, I want clear reports so I can justify usage and understand adoption.
- **Description:** The platform shall generate reports showing standards covered, lessons run, games used, participation counts, and observed skills trends. Teachers can view their classroom data; admins can see aggregate organization-level summaries.
- **Dependencies:** FR-07, FR-08
- **Acceptance Criteria:**
  - **Given** completed sessions exist, **when** a teacher opens reports, **then** they can filter by classroom, date range, subject, and standard.
  - **Given** an admin opens the school report view, **when** they select a date range, **then** they see aggregate counts across classrooms without exposing unauthorized student detail.
  - **Given** a report is exported, **when** export completes, **then** PDF and CSV outputs reflect the same filtered dataset.
- **Edge Cases:** No data available, sparse data that should not imply mastery, cross-school admin access attempt, export size too large.

### FR-10 — Content Authoring, Review, and Publishing
- **Priority:** Must
- **User Story:** As a content operations manager, I want to create and update mappings and lesson plans without code deploys so the catalog stays fresh and accurate.
- **Description:** Internal users can create draft game profiles, standards mappings, and lesson plans, route them for review, publish approved content, and maintain version history.
- **Dependencies:** FR-02, FR-03
- **Acceptance Criteria:**
  - **Given** a draft lesson plan, **when** it is submitted for review, **then** its status changes and a reviewer can approve or request changes.
  - **Given** approved content, **when** it is published, **then** it becomes visible in the user-facing product without a code deployment.
  - **Given** an existing published lesson plan is edited, **when** the new version is published, **then** the previous version remains in history for audit purposes.
- **Edge Cases:** Orphaned mappings when a standard is deprecated, simultaneous edits, accidental unpublish of active content.

### FR-11 — Procurement Wishlist and Classroom Kit Builder
- **Priority:** Should
- **User Story:** As a teacher, I want to estimate the materials needed for a classroom kit so I can request budget approval.
- **Description:** Teachers can add games to a wishlist, specify classroom size and number of copies, estimate total cost ranges, and export a justification summary for administrators. This is a lightweight planning tool, not in-app checkout.
- **Dependencies:** FR-03
- **Acceptance Criteria:**
  - **Given** a teacher adds a game to a wishlist, **when** they define class size and copies needed, **then** the system estimates the quantity required and cost range.
  - **Given** a completed wishlist, **when** the teacher exports it, **then** the export includes game names, copy counts, estimated costs, and instructional rationale.
- **Edge Cases:** Unknown price, discontinued game, multiple editions with different prices, school already owns partial inventory.

---

## 5. Non-Functional Requirements

### Performance [INFERRED]
- Catalog/search result page load: **p95 <= 1.5s** for cached/filterable queries.
- Lesson plan detail page load: **p95 <= 2.0s**.
- Session state save (timer/checklist/notes): **p95 <= 500ms**.
- PDF export generation: **p95 <= 8s**.
- CSV roster import processing for 35 students: **p95 <= 30s**.

### Availability [INFERRED]
- Monthly application uptime SLA: **99.5%** excluding scheduled maintenance.
- Planned maintenance windows must be announced at least **48 hours** in advance for school customers [INFERRED].
- Recovery Time Objective (RTO): **4 hours**; Recovery Point Objective (RPO): **15 minutes**.

### Scalability [INFERRED]
- Support **10,000 monthly active teachers**, **2,000 concurrent active sessions**, and **500,000 student session records** without architectural redesign.
- Support catalog growth to **20,000 games**, **100,000 standards mappings**, and **25,000 published lesson plan variants**.
- Reporting queries for a single school with up to **20 teachers and 1,000 students** should return in **<= 5 seconds p95**.

### Security Model [INFERRED]
- FERPA-aligned data handling; COPPA review required before direct student-facing reflection collection [NEEDS INPUT].
- TLS 1.2+ in transit and AES-256 or cloud-provider equivalent encryption at rest.
- RBAC roles at minimum: `teacher`, `admin`, `content_editor`, `homeschool_owner` [INFERRED].
- Audit logs for login, role changes, exports, roster imports, and content publishing.
- Default to minimal student data: first name, last initial, pseudonymous external ID where possible [INFERRED].
- No sale of student data; analytics must exclude raw student responses unless contractually permitted [INFERRED].

### Accessibility
- Meet **WCAG 2.2 AA** for the core web experience [INFERRED].
- Keyboard navigable teacher workflows for search, export, session mode, and reporting.
- Color is never the only indicator for timer state, rubric status, or errors.

### Internationalization (i18n) [INFERRED]
- v1 UI language: English.
- System architecture must support localized strings and locale-aware date/time formatting.
- Standards framework model must support region-specific catalogs for future international expansion.

### Data Retention [INFERRED]
- Active customer content retained for contract duration.
- Student-level identifiable records deleted or anonymized **24 months after last activity** unless a shorter district policy is configured [NEEDS INPUT].
- Audit logs retained **12 months**.
- System operational logs retained **90 days hot / 1 year archived**.

### Browser and Device Support [INFERRED]
- Latest 2 versions of Chrome, Edge, Firefox, and Safari.
- iPad Safari 16+ supported for teacher classroom use.
- Minimum viewport support: **1280px desktop**, **768px tablet**.
- Phone support is responsive for reference usage, but live session mode is optimized for tablet/desktop [INFERRED].

---

## 6. User Flows

### Flow 1 — Teacher Finds a Standards-Aligned Game Lesson
**Happy Path**
1. Teacher signs in.
2. Teacher selects grade, subject, standard, class size, and lesson duration.
3. System returns ranked games with explanation badges.
4. Teacher opens a lesson plan and saves it.
5. Teacher exports the printable version.

**Error/Exception Paths**
- No exact results: system suggests nearby matches and explains the relaxed constraint.
- Lesson exists but no export available: system offers web-only view and flags export issue.
- Teacher lacks access to school-branded export: system falls back to default branding.

### Flow 2 — Teacher Imports a Class and Prepares Groups
**Happy Path**
1. Teacher creates a classroom.
2. Teacher imports roster via CSV or Google Classroom.
3. Teacher opens a lesson and selects the classroom.
4. System recommends groups/copies based on player count and class size.
5. Teacher manually adjusts groups and saves the session plan.

**Error/Exception Paths**
- CSV contains invalid rows: system imports valid rows and returns row-level error messages.
- Class size exceeds available copies: system warns and suggests rotation or additional copies.
- Duplicate students are detected: system prompts teacher to merge or keep separate.

### Flow 3 — Teacher Runs a Live Session
**Happy Path**
1. Teacher starts the session in run mode.
2. Teacher marks absent students.
3. Timer and facilitation prompts guide the session.
4. Teacher records observations during gameplay.
5. Session completes and transitions to reflection/assessment.

**Error/Exception Paths**
- Connection drops: the UI preserves local session state and retries save on reconnect [INFERRED].
- Teacher ends session early: system stores partial session and labels it incomplete.
- Game setup takes longer than expected: teacher can skip to a later phase manually.

### Flow 4 — Teacher Captures Evidence and Shares Results
**Happy Path**
1. Teacher completes rubric/checklist and optional notes.
2. Students complete short reflections.
3. System aggregates standards covered and observed skills.
4. Teacher exports a report for admin or parent communication.

**Error/Exception Paths**
- No student reflections submitted: report still generates with teacher evidence only.
- Report has insufficient data: system includes a "directional, not mastery" disclaimer.
- Export times out: system retries and provides an email link when ready [INFERRED].

### Flow 5 — Admin Reviews School-Level Adoption
**Happy Path**
1. Admin signs in.
2. Admin selects a date range and school filters.
3. System shows lessons run, standards covered, active teachers, and participating classrooms.
4. Admin exports a leadership summary.

**Error/Exception Paths**
- No completed sessions exist yet: system displays onboarding guidance instead of empty charts.
- Admin lacks permission for a school/campus: only authorized organizations appear.

---

## 7. Data Model

| Entity | Purpose | Key Relationships | PII Flag |
|---|---|---|---|
| Organization | School, homeschool account, or program container | Has many Users, Classrooms, Reports, IntegrationConnections | No |
| User | Authenticated teacher, admin, or content staff | Belongs to one Organization; owns Classrooms, Sessions, Exports | Yes |
| Classroom | Group of students tied to a teacher | Belongs to User and Organization; has many Students and Sessions | Low |
| Student | Learner record for tracking participation and evidence | Belongs to Classroom; has many SessionParticipants and Reflections | Yes |
| StandardsFramework | Framework container such as CCSS/CASEL/NGSS | Has many Standards | No |
| Standard | Individual instructional standard | Belongs to StandardsFramework; linked to GameMappings and LessonPlans | No |
| Game | Board game catalog record | Has many GameMappings, LessonPlans, WishlistItems | No |
| GameMapping | Join entity linking a game to one or more standards with rationale | Belongs to Game and Standard; may reference evidence score | No |
| LessonPlan | Published instructional content tied to a game + standard context | Belongs to Game; references Standards; has many LessonVariants | No |
| LessonVariant | Time-boxed version (30/45/60 min) of a lesson | Belongs to LessonPlan | No |
| Session | Planned or completed classroom run of a lesson | Belongs to Classroom, LessonPlan, User; has many Observations | No |
| SessionParticipant | Student participation and group assignment for a session | Belongs to Session and Student | Yes |
| Observation | Teacher rubric/checklist/note record | Belongs to Session; optionally Student or Group | Potentially Yes |
| Reflection | Student self-assessment/reflection response | Belongs to Session and optionally Student | Yes |
| ReportExport | Metadata for generated PDF/CSV evidence reports | Belongs to User/Organization and optional filter scope | No |
| IntegrationConnection | OAuth or external-system connection state | Belongs to Organization or User | Sensitive |
| ContentRevision | Version history for game/lesson content | Belongs to LessonPlan or Game | No |

### Data Design Notes
- Student records should support pseudonymous display names where districts do not permit full names [INFERRED].
- Reports must aggregate by default and only expose student-level detail to authorized teachers.
- Game-to-standard mapping should include a rationale/evidence field to explain why a match exists.

---

## 8. Integration Points

| Integration | v1? | Purpose | Notes / Fallback |
|---|---|---|---|
| Google Sign-In / Google Workspace for Education | Yes | Authentication and optional roster import | If unavailable, fall back to email/password or Microsoft SSO [INFERRED] |
| Microsoft 365 Education SSO | Yes | Authentication for school users | Roster sync can be deferred if auth only is simpler for v1 [INFERRED] |
| Google Classroom | Yes | Classroom roster import | Manual CSV import remains mandatory fallback |
| BoardGameGeek API / equivalent game metadata source | Yes | Seed public game metadata and images where licensing permits | Cache external data; if unavailable, show internal curated metadata |
| Headless CMS | Yes | Authoring/review/publish workflow for lesson content | Must support version history and publish states |
| PDF generation service | Yes | Export lesson plans and reports | Queue large exports asynchronously [INFERRED] |
| Email provider | Yes | Invites, export notifications, account alerts | Failure should not block core in-app workflow |
| Product analytics | Yes | Activation, usage, and funnel measurement | Must exclude unauthorized student PII |
| Canvas / Schoology | No (v2+) | Assignment links and eventual grade passback | CSV/PDF export is v1 fallback |
| Clever | No (v2+) | Additional education SSO/roster sync | Evaluate after pilot demand [INFERRED] |

---

## 9. UX/UI Requirements

### Key Screens
1. **Onboarding / Sign-In:** Role-aware onboarding, org selection/invite handling, SSO options.
2. **Teacher Home Dashboard:** Recently viewed lessons, saved lessons, upcoming sessions, class setup prompts.
3. **Standards + Search Workspace:** Filter panel, standards browser, ranked game/lesson results, explanation badges.
4. **Game Detail Page:** Classroom-fit metadata, standards covered, lesson availability, materials and accessibility notes.
5. **Lesson Plan Detail:** Objectives, timing tabs, facilitation guidance, rubric, export CTA, save CTA.
6. **Classroom/Roster Screen:** Classroom metadata, student list, import actions, sync status, duplicate resolution.
7. **Live Session Mode:** Large timer, current phase, facilitation prompts, quick observation capture, pause/resume controls.
8. **Reports Dashboard:** Filterable charts/tables, export actions, usage summaries, standards coverage.
9. **Admin Dashboard:** Teacher adoption, school-wide activity, organization settings, integration status.

### Loading States
- Search results use skeleton rows and preserve filter state.
- Large exports show queued/progress state.
- Roster import shows processing state with completion summary.

### Empty States
- No saved lessons: suggest top recommended starter lessons.
- No classrooms: prompt teacher to create/import a class.
- No report data: explain how to run first session and log evidence.

### Error States
- Friendly, action-oriented copy with retry options for SSO, search, sync, and export failures.
- CSV import errors must be row-specific and downloadable.
- If external metadata is unavailable, show last cached data and timestamp.

### UX Constraints [INFERRED]
- Teachers should be able to complete the core find-to-export workflow in **<= 5 clicks after login** for a common use case.
- Live session mode must prioritize large tap/click targets suitable for classroom movement.
- Lesson pages should support print-friendly layout without hidden essential content.

---

## 10. Release & Rollout

### Recommended Rollout Plan [INFERRED]

#### Phase 0 — Content Seeding and Internal QA (6-8 weeks)
- Seed initial game catalog and standards dataset.
- Publish first 50-100 lesson plans.
- Validate content workflow, search quality, and export reliability.

#### Phase 1 — Closed Alpha (10 teachers / 2 schools)
- Goal: validate onboarding, search relevance, and lesson usability.
- Gate to next phase: >= 70% of alpha teachers can independently find and save a lesson in one session [INFERRED].

#### Phase 2 — Pilot (50 teachers / 10 schools)
- Aligns to original PRD pilot intent.
- Goal: validate classroom session logging, reports, and renewal signals.
- Gate to next phase: activation >= 40%, NPS > 40, < 5% critical-session failure rate [INFERRED].

#### Phase 3 — General Teacher Launch
- Open teacher subscriptions.
- Launch school admin reporting, support workflows, and sales collateral.
- Maintain feature flags for integrations and reporting exports.

#### Phase 4 — School / District Expansion
- Expand integration coverage.
- Add procurement workflows, school-wide controls, and multi-school reporting.

### Rollout Requirements
- Use feature flags for SSO providers, roster sync, exports, and admin reporting.
- Provide onboarding guides and sample lesson plans for first-run experience.
- Establish customer support SLA of **1 business day** for pilot schools [INFERRED].
- Instrument activation, search success, export success, and session completion before pilot begins.

---

## 11. Open Questions with Proposed Defaults

| Question | Status | Proposed Default |
|---|---|---|
| Which standards should be fully supported at v1 launch? | [NEEDS INPUT] | Launch with Common Core Math K-5 and CASEL K-8; add NGSS 3-5 only if content capacity remains [INFERRED] |
| Is v1 primarily a school product or a mixed school + homeschool launch? | [NEEDS INPUT] | Optimize v1 for teacher-led school pilots; keep homeschool on a lighter self-serve path without dedicated feature work [INFERRED] |
| What student data are customers willing to store? | [NEEDS INPUT] | Default to minimal PII: first name + last initial or pseudonymous ID; no birthdates or sensitive demographic data [INFERRED] |
| Can LearnByPlay host print-and-play files or rewritten rules? | [NEEDS INPUT] | Do not host copyrighted PnP assets or full rulebooks unless explicitly licensed; allow original summaries and facilitation notes only [INFERRED] |
| Is direct student reflection collection permitted under intended compliance posture? | [NEEDS INPUT] | Disable direct student-facing reflection forms by default for school tenants until compliance/legal review is complete [INFERRED] |
| How should recommendation ranking work initially? | [NEEDS INPUT] | Use rules-based ranking (standards fit, duration fit, player fit, teacher saves) before ML personalization [INFERRED] |
| Should LMS grade passback be in v1? | [NEEDS INPUT] | No; provide PDF/CSV exports first |
| How will content be created at launch? | [NEEDS INPUT] | Internal curriculum team authors and reviews content; no external teacher publishing in v1 [INFERRED] |
| What level of school branding is required in exports? | [NEEDS INPUT] | Support logo + school name only in v1; advanced custom templates deferred [INFERRED] |
| What procurement data source should power cost estimates? | [NEEDS INPUT] | Use curated price ranges updated manually monthly until supplier integrations are justified [INFERRED] |

