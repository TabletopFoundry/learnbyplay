import type { LessonPlan } from "@/lib/types";

const lesson = (item: LessonPlan): LessonPlan => item;
const variant = (duration: number, focus: string, sequence: Array<[string, number, string]>) => ({
  duration,
  label: `${duration}-minute block`,
  focus,
  sequence: sequence.map(([phase, minutes, guidance]) => ({ phase, minutes, guidance })),
});

export const lessonsSeed: LessonPlan[] = [
  lesson({
    slug: "fraction-races-with-prime-climb",
    gameSlug: "prime-climb",
    title: "Fraction Races with Prime Climb",
    summary: "Use Prime Climb to compare benchmark fractions, justify equivalent moves, and build productive struggle routines.",
    standards: ["CCSS.MATH.CONTENT.3.NF.A.1", "CCSS.MATH.CONTENT.4.NF.A.1", "CASEL.SELF_MANAGEMENT"],
    gradeBand: "3-5",
    learningObjectives: ["Represent fraction moves with words, symbols, and sketches.", "Explain why two moves create equivalent values.", "Use self-management routines when a first strategy does not work."],
    materialsNeeded: ["1 Prime Climb board per group", "fraction recording sheet", "benchmark fraction chart", "math journals"],
    preGameActivity: ["Sort halves, fourths, and eighths with quick visuals.", "Model one sample turn and record it as a number sentence.", "Predict which board spaces will be easiest to reach and why."],
    facilitationGuide: ["Pause after five turns and ask each group to name one equivalent move.", "Listen for students using comparison language such as more than one whole.", "Prompt stuck students with Which operation changes the size of the jump most efficiently?"],
    postGameReflection: ["Which move felt most efficient and what evidence supports it?", "When did your group revise a plan after new information appeared?", "How did you stay focused when a setback space changed your plan?"],
    assessmentRubric: [
      { criterion: "Fraction reasoning", exceeds: "Explains equivalent moves using visual and symbolic evidence.", meets: "Identifies and justifies a fraction move with one supporting example.", developing: "Names a move but needs support connecting it to fraction meaning." },
      { criterion: "Strategy communication", exceeds: "Uses precise math vocabulary and responds to peers' ideas.", meets: "Explains thinking clearly when prompted.", developing: "Shares a strategy but relies on partial evidence." },
      { criterion: "Self-management", exceeds: "Persists, monitors mistakes, and adjusts independently.", meets: "Returns to the task after feedback and completes rounds responsibly.", developing: "Needs repeated adult support to reengage after setbacks." }
    ],
    teacherPrep: ["Pre-sort boards and pawns into bags.", "Post fraction sentence stems at each table.", "Decide whether students record every turn or only highlight moves."],
    variants: [
      variant(30, "Fast math rotation", [["Warm-up", 5, "Review benchmark fractions with quick sketches."], ["Play", 18, "Students complete two fast rounds while recording one key move."], ["Debrief", 7, "Share efficient moves and SEL habits."]]),
      variant(45, "Core workshop lesson", [["Launch", 8, "Model a sample move and review recording expectations."], ["Play Round 1", 15, "Students play, pause, and compare fraction moves."], ["Mini-conference", 7, "Teacher meets with one table to push equivalence talk."], ["Play Round 2", 10, "Groups try a revised strategy."], ["Reflection", 5, "Complete exit slip."]]),
      variant(60, "Deep intervention block", [["Number Talk", 10, "Compare two fraction representations from the board."], ["Guided Setup", 8, "Assign roles and practice turn narration."], ["Play Round 1", 15, "Teacher confers with targeted students."], ["Strategy Swap", 7, "Groups pause to trade successful move ideas."], ["Play Round 2", 12, "Students attempt a challenge card."], ["Reflection", 8, "Journal and rubric self-check."]])
    ]
  }),
  lesson({
    slug: "pattern-evidence-with-qwirkle",
    gameSlug: "qwirkle",
    title: "Pattern Evidence with Qwirkle",
    summary: "Students classify attributes, justify pattern extensions, and practice collaborative talk through Qwirkle tile play.",
    standards: ["CCSS.MATH.CONTENT.2.OA.C.3", "CCSS.MATH.CONTENT.4.G.A.3", "CASEL.RELATIONSHIP_SKILLS"],
    gradeBand: "3-5",
    learningObjectives: ["Describe patterns using shape and color attributes.", "Explain why a tile placement is valid or invalid with evidence.", "Build on classmates' ideas using respectful discussion moves."],
    materialsNeeded: ["1 Qwirkle set per group", "attribute chart", "discussion stems", "score sheet"],
    preGameActivity: ["Sort six sample tiles by two different rules.", "Co-create a sentence stem for valid pattern moves.", "Preview how score lines connect to pattern length."],
    facilitationGuide: ["Ask groups to defend one high-scoring move using both color and shape language.", "Encourage quiet students to point to evidence before speaking.", "Model how to disagree politely when a placement is challenged."],
    postGameReflection: ["What made a placement valid in more than one way?", "How did your team handle a disagreement about a move?", "Which discussion stem helped your group stay productive?"],
    assessmentRubric: [
      { criterion: "Pattern explanation", exceeds: "Uses both attributes accurately and compares multiple valid options.", meets: "Correctly explains why a tile matches a line.", developing: "Needs support naming the matching attribute." },
      { criterion: "Collaboration", exceeds: "Invites others in and responds constructively to feedback.", meets: "Participates and follows agreed talk norms.", developing: "Participates inconsistently or dominates without listening." },
      { criterion: "Precision", exceeds: "Scores accurately and self-corrects with minimal support.", meets: "Tracks score with occasional reminders.", developing: "Needs adult support to track or verify scoring." }
    ],
    teacherPrep: ["Pre-teach color and shape vocabulary for multilingual support.", "Decide whether students score every turn or every three turns.", "Post one exemplar valid line and one invalid line."],
    variants: [
      variant(30, "Station rotation", [["Pattern Sort", 5, "Warm up by classifying sample tiles."], ["Play", 18, "Groups play one round with talk stems on table."], ["Share", 7, "Describe one valid and one almost-valid move."]]),
      variant(45, "Full lesson", [["Launch", 8, "Review rules and language targets."], ["Play Round 1", 12, "Students build initial lines."], ["Pause", 5, "Groups defend one move."], ["Play Round 2", 14, "Continue with a focus on score accuracy."], ["Reflection", 6, "Exit slip and pair share."]]),
      variant(60, "Math discourse block", [["Mini-lesson", 10, "Compare attribute-based classifications."], ["Guided Play", 15, "Teacher coaches the first few turns."], ["Discussion Lab", 10, "Teams evaluate photographed board states."], ["Independent Play", 17, "Students apply feedback in a second round."], ["Written Reflection", 8, "Rubric and written response."]])
    ]
  }),
  lesson({
    slug: "data-talks-with-sushi-go",
    gameSlug: "sushi-go",
    title: "Data Talks with Sushi Go!",
    summary: "Turn quick card drafts into opportunities for multi-step problem solving, data displays, and decision analysis.",
    standards: ["CCSS.MATH.CONTENT.3.OA.D.8", "CCSS.MATH.CONTENT.3.MD.B.3", "CASEL.SELF_AWARENESS"],
    gradeBand: "3-5",
    learningObjectives: ["Solve multi-step scoring situations using addition and subtraction.", "Represent round totals with a simple bar graph.", "Notice how personal habits influence in-game choices."],
    materialsNeeded: ["1 Sushi Go! deck per group", "score tracker", "bar graph template", "colored pencils"],
    preGameActivity: ["Review the point values for tempura, sashimi, dumplings, and pudding.", "Predict which card family might create the biggest score swing.", "Create a class chart for collecting round totals."],
    facilitationGuide: ["Pause after each round to compare totals and drafting strategies.", "Prompt learners to explain why a lower-value card now may set up a better later score.", "Celebrate self-awareness when students name a rushed decision."],
    postGameReflection: ["Which scoring card gave you the best long-term return?", "What does your bar graph show about consistency across rounds?", "How did you respond when another player disrupted your original plan?"],
    assessmentRubric: [
      { criterion: "Problem solving", exceeds: "Computes scores accurately and explains multi-step decisions clearly.", meets: "Calculates totals correctly with minor support.", developing: "Needs help connecting card sets to total score." },
      { criterion: "Data representation", exceeds: "Creates a clean graph and draws a supported conclusion from it.", meets: "Graphs round totals correctly.", developing: "Graphs partially correctly but conclusions are incomplete." },
      { criterion: "Reflection", exceeds: "Identifies decision patterns and suggests a concrete adjustment.", meets: "Names one strength or challenge from play.", developing: "Reflection remains vague or off-task." }
    ],
    teacherPrep: ["Write scoring examples on the board for reference.", "Decide whether groups will self-score or exchange score sheets.", "Prepare a visual for graphing round totals."],
    variants: [
      variant(30, "Quick review game", [["Scoring Review", 6, "Practice one sample score."], ["Play", 17, "Complete two brisk rounds."], ["Graph & Share", 7, "Record totals and compare patterns."]]),
      variant(45, "Math workshop", [["Launch", 8, "Preview point systems and graph template."], ["Play Round 1", 12, "Students draft and score."], ["Data Pause", 5, "Add totals to bar graph."], ["Play Round 2", 12, "Apply a new strategy."], ["Reflection", 8, "Discuss decision habits."]]),
      variant(60, "Extended strategy block", [["Mini-lesson", 10, "Model efficient score tracking."], ["Play Round 1", 12, "Teacher confers with groups."], ["Graph & Analyze", 8, "Compare tables and identify trends."], ["Play Round 2", 15, "Students test a revised approach."], ["Reflection", 8, "Write and discuss strategy notes."], ["Share-out", 7, "Whole-group synthesis."]])
    ]
  }),
  lesson({
    slug: "area-strategy-with-kingdomino",
    gameSlug: "kingdomino",
    title: "Area Strategy with Kingdomino",
    summary: "Students compare area, multiplication, and draft order as they design efficient kingdoms.",
    standards: ["CCSS.MATH.CONTENT.4.MD.A.2", "CCSS.MATH.CONTENT.5.MD.C.5", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "3-5",
    learningObjectives: ["Use multiplication to compute regional scores efficiently.", "Compare area-based scoring strategies across kingdoms.", "Make responsible decisions that consider both immediate and future consequences."],
    materialsNeeded: ["1 Kingdomino set per group", "grid paper", "area model tracker", "decision prompt cards"],
    preGameActivity: ["Model how crowns multiply region size using a simple example.", "Ask students to compare two sample domino choices.", "Review the 5 by 5 kingdom limit."],
    facilitationGuide: ["Pause mid-game and ask learners to estimate unfinished region values.", "Highlight when students choose a less flashy tile to improve future placement.", "Encourage groups to sketch one completed region as an area model."],
    postGameReflection: ["Which draft choice changed your score the most and why?", "How did the 5 by 5 limit influence your plan?", "When did you choose a responsible long-term move over a quick point gain?"],
    assessmentRubric: [
      { criterion: "Area and multiplication", exceeds: "Computes and compares region values efficiently with clear models.", meets: "Calculates region scores accurately.", developing: "Needs support linking region size and crowns." },
      { criterion: "Decision-making", exceeds: "Explains tradeoffs between immediate and future value.", meets: "Names a reason for a draft choice.", developing: "Describes choices without evidence." },
      { criterion: "Representation", exceeds: "Creates a neat area model that supports verbal explanation.", meets: "Records at least one accurate area model.", developing: "Representation is incomplete or inaccurate." }
    ],
    teacherPrep: ["Print one area-model tracker per group.", "Pre-plan a projected sample kingdom for modeling.", "Decide whether students may use calculators during the first round."],
    variants: [
      variant(30, "Compact math block", [["Launch", 6, "Model one scoring example."], ["Play", 18, "Students complete a shortened kingdom round."], ["Debrief", 6, "Compare region scores."]]),
      variant(45, "Core lesson", [["Hook", 7, "Compare two draft options."], ["Play Round 1", 15, "Students draft and place."], ["Score Pause", 6, "Estimate region values."], ["Play Round 2", 11, "Continue with revised plans."], ["Reflection", 6, "Exit ticket on decision-making."]]),
      variant(60, "Extended application", [["Mini-lesson", 10, "Connect area models to multiplication."], ["Play Round 1", 15, "Teacher confers."], ["Math Talk", 10, "Analyze two photographed kingdoms."], ["Play Round 2", 15, "Apply feedback."], ["Reflection", 10, "Journal and rubric self-check."]])
    ]
  }),
  lesson({
    slug: "route-ratios-with-ticket-to-ride",
    gameSlug: "ticket-to-ride",
    title: "Route Ratios with Ticket to Ride",
    summary: "Use route planning and map evidence to compare efficiency, justify choices, and connect gameplay to proportional reasoning.",
    standards: ["CCSS.MATH.CONTENT.6.RP.A.3", "CCSS.MATH.CONTENT.7.RP.A.2", "CASEL.RELATIONSHIP_SKILLS"],
    gradeBand: "6-8",
    learningObjectives: ["Compare route choices using efficiency criteria such as cards needed versus points earned.", "Use map evidence to justify the best route for a destination goal.", "Collaborate productively by listening and responding to a partner's planning ideas."],
    materialsNeeded: ["1 Ticket to Ride board per group", "route analysis sheet", "colored pencils", "map projection"],
    preGameActivity: ["Model how to compare two routes by cost, length, and blocking risk.", "Review destination tickets and discuss hidden information in planning.", "Set a collaboration norm for table conversations."],
    facilitationGuide: ["Ask groups to defend one route as most efficient using evidence from the board.", "Encourage students to notice how scarce colors shift ratios and choices.", "Prompt partners to paraphrase each other's plan before disagreeing."],
    postGameReflection: ["Which route had the best payoff for its cost?", "How did another player's move force you to revise your plan?", "What collaboration move helped your table stay strategic instead of reactive?"],
    assessmentRubric: [
      { criterion: "Ratio reasoning", exceeds: "Compares multiple routes using clear efficiency evidence.", meets: "Uses at least one route metric accurately.", developing: "Names a route preference without quantitative support." },
      { criterion: "Map evidence", exceeds: "References destination goals, blocking risk, and geography.", meets: "Uses the board as evidence for a decision.", developing: "Needs prompts to cite board evidence." },
      { criterion: "Collaboration", exceeds: "Builds on peers' ideas and helps regulate table talk.", meets: "Participates respectfully and listens to others.", developing: "Needs reminders to listen or share space." }
    ],
    teacherPrep: ["Choose whether to use the USA map or another edition.", "Create a sample route comparison for the warm-up.", "Assign note-catcher roles if students need discussion structure."],
    variants: [
      variant(30, "Strategy seminar", [["Map Hook", 6, "Compare two short routes."], ["Guided Play", 17, "Students play a shortened scenario."], ["Debrief", 7, "Share efficient route decisions."]]),
      variant(45, "Core middle-school lesson", [["Launch", 8, "Review route metrics and collaboration norms."], ["Play Round 1", 14, "Students build early routes."], ["Planning Pause", 6, "Discuss revised routes."], ["Play Round 2", 12, "Apply ratio reasoning."], ["Reflection", 5, "Exit ticket."]]),
      variant(60, "Deep analysis block", [["Mini-lesson", 10, "Model route comparison with evidence."], ["Play Round 1", 15, "Teacher listens for ratio language."], ["Small Group Analysis", 10, "Students compare photographed maps."], ["Play Round 2", 15, "Re-enter the game with a new target."], ["Reflection", 10, "Written justification and SEL rubric."]])
    ]
  }),
  lesson({
    slug: "negotiation-math-with-catan",
    gameSlug: "catan",
    title: "Negotiation Math with Catan",
    summary: "Connect ratios, probability, and ethical negotiation as students plan settlements and trades in Catan.",
    standards: ["CCSS.MATH.CONTENT.6.RP.A.3", "CCSS.MATH.CONTENT.7.RP.A.2", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "6-8",
    learningObjectives: ["Analyze the relative value of resources and trade offers.", "Use probability clues from dice numbers to justify settlement choices.", "Practice ethical negotiation that considers classroom community norms."],
    materialsNeeded: ["1 Catan set per group", "trade log", "probability strip", "ethics discussion stems"],
    preGameActivity: ["Review which dice totals appear more frequently and why.", "Compare two settlement spots and decide which offers better future value.", "Name a class norm for fair negotiation."],
    facilitationGuide: ["Pause when interesting trades emerge and ask students to explain both sides of the deal.", "Draw attention to how number-token probability affects long-term resource flow.", "Coach students to replace exploitative trade language with clear academic talk."],
    postGameReflection: ["Which trade was most mathematically fair and why?", "How did probability influence where you built first?", "What did responsible decision-making sound like at your table?"],
    assessmentRubric: [
      { criterion: "Ratio and probability reasoning", exceeds: "Uses strong evidence from numbers and trades to justify choices.", meets: "Explains at least one decision with mathematical support.", developing: "Describes decisions without connecting to ratios or probability." },
      { criterion: "Negotiation", exceeds: "Negotiates clearly, ethically, and flexibly.", meets: "Uses fair language and listens to counters.", developing: "Needs reminders about fairness or clarity." },
      { criterion: "Reflection", exceeds: "Connects game decisions to classroom norms and future adjustments.", meets: "Names a successful or unsuccessful decision.", developing: "Reflection lacks specificity." }
    ],
    teacherPrep: ["Pre-build a fair trade anchor chart.", "Decide if robber rules need simplification for time.", "Provide a probability strip for students who need support."],
    variants: [
      variant(30, "Decision mini-lab", [["Hook", 7, "Compare settlement sites."], ["Scenario Play", 16, "Run a shortened opening-game scenario."], ["Debrief", 7, "Analyze one trade and one build choice."]]),
      variant(45, "Core lesson", [["Launch", 8, "Review negotiation norms and probability cues."], ["Play Round 1", 15, "Students develop openings."], ["Trade Pause", 6, "Analyze a live trade."], ["Play Round 2", 10, "Students apply new thinking."], ["Reflection", 6, "Complete exit ticket."]]),
      variant(60, "Extended simulation", [["Mini-lesson", 10, "Model fair trade analysis."], ["Play Round 1", 15, "Teacher confers with groups."], ["Probability Check", 10, "Compare settlement output."], ["Play Round 2", 15, "Negotiate with revised goals."], ["Reflection", 10, "Write and discuss conclusions."]])
    ]
  }),
  lesson({
    slug: "mosaic-strategy-with-azul",
    gameSlug: "azul",
    title: "Mosaic Strategy with Azul",
    summary: "Students analyze constraints, efficient choices, and error recovery as they build patterned mosaics.",
    standards: ["CCSS.MATH.CONTENT.5.NBT.B.7", "CCSS.MATH.CONTENT.7.G.B.6", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "6-8",
    learningObjectives: ["Compare multiple drafting choices and justify the most efficient option.", "Use pattern constraints to predict future scoring outcomes.", "Reflect on how decision-making changes after an avoidable mistake."],
    materialsNeeded: ["1 Azul set per group", "decision matrix", "pattern wall diagram", "reflection slips"],
    preGameActivity: ["Examine one sample board and predict which color a player should draft next.", "Review how floor-row penalties change decision quality.", "Model one think-aloud about choosing for both now and later."],
    facilitationGuide: ["Pause when students face a tempting but risky draft and ask them to name consequences.", "Encourage learners to compare two options before finalizing a move.", "Normalize error analysis by asking what a penalty taught the player."],
    postGameReflection: ["Which draft choice was efficient because of future turns, not this turn?", "How did the floor row change your plan?", "What does responsible decision-making look like when choices are imperfect?"],
    assessmentRubric: [
      { criterion: "Strategic reasoning", exceeds: "Explains short- and long-term outcomes clearly.", meets: "Justifies a move with at least one future-oriented reason.", developing: "Describes moves only in the moment." },
      { criterion: "Use of constraints", exceeds: "Accurately tracks board limitations and avoids unforced penalties.", meets: "Usually accounts for placement rules.", developing: "Needs support reading pattern-line constraints." },
      { criterion: "Reflection", exceeds: "Analyzes mistakes constructively and proposes a better future choice.", meets: "Names one adjustment after a penalty.", developing: "Struggles to identify a productive next step." }
    ],
    teacherPrep: ["Photograph one mid-game board state for warm-up discussion.", "Provide dry-erase markers if students use decision matrices repeatedly.", "Plan table jobs for efficient tile cleanup."],
    variants: [
      variant(30, "Strategy clinic", [["Board Study", 6, "Compare two draft choices."], ["Play", 17, "Students play a focused mid-game scenario."], ["Debrief", 7, "Discuss efficient decisions and recovery."]]),
      variant(45, "Core lesson", [["Launch", 8, "Review constraints and think-aloud."], ["Play Round 1", 15, "Students draft with a decision matrix."], ["Pause", 5, "Name one risky choice."], ["Play Round 2", 11, "Apply revised strategy."], ["Reflection", 6, "Exit slip."]]),
      variant(60, "Deep reasoning block", [["Mini-lesson", 10, "Analyze pattern-line efficiency."], ["Play Round 1", 15, "Teacher confers."], ["Gallery Walk", 10, "Students compare table boards."], ["Play Round 2", 15, "Try a new approach."], ["Reflection", 10, "Journal plus rubric."]])
    ]
  }),
  lesson({
    slug: "cooperative-communication-with-the-crew",
    gameSlug: "the-crew",
    title: "Cooperative Communication with The Crew",
    summary: "Mission-based trick taking helps students practice inference, concise communication, and team planning.",
    standards: ["CCSS.MATH.CONTENT.6.EE.B.7", "CASEL.RELATIONSHIP_SKILLS", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "6-8",
    learningObjectives: ["Use logical inference from played cards to predict likely outcomes.", "Communicate important information clearly within game constraints.", "Reflect on how a team makes shared decisions under pressure."],
    materialsNeeded: ["1 The Crew deck per group", "mission log", "communication stems", "reflection sheet"],
    preGameActivity: ["Model one short trick-taking example and identify what information it reveals.", "Explain the single communication token and why constraints matter.", "Set a norm for quick, respectful debriefs after failed missions."],
    facilitationGuide: ["After each mission, ask groups what evidence they inferred from the cards played.", "Coach students to keep feedback specific and forward-looking.", "Highlight teams that adjust roles after a failed mission instead of blaming."],
    postGameReflection: ["What clue helped your team infer the right play?", "How did your team decide who should lead a critical trick?", "What communication move helped the group recover from failure?"],
    assessmentRubric: [
      { criterion: "Inference", exceeds: "Uses multiple card clues to predict outcomes accurately.", meets: "Uses at least one clue from play to explain a decision.", developing: "Relies on guesses more than evidence." },
      { criterion: "Communication", exceeds: "Communicates concise, high-value information at the right time.", meets: "Uses the communication system appropriately.", developing: "Needs support selecting useful information to share." },
      { criterion: "Team resilience", exceeds: "Helps the team revise plans without blame.", meets: "Participates constructively after setbacks.", developing: "Needs reminders to stay solution-focused." }
    ],
    teacherPrep: ["Choose 3-4 missions that fit the available time.", "Post a quick trick-taking glossary.", "Identify one debrief question to repeat after each mission."],
    variants: [
      variant(30, "Mission sprint", [["Launch", 6, "Review communication token and sample trick."], ["Mission Play", 17, "Groups attempt two quick missions."], ["Debrief", 7, "Compare team inference strategies."]]),
      variant(45, "Core advisory lesson", [["Hook", 8, "Model inference from a sample hand."], ["Mission 1", 10, "Play and debrief."], ["Mission 2", 10, "Adjust roles and replay."], ["Mission 3", 10, "Apply refined communication norms."], ["Reflection", 7, "Write and discuss."]]),
      variant(60, "Extended teamwork block", [["Mini-lesson", 10, "Teach quick post-mission analysis."], ["Mission Cycle 1", 12, "Play and debrief."], ["Mission Cycle 2", 12, "Apply feedback."], ["Mission Cycle 3", 12, "Try a more complex task."], ["Reflection", 8, "Rubric self-check."], ["Share-out", 6, "Team takeaways."]])
    ]
  }),
  lesson({
    slug: "geometry-defenses-with-blokus",
    gameSlug: "blokus",
    title: "Geometry Defenses with Blokus",
    summary: "Students build spatial reasoning and productive struggle habits as they cover a shared board with polyominoes.",
    standards: ["CCSS.MATH.CONTENT.4.G.A.3", "CCSS.MATH.CONTENT.7.G.B.6", "CASEL.SELF_MANAGEMENT"],
    gradeBand: "3-5",
    learningObjectives: ["Visualize and describe rotations and reflections that change piece placement.", "Plan multi-step placements under geometric constraints.", "Use self-management strategies to persist when blocked."],
    materialsNeeded: ["1 Blokus board per group", "polyomino reference page", "strategy tracker", "reflection slips"],
    preGameActivity: ["Rotate two sample pieces and ask students to describe what changed.", "Review the corner-touch rule using a quick example and non-example.", "Ask learners to name one persistence strategy they can use when blocked."],
    facilitationGuide: ["Pause when a student finds an unexpected fit and ask them to explain the transformation.", "Encourage students to trace blocked spaces before giving up on a turn.", "Reinforce calm reset routines when a planned move no longer works."],
    postGameReflection: ["Which piece was hardest to place and how did you solve it?", "How did visualizing a rotation or reflection help?", "What self-management routine helped when you felt stuck?"],
    assessmentRubric: [
      { criterion: "Spatial reasoning", exceeds: "Describes transformations and applies them accurately during play.", meets: "Uses geometry language to justify at least one placement.", developing: "Needs support visualizing transformations." },
      { criterion: "Planning", exceeds: "Plans several moves ahead and adapts efficiently.", meets: "Shows evidence of anticipating future space needs.", developing: "Focuses mostly on immediate placement." },
      { criterion: "Persistence", exceeds: "Uses productive struggle routines independently.", meets: "Re-engages after setbacks with minimal prompting.", developing: "Needs repeated support after blocked turns." }
    ],
    teacherPrep: ["Provide one printed polyomino reference per table.", "Decide whether players track remaining squares or only final score.", "Pre-teach rotation language if needed."],
    variants: [
      variant(30, "Geometry center", [["Transform Warm-up", 6, "Rotate sample pieces."], ["Play", 17, "Students complete a short round."], ["Debrief", 7, "Share one geometry-based move."]]),
      variant(45, "Core lesson", [["Launch", 8, "Review geometry language and rules."], ["Play Round 1", 13, "Students start boards."], ["Pause", 5, "Explain a transformed placement."], ["Play Round 2", 12, "Students continue."], ["Reflection", 7, "Exit slip and rubric."]]),
      variant(60, "Extended math block", [["Mini-lesson", 10, "Analyze rotations and reflections."], ["Play Round 1", 15, "Teacher confers."], ["Strategy Clinic", 10, "Compare photographed board states."], ["Play Round 2", 15, "Apply feedback."], ["Reflection", 10, "Journal and share."]])
    ]
  }),
  lesson({
    slug: "chronology-conversations-with-timeline",
    gameSlug: "timeline",
    title: "Chronology Conversations with Timeline",
    summary: "Use quick rounds of Timeline to strengthen sequencing, evidence talk, and perspective taking in history or science units.",
    standards: ["CASEL.SELF_AWARENESS", "CASEL.SOCIAL_AWARENESS"],
    gradeBand: "6-8",
    learningObjectives: ["Place events in chronological order using background knowledge and contextual clues.", "Explain the evidence behind a sequencing choice.", "Listen to and build on alternate interpretations respectfully."],
    materialsNeeded: ["1 Timeline deck per group", "event evidence organizer", "unit vocabulary support"],
    preGameActivity: ["Preview three anchor events from the current unit.", "Model how to infer timing from a clue embedded in an event title.", "Create a norm for disagreeing with evidence, not volume."],
    facilitationGuide: ["Invite students to justify placements before revealing the year.", "Ask what prior event or concept helped them anchor a guess.", "Use reveal moments to celebrate revision and flexible thinking."],
    postGameReflection: ["Which clue helped you most when placing an unfamiliar event?", "How did listening to a classmate change your thinking?", "Where else in class do you use chronology as evidence?"],
    assessmentRubric: [
      { criterion: "Sequencing evidence", exceeds: "Uses unit knowledge and textual clues together to justify placements.", meets: "Provides one reasonable piece of evidence for a placement.", developing: "Needs support connecting a clue to chronology." },
      { criterion: "Discussion", exceeds: "Builds on peers' ideas and revises thinking visibly.", meets: "Participates respectfully in event debates.", developing: "Needs reminders to use respectful language or evidence." },
      { criterion: "Reflection", exceeds: "Transfers chronology thinking to other academic tasks.", meets: "Names one sequencing strategy that helped.", developing: "Reflection is brief or nonspecific." }
    ],
    teacherPrep: ["Select a Timeline deck that matches the current unit if possible.", "Pre-teach unfamiliar vocabulary on a few cards.", "Prepare a board space to collect anchor events after play."],
    variants: [
      variant(30, "Unit opener", [["Hook", 5, "Place three anchor events."], ["Play", 18, "Groups sequence and justify."], ["Debrief", 7, "Discuss surprise revisions."]]),
      variant(45, "Core social studies lesson", [["Launch", 8, "Model clue-based placement."], ["Play Round 1", 12, "Students play in groups."], ["Pause", 5, "Whole-group event debate."], ["Play Round 2", 12, "Continue with stronger evidence."], ["Reflection", 8, "Write and share."]]),
      variant(60, "Research extension", [["Mini-lesson", 10, "Compare contextual clues."], ["Play Round 1", 12, "Groups begin."], ["Research Burst", 10, "Investigate one surprising event."], ["Play Round 2", 15, "Use research insights."], ["Reflection", 13, "Timeline plus written response."]])
    ]
  }),
  lesson({
    slug: "ecosystem-modeling-with-photosynthesis",
    gameSlug: "photosynthesis",
    title: "Ecosystem Modeling with Photosynthesis",
    summary: "Students model competition for light and resources while discussing ecosystem interdependence through strategic play.",
    standards: ["CASEL.RESPONSIBLE_DECISION_MAKING", "CASEL.SOCIAL_AWARENESS"],
    gradeBand: "6-8",
    learningObjectives: ["Describe how access to resources affects organism success in an ecosystem.", "Use game evidence to explain why certain tree placements were advantageous.", "Consider how one decision influences the whole shared system."],
    materialsNeeded: ["1 Photosynthesis set per group", "ecosystem evidence chart", "science vocabulary cards", "discussion stems"],
    preGameActivity: ["Review how sunlight rotates and why shadows matter.", "Connect the game to real ecosystem competition for resources.", "Predict which board spaces will become valuable as the sun moves."],
    facilitationGuide: ["Pause at each sun rotation and ask groups to narrate which trees gained or lost access to energy.", "Prompt students to cite evidence from the board rather than general opinions.", "Connect decision-making back to ecosystem interdependence."],
    postGameReflection: ["How did the sun's movement change your strategy?", "What board evidence shows that systems are interconnected?", "When did your decision help one part of your forest but hurt another?"],
    assessmentRubric: [
      { criterion: "Systems thinking", exceeds: "Explains cascading effects across multiple turns.", meets: "Names one cause-and-effect relationship from play.", developing: "Describes moves without linking them to system effects." },
      { criterion: "Science evidence", exceeds: "Uses precise ecosystem vocabulary tied to board evidence.", meets: "Uses at least one accurate science term.", developing: "Needs support applying content vocabulary." },
      { criterion: "Decision-making", exceeds: "Reflects on tradeoffs thoughtfully and ethically.", meets: "Identifies one successful or unsuccessful choice.", developing: "Needs prompts to analyze choices." }
    ],
    teacherPrep: ["Review tree-growth vocabulary before class.", "Project one sample round to explain shadow rules.", "Assign one evidence recorder per table if students need structure."],
    variants: [
      variant(30, "Science mini-lab", [["Hook", 6, "Predict a high-value planting spot."], ["Play", 17, "Students run a shortened forest cycle."], ["Debrief", 7, "Explain system effects."]]),
      variant(45, "Core science lesson", [["Launch", 8, "Connect rules to ecosystems."], ["Play Round 1", 14, "Students grow forests."], ["Pause", 6, "Narrate resource flow."], ["Play Round 2", 11, "Apply new thinking."], ["Reflection", 6, "Exit slip."]]),
      variant(60, "Inquiry block", [["Mini-lesson", 10, "Model evidence-based explanation."], ["Play Round 1", 15, "Teacher confers."], ["Data Walk", 10, "Compare boards after sunlight rotation."], ["Play Round 2", 15, "Students test hypotheses."], ["Reflection", 10, "Written response and share."]])
    ]
  }),
  lesson({
    slug: "academic-vocabulary-with-codenames",
    gameSlug: "codenames",
    title: "Academic Vocabulary with Codenames",
    summary: "Strengthen vocabulary, inference, and teamwork by converting unit words into clue-based team play.",
    standards: ["CASEL.RELATIONSHIP_SKILLS", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "6-8",
    learningObjectives: ["Connect unit vocabulary through meaningful categories and clues.", "Use inference to justify why a clue maps to specific words.", "Practice inclusive teamwork by balancing speed with listening."],
    materialsNeeded: ["1 Codenames set", "unit word bank", "clue planning chart", "discussion stems"],
    preGameActivity: ["Swap in unit vocabulary or brainstorm possible clue categories together.", "Model one clue that is too broad and one that is precise enough.", "Review listening norms before team guessing begins."],
    facilitationGuide: ["Ask clue-givers to explain their reasoning after each round.", "Encourage teams to defend guesses with evidence from word meaning.", "Pause when one voice dominates and reset to include more perspectives."],
    postGameReflection: ["Which clue was most effective and why?", "How did your team use evidence instead of hunches?", "What helped your group balance confidence with collaboration?"],
    assessmentRubric: [
      { criterion: "Vocabulary reasoning", exceeds: "Connects multiple words with precise academic categories.", meets: "Explains a clue-word connection accurately.", developing: "Needs support articulating why a clue fits." },
      { criterion: "Inference", exceeds: "Uses elimination and context strategically.", meets: "Uses evidence to justify a guess.", developing: "Relies mostly on intuition." },
      { criterion: "Teamwork", exceeds: "Invites all voices and adjusts group process productively.", meets: "Works respectfully within the team.", developing: "Needs reminders to listen or share space." }
    ],
    teacherPrep: ["Choose vocabulary that aligns to the current unit.", "Pre-write a few strong clue models.", "Decide whether to rotate spymasters every round or every game."],
    variants: [
      variant(30, "Vocabulary review", [["Launch", 6, "Preview strong clues."], ["Play", 17, "Run one or two fast rounds."], ["Debrief", 7, "Analyze clue quality."]]),
      variant(45, "Core ELA/content lesson", [["Hook", 8, "Compare broad and precise clues."], ["Round 1", 12, "Teams play with support."], ["Pause", 5, "Discuss best evidence talk."], ["Round 2", 12, "Rotate roles."], ["Reflection", 8, "Write and share."]]),
      variant(60, "Extended discourse lab", [["Mini-lesson", 10, "Plan evidence-based clues."], ["Round 1", 12, "Play and observe."], ["Team Coaching", 10, "Improve talk moves."], ["Round 2", 12, "Apply revisions."], ["Reflection", 10, "Self and peer rubric."], ["Share-out", 6, "Whole-group synthesis."]])
    ]
  }),
  lesson({
    slug: "place-value-patterns-with-tiny-polka-dot",
    gameSlug: "tiny-polka-dot",
    title: "Place Value Patterns with Tiny Polka Dot",
    summary: "Use visual card matches to help young learners count efficiently, compare quantities, and explain groups of ten.",
    standards: ["CCSS.MATH.CONTENT.K.CC.B.4"],
    gradeBand: "K-2",
    learningObjectives: ["Count collections accurately and explain how many objects are represented.", "Recognize when a quantity can be described with a group of ten and extra ones.", "Use confident partner talk to compare two quantities."],
    materialsNeeded: ["1 Tiny Polka Dot deck per group", "ten-frame mats", "mini dry-erase boards", "counting cubes"],
    preGameActivity: ["Flash three cards and ask students to show the quantity without counting by ones.", "Model how a card can be described with both a total and a ten-and-ones sentence.", "Practice a quick comparison stem such as I know ___ is greater because ___."],
    facilitationGuide: ["Pause after early matches and ask students to justify how they saw the quantity so quickly.", "Invite learners to prove a ten-and-ones explanation with cubes or sketches.", "Celebrate when a child revises from counting by ones to seeing a structure."],
    postGameReflection: ["Which card was easiest to see all at once and why?", "How did a ten-frame or dot pattern help you count faster?", "What words helped you explain a larger or smaller quantity to your partner?"],
    assessmentRubric: [
      { criterion: "Counting accuracy", exceeds: "Counts and compares quantities with more than one efficient strategy.", meets: "Counts and names the represented quantity accurately.", developing: "Needs support tracking all objects while counting." },
      { criterion: "Place-value language", exceeds: "Describes quantities flexibly with totals and grouped tens.", meets: "Uses a total and one grouped description when prompted.", developing: "Names the total but not the grouped structure yet." },
      { criterion: "Partner discourse", exceeds: "Explains clearly and listens to a partner before responding.", meets: "Uses a sentence stem to share thinking.", developing: "Needs reminders to take turns or explain aloud." }
    ],
    teacherPrep: ["Pre-sort decks for the quantity range you want to emphasize.", "Set out ten-frame mats before students arrive.", "Choose whether students will record every match or only one highlighted example."],
    variants: [
      variant(30, "Primary math center", [["Visual Warm-up", 5, "Flash dot cards and have students show the quantity."], ["Card Match Play", 18, "Students match equivalent quantities and explain each claim."], ["Reflection", 7, "Share one card that showed a ten and some ones."]]),
      variant(45, "Core number sense lesson", [["Launch", 8, "Model quick recognition and comparison stems."], ["Round 1", 12, "Students match and compare quantities."], ["Math Talk", 7, "Discuss efficient counting strategies."], ["Round 2", 12, "Students try again with larger values."], ["Exit Reflection", 6, "Record one ten-and-ones explanation."]]),
      variant(60, "Intervention block", [["Mini-lesson", 10, "Connect patterns to groups of ten."], ["Guided Play", 15, "Teacher coaches a target group."], ["Concrete Proof", 10, "Use cubes or drawings to verify cards."], ["Independent Play", 15, "Students apply the strategy with new cards."], ["Reflection", 10, "Rubric self-check and share-out."]])
    ]
  }),
  lesson({
    slug: "number-sense-stories-with-zingo-123",
    gameSlug: "zingo-123",
    title: "Number Sense Stories with Zingo! 1-2-3",
    summary: "Pair early addition and place-value talk with quick bingo-style matches and short math stories.",
    standards: ["CCSS.MATH.CONTENT.K.OA.A.1", "CCSS.MATH.CONTENT.1.NBT.B.2", "CASEL.SELF_AWARENESS"],
    gradeBand: "K-2",
    learningObjectives: ["Represent a simple addition idea with words, objects, or drawings.", "Connect numbers on the board to tens and ones language when possible.", "Notice when a personal habit such as rushing or checking carefully changes success."],
    materialsNeeded: ["1 Zingo! 1-2-3 set per group", "story prompt cards", "connecting cubes", "dry-erase boards"],
    preGameActivity: ["Model a quick addition story for one tile combination.", "Build one board number with cubes and name the tens and ones.", "Ask students to choose one personal goal for careful play."],
    facilitationGuide: ["Require a spoken or drawn story before a student covers a space.", "Prompt learners to show how a number could be decomposed with cubes.", "Use calm self-talk stems when a student misses a match because of speed."],
    postGameReflection: ["Which number story helped you remember a match?", "Where did you notice a group of ten and some extra ones?", "How did checking your work change the way you played?"],
    assessmentRubric: [
      { criterion: "Story representation", exceeds: "Creates clear addition stories and matches them to quantities independently.", meets: "Shares a simple story that fits the number shown.", developing: "Needs support connecting a story to the quantity." },
      { criterion: "Place-value understanding", exceeds: "Uses tens-and-ones language flexibly during play.", meets: "Identifies tens and ones with a prompt or manipulative.", developing: "Counts the total but needs support naming place value." },
      { criterion: "Self-awareness", exceeds: "Accurately names a habit that helped and makes an adjustment independently.", meets: "Reflects on one helpful or unhelpful habit.", developing: "Needs support describing personal learning behaviors." }
    ],
    teacherPrep: ["Select prompt cards that match the lesson focus.", "Prepare a few examples of board numbers built with cubes.", "Decide if students will play in pairs or coach from teams of three."],
    variants: [
      variant(30, "Quick K-2 rotation", [["Story Warm-up", 5, "Tell one addition story together."], ["Play", 18, "Students cover spaces after explaining their matches."], ["Debrief", 7, "Share one careful-play strategy."]]),
      variant(45, "Core lesson", [["Launch", 8, "Model story and place-value talk."], ["Round 1", 12, "Students play with oral stories."], ["Pause", 5, "Build one matched number with cubes."], ["Round 2", 12, "Students apply more careful checking."], ["Reflection", 8, "Write or draw one number story."]]),
      variant(60, "Extended support block", [["Mini-lesson", 10, "Connect stories to equations."], ["Guided Play", 15, "Teacher confers with one table."], ["Manipulative Check", 10, "Verify selected numbers with cubes."], ["Independent Play", 15, "Students replay with a personal goal."], ["Reflection", 10, "Self-awareness share circle."]])
    ]
  }),
  lesson({
    slug: "evidence-trails-with-outfoxed",
    gameSlug: "outfoxed",
    title: "Evidence Trails with Outfoxed!",
    summary: "Turn a cooperative mystery into a lesson on evidence, data recording, and respectful problem solving.",
    standards: ["CCSS.MATH.CONTENT.2.OA.C.3", "CCSS.MATH.CONTENT.2.MD.D.10", "CASEL.RELATIONSHIP_SKILLS"],
    gradeBand: "K-2",
    learningObjectives: ["Use recorded clues to eliminate suspects logically.", "Represent clue results on a simple chart or bar graph.", "Work with classmates by listening, sharing turns, and building on each other's evidence."],
    materialsNeeded: ["1 Outfoxed! set per group", "suspect chart", "mini bar graph template", "discussion stems"],
    preGameActivity: ["Practice reading one clue and crossing off suspects that no longer fit.", "Model how a class chart can track which clues appeared most often.", "Review what supportive teammate talk sounds like during a mystery."],
    facilitationGuide: ["Ask students to explain which suspects are ruled out after each clue.", "Pause mid-game to update a graph of clue categories such as glasses or hats.", "Reinforce turn-taking when one student wants to rush the decoder."],
    postGameReflection: ["Which clue changed the mystery the most and why?", "What did your chart or graph show about the clues you collected?", "How did your team make sure every detective had a voice?"],
    assessmentRubric: [
      { criterion: "Evidence use", exceeds: "Explains eliminations clearly using multiple clues.", meets: "Uses at least one clue to justify removing a suspect.", developing: "Needs help connecting clues to suspects." },
      { criterion: "Data representation", exceeds: "Creates and interprets a simple graph accurately.", meets: "Records clue results correctly on the class chart.", developing: "Needs support organizing clue data." },
      { criterion: "Collaboration", exceeds: "Invites peers in and responds supportively during disagreements.", meets: "Shares materials and follows detective team norms.", developing: "Needs repeated reminders about turn-taking or listening." }
    ],
    teacherPrep: ["Photocopy one suspect chart per group.", "Choose which clue categories students will graph.", "Assign simple team jobs such as roller, decoder, and recorder if needed."],
    variants: [
      variant(30, "Mystery center", [["Clue Launch", 6, "Practice one decoder clue together."], ["Play", 17, "Groups solve the mystery while recording evidence."], ["Debrief", 7, "Share one key elimination clue."]]),
      variant(45, "Core cooperative lesson", [["Launch", 8, "Model evidence talk and charting."], ["Round 1", 12, "Students play and record clues."], ["Data Pause", 5, "Update the graph."], ["Round 2", 12, "Use the graph and clues to narrow suspects."], ["Reflection", 8, "Discuss teamwork and evidence."]]),
      variant(60, "Extended reasoning block", [["Mini-lesson", 10, "Connect clues to data displays."], ["Guided Play", 15, "Teacher coaches evidence language."], ["Graph Talk", 10, "Interpret the clue graph together."], ["Independent Play", 15, "Students finish the mystery."], ["Reflection", 10, "Rubric and team celebration."]])
    ]
  }),
  lesson({
    slug: "design-thinking-with-7-wonders",
    gameSlug: "7-wonders",
    title: "Design Thinking with 7 Wonders",
    summary: "Use drafting, resource models, and wonder construction to compare long-term plans and ethical tradeoffs.",
    standards: ["CCSS.MATH.CONTENT.HSA.CED.A.2", "CCSS.MATH.CONTENT.HSG.MG.A.3", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "9-12",
    learningObjectives: ["Model resource needs and tradeoffs with equations or planning tables.", "Defend a design pathway using evidence from available cards and neighboring resources.", "Evaluate the consequences of short-term gains versus long-term community impact."],
    materialsNeeded: ["1 7 Wonders set per group", "resource flow planner", "cost modeling sheet", "decision protocol card"],
    preGameActivity: ["Compare two opening hands and predict which supports a stronger long-term build.", "Model a simple resource equation for constructing one card and one wonder stage.", "Discuss how responsible decision-making applies when a choice helps you but harms neighboring tables."],
    facilitationGuide: ["Pause after each age and ask groups to explain one design choice with quantitative evidence.", "Press students to compare at least two viable pathways before selecting a build.", "Use the debrief to connect strategic play with ethical design decisions."],
    postGameReflection: ["Which modeled resource relationship helped you most during drafting?", "How did you balance immediate points against future flexibility?", "What evidence showed that one decision had ripple effects beyond your own board?"],
    assessmentRubric: [
      { criterion: "Modeling", exceeds: "Builds and revises clear quantitative models for several turns ahead.", meets: "Uses a resource table or equation to justify a design choice.", developing: "Needs support translating a plan into a model." },
      { criterion: "Design reasoning", exceeds: "Compares multiple strategic pathways with strong evidence.", meets: "Explains one build path with board evidence.", developing: "Describes choices without enough supporting detail." },
      { criterion: "Decision-making", exceeds: "Weighs ethical and strategic consequences thoughtfully.", meets: "Identifies one meaningful consequence of a choice.", developing: "Needs prompts to reflect on consequences." }
    ],
    teacherPrep: ["Preselect wonder boards if you want balanced openings.", "Print one resource flow planner per student pair.", "Decide whether to run a full game or a focused two-age scenario."],
    variants: [
      variant(30, "Strategy seminar", [["Hook", 6, "Analyze two opening hands."], ["Scenario Play", 17, "Students draft through a short simulation."], ["Debrief", 7, "Compare modeled design choices."]]),
      variant(45, "Core high-school lesson", [["Launch", 8, "Model one resource equation."], ["Age 1", 12, "Students draft and record choices."], ["Pause", 5, "Compare long-term pathways."], ["Age 2", 12, "Students apply revised plans."], ["Reflection", 8, "Written decision analysis."]]),
      variant(60, "Project-based extension", [["Mini-lesson", 10, "Connect design problems to geometry and constraints."], ["Age 1", 12, "Play and record."], ["Studio Critique", 10, "Review neighboring tables' design choices."], ["Age 2", 12, "Draft with revised criteria."], ["Reflection", 10, "Rubric and design memo."], ["Share-out", 6, "Whole-group synthesis."]])
    ]
  }),
  lesson({
    slug: "systems-budgeting-with-power-grid",
    gameSlug: "power-grid",
    title: "Systems Budgeting with Power Grid",
    summary: "Explore scaling systems, rising costs, and budget models through energy network decisions.",
    standards: ["CCSS.MATH.CONTENT.HSF.IF.B.4", "CCSS.MATH.CONTENT.HSF.LE.A.1", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "9-12",
    learningObjectives: ["Interpret tables or graphs that show how costs change as a system grows.", "Compare linear and non-linear patterns in network expansion and fuel use.", "Use responsible decision-making when scarce resources create competing priorities."],
    materialsNeeded: ["1 Power Grid set per group", "cost table template", "graph paper", "market tracker"],
    preGameActivity: ["Analyze one sample table showing city connection costs over time.", "Review how the fuel market changes after each purchase.", "Discuss how scarcity changes both mathematical models and ethical choices."],
    facilitationGuide: ["Ask groups to predict how a choice will alter a future graph or cost table before committing.", "Connect in-game scaling to the difference between steady and accelerating change.", "Prompt students to explain why the mathematically best move may still have social tradeoffs."],
    postGameReflection: ["Where did your graphs or tables help you anticipate future costs?", "Which decision illustrated linear change and which showed a more complex pattern?", "How did scarcity affect what counted as a responsible choice?"],
    assessmentRubric: [
      { criterion: "Function interpretation", exceeds: "Interprets and compares several changing quantities accurately.", meets: "Uses at least one graph or table to justify a decision.", developing: "Needs support reading the changing quantities." },
      { criterion: "Budget reasoning", exceeds: "Connects expenditures, income, and growth over multiple turns.", meets: "Explains one budget decision with evidence.", developing: "Describes a purchase without enough quantitative support." },
      { criterion: "Ethical reflection", exceeds: "Thoughtfully connects mathematical decisions to broader consequences.", meets: "Names one responsible or irresponsible choice and why.", developing: "Needs prompts to reflect on consequences." }
    ],
    teacherPrep: ["Decide whether to simplify auction rules for time.", "Prepare graph templates that match the quantities you want students to track.", "Choose a shorter region map if you need a tighter lesson window."],
    variants: [
      variant(30, "Modeling lab", [["Data Hook", 6, "Interpret a sample cost table."], ["Scenario Play", 17, "Run a short purchasing and expansion cycle."], ["Debrief", 7, "Explain one modeled choice."]]),
      variant(45, "Core lesson", [["Launch", 8, "Review graphs, tables, and market rules."], ["Round 1", 12, "Students track early choices."], ["Pause", 5, "Compare growth patterns."], ["Round 2", 12, "Students revise budgets."], ["Reflection", 8, "Write and discuss decisions."]]),
      variant(60, "Extended systems seminar", [["Mini-lesson", 10, "Compare linear and non-linear growth."], ["Round 1", 12, "Play and collect data."], ["Data Conference", 10, "Analyze cost graphs in small groups."], ["Round 2", 12, "Apply feedback."], ["Reflection", 10, "Decision memo and rubric."], ["Share-out", 6, "Whole-group synthesis."]])
    ]
  }),
  lesson({
    slug: "codebreaking-discourse-with-decrypto",
    gameSlug: "decrypto",
    title: "Codebreaking Discourse with Decrypto",
    summary: "Students design clues for multiple audiences, interpret patterns, and reflect on how communication choices shape understanding.",
    standards: ["CASEL.RELATIONSHIP_SKILLS", "CASEL.SOCIAL_AWARENESS"],
    gradeBand: "9-12",
    learningObjectives: ["Craft clues that are clear to teammates and less transparent to opponents.", "Infer another team's pattern by attending to language, context, and perspective.", "Reflect on how audience, prior knowledge, and tone affect communication success."],
    materialsNeeded: ["1 Decrypto set per group", "clue planning sheet", "audience analysis chart", "discussion stems"],
    preGameActivity: ["Compare one overly broad clue and one audience-specific clue.", "Review how prior knowledge changes what a teammate can infer.", "Set a norm for critiquing clue quality without criticizing people."],
    facilitationGuide: ["After each round, ask students what made a clue accessible to one audience and confusing to another.", "Highlight moments when teams adjusted after noticing how an opponent interpreted a pattern.", "Encourage students to paraphrase a peer's reasoning before disagreeing."],
    postGameReflection: ["Which clue worked because it fit your audience best?", "How did perspective taking help you anticipate the other team's reasoning?", "What communication habit made your team more effective over time?"],
    assessmentRubric: [
      { criterion: "Audience awareness", exceeds: "Designs clues that intentionally account for multiple audiences and constraints.", meets: "Explains why a clue fit teammates better than opponents.", developing: "Needs support considering the audience when giving clues." },
      { criterion: "Inference", exceeds: "Uses several rounds of evidence to explain an opponent pattern.", meets: "Uses one strong piece of evidence to explain a guess.", developing: "Relies more on hunches than evidence." },
      { criterion: "Team discourse", exceeds: "Builds on peers' ideas and keeps critique constructive.", meets: "Uses respectful discussion moves during clue review.", developing: "Needs reminders to respond constructively." }
    ],
    teacherPrep: ["Select whether to use original word cards or a content-specific set.", "Print one audience analysis chart per team.", "Plan a quick protocol for reviewing clue quality after each round."],
    variants: [
      variant(30, "Discourse clinic", [["Audience Hook", 6, "Analyze two sample clues."], ["Play", 17, "Teams complete a short round sequence."], ["Debrief", 7, "Name one audience-aware clue."]]),
      variant(45, "Core seminar", [["Launch", 8, "Review perspective-taking moves."], ["Round 1", 12, "Teams play and record clues."], ["Pause", 5, "Compare clue quality."], ["Round 2", 12, "Students adjust for audience."], ["Reflection", 8, "Written communication analysis."]]),
      variant(60, "Extended communication lab", [["Mini-lesson", 10, "Connect audience and interpretation."], ["Round 1", 12, "Play and observe."], ["Team Coaching", 10, "Revise clue patterns."], ["Round 2", 12, "Apply revisions."], ["Reflection", 10, "Rubric and discussion."], ["Share-out", 6, "Whole-group synthesis."]])
    ]
  }),
  lesson({
    slug: "estimation-data-with-wits-and-wagers",
    gameSlug: "wits-and-wagers",
    title: "Estimation Data with Wits & Wagers",
    summary: "Use estimates, wagers, and confidence tracking to launch meaningful statistics conversations.",
    standards: ["CCSS.MATH.CONTENT.HSS.ID.B.6", "CASEL.SELF_AWARENESS"],
    gradeBand: "9-12",
    learningObjectives: ["Represent class estimates on a scatter plot or ordered line and describe patterns.", "Compare confidence and accuracy using evidence from several rounds.", "Reflect on how personal confidence can help or distort data-based decisions."],
    materialsNeeded: ["1 Wits & Wagers set", "estimate log", "graph paper", "confidence tracker"],
    preGameActivity: ["Show how the class can graph estimates from low to high.", "Model a confidence rating separate from whether an answer is right.", "Discuss why thoughtful risk taking depends on evidence, not just certainty."],
    facilitationGuide: ["After each question, record both estimates and confidence ratings before students wager.", "Prompt teams to explain why a middle estimate may be more defensible than the boldest one.", "Ask students to notice when confidence and accuracy do or do not align."],
    postGameReflection: ["What did the data display reveal about the spread of class estimates?", "When was your confidence well calibrated and when was it misleading?", "How did evidence improve the way you decided where to wager?"],
    assessmentRubric: [
      { criterion: "Data representation", exceeds: "Creates a clear display and draws supported conclusions from it.", meets: "Represents the class estimates accurately.", developing: "Needs support organizing or reading the display." },
      { criterion: "Statistical reasoning", exceeds: "Uses spread, clustering, and outliers to explain decisions.", meets: "Uses at least one feature of the data to justify a wager.", developing: "References the data only loosely or not at all." },
      { criterion: "Self-awareness", exceeds: "Reflects deeply on confidence patterns and adjusts strategies intentionally.", meets: "Identifies one way confidence affected a decision.", developing: "Needs support connecting reflection to specific choices." }
    ],
    teacherPrep: ["Choose question cards that fit the maturity and interests of the class.", "Prepare a confidence scale visible to all learners.", "Decide whether students graph every round or a sample of rounds."],
    variants: [
      variant(30, "Statistics opener", [["Launch", 6, "Model estimate plus confidence tracking."], ["Play", 17, "Students answer, graph, and wager."], ["Debrief", 7, "Discuss one data pattern."]]),
      variant(45, "Core lesson", [["Hook", 8, "Compare two sample spreads."], ["Round Set 1", 12, "Collect early estimates."], ["Data Pause", 5, "Interpret the graph."], ["Round Set 2", 12, "Apply new reasoning."], ["Reflection", 8, "Write about confidence and evidence."]]),
      variant(60, "Extended statistics block", [["Mini-lesson", 10, "Interpret spread and clustering."], ["Round Set 1", 12, "Play and record."], ["Graph Conference", 10, "Analyze displays in pairs."], ["Round Set 2", 12, "Use refined wagering criteria."], ["Reflection", 10, "Rubric and discussion."], ["Share-out", 6, "Whole-class synthesis."]])
    ]
  }),
  lesson({
    slug: "function-paths-with-ricochet-robots",
    gameSlug: "ricochet-robots",
    title: "Function Paths with Ricochet Robots",
    summary: "Students model multi-step motion, compare pathways, and justify shortest solutions with precise math language.",
    standards: ["CCSS.MATH.CONTENT.HSA.REI.D.11", "CCSS.MATH.CONTENT.HSG.MG.A.3", "CASEL.SELF_MANAGEMENT"],
    gradeBand: "9-12",
    learningObjectives: ["Explain how board constraints create possible and impossible solution paths.", "Compare candidate pathways and justify the most efficient solution with evidence.", "Use self-management routines to persist through challenging puzzles and revise after false starts."],
    materialsNeeded: ["1 Ricochet Robots board", "path sketch sheets", "coordinate labels", "strategy tracker"],
    preGameActivity: ["Model how one robot travels until it hits a wall or another robot.", "Compare two sample solution paths and discuss which uses fewer moves.", "Choose a persistence routine students can use after a failed attempt."],
    facilitationGuide: ["Require students to narrate the full path before testing it on the board.", "Ask what constraint forced each ricochet and how another path differs.", "Normalize productive struggle by spotlighting useful revisions rather than only correct answers."],
    postGameReflection: ["Which constraint mattered most in solving today's puzzle?", "How did comparing paths help you notice a more efficient solution?", "What self-management strategy helped you stay focused after a dead end?"],
    assessmentRubric: [
      { criterion: "Path reasoning", exceeds: "Explains several viable paths and why one is most efficient.", meets: "Justifies a solution path with accurate board evidence.", developing: "Needs support describing how the path works." },
      { criterion: "Precision", exceeds: "Uses exact mathematical language and sequence details throughout.", meets: "Describes the path clearly enough to follow.", developing: "Skips important steps or relies on vague language." },
      { criterion: "Persistence", exceeds: "Uses revision strategies independently and constructively.", meets: "Re-engages after a false start with minimal prompting.", developing: "Needs repeated support after a dead end." }
    ],
    teacherPrep: ["Label rows and columns if you want stronger coordinate talk.", "Select puzzles with multiple possible solution paths.", "Prepare one projected puzzle for the launch."],
    variants: [
      variant(30, "Puzzle sprint", [["Launch", 6, "Review movement rules."], ["Solve", 17, "Students compare fast solutions."], ["Debrief", 7, "Share one efficient path."]]),
      variant(45, "Core lesson", [["Hook", 8, "Compare two sample paths."], ["Puzzle 1", 12, "Students solve and justify."], ["Pause", 5, "Discuss constraints and revisions."], ["Puzzle 2", 12, "Apply new ideas."], ["Reflection", 8, "Write about persistence and precision."]]),
      variant(60, "Extended enrichment block", [["Mini-lesson", 10, "Model efficient path notation."], ["Puzzle 1", 12, "Students solve and record."], ["Strategy Clinic", 10, "Compare proofs in small groups."], ["Puzzle 2", 12, "Test revised strategies."], ["Reflection", 10, "Rubric and self-check."], ["Share-out", 6, "Whole-group synthesis."]])
    ]
  }),
  lesson({
    slug: "data-design-studio-with-railroad-ink",
    gameSlug: "railroad-ink",
    title: "Data Design Studio with Railroad Ink",
    summary: "Use route sketches, counts, and quick data displays to compare network designs across middle and high school math settings.",
    standards: ["CCSS.MATH.CONTENT.8.SP.A.1", "CCSS.MATH.CONTENT.HSS.ID.B.6", "CASEL.RESPONSIBLE_DECISION_MAKING"],
    gradeBand: "6-8 & 9-12",
    learningObjectives: ["Represent route outcomes with counts, tables, or scatter plots appropriate to the grade level.", "Compare how different design choices affect exits, dead ends, and efficiency.", "Make responsible design decisions by balancing immediate gains with future flexibility."],
    materialsNeeded: ["1 Railroad Ink set per group", "route score sheet", "data organizer", "colored pencils"],
    preGameActivity: ["Review how every player receives the same dice results but can design a different network.", "Model one way to record exits connected, middle spaces filled, and dead ends.", "Discuss why strong design decisions consider both current and future consequences."],
    facilitationGuide: ["Pause after the same dice result and ask several groups why they placed it differently.", "Have students compare route data before claiming that one board is strongest.", "Encourage learners to justify revisions when a riskier design creates too many dead ends."],
    postGameReflection: ["Which measurement best captured the strength of your board and why?", "How did the same dice lead to different design choices across teams?", "What responsible decision helped your network stay flexible later in the game?"],
    assessmentRubric: [
      { criterion: "Data use", exceeds: "Chooses and interprets a meaningful representation to compare designs.", meets: "Uses recorded data to justify a network decision.", developing: "Needs support selecting or reading the data representation." },
      { criterion: "Design comparison", exceeds: "Analyzes multiple variables such as exits, dead ends, and coverage together.", meets: "Compares boards using at least one clear metric.", developing: "Compares boards mostly by impression." },
      { criterion: "Decision-making", exceeds: "Thoughtfully explains tradeoffs and revisions over time.", meets: "Names one choice that improved a later turn.", developing: "Needs prompts to connect choices across rounds." }
    ],
    teacherPrep: ["Choose whether middle school students use tables while high school students use scatter plots or multiple variables.", "Prepare one sample board for the launch.", "Decide whether students compare pairs, pods, or a whole-class gallery of boards."],
    variants: [
      variant(30, "Cross-grade studio sprint", [["Launch", 6, "Review shared dice and recording options."], ["Play", 17, "Students design and record outcomes."], ["Debrief", 7, "Compare one key metric across boards."]]),
      variant(45, "Core lesson", [["Hook", 8, "Model one route data organizer."], ["Rounds 1-4", 12, "Students build early networks."], ["Data Pause", 5, "Interpret current results."], ["Rounds 5-7", 12, "Apply revised criteria."], ["Reflection", 8, "Write a design comparison."]]),
      variant(60, "Inquiry extension", [["Mini-lesson", 10, "Compare possible data displays."], ["Rounds 1-4", 12, "Play and record."], ["Gallery Walk", 10, "Analyze peers' designs."], ["Rounds 5-7", 12, "Refine design choices."], ["Reflection", 10, "Rubric plus written defense."], ["Share-out", 6, "Cross-grade comparison discussion."]])
    ]
  })

];
