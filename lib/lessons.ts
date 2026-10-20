import { advancedLessons } from './advanced-lessons';
import {
  type Lesson,
  type LessonCategory,
  lessonDefaults as shared,
  makeStep as step,
} from './lesson-types';
export { lessonLevels, lessonCategories } from './lesson-types';
export type { Lesson, LessonLevel, LessonCategory, Step } from './lesson-types';
export const lessons: Lesson[] = [
  {
    ...shared,
    id: 'calm-at-home',
    title: 'Calm at Home',
    category: 'Barking',
    subtitle: 'Make your home a little haven.',
    objective: 'Notice triggers and build a relaxed settling routine in a new or noisy home.',
    equipment: ['Soft mat', 'Small treats', 'Trigger notebook'],
    preparation:
      'Meet toileting, exercise and rest needs. Choose a quiet time; block a busy window if it helps.',
    safety:
      'Sudden barking or changes in behaviour may need a vet check. Do not punish communication or play loud sounds to force adaptation.',
    sources: ['barking', 'avsab'],
    steps: [
      step(
        'Become a quiet detective',
        60,
        'Watch from a calm spot. Note a sound, movement or unmet need that precedes barking. Reduce that trigger where possible.',
        'Identify one trigger without provoking barking.',
      ),
      step(
        'Catch a calm moment',
        120,
        'When your dog voluntarily rests or notices a mild sound comfortably, quietly mark and deliver a treat on the mat.',
        'Your dog remains loose-bodied for three comfortable observations.',
      ),
      step(
        'Build a little routine',
        120,
        'Offer the mat after a familiar walk or meal. Reward settled moments and end while your dog is comfortable.',
        'Your dog chooses the resting area and relaxes briefly.',
      ),
    ],
  },
  {
    ...shared,
    id: 'doorbell-detective',
    title: 'Doorbell Detective',
    category: 'Barking',
    subtitle: 'A little ding. A calmer thing.',
    objective: 'Build a comfortable association with a very quiet doorbell cue and a resting mat.',
    equipment: ['Doorbell recording', 'Treats', 'Mat'],
    preparation:
      'Put the mat away from the door. Start with a recording so quiet your dog notices without startling.',
    safety:
      'Never surprise your dog with full-volume ringing. Manage actual visitors separately while practising.',
    sources: ['barking', 'avsab'],
    steps: [
      step(
        'Prepare the environment',
        60,
        'Practise going to the mat with treats before adding sound. Keep the door closed and visitors away.',
        'Your dog voluntarily goes to the mat.',
      ),
      step(
        'Introduce the sound',
        120,
        'Play one very quiet ding, then immediately offer a treat. Leave long pauses. Stop if your dog is worried.',
        'Three quiet sounds are followed by relaxed treat-taking.',
      ),
      step(
        'Reward relaxed behaviour',
        120,
        'Play the same comfortable sound and reward moving to the mat. Stay at this volume until it feels easy.',
        'Your dog moves toward the mat and remains comfortable.',
      ),
    ],
  },
  {
    ...shared,
    id: 'strangers-are-okay',
    title: 'Strangers Are Okay',
    category: 'Barking',
    subtitle: 'More space. Less pressure.',
    objective: 'Help your dog observe unfamiliar people without pressure to interact.',
    equipment: ['Comfortable harness', 'Leash', 'High-value treats'],
    preparation:
      'Choose a quiet open space with an easy exit. Start well beyond the distance where barking begins.',
    safety:
      'Never force greetings. For growling, lunging or a bite history, seek a qualified reward-based behaviour professional. Avoid crowded paths.',
    sources: ['avsab', 'barking'],
    steps: [
      step(
        'Find your comfort zone',
        60,
        'Let your dog observe one distant person. Increase distance if your dog stiffens or cannot disengage.',
        'Your dog can look and turn away voluntarily.',
      ),
      step(
        'Good things at a distance',
        120,
        'When a person appears at the comfortable distance, offer a treat. When they pass, let your dog sniff or rest.',
        'Your dog takes treats gently with a loose body.',
      ),
      step(
        'Choose a calm exit',
        60,
        'Cue a cheerful turn away and reward following. End with a quiet sniffing break, not a closer greeting.',
        'Your dog can move away without pulling toward the person.',
      ),
    ],
  },
  {
    ...shared,
    id: 'tiny-goodbyes',
    title: 'Tiny Goodbyes',
    category: 'Separation worries',
    subtitle: 'Confidence, one tiny goodbye at a time.',
    objective:
      'Find an absence shorter than your dog’s worry threshold; the timer is a ceiling, never a target.',
    equipment: ['Camera if available', 'Safe resting space', 'Support person if needed'],
    preparation:
      'Choose a calm moment after needs are met. Start with a movement toward the door or a fraction of a second out of sight.',
    safety:
      'Return before distress. Never use “cry it out.” Arrange company to avoid overwhelming absences. Persistent or severe distress needs veterinary behaviour support. Never leave a dog unattended in a vehicle where temperature or other hazards may arise.',
    sources: ['aspca', 'avsab'],
    steps: [
      step(
        'Notice comfortable distance',
        60,
        'Move a small distance while remaining visible, then return. The practice itself may last only one second.',
        'Your dog stays relaxed as you move a small distance.',
      ),
      step(
        'Try a tiny absence',
        60,
        'Only if relaxed, step briefly out of sight and return immediately. Watch the camera. Skip this if even a small movement worries your dog.',
        'Your dog remains comfortable during a tolerable moment out of sight.',
      ),
      step(
        'Rest and note the threshold',
        60,
        'Stay together and note the comfortable duration. Do not keep increasing today. Stop immediately after any distress.',
        'You identified a comfortable starting point without escalating worry.',
      ),
    ],
  },
  {
    ...shared,
    id: 'everyday-departures',
    title: 'Everyday Departures',
    category: 'Separation worries',
    subtitle: 'Keys can just be keys.',
    objective: 'Make individual departure cues less predictive of a stressful absence.',
    equipment: ['Keys or jacket', 'Notebook'],
    preparation:
      'Choose one mild cue your dog can tolerate. Do not rehearse the entire departure sequence.',
    safety:
      'This complements gradual absence training; it is not a cure on its own. Stop if cues increase distress and consult your vet for persistent anxiety.',
    sources: ['aspca'],
    steps: [
      step(
        'Choose one tiny cue',
        60,
        'Touch your keys without picking them up, or move near your shoes. Stay with your dog.',
        'Your dog notices the cue without tensing or following anxiously.',
      ),
      step(
        'Make it ordinary',
        90,
        'Perform the same mild cue, then sit down and read. No actual departure follows. Allow a long pause.',
        'Your dog returns to a comfortable activity.',
      ),
      step(
        'Finish with normal life',
        60,
        'Put the item away and continue a calm familiar routine. Record which cue intensity felt comfortable.',
        'Your dog remains settled after the cue.',
      ),
    ],
  },
  {
    ...shared,
    id: 'my-cozy-spot',
    title: 'My Cozy Spot',
    category: 'Separation worries',
    subtitle: 'A safe place, chosen by your pup.',
    objective: 'Build voluntary relaxation while you remain present.',
    equipment: ['Comfortable bed', 'Treats', 'Water nearby'],
    preparation:
      'Offer an open resting area where your dog already feels safe, with the freedom to leave.',
    safety:
      'A crate is not appropriate for every anxious dog. Do not shut your dog in or use confinement as punishment. A bed does not replace separation treatment.',
    sources: ['aspca', 'avsab'],
    steps: [
      step(
        'Let comfort lead',
        60,
        'Scatter a few treats near the bed. Reward approaching or stepping onto it voluntarily.',
        'Your dog freely chooses to approach the bed.',
      ),
      step(
        'Reward a soft settle',
        120,
        'Stay nearby. Quietly place treats between relaxed paws, avoiding excitement or repeated commands.',
        'Your dog rests with a soft body while you stay nearby.',
      ),
      step(
        'One small movement',
        60,
        'Shift in your seat or stand briefly, then settle again. If your dog follows, make the next movement smaller.',
        'Your dog stays comfortable with one small movement.',
      ),
    ],
  },
  {
    ...shared,
    id: 'chew-this-instead',
    title: 'Chew This Instead',
    category: 'Chewing',
    subtitle: 'A better outlet for busy jaws.',
    objective: 'Make safe, permitted chewing easy and rewarding.',
    equipment: ['Size-appropriate chew', 'Treats', 'Storage for belongings'],
    preparation:
      'Put collars, cables and belongings out of reach. Choose a chew appropriate for your dog’s teeth and chewing style.',
    safety:
      'Supervise chews. Avoid objects that can splinter, break teeth or be swallowed. Ingesting non-food objects can obstruct the bowel; contact a vet promptly. Sudden chewing changes need assessment.',
    sources: ['chewing'],
    steps: [
      step(
        'Set up a safe choice',
        60,
        'Remove hazards and offer one appropriate chew in a comfortable area. Let your dog choose whether to engage.',
        'Your dog can access a safe chew without competing hazards.',
      ),
      step(
        'Reward the good choice',
        120,
        'Quietly praise or add a small treat when your dog chooses the permitted chew. Give space.',
        'Your dog chooses the appropriate item voluntarily.',
      ),
      step(
        'Keep it easy to repeat',
        60,
        'Plan a supervised chew opportunity at a time your dog often seeks objects. Rotate safe options.',
        'You have a practical management plan for the next tempting moment.',
      ),
    ],
  },
  {
    ...shared,
    id: 'trade-it',
    title: 'Trade It!',
    category: 'Chewing',
    subtitle: 'Good trades build trust.',
    objective: 'Practise releasing a low-value safe toy in exchange for something better.',
    equipment: ['Low-value toy', 'High-value treats'],
    preparation:
      'Start with a toy your dog does not guard. Keep children away during object exercises.',
    safety:
      'Do not chase, pry jaws or forcibly remove objects. If your dog freezes, growls or guards, stop and get qualified support. Suspected ingestion of a dangerous object needs immediate veterinary advice.',
    sources: ['chewing', 'avsab'],
    steps: [
      step(
        'Offer an easy toy',
        60,
        'Allow your dog to pick up a low-value toy. Keep your hands away from their mouth.',
        'Your dog holds the toy with a relaxed body.',
      ),
      step(
        'Make a generous trade',
        90,
        'Offer a tasty treat nearby. As your dog releases, calmly mark and give the treat. Do not reach before the release.',
        'Your dog releases voluntarily without tension.',
      ),
      step(
        'Give the toy back',
        60,
        'When safe, return the toy so releasing does not always mean losing. Repeat only while comfortable.',
        'Your dog willingly repeats a relaxed exchange.',
      ),
    ],
  },
  {
    ...shared,
    id: 'puppy-proof-paradise',
    title: 'Puppy-Proof Paradise',
    category: 'Chewing',
    subtitle: 'Small changes. Safer adventures.',
    objective: 'Reduce access to hazards and plan suitable enrichment for chewing needs.',
    equipment: ['Storage baskets', 'Safe enrichment toy', 'Pet gate if comfortable'],
    preparation:
      'Walk through your dog’s space and identify cables, medicines, cardboard pieces and other tempting hazards.',
    safety:
      'Swallowing cardboard or other objects can cause obstruction. Vomiting, abdominal pain, lethargy or suspected ingestion needs urgent veterinary advice. Consider teething, pain, boredom and anxiety.',
    sources: ['chewing'],
    steps: [
      step(
        'See the room at dog level',
        90,
        'Secure three hazards. Use closed storage and safe barriers your dog already accepts.',
        'Your practice area is free of the identified hazards.',
      ),
      step(
        'Offer a legal adventure',
        120,
        'Provide a supervised food-search or appropriate chew. Avoid shredding games for dogs who swallow material.',
        'Your dog explores a safe activity comfortably.',
      ),
      step(
        'Plan the busy moment',
        60,
        'Choose a safe enrichment option before your next busy period. Include rest, exercise and company as needed.',
        'You have a realistic daily prevention routine.',
      ),
    ],
  },
  {
    ...shared,
    id: 'loose-leash-magic',
    title: 'Loose Leash Magic',
    category: 'Walking',
    subtitle: 'A softer lead, a happier stroll.',
    objective: 'Reward walking on a slack leash in an easy environment.',
    equipment: ['Comfortable harness', 'Fixed-length leash', 'Treats'],
    preparation: 'Begin indoors or in a quiet space after a toileting break. Keep the lead loose.',
    safety:
      'Never jerk the leash or use painful equipment. Avoid busy roads. Sudden reluctance or unusual stopping can indicate pain, heat or fatigue.',
    sources: ['rspca', 'avsab'],
    steps: [
      step(
        'Reward a soft start',
        60,
        'Stand still and reward a slack lead beside you. Your dog does not need to sit or stare.',
        'The leash hangs loose for three comfortable moments.',
      ),
      step(
        'Take a few little steps',
        120,
        'Walk two or three steps and reward while the leash is slack. Pause gently if tension appears; invite a comfortable turn.',
        'Your dog walks three steps on a loose lead.',
      ),
      step(
        'Let sniffing be a reward',
        90,
        'After a short easy stretch, invite a sniff break. Keep the lead relaxed during the transition.',
        'Your dog moves between walking and sniffing without leash pressure.',
      ),
    ],
  },
  {
    ...shared,
    id: 'walk-with-me',
    title: 'Walk With Me',
    category: 'Walking',
    subtitle: 'Together feels good.',
    objective:
      'Reward voluntary attention and comfortable proximity, without demanding a rigid heel.',
    equipment: ['Harness and leash', 'Treats'],
    preparation: 'Use a quiet familiar route with room to move away from distractions.',
    safety:
      'Do not pull your dog into position or withhold all exploration. Sudden changes in gait or energy need a vet check.',
    sources: ['rspca', 'avsab'],
    steps: [
      step(
        'Notice a check-in',
        60,
        'Wait for a voluntary glance or movement toward you. Mark it and reward beside your leg.',
        'Your dog offers one comfortable voluntary check-in.',
      ),
      step(
        'Walk a tiny stretch',
        120,
        'Take a few relaxed steps. Reward proximity, then release to explore. Keep the interval short.',
        'Your dog chooses to stay near for a few steps.',
      ),
      step(
        'One gentle distraction',
        60,
        'Practise with a mild distant distraction only if the earlier steps are easy. Increase space as needed.',
        'Your dog can reconnect without being pulled or repeatedly called.',
      ),
    ],
  },
  {
    ...shared,
    id: 'sniff-and-stroll',
    title: 'Sniff & Stroll',
    category: 'Walking',
    subtitle: 'There’s a whole world to sniff.',
    objective:
      'Balance predictable short walking intervals with meaningful sniffing opportunities.',
    equipment: ['Harness', 'Leash', 'Treats'],
    preparation: 'Choose a safe green area away from traffic, discarded food and hazardous plants.',
    safety:
      'Do not drag a dog away from sniffing. Investigate excessive stopping for pain, fear, fatigue or heat rather than treating it as stubbornness.',
    sources: ['rspca', 'avsab'],
    steps: [
      step(
        'Invite a sniff',
        90,
        'Say “go sniff” and follow at a safe, loose-leash distance. Let your dog choose a comfortable spot.',
        'Your dog explores with a soft body and slack lead.',
      ),
      step(
        'Ask for a short stroll',
        60,
        'Say “let’s walk” once, invite a few steps and reward joining you. Give more time if your dog is not ready.',
        'Your dog voluntarily transitions into a few walking steps.',
      ),
      step(
        'Return to exploration',
        90,
        'Release back to sniffing after the short stretch. Keep both activities predictable and enjoyable.',
        'Your dog can switch comfortably between the two activities.',
      ),
    ],
  },
  {
    ...shared,
    id: 'happy-bathroom',
    title: 'Happy Bathroom',
    category: 'Bathing',
    subtitle: 'A friendly room before a bath.',
    objective: 'Build voluntary comfort around a dry bathing area.',
    equipment: ['Non-slip mat', 'Treats', 'Dry towel'],
    preparation:
      'Keep water off and the exit available. Start outside the room if entering is worrying.',
    safety:
      'Never force or lift a worried dog into the bath. Check persistent odour, irritated skin or unusual coat changes with a vet. Bath frequency depends on individual coat and medical needs.',
    sources: ['cooperative', 'avsab'],
    steps: [
      step(
        'Meet the doorway',
        60,
        'Reward looking toward or approaching the room. Let your dog retreat whenever they choose.',
        'Your dog approaches the doorway voluntarily.',
      ),
      step(
        'Explore the dry space',
        90,
        'With a non-slip surface in place, offer treats in an easily accessible dry area. No bath is required.',
        'Your dog explores the dry area with a relaxed body.',
      ),
      step(
        'Leave on a good note',
        60,
        'Invite your dog back out and reward. Finish before they worry, without adding water today.',
        'Your dog can enter and leave without pressure.',
      ),
    ],
  },
  {
    ...shared,
    id: 'splash-confidence',
    title: 'Splash Confidence',
    category: 'Bathing',
    subtitle: 'Water, at your pup’s pace.',
    objective: 'Introduce one mild water cue while preserving choice and comfort.',
    equipment: ['Non-slip mat', 'Lukewarm water', 'Treats'],
    preparation:
      'Begin only after the dry area is comfortable. Start far from a quiet trickle, or use a damp cloth instead.',
    safety:
      'Check water temperature by hand. Avoid eyes, ears and nose. Never restrain your dog through panic. Do not increase water exposure because a timer is running.',
    sources: ['cooperative', 'avsab'],
    steps: [
      step(
        'Listen from a distance',
        60,
        'Briefly run a quiet trickle far away and offer a treat. Turn it off before your dog becomes uneasy.',
        'Your dog hears the water comfortably at a safe distance.',
      ),
      step(
        'Choose a tiny touch',
        60,
        'If comfortable, let your dog inspect a damp cloth. Briefly touch a non-sensitive area only with willing participation.',
        'Your dog stays loose and can move away during a tiny damp touch.',
      ),
      step(
        'Dry and relax',
        60,
        'Offer a dry towel and rest. Next time, repeat the same easy amount rather than jumping to a full bath.',
        'Your dog remains comfortable after the tiny water exposure.',
      ),
    ],
  },
  {
    ...shared,
    id: 'fresh-and-fluffy',
    title: 'Fresh & Fluffy',
    category: 'Bathing',
    subtitle: 'Gentle care, with a little choice.',
    objective: 'Practise comfortable handling and towel contact before full grooming.',
    equipment: ['Soft towel', 'Treats', 'Dog-appropriate products when needed'],
    preparation:
      'Start in a quiet familiar space. Let your dog inspect the towel and choose whether to stay.',
    safety:
      'Avoid hot dryers, forced restraint and products intended for people. Persistent odour, skin irritation or coat changes need a vet. Do not bathe more often than your dog needs.',
    sources: ['cooperative', 'avsab'],
    steps: [
      step(
        'A willing hello',
        60,
        'Present the towel and reward a voluntary approach. Pause if your dog turns away.',
        'Your dog chooses to approach the towel.',
      ),
      step(
        'A gentle touch',
        90,
        'Touch a comfortable shoulder area for a second, reward, then remove your hands. Wait for your dog to re-engage.',
        'Your dog voluntarily re-engages after brief gentle handling.',
      ),
      step(
        'A soft towel moment',
        60,
        'Briefly pat one comfortable area with the towel. Stop often and allow your dog to opt out.',
        'Your dog remains relaxed during a brief towel pat.',
      ),
    ],
  },
  ...advancedLessons,
];
export const lessonById = (id: string) => lessons.find((lesson) => lesson.id === id);
export const durationMinutes = (lesson: Lesson) =>
  Math.ceil(lesson.steps.reduce((sum, s) => sum + s.seconds, 0) / 60);
export const categoryMeta: Record<
  LessonCategory,
  { emoji: string; color: string; description: string }
> = {
  Barking: {
    emoji: '🔔',
    color: 'peach',
    description: 'A little less noise, a little more calm.',
  },
  'Separation worries': {
    emoji: '🏡',
    color: 'sage',
    description: 'Build comfort, one tiny goodbye at a time.',
  },
  Chewing: {
    emoji: '🦴',
    color: 'butter',
    description: 'Good choices for those busy little jaws.',
  },
  Walking: { emoji: '🌿', color: 'sage', description: 'Find your rhythm, side by side.' },
  Bathing: { emoji: '🫧', color: 'lavender', description: 'Gentle care, at your pup’s pace.' },
  'Recall & focus': {
    emoji: '🎯',
    color: 'peach',
    description: 'Build attention, returning and reliable releases in comfortable stages.',
  },
  'Everyday skills': {
    emoji: '✨',
    color: 'sage',
    description: 'Take familiar skills into thoughtful everyday routines.',
  },
  'Scent & enrichment': {
    emoji: '🔎',
    color: 'butter',
    description: 'Let the nose lead through safe, rewarding searches.',
  },
  'Cooperative care': {
    emoji: '🤝',
    color: 'lavender',
    description: 'Build useful care skills with voluntary participation and clear pauses.',
  },
};
