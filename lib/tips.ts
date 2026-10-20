import type { ReferenceId } from './references';
const originalTipGroups = {
  'Calming routines': [
    'A predictable routine can help your dog feel more secure.',
    'Protect quiet rest time. A sleeping dog does not need to join every activity.',
    'Offer a comfortable retreat and let your dog choose when to use it.',
    'Keep greetings gentle when your dog is already excited.',
    'Meet toileting, water and comfort needs before asking for calm.',
    'Reward a soft, settled moment with a quiet treat near the paws.',
    'After a busy outing, give your dog time to decompress in a familiar space.',
  ],
  'Apartment living': [
    'A frosted window film can reduce the pressure of a busy street view.',
    'Choose quieter lift and hallway times if close encounters worry your dog.',
    'Move the resting bed away from a noisy shared wall when possible.',
    'Keep rewarding quiet hallway moments before the next unexpected sound.',
    'A new home needs a gradual introduction, with familiar bedding and space.',
    'Plan regular outdoor breaks; enrichment does not replace toileting needs.',
    'Ask visitors to give your dog space instead of reaching over their head.',
  ],
  Barking: [
    'Reward the quiet moments, not just the loud ones.',
    'Notice what happened just before the bark. The trigger can guide your next step.',
    'Some dogs need more distance, not more introductions.',
    'If the doorbell is overwhelming, practise a much quieter recording first.',
    'Shouting can add to the excitement. Create space and use a calm, familiar cue.',
    'Teach a simple alternative, like moving to a mat, before visitors arrive.',
    'For attention barking, check needs first and reward a quiet way to ask for contact.',
  ],
  'Separation worries': [
    'Five comfortable seconds are better than five stressful minutes.',
    'A camera can help you notice subtle worry before barking begins.',
    'Return before distress builds; do not wait for an anxious dog to become quiet.',
    'Picking up your keys need not always mean leaving. Keep practice mild and comfortable.',
    'Arrange company when needed while you build tolerable absences.',
    'Severe or persistent separation distress deserves veterinary behaviour support.',
    'Never leave your dog unattended in a vehicle where heat, cold or other hazards may arise.',
  ],
  Walking: [
    'Sniffing is not wasted time. It is part of how dogs explore their world.',
    'Start loose-leash practice somewhere quiet before trying a busy street.',
    'Reward a voluntary check-in without demanding constant eye contact.',
    'A comfortable harness and a slack leash make gentle practice easier.',
    'If the leash tightens, pause gently and invite a change of direction. Never jerk it.',
    'Sudden stopping may mean pain, heat or worry. Check before asking for more.',
    'Keep a safe distance from dogs or people your pup is not ready to meet.',
  ],
  Enrichment: [
    'Hide a few pieces of your dog’s usual food in an easy, safe search area.',
    'Rotate a few safe toys instead of presenting every toy at once.',
    'Supervise new food puzzles and choose a difficulty your dog can enjoy.',
    'An easy sniffing game can be more useful than a frustrating puzzle.',
    'Include training treats in the daily food allowance and ask your vet about diet needs.',
    'Let your dog choose between two safe activities when possible.',
    'Enrichment works best alongside rest, exercise, company and veterinary care.',
  ],
  Chewing: [
    'Offer a safe chew before the busy time when your dog usually seeks belongings.',
    'Put cables, medicines and small objects behind secure barriers.',
    'Choose chews for your dog’s size and chewing style, and supervise them.',
    'A generous trade is safer than chasing a dog carrying a tempting object.',
    'Cardboard is not safe enrichment for a dog who swallows the pieces.',
    'Suspected swallowing of a non-food object needs prompt veterinary advice.',
    'Sudden chewing changes can be a sign of pain, stress or another medical issue.',
  ],
  Grooming: [
    'Explore the bathroom without running water before expecting a comfortable bath.',
    'A non-slip surface can make a big difference to confidence.',
    'Introduce a towel with one brief touch, a reward and a pause.',
    'Use lukewarm water and dog-appropriate products when a bath is needed.',
    'Let your dog move away from handling and return voluntarily.',
    'Persistent odour, irritated skin or coat changes deserve a vet check.',
    'Bathing needs vary. Follow advice for your dog’s coat and medical needs.',
  ],
  'Building confidence': [
    'Let curiosity lead. Your dog does not need to approach every new object.',
    'Change only one thing at a time: distance, duration or intensity.',
    'End an easy practice while your dog is still comfortable.',
    'A retreat is useful information, not a failed training session.',
    'Offer a familiar activity after a novel experience, then allow rest.',
    'Celebrate a small voluntary choice rather than luring a worried dog closer.',
    'Use qualified reward-based support when fear limits everyday life.',
  ],
  'Understanding body language': [
    'Read the whole dog and the situation; a wagging tail alone does not mean comfort.',
    'Turning away can be a polite request for more space.',
    'Lip licking, yawning and panting can signal stress depending on context.',
    'Freezing is a reason to stop and give space, not to push through.',
    'Refusing a normally loved treat may mean the situation is too difficult.',
    'Do not punish a growl. Create safety and seek help understanding its cause.',
    'Loose muscles, easy movement and voluntary engagement are useful signs of comfort.',
  ],
};
type TipContent = { id: string; text: string; source: ReferenceId };

// These are original educational adaptations, not quotations or trainer protocols.
// Explicit IDs keep saved tips stable when this collection grows or is reordered.
const additionalTipGroups = {
  'Recall & focus': [
    {
      id: 'recall-one-clear-cue',
      text: 'Say your recall cue once in an easy setting, then reward arriving beside you.',
      source: 'zak',
    },
    {
      id: 'recall-release-to-explore',
      text: 'After rewarding an easy recall, sometimes release your dog back to safe sniffing.',
      source: 'zak',
    },
    {
      id: 'recall-practise-nearby',
      text: 'Begin a new recall exercise a few steps away before adding distance.',
      source: 'mcmillan',
    },
    {
      id: 'recall-protect-the-cue',
      text: 'Move to an easier setting if your dog repeatedly misses a recall cue.',
      source: 'zak',
    },
    {
      id: 'recall-generous-arrival-reward',
      text: 'Reward a dog who returns to you, even when the return took longer than you hoped.',
      source: 'stilwell',
    },
    {
      id: 'recall-harness-long-line',
      text: 'Use a suitable harness and a slack long line for recall practice in an open, hazard-free area.',
      source: 'zak',
    },
    {
      id: 'recall-mark-head-turn',
      text: 'Mark a voluntary head turn toward you before asking for a longer check-in.',
      source: 'zak',
    },
    {
      id: 'recall-new-place-easier',
      text: 'In a new place, restart recall practice closer than you would at home.',
      source: 'mcmillan',
    },
    {
      id: 'recall-handler-change',
      text: 'Let another familiar adult practise the same recall cue in a quiet room before trying it outdoors.',
      source: 'mcmillan',
    },
    {
      id: 'recall-before-clip',
      text: 'Practise rewarding a gentle harness touch separately from clipping on the lead and ending an outing.',
      source: 'stilwell',
    },
    {
      id: 'recall-distraction-distance',
      text: 'Increase your distance from a mild distraction before asking for a familiar recall.',
      source: 'zak',
    },
    {
      id: 'recall-name-orientation',
      text: 'Reward looking toward you after hearing their name; teach the movement toward you with a separate recall cue.',
      source: 'mcmillan',
    },
    {
      id: 'recall-floor-reset',
      text: 'Place a reward near your feet after a check-in to make returning to your space worthwhile.',
      source: 'zak',
    },
    {
      id: 'recall-first-minutes-observe',
      text: 'Give your dog time to investigate a quiet new training space before requesting focused work.',
      source: 'stilwell',
    },
    {
      id: 'recall-rehearse-end-position',
      text: 'Reward the same comfortable arrival position so your dog knows where a recall finishes.',
      source: 'mcmillan',
    },
  ],
  'Advanced skills': [
    {
      id: 'advanced-return-before-release',
      text: 'Return to your dog before giving the release cue when first building a stay.',
      source: 'mcmillan',
    },
    {
      id: 'advanced-stay-one-step',
      text: 'Add one handler step to a stay while keeping its duration short and familiar.',
      source: 'mcmillan',
    },
    {
      id: 'advanced-proof-small-movement',
      text: 'Use a small hand movement as a stay distraction before practising around a moving helper.',
      source: 'mcmillan',
    },
    {
      id: 'advanced-mat-cue-distance',
      text: 'Move the mat only a small distance away when teaching your dog to go there on cue.',
      source: 'zak',
    },
    {
      id: 'advanced-reward-chain-links',
      text: 'Reward each link of a new cue sequence before expecting the whole sequence for one reward.',
      source: 'zak',
    },
    {
      id: 'advanced-break-chain-apart',
      text: 'Practise a weak link on its own when a familiar behaviour sequence starts to unravel.',
      source: 'zak',
    },
    {
      id: 'advanced-heel-short-burst',
      text: 'Practise a few voluntary heel steps, then release your dog to a comfortable loose-lead walk.',
      source: 'mcmillan',
    },
    {
      id: 'advanced-deliver-at-position',
      text: 'Deliver a heel reward beside your leg so the reward supports the position you are teaching.',
      source: 'mcmillan',
    },
    {
      id: 'advanced-shape-weight-shift',
      text: 'Reward a small backward weight shift before expecting a complete voluntary step backward.',
      source: 'zak',
    },
    {
      id: 'advanced-mat-quiet-corner',
      text: 'Choose a quiet outdoor corner for the first public mat session and finish after a comfortable short settle.',
      source: 'stilwell',
    },
    {
      id: 'advanced-sit-or-down-comfort',
      text: 'Offer a comfortable standing option if repeated sitting or lying down appears physically difficult.',
      source: 'stilwell',
    },
    {
      id: 'advanced-toy-touch-first',
      text: 'Reward touching a safe retrieve toy before expecting your dog to pick it up.',
      source: 'zak',
    },
    {
      id: 'advanced-doorway-interior-first',
      text: 'Practise a doorway pause at a secure interior doorway before adding the distractions of an outside entrance.',
      source: 'mcmillan',
    },
    {
      id: 'advanced-routine-before-visitor',
      text: 'Rehearse your mat-and-reward routine before inviting a helper to join the practice.',
      source: 'cesar',
    },
    {
      id: 'advanced-practise-before-busy-time',
      text: 'Choose a quiet part of the day for a new skill rather than starting during the household rush.',
      source: 'cesar',
    },
  ],
  'Cooperative care': [
    {
      id: 'care-teach-rest-position',
      text: 'Teach a voluntary chin rest without grooming tools present before using it during care.',
      source: 'stilwell',
    },
    {
      id: 'care-withdrawal-pauses-handling',
      text: 'Pause handling as soon as your dog lifts away from an agreed chin-rest position.',
      source: 'stilwell',
    },
    {
      id: 'care-tool-at-distance',
      text: 'Reward calmly noticing a grooming tool at a comfortable distance before bringing it closer.',
      source: 'stilwell',
    },
    {
      id: 'care-separate-tool-sound',
      text: 'Introduce a grooming tool’s quiet sound separately from touching your dog with it.',
      source: 'stilwell',
    },
    {
      id: 'care-paw-voluntary-lift',
      text: 'Reward a voluntary paw lift before asking to hold the paw briefly.',
      source: 'zak',
    },
    {
      id: 'care-one-brush-stroke',
      text: 'Begin with one gentle brush stroke on a comfortable area, then pause for your dog to opt in again.',
      source: 'stilwell',
    },
    {
      id: 'care-prepare-stable-surface',
      text: 'Set out a stable non-slip mat before starting a handling exercise.',
      source: 'stilwell',
    },
    {
      id: 'care-harness-nose-choice',
      text: 'Hold a harness opening still and reward your dog for voluntarily moving their nose toward it.',
      source: 'zak',
    },
    {
      id: 'care-towel-nearby-first',
      text: 'Let your dog investigate a towel on the floor before practising a brief towel touch.',
      source: 'stilwell',
    },
    {
      id: 'care-station-before-tools',
      text: 'Reward choosing the care mat before reaching for any equipment.',
      source: 'zak',
    },
    {
      id: 'care-note-comfortable-area',
      text: 'Record which body areas your dog comfortably accepts being touched and practise there first.',
      source: 'stilwell',
    },
    {
      id: 'care-break-before-fatigue',
      text: 'Offer a handling break before your dog becomes restless or starts moving away.',
      source: 'stilwell',
    },
    {
      id: 'care-reward-after-touch',
      text: 'Use the sequence brief comfortable touch, marker, then reward when teaching a new handling step.',
      source: 'zak',
    },
    {
      id: 'care-change-one-area',
      text: 'Shorten the touch when introducing a less familiar body area instead of keeping the previous duration.',
      source: 'stilwell',
    },
    {
      id: 'care-plan-necessary-treatment',
      text: 'Ask your vet for a low-stress plan when necessary treatment cannot wait for cooperative-care practice.',
      source: 'stilwell',
    },
  ],
  'Scent games': [
    {
      id: 'scent-watch-first-hide',
      text: 'Let your dog watch the first easy food hide so the search starts with a clear success.',
      source: 'zak',
    },
    {
      id: 'scent-hide-at-floor-level',
      text: 'Place beginner hides at floor level so your dog can search without climbing or jumping.',
      source: 'stilwell',
    },
    {
      id: 'scent-clear-search-area',
      text: 'Remove medicines, cables and swallowable objects before starting a search game.',
      source: 'stilwell',
    },
    {
      id: 'scent-small-search-zone',
      text: 'Use one small search area before expanding to a whole room.',
      source: 'zak',
    },
    {
      id: 'scent-airflow-observation',
      text: 'Notice fans or open windows when a familiar hide suddenly becomes harder to locate.',
      source: 'stilwell',
    },
    {
      id: 'scent-pause-guiding-hands',
      text: 'Keep your hands still during an easy search so your dog can investigate the scent independently.',
      source: 'zak',
    },
    {
      id: 'scent-open-container-first',
      text: 'Start container searches with a wide, open, stable container that cannot trap your dog’s head.',
      source: 'stilwell',
    },
    {
      id: 'scent-no-concentrated-oils',
      text: 'Use familiar food for home scent games rather than applying concentrated essential oils.',
      source: 'stilwell',
    },
    {
      id: 'scent-reward-location',
      text: 'Deliver the search reward beside the discovered hide to make its location meaningful.',
      source: 'zak',
    },
    {
      id: 'scent-search-one-new-variable',
      text: 'Keep the hiding place easy when first moving a scent game to a different room.',
      source: 'zak',
    },
    {
      id: 'scent-remove-empty-containers',
      text: 'Collect search containers after the game so they do not become unsupervised chewing items.',
      source: 'stilwell',
    },
    {
      id: 'scent-count-food-hides',
      text: 'Count the food pieces you hide so you can remove any your dog does not find.',
      source: 'stilwell',
    },
    {
      id: 'scent-help-before-frustration',
      text: 'Reveal part of a hide when searching becomes frustrated instead of making your dog persist.',
      source: 'zak',
    },
    {
      id: 'scent-share-one-at-time',
      text: 'Give household dogs separate search turns if food competition could create tension.',
      source: 'stilwell',
    },
    {
      id: 'scent-safe-toy-alternative',
      text: 'Use a familiar safe toy for a simple visible hide if food searches do not suit your dog’s diet.',
      source: 'zak',
    },
  ],
  'Reactivity & choice': [
    {
      id: 'choice-plan-open-exit',
      text: 'Identify an open retreat route before beginning practice near a known trigger.',
      source: 'bat',
    },
    {
      id: 'choice-start-beyond-staring',
      text: 'Begin farther away if your dog locks into a prolonged stare instead of looking around freely.',
      source: 'bat',
    },
    {
      id: 'choice-reward-turning-away',
      text: 'Support a voluntary turn away from a trigger by moving with your dog into more space.',
      source: 'bat',
    },
    {
      id: 'choice-distance-varies',
      text: 'Reassess comfortable distance on each outing rather than relying on yesterday’s distance.',
      source: 'bat',
    },
    {
      id: 'choice-allow-sniffing-break',
      text: 'Allow a safe sniffing break when your dog chooses to disengage from a distant trigger.',
      source: 'bat',
    },
    {
      id: 'choice-eating-not-only-signal',
      text: 'Check posture and movement alongside treat-taking before deciding an encounter is comfortable.',
      source: 'stilwell',
    },
    {
      id: 'choice-no-food-closer',
      text: 'Deliver rewards where your dog already feels comfortable instead of using food to draw them toward a worry.',
      source: 'bat',
    },
    {
      id: 'choice-helper-stays-distant',
      text: 'Ask a practice helper to remain at the agreed distance rather than walking toward your dog.',
      source: 'bat',
    },
    {
      id: 'choice-curved-path',
      text: 'Choose a wide curved route around a distant dog when a direct approach would reduce comfortable space.',
      source: 'bat',
    },
    {
      id: 'choice-unexpected-encounter-exit',
      text: 'Use your rehearsed turn-away cue to leave an unexpectedly close encounter.',
      source: 'stilwell',
    },
    {
      id: 'choice-stop-repeated-encounters',
      text: 'End trigger practice after a difficult encounter, allow recovery, and choose an easier setup next time.',
      source: 'stilwell',
    },
    {
      id: 'choice-observe-recovery',
      text: 'Wait for comfortable movement and normal exploration to return before deciding whether to continue.',
      source: 'bat',
    },
    {
      id: 'choice-record-context',
      text: 'Note the trigger’s movement and surroundings as well as distance in your practice log.',
      source: 'bat',
    },
    {
      id: 'choice-barrier-for-visitor',
      text: 'Set up a secure barrier and a comfortable retreat before a visitor arrives.',
      source: 'stilwell',
    },
    {
      id: 'choice-professional-bite-plan',
      text: 'Arrange an individualized plan with a qualified reward-based professional before practising with a dog who has bitten.',
      source: 'bat',
    },
  ],
  'Training technique': [
    {
      id: 'technique-marker-first-moment',
      text: 'Mark the exact moment the desired action happens, then deliver the reward.',
      source: 'zak',
    },
    {
      id: 'technique-ready-rewards',
      text: 'Prepare small easy-to-deliver rewards before beginning a new exercise.',
      source: 'zak',
    },
    {
      id: 'technique-agree-household-cue',
      text: 'Agree on one cue and one release word with everyone who practises the skill.',
      source: 'mcmillan',
    },
    {
      id: 'technique-write-small-goal',
      text: 'Write down one observable action for today’s session, such as two relaxed steps beside you.',
      source: 'mcmillan',
    },
    {
      id: 'technique-film-one-repetition',
      text: 'Record a short practice clip to check whether your marker arrives before or after the action.',
      source: 'zak',
    },
    {
      id: 'technique-interleave-easy-reps',
      text: 'Place an easy familiar repetition between attempts at a harder version of a skill.',
      source: 'zak',
    },
    {
      id: 'technique-shrink-repeated-misses',
      text: 'Reduce the next repetition’s difficulty after repeated misses instead of repeating the same request.',
      source: 'stilwell',
    },
    {
      id: 'technique-quiet-human-rehearsal',
      text: 'Rehearse your own cue, movement and reward delivery without the dog before adding a new task.',
      source: 'cesar',
    },
    {
      id: 'technique-needs-before-session',
      text: 'Offer a toileting break and water before beginning a planned training session.',
      source: 'cesar',
    },
    {
      id: 'technique-predictable-start',
      text: 'Use the same simple preparation routine so your dog can recognize when a short practice begins.',
      source: 'cesar',
    },
    {
      id: 'technique-pause-handler-frustration',
      text: 'Pause practice when you feel frustrated and return after both of you have had a break.',
      source: 'cesar',
    },
    {
      id: 'technique-record-reward-preference',
      text: 'Note which safe rewards your dog chooses in each setting instead of assuming food always ranks first.',
      source: 'stilwell',
    },
    {
      id: 'technique-choose-clear-background',
      text: 'Move away from competing activity when introducing a new verbal cue.',
      source: 'mcmillan',
    },
    {
      id: 'technique-fade-visible-food',
      text: 'After a movement is familiar, practise the same small hand signal without visible food and reward from the other hand.',
      source: 'zak',
    },
    {
      id: 'technique-end-after-comfort',
      text: 'Finish after a comfortable easy repetition rather than chasing a perfect final attempt.',
      source: 'stilwell',
    },
  ],
} satisfies Record<string, TipContent[]>;

export const tipGroups: Record<string, string[]> = {
  ...originalTipGroups,
  ...Object.fromEntries(
    Object.entries(additionalTipGroups).map(([category, entries]) => [
      category,
      entries.map((entry) => entry.text),
    ]),
  ),
};

const sourceFor = (category: string): ReferenceId =>
  category === 'Separation worries'
    ? 'aspca'
    : category === 'Barking' || category === 'Apartment living'
      ? 'barking'
      : category === 'Chewing' || category === 'Enrichment'
        ? 'chewing'
        : category === 'Grooming'
          ? 'cooperative'
          : category === 'Walking'
            ? 'rspca'
            : 'avsab';
export const tips = [
  ...Object.entries(originalTipGroups).flatMap(([category, texts]) =>
    texts.map((text, index) => ({
      id: `${category.toLowerCase().replaceAll(' ', '-')}-${index}`,
      category,
      text,
      source: sourceFor(category),
    })),
  ),
  ...Object.entries(additionalTipGroups).flatMap(([category, entries]) =>
    entries.map((entry) => ({ ...entry, category })),
  ),
];
