// CONFIG.JS - ALL EDITABLE CONTENT LIVES HERE
// Change these values to customize the digital gift for your boyfriend

const CONFIG = {
  // Names
  hisName: "Akshat Aryan", // <-- CHANGE TO HIS NAME
  myName: "Kriti Sagar",       // <-- CHANGE TO YOUR NAME
  
  // Password lock
  password: "2005",          // <-- CHANGE TO 4-DIGIT PASSWORD (numbers only)
  
  // Screen 2 - Intro text
  screen2Text: " Hey my cutie pie! I made the tiniest bit of extra love just for you today~ Are ya excited?", // <-- CHANGE TEXT
  
  // Bouquet images - relative paths (browsers can't load C:\ absolute paths)
  bouquetImages: [
    "assets/photos/bouquet1.jpg",  // copied from "images f1.jpg"
    "assets/photos/bouquet2.jpg",  // copied from "images f2.jpg"
    "assets/photos/bouquet3.webp"  // copied from "9e09899d9d010579187d39861894ff0b f3.webp"
  ],
  
  // Bouquet notes - shown after clicking each bouquet
  bouquetNotes: [
    "Mwah~ You make my whole world bloom into the fluffiest flowers ever! I love youuu so much!", // <-- CHANGE BOUQUET 1 NOTE
    "Every day with you is like frolicking in the cutest flower garden! You're my lil sunshine~",   // <-- CHANGE BOUQUET 2 NOTE
    "You're my prettiest little bloom in this entire universe~ Happy Boyfriend's Day, my cutieeee!" // <-- CHANGE BOUQUET 3 NOTE
  ],
  
  // Music player
  music: {
    title: "Saiyaara Reprise (Female Version)",  // <-- SONG TITLE
    filePath: "assets/music/Saiyaara%20Reprise%20(Female%20Version)_320(KoshalWorld.Com).mp3", // <-- RELATIVE PATH TO THE MP3
    albumArt: "assets/photos/album-art.jpg" // <-- CHANGE ALBUM ART (add a file at this path)
  },
  
  // Love letter (Screen 5)
  letterText: `My Dearest Hubby...,

Heheee~ my sweetest boy...

You make every single day the CUTEST day ever just by being you! Your laugh is my most favoritest sound in the entire fluffy universe, and your hugs are my comfiest little safe bubble everrr.

Thank you for being my safe space, my adventure buddy, my biggest cheerleader, and my home sweet home~ Being with you is pure magic and I feel the luckiest lil bean to get to love youuu!

I hope today is as squishably amazing as YOU are, my cutie pie! You deserve the whole universe, all the bunnies, all the strawberries and SO much more~ Happy Boyfriend's Day, my love!

Love always,
Your wifey `, // <-- CHANGE LETTER TEXT (you can use line breaks as shown)
  
  // Photo gallery captions (Screen 6) - 3 photos
  galleryCaptions: [
    "My Comfy Home~",      // <-- CAPTION FOR PHOTO 1
    "My Lil Cutie~",      // <-- CAPTION FOR PHOTO 2
    "My Whole World~"     // <-- CAPTION FOR PHOTO 3
  ],
  
  // Photo paths (Screen 6 - gallery)
  galleryPhotos: [
    "assets/photos/photo1.jpg", // Snapchat-1571583298.jpg
    "assets/photos/photo2.jpg", // IMG-20260418-WA0003.jpg
    "assets/photos/photo3.jpg"  // IMG_20260222_085644.jpg
  ],
  
  // Screen 7 - Certificate
  certificateText: "BEST BOYFRIEND AWARD", // <-- CHANGE CERTIFICATE TITLE
  congratulationsText: "Congratulations",   // <-- CHANGE TEXT
  circularPhoto: "assets/photos/circle.jpg", // Snapchat-1129878082.jpg (certificate circle)
  
  // Screen 8 - Final message
  finalMessage: "Happy Boyfriend's Day, my cutie pieee~! You make my world the fluffiest and cutest everrr! I love youuu to the moon & back & to the stars & back!!", // <-- CHANGE FINAL MESSAGE
};

// Export for use in script.js
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
