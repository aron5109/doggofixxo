import type { ReferenceId } from './references';
export const tipGroups = {
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
export const tips = Object.entries(tipGroups).flatMap(([category, texts]) =>
  texts.map((text, index) => ({
    id: `${category.toLowerCase().replaceAll(' ', '-')}-${index}`,
    category,
    text,
    source: sourceFor(category),
  })),
);
