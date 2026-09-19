/* Les vidéos de Robin — épisode 01 : « Robin à la Poste »
   Voix : Chatterbox Multilingual (MIT), validées et normalisées.
   Timeline générée depuis les durées réelles — ne pas éditer les temps à la main. */
window.EPISODE = {
  id: 'ep01-la-poste', title: 'Robin à la Poste', duration: 24.51, audio: 'ep01_voix.wav',
  chars: {
    R: { name:'Robin',   skin:'#edccb0', top:'#d9534f', hair:{style:'cap', color:'#6b4a32', part:0.09},
         glasses:false, wrinkles:false, mouthY:648, prop:'phone' },
    S: { name:"l'agent", skin:'#dcb797', top:'#3f6fa8', hair:{style:'mop', color:'#3a2a1e'},
         glasses:true,  wrinkles:false, mouthY:648, prop:'paper' }
  },
  decor: { R:'posteClient', S:'posteAgent' },
  beats: [
    [0.4, 1.42, "R", "Je viens chercher un colis", "med", "flat", true],
    [1.67, 4.03, "S", "Vous avez l'avis de passage", "cu", "flat", false],
    [4.03, 4.98, "R", null, "xcu", "shock", false],
    [4.98, 8.58, "R", "On m'a rien laissé", "med", "flat", false],
    [8.83, 11.47, "S", "Alors il est pas arrivé", "cu", "smug", false],
    [11.47, 12.42, "R", null, "xcu", "shock", false],
    [12.42, 13.76, "R", "Le suivi dit livré", "med", "angry", true],
    [14.01, 15.97, "S", "Le suivi se trompe jamais", "cu", "smug", false],
    [15.97, 17.02, "R", null, "xcu", "shock", false],
    [17.02, 17.97, "R", "Donc il est arrivé", "med", "flat", false],
    [18.22, 19.44, "S", "Je viens de vous dire que non", "cu", "angry", true],
    [19.44, 20.49, "R", null, "xcu", "shock", false],
    [20.49, 21.39, "R", "Vous avez dit les deux", "med", "flat", false],
    [21.64, 23.01, "S", "Guichet suivant", "cu", "smug", true],
    [23.01, 24.51, "R", null, "xcu", "shock", false]
  ]
};
