import { Character } from './types';

const DEFAULT_IMAGE_PATH = '/gallery/placeholder.webp'; 

export const CHARACTERS: Character[] = [
{ 
id: 'santa-claus', 
name: 'Santa Claus', 
description: 'Wish someone a Merry ', 
image: '/gallery/santa.webp', 
previewVideo: 'https://ojhpedsolocvnxjzqymj.supabase.co/storage/v1/object/sign/videos/b403c4fd-d8ed-4f64-99a0-8c75cd1cdaa7.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzRiYzkzMy1kNjI4LTRlMzEtYjc1OS00NmU4MDZiODU4ZjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvYjQwM2M0ZmQtZDhlZC00ZjY0LTk5YTAtOGM3NWNkMWNkYWE3Lm1wNCIsImlhdCI6MTc2NTI1MzY0NywiZXhwIjoxNzY1ODU4NDQ3fQ.CrzjG0Ui66CO3q0zPnpg5ixDD-uyhDcMYfa6C6566ldk',
category: 'trending' 
},
{ 
id: 'monk', 
name: 'Monk', 
description: 'Frosty greetings for friends', 
image: '/gallery/monk.webp', 
category: 'trending' 
},
{ 
id: 'alien', 
name: 'Alien', 
description: 'Guide your sleigh tonight', 
image: '/gallery/alien.webp', 
category: 'trending' 
},
{ 
id: 'elf', 
name: 'Elf', 
description: 'Workshop updates', 
image: '/gallery/elf.webp', 
category: 'trending' 
},
{ 
id: 'navyseal', 
name: 'Navyseal', 
description: 'Sweet messages', 
image: '/gallery/navyseal.webp', 
category: 'trending' 
},
{ 
id: 'tribalman', 
name: 'Tribalman', 
description: 'Waddle waddle', 
image: '/gallery/tribalman.webp', 
previewVideo: 'https://ojhpedsolocvnxjzqymj.supabase.co/storage/v1/object/sign/videos/b403c4fd-d8ed-4f64-99a0-8c75cd1cdaa7.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzRiYzkzMy1kNjI4LTRlMzEtYjc1OS00NmU4MDZiODU4ZjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvYjQwM2M0ZmQtZDhlZC00ZjY0LTk5YTAtOGM3NWNkMWNkYWE3Lm1wNCIsImlhdCI6MTc2NTI1MzY0NywiZXhwIjoxNzY1ODU4NDQ3fQ.CrzjG0Ui66CO3q0zPnpg5ixDD-uyhDcMYfa6C6566ldk', 
category: 'trending' 
},

{ 
id: 'bad-santa', 
name: 'Bad Santa', 
description: 'Warm holiday wishes', 
image: '/gallery/bad_santa.webp', 
category: 'christmas' 
},
{ 
id: 'nutcracker', 
name: 'Nutcracker', 
description: 'Soldier on duty', 
image: DEFAULT_IMAGE_PATH, 
category: 'christmas' 
},
{ 
id: 'angel', 
name: 'Angel', 
description: 'Heavenly tidings', 
image: DEFAULT_IMAGE_PATH, 
category: 'christmas' 
},
{ 
id: 'tree', 
name: 'Tree', 
description: 'Rockin around', 
image: DEFAULT_IMAGE_PATH, 
category: 'christmas' 
},
{ 
id: 'gift', 
name: 'Gift', 
description: 'Surprise inside', 
image: DEFAULT_IMAGE_PATH, 
category: 'christmas' 
},


{ 
id: 'grinch', 
name: 'Grinch', 
description: 'Steal their joy', 
image: '/gallery/grinch.webp', 
category: 'roast' 
},
{ 
id: 'coal', 
name: 'Coal', 
description: 'You were naughty', 
image: DEFAULT_IMAGE_PATH, 
category: 'roast' 
},
{ 
id: 'clown', 
name: 'Clown', 
description: 'Stop clowning around', 
image: DEFAULT_IMAGE_PATH, 
category: 'roast' 
},
{ 
id: 'robot', 
name: 'Robot', 
description: 'Beep boop roast', 
image: DEFAULT_IMAGE_PATH, 
category: 'roast' 
},
];