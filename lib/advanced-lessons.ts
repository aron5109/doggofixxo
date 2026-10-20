import { type Lesson, lessonDefaults as shared, makeStep as step } from './lesson-types';

export const advancedLessons: Lesson[] = [
  {
    ...shared,
    id: 'recall-reward-release',
    title: 'Recall, Reward, Release',
    category: 'Recall & focus',
    level: 'Intermediate',
    prerequisites: ['walk-with-me'],
    readiness:
      'Your dog willingly checks in with you and follows a few steps in a quiet enclosed space. They can take a reward and return to exploring comfortably.',
    subtitle: 'Coming back can keep the fun going.',
    objective:
      'Build a clear recall cue that brings your dog close enough for a gentle harness touch, followed by a rewarding release.',
    equipment: ['Small high-value rewards', 'Secure enclosed area', 'Comfortable harness'],
    preparation:
      'Choose a quiet enclosed room or garden. Pick one recall word and a separate release word. Begin only a step away from an attentive dog.',
    safety:
      'Keep doors and gates secure. This exercise does not establish off-lead reliability. Never call your dog for punishment or pull them toward you by their collar.',
    easier:
      'Return to one step of distance with no distractions. Reward any willing movement toward you, then rebuild the full approach.',
    harder:
      'On a later day, add one step of distance or a very mild distraction, keeping the other parts easy. Continue to release back to safe enjoyable activities.',
    sources: ['zak', 'stilwell', 'avsab'],
    steps: [
      step(
        'Make the word rewarding',
        90,
        'When your dog is already looking your way, say the recall word once and move one step away. Mark the approach and reward beside your knees. Reset with a short sniff break.',
        'Your dog approaches willingly on three easy opportunities without repeated cues.',
      ),
      step(
        'Arrive within gentle reach',
        120,
        'Cue from the same easy distance. As your dog arrives, reward and briefly touch the side of their harness only if comfortable. Feed another reward, then remove your hand.',
        'Your dog comes within reach and stays relaxed through a brief harness touch.',
      ),
      step(
        'Release back to the fun',
        90,
        'After an easy return and reward, say your release word and let your dog resume safe exploration. Mix a few recalls with plenty of time when you simply leave them to sniff.',
        'Your dog returns, accepts the reward and comfortably resumes exploring on release.',
      ),
    ],
  },
  {
    ...shared,
    id: 'recall-around-distractions',
    title: 'Recall Around Distractions',
    category: 'Recall & focus',
    level: 'Advanced',
    prerequisites: ['recall-reward-release'],
    readiness:
      'Your dog returns promptly from several easy distances on separate days, accepts a gentle harness touch, and can disengage from a mild distraction without tension.',
    subtitle: 'A familiar cue in a slightly busier world.',
    objective:
      'Generalize a reliable easy recall around one carefully controlled, low-intensity distraction.',
    equipment: ['Harness', 'Long line', 'High-value rewards', 'Quiet secure practice area'],
    preparation:
      'Choose a quiet open area with ample space. Attach a long line to a well-fitted harness and arrange one mild distraction, such as a stationary toy far away.',
    safety:
      'Keep the line clear of feet and obstacles; never wrap it around a hand or attach it to the neck. Avoid roads, wildlife and unfamiliar dogs. The line prevents escape; it is not a tool to reel your dog in.',
    easier:
      'Move farther from the distraction, shorten the recall distance, or remove the distraction entirely. Return to a familiar cue your dog can complete willingly.',
    harder:
      'Change only distraction intensity, recall distance or location after comfortable success on separate days. Keep the safety line and do not test around hazards.',
    sources: ['zak', 'stilwell', 'avsab'],
    steps: [
      step(
        'Check the easy version',
        90,
        'Away from the distraction, rehearse two short recalls and reward generously. Let the line remain slack. If the familiar version is difficult, choose a quieter setting instead.',
        'Your dog returns promptly twice with a loose body and slack line.',
      ),
      step(
        'Add one mild distraction',
        120,
        'At a generous distance, let your dog notice the stationary distraction. When they can comfortably turn away, cue once from a short distance. Reward arriving, then release to safe sniffing.',
        'Your dog turns from the mild distraction and completes one relaxed return without line pressure.',
      ),
      step(
        'Keep success predictable',
        120,
        'Alternate the same comfortable distraction setup with easy recalls facing away from it. Keep distances unchanged today and finish after a few good choices rather than testing a harder approach.',
        'Your dog completes relaxed returns in both the easy and mildly distracting setup.',
      ),
    ],
  },
  {
    ...shared,
    id: 'emergency-recall',
    title: 'Emergency Recall Rehearsal',
    category: 'Recall & focus',
    level: 'Advanced',
    prerequisites: ['recall-around-distractions'],
    readiness:
      'Your everyday recall is comfortable in several controlled settings, and you can safely manage a long line without tension. Your dog eagerly accepts a special reward.',
    subtitle: 'Build a special cue before you need it.',
    objective:
      'Create a distinct, generously rewarded recall cue through occasional easy rehearsals, while maintaining ordinary safety management.',
    equipment: [
      'Distinct recall word or comfortable whistle',
      'Exceptional dog-safe rewards',
      'Harness and long line',
      'Secure area',
    ],
    preparation:
      'Choose a new cue that you will use consistently and sparingly. Prepare several tiny rewards your dog especially enjoys. Begin indoors or in a secure quiet garden.',
    safety:
      'No recall is guaranteed in an emergency. Never create danger or frighten your dog to test it. Keep barriers and lead management around roads, wildlife and other hazards; avoid a loud whistle near sensitive ears.',
    reinforcement:
      'Pair every use of this special cue with a generous reward your dog values. Keep the cue special and use only a few easy repetitions, with long breaks.',
    easier:
      'Pair the cue with rewards while your attentive dog is already beside you. Resume short approaches only when the cue predicts good things without startling them.',
    harder:
      'On later days, rehearse a little farther away in secure settings. Keep distractions mild and rewards generous; do not intentionally create an emergency.',
    sources: ['zak', 'stilwell', 'avsab'],
    steps: [
      step(
        'Give the new cue meaning',
        90,
        'With your dog nearby and comfortable, give the new cue once and immediately offer several tiny rewards in succession. Pause for normal activity before one more easy pairing.',
        'Your dog remains comfortable and expects a valued reward when the cue sounds.',
      ),
      step(
        'Invite a very easy return',
        90,
        'After comfortable pairings over separate sessions, stand a few steps away in the secure area. Give the cue once, reward the return generously and release your dog to a safe enjoyable activity.',
        'Your dog turns and reaches you promptly from a few easy steps away.',
      ),
      step(
        'Rehearse without a crisis',
        90,
        'On a later comfortable outing, use the harness and long line in an open quiet area. Rehearse one easy return while your dog is only mildly occupied, reward generously, then continue the walk.',
        'One calm, managed rehearsal ends with a willing return and a relaxed release.',
      ),
    ],
  },
  {
    ...shared,
    id: 'stay-while-i-move',
    title: 'Stay While I Move',
    category: 'Everyday skills',
    level: 'Intermediate',
    prerequisites: ['my-cozy-spot'],
    readiness:
      'Your dog comfortably chooses a resting position on a mat while you stand nearby. They can leave freely without becoming worried.',
    subtitle: 'One little movement, one clear release.',
    objective:
      'Teach a comfortable station-and-release routine while you make small movements nearby.',
    equipment: ['Non-slip mat', 'Small rewards', 'Quiet room'],
    preparation:
      'Choose a familiar position your dog offers comfortably, such as standing or lying on a mat. Pick a release word and start beside them.',
    safety:
      'Do not physically hold your dog in position or repeatedly put them back. A stay is not a substitute for a lead, barrier or supervision, and this is not an absence-training exercise.',
    easier:
      'Reward remaining comfortable while you merely shift your weight. Release after a moment before your dog needs to get up.',
    harder:
      'Add one small step of distance or one second of duration at a time on later days. Return to your dog to reward instead of always calling them off the mat.',
    sources: ['mcmillan', 'stilwell', 'avsab'],
    steps: [
      step(
        'Introduce the release',
        90,
        'Reward your dog for comfortably choosing the mat. After a brief pause, say the release word and invite them to move away. Repeat so there is a clear beginning and end.',
        'Your dog stays comfortably for a moment and moves freely when released.',
      ),
      step(
        'Move one foot',
        120,
        'Ask for the familiar resting position. Say your stay cue once, shift one foot back, then immediately return and reward on the mat. Release before trying again.',
        'Your dog remains loose-bodied through one tiny step and return.',
      ),
      step(
        'Try a small side step',
        120,
        'Keep the duration brief. Take one small side step, return to reward and release. If your dog follows, reset kindly and make your movement smaller.',
        'Your dog comfortably holds position through a small movement in either direction.',
      ),
    ],
  },
  {
    ...shared,
    id: 'stay-through-distractions',
    title: 'Stay Through Distractions',
    category: 'Everyday skills',
    level: 'Advanced',
    prerequisites: ['stay-while-i-move'],
    readiness:
      'Your dog comfortably remains on their station through small handler movements, understands the release word, and recovers easily from ordinary quiet activity.',
    subtitle: 'Keep the stay easy while life moves a little.',
    objective:
      'Maintain a short, relaxed station while one low-intensity household distraction occurs.',
    equipment: ['Familiar mat', 'Rewards', 'Quiet household object or calm helper'],
    preparation:
      'Pick a distraction that normally does not worry your dog, such as moving an empty mug across a table. Keep your own distance and the stay duration easier than usual.',
    safety:
      'Never startle your dog, throw objects at them or test around food they might guard. If remaining still causes worry, release and remove the distraction.',
    easier:
      'Remove the distraction and reward an easy stay. Next time, make the household movement smaller or farther away.',
    harder:
      'After comfortable repetitions on separate days, change only one aspect of the distraction. Do not increase duration and handler distance at the same time.',
    sources: ['mcmillan', 'zak', 'avsab'],
    steps: [
      step(
        'Revisit the familiar stay',
        90,
        'Practise a short stay with you beside the mat. Return rewards to the resting place and use the release word after each repetition.',
        'Your dog completes two easy, relaxed stays with a clear release.',
      ),
      step(
        'Make one ordinary movement',
        120,
        'While your dog rests briefly, move the chosen object a little at a comfortable distance. Reward remaining relaxed, then release. Pause instead of repeating the movement continuously.',
        'Your dog notices one mild movement without leaving the mat or showing tension.',
      ),
      step(
        'Mix easy and mild trials',
        120,
        'Alternate a familiar stay with one using the same small distraction. Keep each attempt short. If your dog gets up, reset without correction and reduce the next distraction.',
        'Your dog remains comfortable during short stays both with and without the mild distraction.',
      ),
    ],
  },
  {
    ...shared,
    id: 'send-to-mat',
    title: 'Send to Mat',
    category: 'Everyday skills',
    level: 'Intermediate',
    prerequisites: ['my-cozy-spot', 'stay-while-i-move'],
    readiness:
      'Your dog voluntarily approaches their mat, settles comfortably there with you nearby, and understands a clear release cue.',
    subtitle: 'A familiar destination from a little farther away.',
    objective:
      'Build a verbal station cue that sends your dog to their mat from a short distance without following a visible food lure.',
    equipment: ['Familiar non-slip mat', 'Small rewards', 'Clear quiet floor space'],
    preparation:
      'Set the mat within one easy step. Keep rewards in a pocket so the mat cue, rather than visible food, can become meaningful.',
    safety:
      'The mat remains a comfortable choice, never punishment or forced confinement. Keep the route clear and release rather than insisting if your dog is worried.',
    easier:
      'Move beside the mat and reward an offered approach. Use one small guiding gesture, then fade it gradually as the destination becomes familiar.',
    harder:
      'On later days, add one step of sending distance or change the mat location within the same quiet room. Keep settling duration short during these changes.',
    sources: ['stilwell', 'zak', 'avsab'],
    steps: [
      step(
        'Name the destination',
        90,
        'As your dog begins a familiar approach, say your chosen mat cue once. Mark stepping onto the mat and deliver the reward there. Release for a fresh start.',
        'Your dog approaches the mat willingly as the new cue is introduced.',
      ),
      step(
        'Send from one step away',
        120,
        'Stand one step away, give the cue and wait briefly. If needed, add a small hand gesture without displaying food. Reward on the mat, then release.',
        'Your dog travels the short distance to the mat without following a visible treat.',
      ),
      step(
        'Reward the destination',
        120,
        'Repeat from the same distance with a smaller gesture. Approach to deliver a reward on the mat, add a brief comfortable pause, then release. Keep your own movement unhurried.',
        'Your dog goes to the mat on the familiar cue and stays comfortably for a brief reward.',
      ),
    ],
  },
  {
    ...shared,
    id: 'visitor-mat-routine',
    title: 'Visitor Mat Routine',
    category: 'Everyday skills',
    level: 'Advanced',
    prerequisites: ['send-to-mat', 'doorbell-detective', 'strangers-are-okay'],
    readiness:
      'Your dog goes to the mat on cue and can watch a familiar helper at a generous distance with a loose body, without barking, rushing or sustained staring.',
    subtitle: 'A predictable welcome with room to choose.',
    objective:
      'Combine an established mat cue with a controlled helper arrival and a comfortable release away from the doorway.',
    equipment: ['Familiar mat', 'Rewards', 'Calm adult helper', 'Secure gate or separate room'],
    preparation:
      'Place the mat well away from the door. Agree on a quiet arrival with a familiar helper who will ignore the dog and stop immediately when asked. Manage real visitors separately.',
    safety:
      'Use a barrier to prevent rushing. Do not require a greeting or use the mat to hold a fearful dog near a visitor. Bite history, growling or lunging needs qualified professional guidance.',
    easier:
      'Practise the mat with the helper already seated far away, or rehearse door movements without a visitor. Increase space before repeating.',
    harder:
      'Change only one part of the arrival on a later day, such as a small door movement. Stranger greetings and busy deliveries require a separate management plan.',
    sources: ['stilwell', 'zak', 'barking', 'avsab'],
    steps: [
      step(
        'Agree on the quiet plan',
        90,
        'With the helper absent, practise one easy send to the mat. Check that the barrier, rewards and a quiet exit route are ready. Let your dog leave the mat on release.',
        'The easy mat cue works and you have a secure, pressure-free setup.',
      ),
      step(
        'Make a tiny arrival',
        120,
        'Ask the helper to appear briefly at the agreed comfortable distance without looking at or approaching the dog. Cue the familiar mat once and reward relaxed participation. The helper withdraws before concern builds.',
        'Your dog can notice the helper and remain comfortable at the mat for one brief appearance.',
      ),
      step(
        'Release away from the door',
        120,
        'After a calm brief appearance, release your dog toward a quiet sniffing area away from the visitor. Keep the helper still or behind the barrier. End without requiring contact.',
        'Your dog follows the release toward a calm alternative area without rushing the helper.',
      ),
    ],
  },
  {
    ...shared,
    id: 'quiet-cafe-settle',
    title: 'Quiet Café Settle',
    category: 'Everyday skills',
    level: 'Advanced',
    prerequisites: ['send-to-mat', 'stay-through-distractions', 'strangers-are-okay'],
    readiness:
      'Your dog settles on their mat in more than one quiet place and can watch distant people or gentle household movement without worry or pulling toward them.',
    subtitle: 'Take a familiar resting skill somewhere new.',
    objective:
      'Generalize a short voluntary mat settle to a quiet dog-friendly outdoor setting with an easy exit.',
    equipment: ['Portable mat', 'Harness and ordinary lead', 'Water', 'Small rewards'],
    preparation:
      'First practise beside a quiet bench. Only later choose an uncrowded, dog-friendly café edge at a cool comfortable time. Meet toileting and movement needs beforehand.',
    safety:
      'Keep your dog away from hot drinks, food scraps, traffic and passing feet. Hold the lead without trapping them under furniture. Leave promptly if they cannot relax; a café is optional, not a socialization test.',
    easier:
      'Return to the quiet bench or practise outside the venue at a greater distance. A few comfortable seconds can be enough for today.',
    harder:
      'On later outings, add a little duration or choose a slightly different quiet position. Do not increase crowding, distance and time together.',
    sources: ['stilwell', 'cesar', 'avsab'],
    steps: [
      step(
        'Choose the quiet edge',
        90,
        'At a quiet bench, give your dog time to sniff and orient. Put down the familiar mat away from foot traffic. Reward choosing it without holding your dog in place.',
        'Your dog can explore briefly and voluntarily return to the mat with a loose body.',
      ),
      step(
        'Practise a tiny pause',
        120,
        'Sit beside the mat and quietly reward comfortable resting moments. Allow changes of position. Release for a sniff break after only a short pause instead of filling the timer.',
        'Your dog chooses a comfortable short rest and can leave the mat calmly on release.',
      ),
      step(
        'Try one small location change',
        120,
        'After successful bench outings on separate days, repeat the easy version at an uncrowded café edge. Stay briefly, keep distractions distant and leave while your dog is still comfortable.',
        'A brief visit ends with voluntary relaxation and a calm departure.',
      ),
    ],
  },
  {
    ...shared,
    id: 'doorway-pause-release',
    title: 'Doorway Pause & Release',
    category: 'Everyday skills',
    level: 'Intermediate',
    prerequisites: ['walk-with-me', 'stay-while-i-move'],
    readiness:
      'Your dog comfortably pauses beside you for a moment, follows a release cue, and can work near a closed interior door without rushing or worry.',
    subtitle: 'A little pause before the next adventure.',
    objective:
      'Teach a brief wait behind an interior threshold while the door moves, followed by a clear release.',
    equipment: ['Interior doorway', 'Rewards', 'Secure secondary barrier when needed'],
    preparation:
      'Start at an interior door leading into another secure room. Choose where your dog will pause and keep rewards ready on that side of the threshold.',
    safety:
      'Keep fingers and paws clear of hinges and never close a door against your dog. Use a lead and physical barriers at exterior exits. This cue does not make an open doorway or road safe.',
    easier:
      'Practise the pause away from the door, then introduce a hand moving toward the handle without opening it.',
    harder:
      'Gradually increase the door opening or add one small handler movement on later days. Exterior practice requires secure lead and barrier management throughout.',
    sources: ['mcmillan', 'zak', 'avsab'],
    steps: [
      step(
        'Choose the waiting spot',
        90,
        'Reward a comfortable pause a short distance behind the closed door. Use the release word to move together into another part of the room, then reset.',
        'Your dog comfortably pauses in the chosen area and follows the release.',
      ),
      step(
        'Add a tiny door movement',
        120,
        'Cue the familiar pause, touch the handle and reward. If comfortable, open the door a small amount with paws well clear, then reward again. Reset before your dog needs to move.',
        'Your dog stays relaxed through a small door movement without rushing forward.',
      ),
      step(
        'Release through together',
        120,
        'Open the interior door only as far as your dog finds easy. Say the release word and invite them through with you. If they move early, calmly reset farther back and simplify the opening.',
        'Your dog waits through an easy opening and walks through after the release cue.',
      ),
    ],
  },
  {
    ...shared,
    id: 'retrieve-to-hand',
    title: 'Retrieve to Hand',
    category: 'Everyday skills',
    level: 'Intermediate',
    prerequisites: ['trade-it'],
    readiness:
      'Your dog willingly picks up a familiar low-value toy, comfortably exchanges it for a reward, and shows no guarding when you are nearby.',
    subtitle: 'Bring it closer, then make a good trade.',
    objective:
      'Shape a short, low-impact retrieve ending in a voluntary release into an offered hand.',
    equipment: ['Soft dog-safe toy too large to swallow', 'Rewards', 'Non-slip floor'],
    preparation:
      'Choose a calm moment and a toy your dog can carry easily. Begin seated or kneeling at a comfortable distance so there is no need to jump or run.',
    safety:
      'Do not chase, pry open the mouth, pull the toy or repeatedly throw it. Stop for stiffening or guarding and seek qualified support. Avoid heavy objects, small parts and objects that can splinter.',
    easier:
      'Reward touching or briefly lifting the familiar toy beside you. Keep the hand close enough that the dog does not need to carry it yet.',
    harder:
      'After comfortable deliveries on separate days, place the same toy one step farther away. Add carrying distance before introducing a different safe object.',
    sources: ['zak', 'stilwell', 'chewing', 'avsab'],
    steps: [
      step(
        'Reward a willing lift',
        90,
        'Place the toy beside you. Mark a voluntary mouth touch or small lift and offer a good trade. Let the dog choose to engage again instead of putting the toy into their mouth.',
        'Your dog willingly lifts the toy beside you and exchanges it without tension.',
      ),
      step(
        'Make your hand the landing place',
        120,
        'When your dog holds the toy near you, offer an open hand just beneath it. Use the familiar trade cue, reward releasing over your hand and return the toy when appropriate.',
        'Your dog voluntarily releases the toy into or directly above your open hand.',
      ),
      step(
        'Add one carrying step',
        120,
        'Place the toy a short step away. Invite your dog toward you after the pickup and offer the same open hand. Reward a willing delivery; shorten the distance if the toy is dropped early.',
        'Your dog carries the toy a short distance and calmly releases into the offered hand.',
      ),
    ],
  },
  {
    ...shared,
    id: 'leave-it-on-the-move',
    title: 'Leave It on the Move',
    category: 'Everyday skills',
    level: 'Advanced',
    prerequisites: ['trade-it', 'walk-with-me', 'doorway-pause-release'],
    readiness:
      'Your dog can follow a slack lead, willingly turn to you for a reward, and disengage from a covered low-value item in a quiet setup without frustration.',
    subtitle: 'Choose a safe route past a tempting thing.',
    objective:
      'Pair a trained leave-it cue with moving past a controlled, inaccessible distraction at a comfortable distance.',
    equipment: [
      'Harness and lead',
      'Rewards',
      'Low-value dog-safe item',
      'Secure cover or barrier',
    ],
    preparation:
      'Secure a low-value familiar toy behind a barrier so your dog cannot reach it. Choose a route with plenty of passing space and rewards that are separate from the distraction.',
    safety:
      'Never practise with medicine, rubbish, toxic food or an item your dog guards. Do not yank the lead or open the mouth. Suspected dangerous ingestion needs prompt veterinary advice, not a cue rehearsal.',
    easier:
      'Increase distance from the covered item and reward looking back at you while stationary. Remove it completely if your dog cannot disengage comfortably.',
    harder:
      'On later days, reduce passing distance slightly or use a different inaccessible safe item. Keep real hazards out of reach regardless of training progress.',
    sources: ['mcmillan', 'zak', 'chewing', 'avsab'],
    steps: [
      step(
        'Practise disengaging safely',
        90,
        'From a generous distance, mark and reward a voluntary turn away from the covered item. Once that turn is predictable, say leave it just before it happens. Reward from your own supply.',
        'Your dog turns from the inaccessible item toward you without lead pressure.',
      ),
      step(
        'Add a short passing route',
        120,
        'Walk a wide arc with the item behind its barrier. Give the cue once while your dog can still respond easily, then reward moving with you. Keep the lead slack and do not approach closer today.',
        'Your dog passes at the planned distance, disengaging and walking with you comfortably.',
      ),
      step(
        'Use both directions',
        120,
        'After a break, walk the same generous route from the opposite direction. Reward choosing you, then continue to a safe sniffing area. Increase space if the new angle is harder.',
        'Your dog passes comfortably from either direction while the safe item remains inaccessible.',
      ),
    ],
  },
  {
    ...shared,
    id: 'scent-search-trail',
    title: 'Scent Search Trail',
    category: 'Scent & enrichment',
    level: 'Intermediate',
    prerequisites: ['sniff-and-stroll'],
    readiness:
      'Your dog enjoys relaxed sniffing, can eat suitable treats comfortably, and searches a clear familiar floor without swallowing non-food items.',
    subtitle: 'Let the nose solve a little puzzle.',
    objective:
      'Introduce an easy food-search trail with a clear search invitation and a calm finish.',
    equipment: ['A few tiny suitable treats', 'Clear non-slip floor', 'Water'],
    preparation:
      'Use part of your dog’s usual food allowance in a familiar room. Remove household hazards and keep other animals separate to avoid competition.',
    safety:
      'Use only foods your dog tolerates and account for dietary restrictions. Avoid essential oils, chemical scent products, small containers and inaccessible hiding places. Supervise and stop if searching causes frustration.',
    easier:
      'Place one visible treat a short distance away and let your dog find it without restraint. Keep the search area very small.',
    harder:
      'On later sessions, increase the gap between treats slightly or add one easy change in direction. Avoid making food harder to reach.',
    sources: ['stilwell', 'zak', 'avsab'],
    steps: [
      step(
        'Introduce the search invitation',
        90,
        'Let your dog see you put one treat on the clear floor. Say your search word once and let them approach freely. Repeat at an easy nearby spot after a short pause.',
        'Your dog comfortably follows the invitation to find a visible treat.',
      ),
      step(
        'Build a short trail',
        120,
        'Place three tiny treats a short distance apart in a straight line. Give the search invitation, then let your dog work at their own pace without pointing repeatedly or steering their nose.',
        'Your dog follows the small search area and finds the treats without frustration.',
      ),
      step(
        'Add an easy turn',
        120,
        'After a rest, lay the same short trail with one gentle turn around a clear patch of floor. Let your dog choose the order, then use an all-done cue and offer water or a rest.',
        'Your dog explores the slightly changed trail comfortably and settles after the finish cue.',
      ),
    ],
  },
  {
    ...shared,
    id: 'search-a-new-room',
    title: 'Search a New Room',
    category: 'Scent & enrichment',
    level: 'Advanced',
    prerequisites: ['scent-search-trail'],
    readiness:
      'Your dog independently finds a short easy food trail in a familiar room and can calmly explore the proposed new room without searching, worry or grabbing household objects.',
    subtitle: 'A new setting, an easier puzzle.',
    objective:
      'Generalize a familiar search cue to a different safe room while reducing search difficulty.',
    equipment: ['Tiny suitable food rewards', 'Safe quiet room', 'Open resting area'],
    preparation:
      'Check the room for cables, plants, rubbish and small objects. Let your dog explore with you first, without hidden rewards. Choose floor-level spots that require no climbing or squeezing.',
    safety:
      'Do not send your dog into an unfamiliar or worrying room alone. Avoid essential oils and inaccessible food. Keep other pets separate and use a toy-based alternative only if safe, familiar and not guarded.',
    easier:
      'Return to the familiar room or place one visible reward just inside the new room’s open doorway. The dog may choose not to enter.',
    harder:
      'Increase only the number of easy hiding spots or reduce visibility a little on later days. Keep the room familiar and the rewards physically accessible.',
    sources: ['stilwell', 'zak', 'avsab'],
    steps: [
      step(
        'Make the room ordinary',
        90,
        'Explore the checked room together with the door open. Let your dog sniff and leave freely. Skip the search if they remain tense or avoid entering.',
        'Your dog explores and can return to you or leave the room comfortably.',
      ),
      step(
        'Move an easy search',
        120,
        'Place one visible treat on a clear part of the floor. Use the familiar search invitation and allow your dog to find it without extra prompting. Repeat only while comfortable.',
        'Your dog responds to the familiar search cue in the new room without hesitation or frustration.',
      ),
      step(
        'Try two accessible spots',
        120,
        'While your dog rests with a helper or beside you, place two treats at easy floor-level spots, one partly out of direct sight. Invite searching, stay nearby and finish before enthusiasm becomes frustration.',
        'Your dog independently finds two easy rewards and finishes calmly in the new setting.',
      ),
    ],
  },
  {
    ...shared,
    id: 'find-a-named-toy',
    title: 'Find a Named Toy',
    category: 'Scent & enrichment',
    level: 'Advanced',
    prerequisites: ['retrieve-to-hand', 'search-a-new-room'],
    readiness:
      'Your dog enjoys safe toy searching and voluntary retrieves, comfortably releases the toy, and shows no guarding when two familiar toys are present.',
    subtitle: 'Listen to the name, then choose the toy.',
    objective:
      'Begin distinguishing two familiar toy names rather than following a pointing gesture or a fixed location.',
    equipment: ['Two clearly different dog-safe toys', 'Rewards', 'Clear non-slip floor'],
    preparation:
      'Choose toys with distinct shapes and short different names. Keep them large enough to carry safely. Start with one toy and teach at your dog’s pace across separate sessions.',
    safety:
      'Object-name learning can take many sessions and is optional enrichment. Avoid small parts, heavy objects, frustration and forced mouth handling. Stop for guarding and seek qualified help.',
    easier:
      'Return to one familiar toy and reward looking toward, touching or bringing it when named. Keep the toy nearby and visible.',
    harder:
      'Only after comfortable two-toy choices on separate days, add a little search distance. Do not add a third name and hide the toys at the same time.',
    sources: ['zak', 'stilwell', 'avsab'],
    steps: [
      step(
        'Name one familiar toy',
        120,
        'Place one toy nearby. Say its name as your dog looks toward or approaches it, then reward a touch or voluntary pickup. Use the established retrieve and trade only if your dog enjoys them.',
        'Your dog turns toward the single familiar toy when its name is used without a pointing gesture.',
      ),
      step(
        'Introduce a second choice',
        120,
        'After the first name is familiar, add the other toy farther to one side. Ask for the known toy by name and reward the correct choice. Swap positions between easy attempts; reset neutrally after another choice.',
        'Your dog selects the named toy in either position without following your hand.',
      ),
      step(
        'Build the second name separately',
        120,
        'In separate short sessions, teach the second toy’s name alone before presenting both. Then occasionally alternate which name you say, changing positions and rewarding each correct voluntary choice.',
        'Across comfortable sessions, your dog can choose either toy by its name in changing positions.',
      ),
    ],
  },
  {
    ...shared,
    id: 'chin-rest-check-in',
    title: 'Chin Rest Check-in',
    category: 'Cooperative care',
    level: 'Intermediate',
    prerequisites: ['fresh-and-fluffy'],
    readiness:
      'Your dog comfortably approaches your open hand or a soft support and accepts brief familiar handling without avoidance, freezing or mouth contact.',
    subtitle: 'A clear way to begin, and a clear way to pause.',
    objective:
      'Teach a voluntary chin rest as a predictable start position for brief, non-painful care practice.',
    equipment: ['Soft folded towel or open palm', 'Small rewards', 'Quiet non-slip area'],
    preparation:
      'Let your dog stand or sit in a comfortable position with room to leave. Hold the support below their chin without reaching over or moving their head.',
    safety:
      'Never hold the chin down. Lifting the head or moving away pauses your hands immediately. A learned position is not consent for painful treatment; veterinary procedures need an appropriate clinical plan.',
    easier:
      'Reward approaching or touching the support briefly. Keep handling separate until returning to the chin rest is comfortable.',
    harder:
      'Add one very small, familiar touch while the chin rests, then remove your hand. Increase touch duration separately from introducing any tool.',
    sources: ['stilwell', 'cooperative', 'avsab'],
    steps: [
      step(
        'Invite the resting place',
        90,
        'Present the towel or open palm below chin height. Mark a voluntary approach or light chin touch, reward and move the support away for a break. Do not push it under the head.',
        'Your dog voluntarily brings the chin to the offered support without being positioned.',
      ),
      step(
        'Build a brief check-in',
        120,
        'Offer the support again and reward a momentary chin rest. Let your dog lift away between attempts. Add a quiet cue only when the movement is predictable.',
        'Your dog chooses a short chin rest and can freely lift away to end it.',
      ),
      step(
        'Pair one familiar touch',
        120,
        'During a voluntary chin rest, make one tiny familiar shoulder touch and stop. Pause instantly if the chin lifts. Offer the support again only after a break, letting your dog decide whether to return.',
        'Your dog remains comfortable through a brief touch, and lifting the chin reliably pauses handling.',
      ),
    ],
  },
  {
    ...shared,
    id: 'paw-care-by-choice',
    title: 'Paw Care by Choice',
    category: 'Cooperative care',
    level: 'Advanced',
    prerequisites: ['chin-rest-check-in', 'fresh-and-fluffy'],
    readiness:
      'Your dog voluntarily returns to a care position, can pause handling by moving away, and comfortably accepts a brief touch near the shoulder or upper leg.',
    subtitle: 'Make a tiny paw check a shared decision.',
    objective:
      'Build voluntary participation in a brief paw presentation and gentle visual check without gripping or trimming.',
    equipment: ['Non-slip mat', 'Soft towel', 'Small rewards', 'Comfortable low hand position'],
    preparation:
      'Choose a relaxed moment when paws appear healthy. Keep your hands visible and below the dog’s comfortable reach. Practise on one front paw while preserving balance.',
    safety:
      'Do not pull a leg, squeeze toes, hold the paw after withdrawal or clip nails in this exercise. Pain, redness, a foreign object or sudden handling sensitivity needs veterinary assessment. Some dogs need a different care setup.',
    easier:
      'Return to the familiar care position and a brief upper-leg touch, or simply reward a voluntary weight shift with no contact.',
    harder:
      'On later days, add a very brief towel touch or practise the other paw separately. Introducing clippers and actual trimming needs its own gradual plan and competent help.',
    sources: ['cooperative', 'stilwell', 'avsab'],
    steps: [
      step(
        'Reconfirm the pause signal',
        90,
        'Offer your dog’s familiar chin rest or care position. Make one comfortable upper-leg touch and remove your hand. If your dog leaves the position, stop and offer a break.',
        'Your dog voluntarily returns to the care position and moving away consistently stops contact.',
      ),
      step(
        'Invite a tiny paw lift',
        120,
        'Hold a low open hand near the chosen paw and reward an offered weight shift or small lift. If a familiar paw cue is comfortable, use it once. Support gently only when the paw is offered.',
        'Your dog willingly lifts or presents the paw without being pulled off balance.',
      ),
      step(
        'Look, release, reward',
        120,
        'For an offered paw, make a momentary visual check without squeezing or spreading the toes. Release immediately, reward and pause. Increase nothing if your dog withdraws or stops offering.',
        'Your dog voluntarily offers a paw for a brief comfortable look and can end contact freely.',
      ),
    ],
  },
  {
    ...shared,
    id: 'basket-muzzle-by-choice',
    title: 'Basket Muzzle by Choice',
    category: 'Cooperative care',
    level: 'Intermediate',
    prerequisites: ['chin-rest-check-in'],
    readiness:
      'Your dog comfortably approaches equipment, voluntarily targets a support with their chin, and can move away without being followed or held.',
    subtitle: 'Useful equipment can predict good things.',
    objective:
      'Introduce voluntary nose entry and easy unfastened strap contact with a properly fitted basket muzzle.',
    equipment: ['Correctly fitted basket muzzle', 'Small rewards', 'Quiet non-slip space'],
    preparation:
      'Get fitting advice from a competent professional. Choose a basket with room to open the mouth and pant, and a safe way to deliver rewards. Keep all straps unfastened for this introductory exercise.',
    safety:
      'Never force the nose inside, use a tight fabric muzzle for this practice or leave a muzzled dog unattended. Do not use food to trap the head while fastening. Bite risk and eventual fitted wearing need an individualized professional plan.',
    easier:
      'Place the muzzle at a comfortable distance and reward looking toward it. End without nose entry if your dog is hesitant.',
    harder:
      'After repeated voluntary relaxed entries, ask a qualified professional to guide brief fastening and gradual wearing. Comfortable unfastened practice does not prove the fit or make close encounters safe.',
    sources: ['stilwell', 'cooperative', 'avsab'],
    steps: [
      step(
        'Let the equipment be ordinary',
        90,
        'Hold the unfastened muzzle still or place it on a stable surface. Reward a comfortable look or approach, then move it away. Let your dog decide when to approach again.',
        'Your dog approaches or investigates the muzzle voluntarily with a loose body.',
      ),
      step(
        'Reward voluntary nose entry',
        120,
        'Hold the basket steady at nose height without moving it toward your dog. Reward a voluntary nose touch or shallow entry through a suitable opening. Allow immediate withdrawal after every attempt.',
        'Your dog freely puts the nose into the basket briefly and withdraws without resistance.',
      ),
      step(
        'Introduce unfastened straps',
        120,
        'Only after comfortable entries across separate sessions, briefly lift an unfastened strap near the cheek while your dog chooses nose entry. Reward and remove the muzzle. Stop at a look or approach if strap movement causes concern.',
        'Your dog remains relaxed during a tiny unfastened strap movement and can leave at any time.',
      ),
    ],
  },
  {
    ...shared,
    id: 'observe-and-choose',
    title: 'Observe & Choose',
    category: 'Walking',
    level: 'Advanced',
    prerequisites: ['strangers-are-okay', 'loose-leash-magic', 'cheerful-u-turn'],
    readiness:
      'Your dog can notice a distant familiar helper, then freely sniff, turn away or move with you while remaining loose-bodied. You have ample space, a clear exit and suitable professional advice for any reactivity.',
    subtitle: 'More room for a comfortable choice.',
    objective:
      'Support a dog’s voluntary disengagement and movement at a comfortable distance, using an educational adaptation of BAT choice and distance principles.',
    equipment: [
      'Well-fitted harness',
      'Lead you can safely handle',
      'Calm adult helper',
      'Quiet open space with exits',
    ],
    preparation:
      'Arrange a familiar helper who will stay still at a generous distance and stop on request. Begin farther away than usual concern appears. This is not a full BAT setup or treatment protocol.',
    safety:
      'Bite history, lunging, freezing or difficulty disengaging needs qualified behavior support. Never lure toward the helper, require a greeting or tighten the lead to hold your dog near a trigger. Leave immediately if comfort changes; the timer is only a ceiling.',
    easier:
      'Remove the helper and take a quiet sniff break. Next time, increase distance or practise the exit route without a trigger.',
    harder:
      'Do not make approaching the helper the goal. Maintain generous space, repeat comfortable choices and discuss any closer or more complex setup with a qualified professional.',
    reinforcement:
      'Support useful consequences your dog chooses, such as sniffing, taking a break or moving farther away. Food can support comfort when appropriate but should never lure the dog closer to a worrying trigger.',
    evidence:
      'A practical exercise based on distance and choice principles associated with Grisha Stewart’s BAT; not a separately validated clinical protocol. It is not the complete BAT protocol, a behavior assessment or a replacement for individualized treatment.',
    sources: ['bat', 'avsab'],
    steps: [
      step(
        'Check space and the exit',
        90,
        'With the helper absent or far beyond concern, let your dog sniff and choose a comfortable direction. Check that the lead stays slack and that you can leave on a wide unobstructed route.',
        'Your dog explores with a loose body and you have a clear route to increase distance.',
      ),
      step(
        'Allow one comfortable observation',
        120,
        'Have the helper remain still at the planned distance. Let your dog notice without asking for a sit or closer approach. If they voluntarily look away, sniff or turn, quietly allow that choice and follow at a safe pace.',
        'Your dog can notice the distant helper and voluntarily disengage without lead tension or repeated cues.',
      ),
      step(
        'Follow the comfortable choice',
        90,
        'Support your dog’s chosen calm direction, including retreat. Increase space at the first sign of tension and end with a quiet break. Record the comfortable setup rather than trying to finish closer.',
        'The session ends with comfortable movement or rest, without reducing distance as a requirement.',
      ),
    ],
  },
  {
    ...shared,
    id: 'cheerful-u-turn',
    title: 'Cheerful U-turn',
    category: 'Walking',
    level: 'Intermediate',
    prerequisites: ['walk-with-me', 'loose-leash-magic'],
    readiness:
      'Your dog comfortably follows your movement for a few steps on a slack lead and can turn toward a familiar reward in a quiet space.',
    subtitle: 'Practise an easy way to make more room.',
    objective:
      'Teach a cheerful turn-and-follow cue before you need an exit from an unexpectedly busy path.',
    equipment: ['Comfortable harness and lead', 'Rewards', 'Quiet clear walking space'],
    preparation:
      'Choose a short phrase distinct from your recall. Practise in a clear room or quiet path with no approaching triggers so your dog can learn the movement comfortably.',
    safety:
      'Turn in a wide comfortable arc, not with a neck jerk or abrupt leash pull. Check behind you before moving. If a real encounter is already overwhelming, prioritize distance and safe management rather than repeated training cues.',
    easier:
      'Reward one small turn of the head and a single step with you. Slow down and make the direction change wider.',
    harder:
      'On later walks, rehearse occasionally at a quiet junction, then release to sniff. Add mild distractions only at distances where your dog can respond comfortably.',
    sources: ['zak', 'stilwell', 'avsab'],
    steps: [
      step(
        'Pair the cue with a turn',
        90,
        'Say the phrase while your dog is already attentive. Turn your body in a wide arc and invite one step with you, rewarding beside your leg. Keep the lead slack.',
        'Your dog follows an easy direction change willingly without being pulled.',
      ),
      step(
        'Make a short shared route',
        120,
        'Walk two easy steps, cue the turn once and travel a few steps back together. Reward following, then pause. Use the same calm speed in both directions.',
        'Your dog changes direction and walks several steps with you on a slack lead.',
      ),
      step(
        'Rehearse a calm exit',
        120,
        'On a quiet path, practise one turn toward a safe open space you checked beforehand. Reward, then release to sniff. End while the cue still feels like a simple, pleasant game.',
        'Your dog follows the cue into the planned open area and settles into comfortable sniffing.',
      ),
    ],
  },
  {
    ...shared,
    id: 'heel-then-go-sniff',
    title: 'Heel, Then Go Sniff',
    category: 'Walking',
    level: 'Intermediate',
    prerequisites: ['walk-with-me', 'sniff-and-stroll'],
    readiness:
      'Your dog can walk several relaxed steps near you on a slack lead and comfortably switch between checking in and exploring.',
    subtitle: 'A few close steps, then room to explore.',
    objective:
      'Distinguish a brief close-walking cue from a release to safe sniffing, without expecting a whole walk at heel.',
    equipment: [
      'Comfortable harness and lead',
      'Rewards',
      'Quiet wide path with safe sniffing spots',
    ],
    preparation:
      'Choose a side comfortable for you and your dog. Pick different words for close walking and sniffing. Start in a roomy area with no need to pass anyone.',
    safety:
      'Keep the lead slack and the dog’s movement natural. Do not force head-up posture, tight alignment or prolonged attention. Close walking is not a substitute for distance from something your dog fears.',
    easier:
      'Reward one comfortable step beside you before releasing. Practise on a non-slip floor with more room and no distraction.',
    harder:
      'Add one or two close steps or a gentle curve on later days, then release again. Preserve most of the walk for comfortable movement and exploration.',
    sources: ['zak', 'stilwell', 'cesar', 'avsab'],
    steps: [
      step(
        'Name a comfortable position',
        90,
        'When your dog voluntarily comes beside you, give the close-walking cue and reward near your leg. Take one relaxed step and reward again without pulling the lead or lifting the head.',
        'Your dog willingly takes one comfortable close step while the lead stays slack.',
      ),
      step(
        'Make a tiny walking pattern',
        120,
        'Cue close walking for two or three steps at your dog’s comfortable pace. Reward beside you, pause and repeat. Reduce the steps if your dog needs more space.',
        'Your dog follows a short close-walking cue without crowding, tension or repeated prompts.',
      ),
      step(
        'Release to a useful reward',
        120,
        'After an easy short pattern, say the sniffing release and allow your dog to explore a safe nearby spot on a loose lead. Later invite another brief close section only when they are ready.',
        'Your dog switches comfortably between the brief close-walking cue and the sniffing release.',
      ),
    ],
  },
];
