const fs = require('fs');
const path = require('path');

const EMOJI_SPECS = [
  // 1. Emotions
  {
    id: 'smiling-face',
    slug: 'animated-smiling-emoji',
    name: 'Smiling Face with Smiling Eyes',
    shortName: 'Smiling Face',
    category: 'emotions',
    categoryName: 'Emotions & Faces',
    codepoint: '1f604',
    unicodeChar: '😄',
    description: 'Animated beaming yellow smiling face with radiant smiling eyes, cheerful joyful expression.',
    alt: 'Animated smiling face emoji with cheerful glowing smile on transparent background',
    tags: ['smile', 'happy', 'joy', 'cheerful', 'grin', 'positive']
  },
  {
    id: 'laughing-tears',
    slug: 'animated-laughing-tears-emoji',
    name: 'Face with Tears of Joy',
    shortName: 'Laughing Tears',
    category: 'emotions',
    categoryName: 'Emotions & Faces',
    codepoint: '1f602',
    unicodeChar: '😂',
    description: 'Animated laughing face crying tears of uncontrollable laughter and comedy.',
    alt: 'Animated laughing face emoji with tears of joy on transparent background',
    tags: ['laugh', 'lol', 'funny', 'tears of joy', 'hilarious', 'rofl']
  },
  {
    id: 'heart-eyes',
    slug: 'animated-heart-eyes-emoji',
    name: 'Smiling Face with Heart-Eyes',
    shortName: 'Heart Eyes',
    category: 'emotions',
    categoryName: 'Emotions & Faces',
    codepoint: '1f60d',
    unicodeChar: '😍',
    description: 'Animated in-love emoji face with pulsing red heart-shaped eyes and affectionate wide smile.',
    alt: 'Animated heart eyes emoji with a smiling yellow face on a transparent background',
    tags: ['love', 'heart eyes', 'crush', 'adoration', 'infatuation', 'sweet']
  },
  {
    id: 'crying-face',
    slug: 'animated-crying-loudly-emoji',
    name: 'Loudly Crying Face',
    shortName: 'Loudly Crying',
    category: 'emotions',
    categoryName: 'Emotions & Faces',
    codepoint: '1f62d',
    unicodeChar: '😭',
    description: 'Animated sobbing face with animated torrents of tears pouring down both cheeks.',
    alt: 'Animated loudly crying face emoji with streaming tears on transparent background',
    tags: ['cry', 'sad', 'sobbing', 'emotional', 'heartbroken', 'grief']
  },
  {
    id: 'surprised-face',
    slug: 'animated-surprised-face-emoji',
    name: 'Astonished Surprised Face',
    shortName: 'Astonished Face',
    category: 'emotions',
    categoryName: 'Emotions & Faces',
    codepoint: '1f632',
    unicodeChar: '😲',
    description: 'Animated shocked face with wide circular open mouth and raised eyebrows in sheer astonishment.',
    alt: 'Animated astonished surprised face emoji with open mouth on transparent background',
    tags: ['shocked', 'surprised', 'omg', 'astonished', 'gasp', 'unbelievable']
  },
  {
    id: 'thinking-face',
    slug: 'animated-thinking-face-emoji',
    name: 'Thinking Face with Hand on Chin',
    shortName: 'Thinking Face',
    category: 'emotions',
    categoryName: 'Emotions & Faces',
    codepoint: '1f914',
    unicodeChar: '🤔',
    description: 'Animated contemplative face stroking its chin in deep thought and curiosity.',
    alt: 'Animated thinking face emoji with hand on chin pondering on transparent background',
    tags: ['think', 'ponder', 'curious', 'wondering', 'idea', 'hmmm']
  },

  // 2. Hearts & Love
  {
    id: 'red-heart',
    slug: 'animated-red-heart-emoji',
    name: 'Classic Red Heart',
    shortName: 'Red Heart',
    category: 'hearts',
    categoryName: 'Hearts & Love',
    codepoint: '2764',
    unicodeChar: '❤️',
    description: 'Animated glowing red heart beating passionately with deep love, warmth and affection.',
    alt: 'Animated beating red heart emoji pulsing with love on transparent background',
    tags: ['heart', 'red heart', 'love', 'romance', 'valentine', 'passion']
  },
  {
    id: 'sparkling-heart',
    slug: 'animated-sparkling-heart-emoji',
    name: 'Sparkling Pink Heart',
    shortName: 'Sparkling Heart',
    category: 'hearts',
    categoryName: 'Hearts & Love',
    codepoint: '1f496',
    unicodeChar: '💖',
    description: 'Animated pink heart surrounded by twinkling golden stars and radiant magical glints.',
    alt: 'Animated sparkling pink heart emoji with twinkling glitter on transparent background',
    tags: ['sparkling heart', 'glitter', 'pink heart', 'crush', 'adorable', 'twinkle']
  },
  {
    id: 'growing-heart',
    slug: 'animated-growing-heart-emoji',
    name: 'Growing Beating Heart',
    shortName: 'Growing Heart',
    category: 'hearts',
    categoryName: 'Hearts & Love',
    codepoint: '1f497',
    unicodeChar: '💗',
    description: 'Animated expanding pink heart showing growing emotional affection and deeper bonds.',
    alt: 'Animated growing heart emoji radiating concentric waves on transparent background',
    tags: ['growing heart', 'heartbeat', 'expanding love', 'affection', 'care']
  },

  // 3. Gestures
  {
    id: 'thumbs-up',
    slug: 'animated-thumbs-up-emoji',
    name: 'Thumbs Up Approval Sign',
    shortName: 'Thumbs Up',
    category: 'gestures',
    categoryName: 'Gestures & Hands',
    codepoint: '1f44d',
    unicodeChar: '👍',
    description: 'Animated upward thumb gesture giving positive confirmation, approval and great job.',
    alt: 'Animated thumbs up hand gesture emoji signaling approval on transparent background',
    tags: ['thumbs up', 'like', 'approve', 'yes', 'awesome', 'good job']
  },
  {
    id: 'waving-hand',
    slug: 'animated-waving-hand-emoji',
    name: 'Waving Hand Greeting',
    shortName: 'Waving Hand',
    category: 'gestures',
    categoryName: 'Gestures & Hands',
    codepoint: '1f44b',
    unicodeChar: '👋',
    description: 'Animated hand waving side-to-side warmly saying hello, hi, welcome or goodbye.',
    alt: 'Animated waving hand emoji greeting hello and farewell on transparent background',
    tags: ['wave', 'hello', 'hi', 'goodbye', 'welcome', 'greet']
  },
  {
    id: 'clapping-hands',
    slug: 'animated-clapping-hands-emoji',
    name: 'Clapping Hands Applause',
    shortName: 'Clapping Hands',
    category: 'gestures',
    categoryName: 'Gestures & Hands',
    codepoint: '1f44f',
    unicodeChar: '👏',
    description: 'Animated clapping hands celebrating an achievement, applause, ovation and bravos.',
    alt: 'Animated clapping hands emoji giving enthusiastic applause on transparent background',
    tags: ['clap', 'applause', 'bravo', 'congratulations', 'praise', 'cheer']
  },
  {
    id: 'folded-hands',
    slug: 'animated-folded-hands-emoji',
    name: 'Folded Hands Namaste & Pray',
    shortName: 'Folded Hands',
    category: 'gestures',
    categoryName: 'Gestures & Hands',
    codepoint: '1f64f',
    unicodeChar: '🙏',
    description: 'Animated hands pressed together in respect, traditional Indian Namaste, gratitude and prayer.',
    alt: 'Animated folded hands Namaste emoji showing respect and gratitude on transparent background',
    tags: ['namaste', 'prayer', 'thank you', 'gratitude', 'blessing', 'respect']
  },

  // 4. Celebration
  {
    id: 'party-popper',
    slug: 'animated-party-popper-emoji',
    name: 'Party Popper Celebration',
    shortName: 'Party Popper',
    category: 'celebration',
    categoryName: 'Celebration & Events',
    codepoint: '1f389',
    unicodeChar: '🎉',
    description: 'Animated festive conical party horn exploding with colorful ribbons and fluttering confetti.',
    alt: 'Animated party popper emoji bursting with celebratory confetti on transparent background',
    tags: ['party', 'celebration', 'congrats', 'new year', 'festival', 'tada']
  },
  {
    id: 'birthday-cake',
    slug: 'animated-birthday-cake-emoji',
    name: 'Birthday Cake with Lit Candles',
    shortName: 'Birthday Cake',
    category: 'celebration',
    categoryName: 'Celebration & Events',
    codepoint: '1f382',
    unicodeChar: '🎂',
    description: 'Animated frosted celebratory birthday cake with flickering glowing candles.',
    alt: 'Animated birthday cake emoji with flickering lit candles on transparent background',
    tags: ['birthday', 'cake', 'celebrate', 'anniversary', 'sweet', 'party']
  },
  {
    id: 'confetti-ball',
    slug: 'animated-confetti-ball-emoji',
    name: 'Confetti Ball Explosion',
    shortName: 'Confetti Ball',
    category: 'celebration',
    categoryName: 'Celebration & Events',
    codepoint: '1f38a',
    unicodeChar: '🎊',
    description: 'Animated golden celebratory sphere opening and raining vibrant multi-colored streamer confetti.',
    alt: 'Animated confetti ball emoji raining streamers and party sparkles on transparent background',
    tags: ['confetti', 'festive', 'win', 'victory', 'carnival', 'gala']
  },

  // 5. Animals
  {
    id: 'cat-face',
    slug: 'animated-cat-face-emoji',
    name: 'Cute Whiskered Cat Face',
    shortName: 'Cat Face',
    category: 'animals',
    categoryName: 'Animals & Pets',
    codepoint: '1f431',
    unicodeChar: '🐱',
    description: 'Animated adorable kitten face winking playfully with twitching whiskers and perked ears.',
    alt: 'Animated cute cat face emoji with twitching whiskers on transparent background',
    tags: ['cat', 'kitten', 'meow', 'cute', 'pet', 'feline']
  },
  {
    id: 'dog-face',
    slug: 'animated-dog-face-emoji',
    name: 'Playful Dog Face',
    shortName: 'Dog Face',
    category: 'animals',
    categoryName: 'Animals & Pets',
    codepoint: '1f415',
    unicodeChar: '🐕',
    description: 'Animated friendly loyal dog wagging its tail with cheerful puppy energy.',
    alt: 'Animated playful dog emoji moving with cheerful puppy tail on transparent background',
    tags: ['dog', 'puppy', 'loyal', 'pet', 'canine', 'bark']
  },
  {
    id: 'panda-face',
    slug: 'animated-panda-face-emoji',
    name: 'Adorable Panda Face',
    shortName: 'Panda Face',
    category: 'animals',
    categoryName: 'Animals & Pets',
    codepoint: '1f43c',
    unicodeChar: '🐼',
    description: 'Animated fluffy black-and-white giant panda face blinking sweetly with round ears.',
    alt: 'Animated adorable panda face emoji blinking gently on transparent background',
    tags: ['panda', 'bear', 'cute', 'bamboo', 'adorable', 'wildlife']
  },
  {
    id: 'monkey-face',
    slug: 'animated-monkey-face-emoji',
    name: 'Cheeky Monkey Face',
    shortName: 'Monkey Face',
    category: 'animals',
    categoryName: 'Animals & Pets',
    codepoint: '1f435',
    unicodeChar: '🐵',
    description: 'Animated mischievous smiling monkey face wiggling its playful round ears.',
    alt: 'Animated cheeky monkey face emoji grinning mischievously on transparent background',
    tags: ['monkey', 'chimp', 'jungle', 'fun', 'playful', 'prank']
  },

  // 6. Nature
  {
    id: 'cherry-blossom',
    slug: 'animated-cherry-blossom-emoji',
    name: 'Blooming Cherry Blossom',
    shortName: 'Cherry Blossom',
    category: 'nature',
    categoryName: 'Nature & Flowers',
    codepoint: '1f338',
    unicodeChar: '🌸',
    description: 'Animated pink cherry blossom flower blooming gently with soft fluttering petals.',
    alt: 'Animated blooming cherry blossom flower emoji with pink petals on transparent background',
    tags: ['flower', 'blossom', 'spring', 'sakura', 'floral', 'botanical']
  },
  {
    id: 'leaf-fluttering',
    slug: 'animated-leaf-fluttering-emoji',
    name: 'Leaf Fluttering in Wind',
    shortName: 'Leaf in Wind',
    category: 'nature',
    categoryName: 'Nature & Flowers',
    codepoint: '1f343',
    unicodeChar: '🍃',
    description: 'Animated vibrant green leaves gently dancing and spiraling in a gentle springtime breeze.',
    alt: 'Animated fluttering green leaves emoji drifting in breeze on transparent background',
    tags: ['leaf', 'nature', 'wind', 'green', 'eco', 'organic', 'breeze']
  },
  {
    id: 'rainbow',
    slug: 'animated-rainbow-emoji',
    name: 'Vibrant Arc Rainbow',
    shortName: 'Rainbow',
    category: 'nature',
    categoryName: 'Nature & Flowers',
    codepoint: '1f308',
    unicodeChar: '🌈',
    description: 'Animated seven-color rainbow arching across the sky with soft glowing prism colors.',
    alt: 'Animated vibrant rainbow arc emoji glowing brightly on transparent background',
    tags: ['rainbow', 'colors', 'sky', 'pride', 'hope', 'weather', 'magic']
  },
  {
    id: 'glowing-star',
    slug: 'animated-glowing-star-emoji',
    name: 'Glowing Yellow Star',
    shortName: 'Glowing Star',
    category: 'nature',
    categoryName: 'Nature & Flowers',
    codepoint: '2b50',
    unicodeChar: '⭐',
    description: 'Animated five-point golden star radiating brilliant celestial light and cosmic energy.',
    alt: 'Animated glowing gold star emoji radiating light rays on transparent background',
    tags: ['star', 'gold star', 'shine', 'celestial', 'brilliant', 'rating', 'night']
  },

  // 7. Food & Drink
  {
    id: 'pizza-slice',
    slug: 'animated-pizza-slice-emoji',
    name: 'Cheesy Pizza Slice',
    shortName: 'Pizza Slice',
    category: 'food',
    categoryName: 'Food & Drink',
    codepoint: '1f355',
    unicodeChar: '🍕',
    description: 'Animated hot slice of pepperoni pizza with stretchable melted cheese and crisp crust.',
    alt: 'Animated hot pizza slice emoji with melted stretchy cheese on transparent background',
    tags: ['pizza', 'cheese', 'food', 'snack', 'delicious', 'italian']
  },
  {
    id: 'strawberry',
    slug: 'animated-strawberry-emoji',
    name: 'Fresh Red Strawberry',
    shortName: 'Strawberry',
    category: 'food',
    categoryName: 'Food & Drink',
    codepoint: '1f353',
    unicodeChar: '🍓',
    description: 'Animated plump ripe red strawberry glistening with fresh garden dew drops.',
    alt: 'Animated sweet red strawberry fruit emoji on transparent background',
    tags: ['strawberry', 'fruit', 'sweet', 'berry', 'fresh', 'healthy']
  },
  {
    id: 'shortcake',
    slug: 'animated-strawberry-cake-emoji',
    name: 'Strawberry Shortcake Slice',
    shortName: 'Cake Slice',
    category: 'food',
    categoryName: 'Food & Drink',
    codepoint: '1f370',
    unicodeChar: '🍰',
    description: 'Animated fluffy sponge cake slice filled with whipped cream and topped with fresh strawberry.',
    alt: 'Animated strawberry shortcake slice emoji with cream layers on transparent background',
    tags: ['cake', 'dessert', 'sweet', 'bakery', 'pastry', 'treat']
  },
  {
    id: 'hot-coffee',
    slug: 'animated-hot-coffee-emoji',
    name: 'Steaming Cup of Coffee',
    shortName: 'Hot Coffee',
    category: 'food',
    categoryName: 'Food & Drink',
    codepoint: '2615',
    unicodeChar: '☕',
    description: 'Animated white ceramic cup filled with aromatic hot coffee with rising steam tendrils.',
    alt: 'Animated hot coffee cup emoji with rising steam on transparent background',
    tags: ['coffee', 'tea', 'cafe', 'morning', 'beverage', 'hot drink', 'cozy']
  },

  // 8. Objects & Symbols
  {
    id: 'rocket-ship',
    slug: 'animated-rocket-emoji',
    name: 'Space Rocket Launch',
    shortName: 'Space Rocket',
    category: 'objects',
    categoryName: 'Objects & Symbols',
    codepoint: '1f680',
    unicodeChar: '🚀',
    description: 'Animated retro space rocket blasting off into orbit with glowing fiery booster exhaust.',
    alt: 'Animated space rocket emoji blasting off into orbit with flames on transparent background',
    tags: ['rocket', 'space', 'launch', 'startup', 'fast', 'blast off', 'growth']
  },
  {
    id: 'music-notes',
    slug: 'animated-music-notes-emoji',
    name: 'Musical Notes Floating',
    shortName: 'Music Notes',
    category: 'objects',
    categoryName: 'Objects & Symbols',
    codepoint: '1f3b6',
    unicodeChar: '🎶',
    description: 'Animated floating musical eighth notes bouncing to an upbeat rhythm and melody.',
    alt: 'Animated musical notes emoji floating in rhythmic melody on transparent background',
    tags: ['music', 'notes', 'song', 'melody', 'rhythm', 'audio', 'sound']
  },
  {
    id: 'light-bulb',
    slug: 'animated-light-bulb-emoji',
    name: 'Glowing Light Bulb Idea',
    shortName: 'Light Bulb',
    category: 'objects',
    categoryName: 'Objects & Symbols',
    codepoint: '1f4a1',
    unicodeChar: '💡',
    description: 'Animated illuminated light bulb flashing bright yellow with a eureka moment idea.',
    alt: 'Animated glowing light bulb emoji flashing with bright idea on transparent background',
    tags: ['light bulb', 'idea', 'creative', 'bright', 'innovation', 'smart']
  },

  // 9. Cool & Fun
  {
    id: 'sunglasses-cool',
    slug: 'animated-sunglasses-cool-emoji',
    name: 'Cool Smiling Face with Sunglasses',
    shortName: 'Cool Sunglasses',
    category: 'cool',
    categoryName: 'Cool & Trending',
    codepoint: '1f60e',
    unicodeChar: '😎',
    description: 'Animated ultra-confident smiling face sporting retro dark sunglasses with swagger.',
    alt: 'Animated cool face emoji wearing dark sunglasses with swagger on transparent background',
    tags: ['cool', 'sunglasses', 'chill', 'swag', 'boss', 'summer', 'confident']
  },
  {
    id: 'fire-flame',
    slug: 'animated-fire-flame-emoji',
    name: 'Blazing Fire Flame',
    shortName: 'Fire Flame',
    category: 'cool',
    categoryName: 'Cool & Trending',
    codepoint: '1f525',
    unicodeChar: '🔥',
    description: 'Animated blazing red and orange fire flicking furiously with heat, energy and lit vibes.',
    alt: 'Animated blazing fire flame emoji burning with bright embers on transparent background',
    tags: ['fire', 'flame', 'lit', 'hot', 'trending', 'blaze', 'energy']
  },
  {
    id: 'party-face',
    slug: 'animated-partying-face-emoji',
    name: 'Partying Face with Horn and Hat',
    shortName: 'Party Face',
    category: 'cool',
    categoryName: 'Cool & Trending',
    codepoint: '1f973',
    unicodeChar: '🥳',
    description: 'Animated ecstatic face blowing a party blower horn wearing a festive party hat and confetti.',
    alt: 'Animated partying face emoji blowing horn with party hat on transparent background',
    tags: ['party face', 'festive', 'cheer', 'celebration', 'birthday', 'fun']
  }
];

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function run() {
  const destDir = path.resolve('public/emojis');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  console.log(`Starting download of ${EMOJI_SPECS.length} animated emojis...`);
  const finalEmojis = [];

  for (const item of EMOJI_SPECS) {
    const webpUrl = `https://fonts.gstatic.com/s/e/notoemoji/latest/${item.codepoint}/512.webp`;
    const gifUrl = `https://fonts.gstatic.com/s/e/notoemoji/latest/${item.codepoint}/512.gif`;

    const webpFilename = `${item.slug}.webp`;
    const gifFilename = `${item.slug}.gif`;
    const stickerFilename = `${item.slug}-whatsapp-sticker.webp`;

    const webpPath = path.join(destDir, webpFilename);
    const gifPath = path.join(destDir, gifFilename);
    const stickerPath = path.join(destDir, stickerFilename);

    try {
      console.log(`Downloading ${item.shortName} (${item.codepoint})...`);
      const webpSize = await downloadFile(webpUrl, webpPath);
      const gifSize = await downloadFile(gifUrl, gifPath);

      // WhatsApp sticker: 512x512 transparent WebP under 500KB
      // Copy webp to sticker filename if under 500KB
      let stickerSupported = false;
      let stickerSize = 0;
      if (webpSize <= 500 * 1024) {
        fs.copyFileSync(webpPath, stickerPath);
        stickerSupported = true;
        stickerSize = webpSize;
      }

      finalEmojis.push({
        ...item,
        webpUrl: `/emojis/${webpFilename}`,
        gifUrl: `/emojis/${gifFilename}`,
        stickerUrl: stickerSupported ? `/emojis/${stickerFilename}` : null,
        webpSizeBytes: webpSize,
        gifSizeBytes: gifSize,
        stickerSizeBytes: stickerSize,
        width: 512,
        height: 512,
        isWhatsAppReady: stickerSupported
      });

      console.log(`  -> Saved: WebP (${(webpSize/1024).toFixed(1)} KB), GIF (${(gifSize/1024).toFixed(1)} KB), Sticker: ${stickerSupported ? 'YES' : 'NO'}`);
    } catch (e) {
      console.error(`  -> ERROR for ${item.shortName}: ${e.message}`);
    }
  }

  // Write TypeScript dataset: src/data/emojisData.ts
  const tsContent = `/**
 * IndiaTools — Animated Emoji Studio
 * Curated Collection of Authentic Animated Emojis
 * Sourced under Apache License 2.0 (Google Noto Color Emoji Animation)
 */

export interface AnimatedEmojiItem {
  id: string
  slug: string
  name: string
  shortName: string
  category: 'emotions' | 'hearts' | 'gestures' | 'celebration' | 'animals' | 'nature' | 'food' | 'objects' | 'cool'
  categoryName: string
  codepoint: string
  unicodeChar: string
  description: string
  alt: string
  tags: string[]
  webpUrl: string
  gifUrl: string
  stickerUrl: string | null
  webpSizeBytes: number
  gifSizeBytes: number
  stickerSizeBytes: number
  width: number
  height: number
  isWhatsAppReady: boolean
}

export const EMOJI_CATEGORIES = [
  { id: 'all', name: 'All Emojis', icon: 'Sparkles', count: ${finalEmojis.length} },
  { id: 'emotions', name: 'Emotions & Faces', icon: 'Smile', count: ${finalEmojis.filter(e => e.category === 'emotions').length} },
  { id: 'hearts', name: 'Hearts & Love', icon: 'Heart', count: ${finalEmojis.filter(e => e.category === 'hearts').length} },
  { id: 'gestures', name: 'Gestures & Hands', icon: 'ThumbsUp', count: ${finalEmojis.filter(e => e.category === 'gestures').length} },
  { id: 'celebration', name: 'Celebration & Events', icon: 'PartyPopper', count: ${finalEmojis.filter(e => e.category === 'celebration').length} },
  { id: 'animals', name: 'Animals & Pets', icon: 'Cat', count: ${finalEmojis.filter(e => e.category === 'animals').length} },
  { id: 'nature', name: 'Nature & Flowers', icon: 'Flower2', count: ${finalEmojis.filter(e => e.category === 'nature').length} },
  { id: 'food', name: 'Food & Drink', icon: 'Coffee', count: ${finalEmojis.filter(e => e.category === 'food').length} },
  { id: 'objects', name: 'Objects & Symbols', icon: 'Rocket', count: ${finalEmojis.filter(e => e.category === 'objects').length} },
  { id: 'cool', name: 'Cool & Trending', icon: 'Flame', count: ${finalEmojis.filter(e => e.category === 'cool').length} },
] as const

export const ANIMATED_EMOJIS: AnimatedEmojiItem[] = ${JSON.stringify(finalEmojis, null, 2)}
`;

  fs.writeFileSync(path.resolve('src/data/emojisData.ts'), tsContent, 'utf8');
  console.log(`\nSuccessfully downloaded ${finalEmojis.length} animated emojis and generated src/data/emojisData.ts!`);
}

run().catch(console.error);
