/* ═══════════════════════════════════════════════════════════
   DATA.JS — All content, letters, timeline, photos
   ═══════════════════════════════════════════════════════════ */

/* ─── CONFIG ──────────────────────────────────────────────── */
const CONFIG = {
  yourName:        "Dewansh",
  herName:         "Shriyanshi",
  anniversaryDate: "2024-06-28",
  nextMeetingDate: "2026-06-03",
  privacyAnswer:   "1123",
  cassetteSongTitle: "Ehsaan Tera Hoga Mujh Par",
  ambientTrackTitle: "Pal Pal Dil Ke Paas",
  ambientArtist:    "for you, always",
  secretMessages: [
    "Okay okay, I miss you too. Get over here already! 🤍",
    "You literally cannot stop, can you? 😭 1123.",
    "I LOB U too. Always. Every single time.",
    "Alright, I counted. That's [N] times. You win. I miss you most.",
  ],
};

/* ─── TIMELINE DATA ─────────────────────────────────────── */
const TIMELINE_DATA = [
  {
    chapterLabel: "Chapter 1 · The Before",
    date: "Before it all",
    title: "Coaching Mates",
    caption: "We were in the same room for months, and somehow that was enough for a beginning. Coaching mates. Nothing more. And then — a farewell, and a group photo where I already knew you were different.",
    photo: "./assets/photos/timeline/01-coaching-farewell.jpg",
    polaroidCaption: "the room where it started",
  },
  {
    date: "28 May 2024",
    title: "The First Heart",
    caption: "There was a photo. I saw it. And I sent a heart — a small, quiet thing — not knowing it would become the opening line of the most important story of my life.",
    isTextOnly: true,
    specialIcon: "💛",
  },
  {
    chapterLabel: "Chapter 2 · Us",
    date: "28 June 2024",
    title: "I LOB U",
    caption: "Three words that changed everything. Not 'love', not properly spelt — just us being us, and meaning every letter of it. 28th June 2024. Our day.",
    isTextOnly: true,
    isAnniversary: true,
    specialIcon: "✦",
  },
  {
    date: "2024",
    title: "The Movie Date",
    caption: "Our first real date. A cinema, and probably the worst attempt at pretending I was calm. I don't even remember what the movie was. I just remember sitting next to you.",
    photo: "./assets/photos/timeline/03-movie-date.jpg",
    polaroidCaption: "our first date 🎬",
  },
  {
    date: "2024",
    title: "Your Birthday",
    caption: "A birthday photo — you, me, and the kind of happiness that shows up in photographs and stays. I'd like to be in every birthday photo of yours from now on.",
    photo: "./assets/photos/timeline/04-birthday-2024.jpg",
    polaroidCaption: "celebrating you 🎂",
  },
  {
    chapterLabel: "Chapter 3 · Closer",
    date: "11 January 2025",
    title: "First Hands Held",
    caption: "A coffee shop. January cold. And for the first time — hands that found each other and didn't let go. It was warm in there. Maybe it was the coffee. Probably it wasn't.",
    photo: "./assets/photos/timeline/05-11jan-coffee.jpg",
    polaroidCaption: "11.01.2025 ☕",
  },
  {
    date: "January 2025",
    title: "That Photo of You",
    caption: "There is a photo of you I keep coming back to. Just you, being yourself, not posing. You have no idea how much I love it. I'm not going to tell you which one — you'd get smug about it.",
    photo: "./assets/photos/timeline/06-her-fav-photo.jpg",
    polaroidCaption: "my favourite 🤍",
  },
  {
    date: "2025",
    title: "School Dress Days",
    caption: "School uniforms and us — there is something impossibly sweet about this photo. Two people in school dress, and somehow already living a story bigger than the place we were in.",
    photo: "./assets/photos/timeline/07-school-dress.jpg",
    polaroidCaption: "school days with you",
  },
  {
    date: "2025",
    title: "She Was Looking at Me",
    caption: "We were saying goodbye to our seniors and I was doing something forgettable. You were looking at me. I didn't know you were. Someone caught it in a photo. I'm so glad they did.",
    photo: "./assets/photos/timeline/08-farewell-seniors.jpg",
    polaroidCaption: "that look 🥺",
  },
  {
    chapterLabel: "Chapter 4 · Our Places",
    date: "March 2025",
    title: "Pizza Date",
    caption: "March, a pizza place, and a video I will watch when I'm old and need to remember what happiness felt like at 18. This one is saved forever.",
    video: "./assets/videos/pizza-date-march.mp4",
    isVideo: true,
    polaroidCaption: "pizza > everything 🍕",
  },
  {
    date: "2025",
    title: "THE COACHING",
    caption: "THE coaching. The place where this whole story started. Being back there with you — same walls, same chairs — but everything between us completely different. Full circle.",
    photo: "./assets/photos/timeline/10-the-coaching.jpg",
    polaroidCaption: "where it all began ✦",
  },
  {
    date: "2025",
    title: "Rain & A Softy",
    caption: "Project work, overcast sky, and you eating a softy in the rain with the most unbothered energy imaginable. This is one of my favourite memories. Don't ask me to explain it.",
    photo: "./assets/photos/timeline/11-rain-softy.jpg",
    polaroidCaption: "softy in the rain 🌧️",
  },
  {
    date: "2025",
    title: "The Mandir",
    caption: "We went to the mandir together. Quiet, early, the air smelling like flowers. I think I made a wish. I'm keeping it private. But I think it's coming true.",
    photo: "./assets/photos/timeline/12-mandir.jpg",
    polaroidCaption: "together at the mandir 🙏",
  },
  {
    date: "2025",
    title: "The Aesthetic Coffee Date",
    caption: "Low light, good coffee, and you across the table looking effortlessly like a photograph. I took note of everything about that evening. I still have those notes.",
    photo: "./assets/photos/timeline/13-coffee-aesthetic.jpg",
    polaroidCaption: "golden hour ☕",
  },
  {
    chapterLabel: "Chapter 5 · The Good Months",
    date: "5 September 2025",
    title: "Teacher's Day",
    caption: "Teacher's Day, a program, and photos I didn't know I needed until I had them. You make every ordinary school day feel like something worth saving.",
    photo: "./assets/photos/timeline/14-teachers-day.jpg",
    polaroidCaption: "teachers day 2025 🎓",
  },
  {
    date: "October 2025",
    title: "Garba Nights",
    caption: "Navratri. You in that outfit. The lights, the music, the spinning. There are good photos and one gloriously silly one. I am keeping all of them. Especially the silly one.",
    photo: "./assets/photos/timeline/15-garba.jpg",
    polaroidCaption: "garba 2025 ✨",
  },
  {
    date: "5 October 2025",
    title: "The Giant Wheel",
    caption: "You were terrified. You held on to me very tightly, which I would like to state for the record was completely fine with me. 47 seconds I'll remember forever.",
    video: "./assets/videos/giant-wheel.mp4",
    isVideo: true,
    polaroidCaption: "she held on tight 🎡",
  },
  {
    date: "2025",
    title: "A Friend's Birthday",
    caption: "Someone else's celebration, but we were there together, and that made it one of the better evenings of the year. Sometimes the best moments happen on borrowed days.",
    photo: "./assets/photos/timeline/17-friend-birthday.jpg",
    polaroidCaption: "borrowed happiness",
  },
  {
    chapterLabel: "Chapter 6 · Celebrating You",
    date: "11 November 2025",
    title: "Her Birthday",
    caption: "11th November. Your birthday. The day the world got you, and I think the world did very well. I want to be there for every one of these.",
    photo: "./assets/photos/timeline/18-her-birthday.jpg",
    polaroidCaption: "happy birthday 🎂 11.11",
  },
  {
    chapterLabel: "Chapter 7 · The Final Chapter (So Far)",
    date: "10 December 2025",
    title: "A December Together",
    caption: "December felt different this year. You were in it. That changes everything about a month.",
    isTextOnly: true,
    specialIcon: "🌙",
  },
  {
    date: "12 January 2026",
    title: "January Again",
    caption: "A year since the coffee shop. January keeps coming back, and every time it does, I like it a little more than I used to.",
    isTextOnly: true,
    specialIcon: "☕",
  },
  {
    date: "2026",
    title: "Scribble Day",
    caption: "Pens and uniforms and writing things on each other that are supposed to last. I hope what I wrote finds you well years from now, when you find that shirt again.",
    photo: "./assets/photos/timeline/21-scribble-day.jpg",
    polaroidCaption: "scribble day ✍️",
  },
  {
    date: "2026",
    title: "School Farewell",
    caption: "Formal clothes, cameras everywhere, a room full of people trying not to feel too much. And us — together in a photo that will somehow outlive the building.",
    photo: "./assets/photos/timeline/22-school-farewell.jpg",
    polaroidCaption: "farewell 🎓",
  },
  {
    date: "25 March 2026",
    title: "The Temple",
    caption: "March, the temple, and something quiet between us that didn't need words. Some moments are complete just as they are.",
    photo: "./assets/photos/timeline/23-temple-march.jpg",
    polaroidCaption: "25.03.2026 🙏",
  },
  {
    date: "2026",
    title: "One More Together",
    caption: "Another photo. Another ordinary day that wasn't ordinary at all. This is what I want to remember — not the big moments, just us, existing near each other.",
    photo: "./assets/photos/timeline/24-extra.jpg",
    polaroidCaption: "one more 🤍",
  },
  {
    date: "2026",
    title: "The Gift",
    caption: "I had something I'd been holding on to. I gave it to you. You held it the way you hold everything — carefully, warmly, like it matters. It does. You do.",
    photo: "./assets/photos/timeline/25-gift.jpg",
    polaroidCaption: "something for you 🎁",
  },
  {
    date: "The Last Time (For Now)",
    title: "The Last Meeting",
    caption: "The last photo — for now. Both of us knowing what 'for now' means and choosing to believe in it anyway. This is the one I'll look at when the days feel long. See you soon.",
    photo: "./assets/photos/timeline/26-last-meeting.jpg",
    polaroidCaption: "see you soon 🤍",
    isLast: true,
  },
  {
    chapterLabel: "Chapter 8 · Coming",
    date: "Soon...",
    title: "The Next Chapter",
    caption: "Every great story has chapters that haven't been written yet. Ours is no different. I don't know exactly what comes next — but I know who I want to be there for it.",
    polaroidCaption: "to be continued ✈️",
    isFuture: true,
  },
];

/* ─── EVENING WALK PHOTOS ───────────────────────────────── */
const EVENING_PHOTOS = [
  { src: "./assets/photos/polaroids/01-her-fav.jpg",           caption: "the photo that started everything 💛" },
  { src: "./assets/photos/polaroids/02-rain-softy.jpg",        caption: "softy in the rain 🌧️" },
  { src: "./assets/photos/polaroids/03-mandir.jpg",            caption: "together at the mandir 🙏" },
  { src: "./assets/photos/polaroids/04-coffee-aesthetic.jpg",  caption: "golden hour and good coffee ☕" },
  { src: "./assets/photos/polaroids/05-garba-silly.jpg",       caption: "garba chaos (the silly one) 😂" },
  { src: "./assets/photos/polaroids/08-garba-good.jpg",        caption: "garba nights ✨" },
];

/* ─── OPEN WHEN LETTERS ─────────────────────────────────── */
const OPEN_WHEN_LETTERS = [
  {
    label: "Open When...", sublabel: "you miss me",
    seal: "🤍", accentColor: "#B5451B",
    letter: {
      eyebrow: "A letter for when the distance feels heavy",
      title: "When You Miss Me",
      body: `<p>Then stop. Close your eyes. I need you to remember something specific.</p>
<p>Remember the coffee shop. 11th January 2025. That moment when hands found each other across the table and the room got very warm very suddenly. <em>That.</em> That is where I live when we're apart.</p>
<p>Missing someone means you had something real. And 28th June 2024 — that day we said those three very important, slightly misspelt words — proved that we very much do.</p>
<p>I'm not far. I'm just in the next scene. And the next scene is going to be so good.</p>`,
      signature: "Always yours, Krishna",
    }
  },
  {
    label: "Open When...", sublabel: "you're having a bad day",
    seal: "🌧️", accentColor: "#5B7FA6",
    letter: {
      eyebrow: "A letter for the hard days",
      title: "When Today is Being Mean to You",
      body: `<p>Okay. Let's talk about this. Whatever today threw at you — it is not a reflection of who you are.</p>
<p>I have watched you eat a softy in the rain during project work with the most unbothered energy I have ever seen in my life. I have watched you hold on for dear life on a giant wheel on 5th October and somehow still be the most entertaining person in the gondola. I have seen you in a garba outfit and I don't think the world deserves you, honestly.</p>
<p>One bad day doesn't touch any of that.</p>
<p><em>Also — I LOB U. Even on the bad days. Especially on the bad days.</em></p>`,
      signature: "Your biggest fan, K.",
    }
  },
  {
    label: "Open When...", sublabel: "you can't sleep",
    seal: "🌙", accentColor: "#6B4F8C",
    letter: {
      eyebrow: "A letter for 2am",
      title: "When the Night Feels Too Long",
      body: `<p>I've thought about this — the specific texture of not being able to sleep. How the ceiling looks different at 2am. How everything feels heavier and louder in the quiet.</p>
<p>I want you to know something I've never quite found the words for out loud: I knew. From the very first heart I sent on your photo — 28th May 2024 — I somehow already knew you were going to matter to me in a way nothing else did.</p>
<p>Close your eyes. Breathe slowly. The mandir, the coffee shop, the giant wheel, the pizza place — all of it is still there. All of it is still ours. I'm not going anywhere.</p>
<p><em>Go to sleep, love. You're okay. You're so much more than okay.</em></p>`,
      signature: "Goodnight 🌙  —K",
    }
  },
  {
    label: "Open When...", sublabel: "you need a laugh",
    seal: "😭", accentColor: "#D4A843",
    letter: {
      eyebrow: "A certified serotonin delivery",
      title: "An Urgent Message",
      body: `<p>I need to formally document something for the record:</p>
<p>On 5th October 2025, on a giant wheel, with a 47-second video as evidence, you — the most effortlessly cool person I know — held on to me for DEAR LIFE and I am NOT over it.</p>
<p>This video exists. I have it. It is archived. It is protected.</p>
<p>Also, the garba silly photo? The one where you know which one I mean? That one too. Also archived. Also protected.</p>
<p><em>You are, objectively, a menace. The most wonderful, most ridiculous, most mine menace there is.</em></p>`,
      signature: "Filed with love, K.",
    }
  },
  {
    label: "Open When...", sublabel: "you doubt yourself",
    seal: "⭐", accentColor: "#B5451B",
    letter: {
      eyebrow: "Read this very carefully",
      title: "When Your Brain Lies to You",
      body: `<p>Your brain is wrong. This is not my opinion. This is a fact.</p>
<p>I have watched you handle school, coaching, projects, farewells, boards, everything — and I have watched you do it while somehow remaining the most genuinely herself person in any room.</p>
<p>The school farewell photo. The scribble day. Teacher's Day. The mandir. The coffee dates. In every single one, you show up fully, warmly, without performing it.</p>
<p>That is who you actually are. The doubt you're feeling right now is just noise. The signal — you — is loud and clear and absolutely extraordinary.</p>
<p><em>I chose you. I would choose you again tomorrow. That's not sentiment. That's data.</em></p>`,
      signature: "Completely, K.",
    }
  },
  {
    label: "Open When...", sublabel: "the distance feels huge",
    seal: "✈️", accentColor: "#4A7C6F",
    letter: {
      eyebrow: "From wherever I am, to wherever you are",
      title: "Across the Distance",
      body: `<p>Here is what I do when I miss you: I go through photos. The coaching farewell. The movie. Your birthday. 11th January. The pizza place. The giant wheel. The garba. Your birthday again. Scribble day. Farewell. Temple. The last one.</p>
<p>That is a long list for two years. It is a beautiful, stupid-long list. And there are so many more to add.</p>
<p>The distance doesn't shrink what we have. If anything, every time I've been away from you, I've been more certain about this than I was before.</p>
<p><em>One day — and I mean this — we're going to have so much time together that we'll forget we ever spent any of it apart. We'll call this stretch "the before." And everything after it will be ours.</em></p>`,
      signature: "Missing you and meaning it, K.",
    }
  },
  {
    label: "Open When...", sublabel: "you want to dance",
    seal: "💃", accentColor: "#C47A1E",
    letter: {
      eyebrow: "Mandatory dancing instructions enclosed",
      title: "A Dance Request",
      body: `<p>I have seen you at garba. I know what you're capable of.</p>
<p>Put a song on. The one we'd choose if we were in a small room somewhere with no one watching. Close your eyes. Imagine the lights are low and it's just us and we have nowhere to be.</p>
<p>That's the scene I keep. The one we haven't had yet — a kitchen somewhere, a song playing, the two of us dancing for absolutely no one.</p>
<p><em>Save me a dance. I'll be the one who's enthusiastic but not technically impressive.</em></p>
<p>Actually, you already know that. You've seen the evidence.</p>`,
      signature: "Save me one, K.",
    }
  },
  {
    label: "Open When...", sublabel: "it's our anniversary ✨",
    seal: "🥂", accentColor: "#D4A843",
    isSpecial: true,
    letter: {
      eyebrow: "28th June. Two years.",
      title: "Our Anniversary",
      body: `<p>28th June 2024. Three words — "I LOB U" — and everything changed.</p>
<p>Two years looks like this from where I'm standing: a coaching farewell group photo. A heart on a photo. A movie we weren't really watching. A birthday. A coffee shop on 11th January. Hands held for the first time. School uniforms. A seniors farewell where you were looking at me and I didn't know. Pizza. THE COACHING. Rain and softies. A mandir. Garba nights. A giant wheel with a 47-second video I am never deleting. Your birthday. Scribble day. School farewell. A temple in March. And a last photo, for now, with a gift you're holding and a look I will keep forever.</p>
<p>That is two years. That is us. That is the most beautiful collection of ordinary, extraordinary, completely-ours moments I have ever been part of.</p>
<p>Happy anniversary, Shriyanshi. Here's to every chapter we haven't written yet. I want all of them. With you.</p>
<p><em>I LOB U. Always. And I mean every letter of it.</em></p>`,
      signature: "Yours, completely. — Krishna 🤍",
    }
  },
];
