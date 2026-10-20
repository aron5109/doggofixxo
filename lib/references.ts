export const references = {
  avsab: {
    title: 'AVSAB: Humane Dog Training Position Statement',
    url: 'https://avsab.org/resources/position-statements/',
    note: 'Reward-based methods; avoid aversive training.',
  },
  aspca: {
    title: 'ASPCA: Separation Anxiety',
    url: 'https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/separation-anxiety',
    note: 'Gradual, below-threshold absences and veterinary support.',
  },
  barking: {
    title: 'ASPCA: Barking',
    url: 'https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/barking',
    note: 'Identify the function and triggers of barking.',
  },
  chewing: {
    title: 'ASPCA: Destructive Chewing',
    url: 'https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/destructive-chewing',
    note: 'Safe outlets, management and medical causes.',
  },
  rspca: {
    title: 'RSPCA: Dog training',
    url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training',
    note: 'Kind, consistent training and reward-based learning.',
  },
  cooperative: {
    title: 'Dogs Trust: Grooming your dog',
    url: 'https://www.dogstrust.org.uk/dog-advice/health-wellbeing/grooming',
    note: 'Gradual, positive grooming and handling.',
  },
  zak: {
    title: 'Zak George: further reading',
    url: 'https://www.dogtrainingrevolution.com/',
    note: 'Reward timing, engagement and gradual generalization inform these original Mellowoof adaptations; no trainer endorsement or clinical protocol is implied.',
  },
  stilwell: {
    title: 'Victoria Stilwell / Positively: further reading',
    url: 'https://positively.com/',
    note: 'Positive reinforcement, emotional wellbeing and choice inform these original Mellowoof adaptations; no trainer endorsement or clinical protocol is implied.',
  },
  mcmillan: {
    title: 'Brandon McMillan: further reading',
    url: 'https://www.canineminded.com/',
    note: 'Consistent cues and structured everyday practice inform these original reward-based adaptations; no trainer endorsement or clinical protocol is implied.',
  },
  bat: {
    title: 'Grisha Stewart / BAT: further reading',
    url: 'https://grishastewart.com/bat-overview/',
    note: 'Distance, agency and functional rewards inform these original educational adaptations; they are not a complete BAT protocol or trainer-endorsed treatment.',
  },
  cesar: {
    title: 'Cesar Millan / Cesar’s Way: further reading',
    url: 'https://www.cesarsway.com/',
    note: 'Only predictable routines, meeting needs and calm human behaviour inform these original reward-based adaptations; no dominance corrections, endorsement or clinical protocol is implied.',
  },
} as const;
export type ReferenceId = keyof typeof references;
