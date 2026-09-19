/* Les vidéos de Robin — épisode 01 : « Robin à la Poste »
   Timeline recalée sur les durées réelles de la piste voix (ep01_voix.wav).
   Généré par retime.py — ne pas éditer les temps à la main. */
window.EPISODE = {
  id: 'ep01-la-poste',
  title: 'Robin à la Poste',
  duration: 21.08,
  audio: 'ep01_voix.wav',

  chars: {
    R: { name:'Robin',   skin:'#edccb0', top:'#d9534f', hair:{style:'cap', color:'#6b4a32', part:0.09},
         glasses:false, wrinkles:false, mouthY:648, prop:'phone' },
    S: { name:"l'agent", skin:'#dcb797', top:'#3f6fa8', hair:{style:'mop', color:'#3a2a1e'},
         glasses:true,  wrinkles:false, mouthY:648, prop:'paper' }
  },

  decor: { R:'posteClient', S:'posteAgent' },

  beats: [
    [0.4, 2.08, "R", "Je viens chercher un colis", "med", "flat", true],
    [2.28, 3.68, "S", "Vous avez l'avis de passage", "cu", "flat", false],
    [3.68, 4.58, "R", null, "xcu", "shock", false],
    [4.58, 5.82, "R", "On m'a rien laissé", "med", "flat", false],
    [6.02, 7.25, "S", "Alors il est pas arrivé", "cu", "smug", false],
    [7.25, 8.15, "R", null, "xcu", "shock", false],
    [8.15, 9.7, "R", "Le suivi dit livré", "med", "angry", true],
    [9.9, 11.54, "S", "Le suivi se trompe jamais", "cu", "smug", false],
    [11.54, 12.54, "R", null, "xcu", "shock", false],
    [12.54, 14.1, "R", "Donc il est arrivé", "med", "flat", false],
    [14.3, 15.66, "S", "Je viens de vous dire que non", "cu", "angry", true],
    [15.66, 16.66, "R", null, "xcu", "shock", false],
    [16.66, 18.39, "R", "Vous avez dit les deux", "med", "flat", false],
    [18.59, 19.68, "S", "Guichet suivant", "cu", "smug", true],
    [19.68, 21.08, "R", null, "xcu", "shock", false]
  ]
};
