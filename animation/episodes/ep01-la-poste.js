/* Les vidéos de Robin — épisode 01 : « Robin à la Poste »
   Un épisode = ce fichier. Le moteur (engine.js) ne bouge pas.
   beats : [t0, t1, qui, texte|null, plan, émotion, accent]
           une entrée sans texte est un silence tenu à l'image. */
window.EPISODE = {
  id: 'ep01-la-poste',
  title: 'Robin à la Poste',
  duration: 21,

  chars: {
    R: { name:'Robin',   skin:'#edccb0', top:'#d9534f', hair:{style:'cap', color:'#6b4a32', part:0.09},
         glasses:false, wrinkles:false, mouthY:648, prop:'phone' },
    S: { name:"l'agent", skin:'#dcb797', top:'#3f6fa8', hair:{style:'mop', color:'#3a2a1e'},
         glasses:true,  wrinkles:false, mouthY:648, prop:'paper' }
  },

  decor: { R:'posteClient', S:'posteAgent' },

  beats: [
    [ 0.4,  1.7, 'R', 'Je viens chercher un colis',   'med', 'flat',  true ],
    [ 1.9,  3.2, 'S', "Vous avez l'avis de passage",  'cu',  'flat',  false],
    [ 3.2,  4.1, 'R', null,                           'xcu', 'flat',  false],
    [ 4.1,  5.4, 'R', "On m'a rien laissé",           'med', 'flat',  false],
    [ 5.6,  7.0, 'S', "Alors il est pas arrivé",      'cu',  'smug',  false],
    [ 7.0,  7.9, 'R', null,                           'cu',  'shock', false],
    [ 7.9,  9.3, 'R', 'Le suivi dit livré',           'med', 'angry', true ],
    [ 9.5, 11.0, 'S', 'Le suivi se trompe jamais',    'cu',  'smug',  false],
    [11.0, 12.0, 'R', null,                           'xcu', 'shock', false],
    [12.0, 13.5, 'R', 'Donc il est arrivé',           'med', 'flat',  false],
    [13.7, 15.4, 'S', 'Je viens de vous dire que non','cu',  'angry', true ],
    [15.4, 16.4, 'R', null,                           'xcu', 'shock', false],
    [16.6, 18.1, 'R', 'Vous avez dit les deux',       'med', 'flat',  false],
    [18.3, 19.7, 'S', 'Guichet suivant',              'cu',  'smug',  true ],
    [19.7, 21.0, 'R', null,                           'xcu', 'shock', false]
  ]
};
