import { Character } from './types';

export const CHARACTERS: Character[] = [
  // Trending (15 items for 3 pages of 5)
  { id: 'santa-claus', name: 'Santa Claus', description: 'Wish someone a Merry Christmas', image: '🎅', color: 'bg-orange-500', category: 'trending' },
  { id: 'snowman', name: 'Snowman', description: 'Frosty greetings for friends', image: '⛄', color: 'bg-blue-400', category: 'trending' },
  { id: 'reindeer', name: 'Reindeer', description: 'Guide your sleigh tonight', image: '🦌', color: 'bg-amber-600', category: 'trending' },
  { id: 'elf', name: 'Elf', description: 'Workshop updates', image: '🧝', color: 'bg-green-500', category: 'trending' },
  { id: 'gingerbread', name: 'Gingerbread', description: 'Sweet messages', image: '🍪', color: 'bg-yellow-600', category: 'trending' },
  { id: 'penguin', name: 'Penguin', description: 'Waddle waddle', image: '🐧', color: 'bg-gray-800', category: 'trending' },
  { id: 'polar-bear', name: 'Polar Bear', description: 'Arctic vibes', image: '🐻‍❄️', color: 'bg-cyan-100', category: 'trending' },
  { id: 'turkey', name: 'Turkey', description: 'Gobble gobble', image: '🦃', color: 'bg-brown-500', category: 'trending' },
  { id: 'star', name: 'Star', description: 'Shine bright', image: '⭐', color: 'bg-yellow-400', category: 'trending' },
  { id: 'bell', name: 'Bell', description: 'Jingle all the way', image: '🔔', color: 'bg-yellow-500', category: 'trending' },
  { id: 'candle', name: 'Candle', description: 'Light the night', image: '🕯️', color: 'bg-red-300', category: 'trending' },
  { id: 'cookie', name: 'Cookie', description: 'Yummy treat', image: '🍪', color: 'bg-orange-300', category: 'trending' },
  { id: 'sleigh', name: 'Sleigh', description: 'Riding fast', image: '🛷', color: 'bg-red-700', category: 'trending' },
  { id: 'present', name: 'Present', description: 'Open me', image: '🎁', color: 'bg-purple-400', category: 'trending' },
  { id: 'mistletoe', name: 'Mistletoe', description: 'Kisses', image: '🌿', color: 'bg-green-400', category: 'trending' },
  
  // Christmas Theme
  { id: 'mrs-claus', name: 'Mrs. Claus', description: 'Warm holiday wishes', image: '👵', color: 'bg-red-400', category: 'christmas' },
  { id: 'nutcracker', name: 'Nutcracker', description: 'Soldier on duty', image: '💂', color: 'bg-red-600', category: 'christmas' },
  { id: 'angel', name: 'Angel', description: 'Heavenly tidings', image: '👼', color: 'bg-yellow-200', category: 'christmas' },
  { id: 'tree', name: 'Tree', description: 'Rockin around', image: '🎄', color: 'bg-green-600', category: 'christmas' },
  { id: 'gift', name: 'Gift', description: 'Surprise inside', image: '🎁', color: 'bg-purple-500', category: 'christmas' },
  
  // Roast Friend
  { id: 'grinchy', name: 'Grinchy', description: 'Steal their joy', image: '🧟', color: 'bg-green-700', category: 'roast' },
  { id: 'coal', name: 'Coal', description: 'You were naughty', image: '⚫', color: 'bg-gray-600', category: 'roast' },
  { id: 'clown', name: 'Clown', description: 'Stop clowning around', image: '🤡', color: 'bg-red-500', category: 'roast' },
  { id: 'robot', name: 'Robot', description: 'Beep boop roast', image: '🤖', color: 'bg-slate-400', category: 'roast' },
];

