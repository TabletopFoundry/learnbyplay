import type { GradeBand, Subject } from "@/lib/constants";

export type SeedClassroom = {
  id: number;
  name: string;
  subject: Subject | "Advisory";
  gradeBand: GradeBand;
  studentCount: number;
  createdAt: string;
};

export type SeedSession = {
  id: number;
  classroomId: number;
  gameSlug: string;
  lessonSlug: string;
  sessionDate: string;
  notes: string;
};

export type SeedFavorite = {
  teacherName: string;
  lessonSlug: string;
  createdAt: string;
};

export const classroomsSeed: SeedClassroom[] = [
  { id: 101, name: "Room 14 Math Workshop", subject: "Math", gradeBand: "3-5", studentCount: 24, createdAt: "2025-08-19" },
  { id: 102, name: "Advisory Cohort Blue", subject: "SEL", gradeBand: "6-8", studentCount: 28, createdAt: "2025-08-20" },
  { id: 103, name: "Kindergarten Number Nest", subject: "Math", gradeBand: "K-2", studentCount: 18, createdAt: "2025-08-18" },
  { id: 104, name: "First Grade Choice Lab", subject: "SEL", gradeBand: "K-2", studentCount: 20, createdAt: "2025-08-21" },
  { id: 105, name: "Grade 5 Math Studio", subject: "Math", gradeBand: "3-5", studentCount: 26, createdAt: "2025-08-22" },
  { id: 106, name: "Algebra I Design Lab", subject: "Math", gradeBand: "9-12", studentCount: 31, createdAt: "2025-08-25" },
  { id: 107, name: "Freshman Seminar Green", subject: "SEL", gradeBand: "9-12", studentCount: 22, createdAt: "2025-08-26" },
  { id: 108, name: "Geometry Flex Block", subject: "Math", gradeBand: "9-12", studentCount: 16, createdAt: "2025-08-27" },
];

export const sessionsSeed: SeedSession[] = [
  { id: 1001, classroomId: 101, gameSlug: "prime-climb", lessonSlug: "fraction-races-with-prime-climb", sessionDate: "2025-09-03", notes: "Students used benchmark fractions to justify efficient jumps and tracked when they revised a move." },
  { id: 1002, classroomId: 101, gameSlug: "qwirkle", lessonSlug: "pattern-evidence-with-qwirkle", sessionDate: "2025-09-05", notes: "Pattern talk stems increased participation from quieter learners during move challenges." },
  { id: 1003, classroomId: 101, gameSlug: "sushi-go", lessonSlug: "data-talks-with-sushi-go", sessionDate: "2025-09-09", notes: "Groups graphed round totals and compared whether early puddings were worth the delayed payoff." },
  { id: 1004, classroomId: 101, gameSlug: "kingdomino", lessonSlug: "area-strategy-with-kingdomino", sessionDate: "2025-09-12", notes: "Most teams shifted from crown chasing to area planning after the mid-game estimation pause." },
  { id: 1005, classroomId: 101, gameSlug: "blokus", lessonSlug: "geometry-defenses-with-blokus", sessionDate: "2025-09-16", notes: "Students began naming rotations and reflections more precisely after using the polyomino reference page." },
  { id: 1006, classroomId: 101, gameSlug: "qwirkle", lessonSlug: "pattern-evidence-with-qwirkle", sessionDate: "2025-09-23", notes: "A second cycle showed stronger self-correction when a placement broke an attribute rule." },
  { id: 1007, classroomId: 102, gameSlug: "the-crew", lessonSlug: "cooperative-communication-with-the-crew", sessionDate: "2025-09-04", notes: "Teams recovered from failed missions faster once they started debriefing the single most useful clue." },
  { id: 1008, classroomId: 102, gameSlug: "codenames", lessonSlug: "academic-vocabulary-with-codenames", sessionDate: "2025-09-08", notes: "Students used science vocabulary more precisely when clue-givers planned categories before the round." },
  { id: 1009, classroomId: 102, gameSlug: "timeline", lessonSlug: "chronology-conversations-with-timeline", sessionDate: "2025-09-11", notes: "Event debates stayed evidence-based after the class agreed to challenge ideas instead of volume." },
  { id: 1010, classroomId: 102, gameSlug: "photosynthesis", lessonSlug: "ecosystem-modeling-with-photosynthesis", sessionDate: "2025-09-15", notes: "Learners connected shadows and resource scarcity to ecosystem vocabulary with minimal prompting." },
  { id: 1011, classroomId: 102, gameSlug: "azul", lessonSlug: "mosaic-strategy-with-azul", sessionDate: "2025-09-18", notes: "The decision matrix reduced rushed drafting and helped students explain floor-row penalties." },
  { id: 1012, classroomId: 102, gameSlug: "ticket-to-ride", lessonSlug: "route-ratios-with-ticket-to-ride", sessionDate: "2025-09-22", notes: "Partners cited route cost, destination value, and blocking risk in a stronger balance than the first cycle." },
  { id: 1013, classroomId: 102, gameSlug: "catan", lessonSlug: "negotiation-math-with-catan", sessionDate: "2025-09-26", notes: "Trade logs revealed which students could explain both fairness and long-term probability in the same turn." },
  { id: 1014, classroomId: 103, gameSlug: "tiny-polka-dot", lessonSlug: "place-value-patterns-with-tiny-polka-dot", sessionDate: "2025-09-02", notes: "Students moved from counting by ones to naming groups of ten when matching cards on the ten-frame mats." },
  { id: 1015, classroomId: 103, gameSlug: "zingo-123", lessonSlug: "number-sense-stories-with-zingo-123", sessionDate: "2025-09-05", notes: "Learners told short addition stories aloud before claiming spaces, which raised confidence during partner play." },
  { id: 1016, classroomId: 103, gameSlug: "outfoxed", lessonSlug: "evidence-trails-with-outfoxed", sessionDate: "2025-09-10", notes: "Teams used clue charts to explain which suspects were eliminated and why that evidence mattered." },
  { id: 1017, classroomId: 103, gameSlug: "tiny-polka-dot", lessonSlug: "place-value-patterns-with-tiny-polka-dot", sessionDate: "2025-09-17", notes: "A second lesson emphasized subitizing and skipping count-by-one habits during card comparisons." },
  { id: 1018, classroomId: 103, gameSlug: "zingo-123", lessonSlug: "number-sense-stories-with-zingo-123", sessionDate: "2025-09-24", notes: "Students showed stronger turn-taking and clearer partner coaching during the mixed-number rounds." },
  { id: 1019, classroomId: 103, gameSlug: "outfoxed", lessonSlug: "evidence-trails-with-outfoxed", sessionDate: "2025-09-26", notes: "Children began saying which clues they still needed instead of guessing randomly near the end of the mystery." },
  { id: 1020, classroomId: 105, gameSlug: "prime-climb", lessonSlug: "fraction-races-with-prime-climb", sessionDate: "2025-09-03", notes: "Grade 5 students compared multiple equivalent paths to the same target and debated which was most efficient." },
  { id: 1021, classroomId: 105, gameSlug: "kingdomino", lessonSlug: "area-strategy-with-kingdomino", sessionDate: "2025-09-10", notes: "Students connected arrays and region scoring more fluently after sketching a sample kingdom before play." },
  { id: 1022, classroomId: 105, gameSlug: "blokus", lessonSlug: "geometry-defenses-with-blokus", sessionDate: "2025-09-17", notes: "Reflection slips showed students could name a productive struggle routine they used after getting blocked." },
  { id: 1023, classroomId: 105, gameSlug: "qwirkle", lessonSlug: "pattern-evidence-with-qwirkle", sessionDate: "2025-09-24", notes: "Teams used precise color and shape language with less adult prompting than during the September launch." },
  { id: 1024, classroomId: 105, gameSlug: "sushi-go", lessonSlug: "data-talks-with-sushi-go", sessionDate: "2025-10-01", notes: "Students predicted which set collection strategy would produce the largest bar graph swing before the final round." },
  { id: 1025, classroomId: 105, gameSlug: "prime-climb", lessonSlug: "fraction-races-with-prime-climb", sessionDate: "2025-10-08", notes: "Learners independently compared which operations produced larger jumps without reverting to trial and error." },
  { id: 1026, classroomId: 106, gameSlug: "power-grid", lessonSlug: "systems-budgeting-with-power-grid", sessionDate: "2025-09-09", notes: "Students built cost tables before buying plants and then used them to explain why a cheaper option scaled better." },
  { id: 1027, classroomId: 106, gameSlug: "wits-and-wagers", lessonSlug: "estimation-data-with-wits-and-wagers", sessionDate: "2025-09-16", notes: "Scatter plots of confidence versus accuracy created a strong debrief about risk and evidence." },
  { id: 1028, classroomId: 106, gameSlug: "7-wonders", lessonSlug: "design-thinking-with-7-wonders", sessionDate: "2025-09-23", notes: "Table groups used resource-flow planners to explain when a civic build was stronger than a military push." },
  { id: 1029, classroomId: 106, gameSlug: "ricochet-robots", lessonSlug: "function-paths-with-ricochet-robots", sessionDate: "2025-09-30", notes: "Students justified multi-step paths with coordinate language and revised quickly after peer feedback." },
  { id: 1030, classroomId: 107, gameSlug: "decrypto", lessonSlug: "codebreaking-discourse-with-decrypto", sessionDate: "2025-09-11", notes: "Teams improved clue quality when they paused to check whether every teammate could explain the category link." },
  { id: 1031, classroomId: 107, gameSlug: "7-wonders", lessonSlug: "design-thinking-with-7-wonders", sessionDate: "2025-09-25", notes: "Freshman seminar teams reflected on how long-term planning changed once neighbors' resource patterns became visible." },
  { id: 1032, classroomId: 107, gameSlug: "railroad-ink", lessonSlug: "data-design-studio-with-railroad-ink", sessionDate: "2025-10-02", notes: "Students compared route efficiency with both visual evidence and quick graph summaries of exit connections." },
];

export const favoritesSeed: SeedFavorite[] = [
  { teacherName: "Lead Teacher", lessonSlug: "fraction-races-with-prime-climb", createdAt: "2025-09-04" },
  { teacherName: "Lead Teacher", lessonSlug: "data-talks-with-sushi-go", createdAt: "2025-09-10" },
  { teacherName: "Ms. Patel", lessonSlug: "place-value-patterns-with-tiny-polka-dot", createdAt: "2025-09-06" },
  { teacherName: "Ms. Patel", lessonSlug: "pattern-evidence-with-qwirkle", createdAt: "2025-09-07" },
  { teacherName: "Mr. Rivera", lessonSlug: "systems-budgeting-with-power-grid", createdAt: "2025-09-12" },
  { teacherName: "Mr. Rivera", lessonSlug: "design-thinking-with-7-wonders", createdAt: "2025-09-13" },
  { teacherName: "Coach Nguyen", lessonSlug: "academic-vocabulary-with-codenames", createdAt: "2025-09-14" },
  { teacherName: "Coach Nguyen", lessonSlug: "function-paths-with-ricochet-robots", createdAt: "2025-09-19" },
  { teacherName: "Dr. Brooks", lessonSlug: "route-ratios-with-ticket-to-ride", createdAt: "2025-09-20" },
  { teacherName: "Ms. Alvarez", lessonSlug: "evidence-trails-with-outfoxed", createdAt: "2025-09-21" },
  { teacherName: "Ms. Alvarez", lessonSlug: "data-talks-with-sushi-go", createdAt: "2025-09-22" },
];
