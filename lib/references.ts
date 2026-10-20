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
} as const;
export type ReferenceId = keyof typeof references;
