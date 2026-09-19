# Les vidéos de Robin — bible du format

## Le concept

**Robin est lâché dans une situation banale, et ça dérape par escalade absurde.**
Un lieu = un épisode. Sketch autonome, pas de série à suivre. Tout se joue au dialogue.

Le titre annonce le lieu : *Robin à la Poste*, *Robin chez le médecin*, *Robin à la salle de sport*.
C'est ce qui rend la chaîne lisible : le spectateur sait en trois mots ce qu'il va voir.

## Règles d'écriture

Relevées sur la vidéo de référence, puis tenues comme contraintes de production.

| Règle | Détail |
| --- | --- |
| Répliques courtes | 1 à 6 mots. Au-delà, ça traîne. |
| Rafale | Les échanges s'enchaînent sans respiration… |
| …sauf les silences | …et c'est justement le silence qui fait rire. Un blanc de 0,8 à 1,5 s après une réplique absurde. |
| Escalade | On part d'un problème banal et on finit ailleurs. Jamais de résolution. |
| Chute sèche | La dernière réplique ne conclut pas, elle enfonce. Puis silence sur la tête de Robin. |
| Pas de narrateur | Aucune voix off, aucune explication. |

**Structure type, 20 à 25 secondes :**

1. **Accroche (0-2 s)** — Robin énonce son problème. Une phrase.
2. **Refus (2-6 s)** — l'interlocuteur bloque, avec une logique administrative.
3. **Premier blanc** — Robin encaisse, plan fixe sur sa tête.
4. **Montée (6-16 s)** — trois allers-retours, chacun plus absurde que le précédent.
5. **Chute (16-20 s)** — l'interlocuteur balance l'énormité.
6. **Blanc final** — très gros plan sur Robin, yeux ronds. Fin.

## Grammaire visuelle

- Vertical 9:16, 720 × 1280, 25 i/s.
- Aplats unis, contour noir à **12 px** (≈ 3,3 % du diamètre de tête), aucun dégradé.
- Tête **parfaitement circulaire**, pas de cou : le crâne rentre dans le vêtement.
- Quatre échelles de plan : `wide` / `med` / `cu` / `xcu`. On coupe au changement de locuteur, jamais pendant un silence.
- Personnage animé **sur 2** (12,5 i/s), caméra lisse.
- Sous-titres une ligne, gras condensé blanc, contour noir, pop d'échelle à chaque réplique.
- Les yeux changent de nature selon l'émotion : points (neutre), grands ronds blancs (choc), paupières lourdes (colère, air narquois).

## Distribution

| Perso | Rôle | Design |
| --- | --- | --- |
| **Robin** | protagoniste, dans tous les épisodes | cheveux courts châtains avec raie, t-shirt rouge, jeune adulte |
| Interlocuteur | change à chaque épisode | agent, médecin, coach, voisin… |

Robin subit, il ne gagne jamais. C'est ce qui le rend attachant et ce qui permet de refaire l'épisode indéfiniment ailleurs.

## Produire un épisode

Un épisode = **un fichier** dans `episodes/`. Le moteur ne bouge pas.

```js
window.EPISODE = {
  id:'ep02-chez-le-medecin', title:'Robin chez le médecin', duration:22,
  chars:  { R:{...}, D:{...} },          // fiches perso
  decor:  { R:'cabinetPatient', D:'cabinetMedecin' },
  beats:  [ [t0,t1,'R','texte','med','flat',true], ... ]
};
```

```bash
node render.js ep02-chez-le-medecin out/ep02
ffmpeg -framerate 25 -i out/ep02/frames/%04d.png \
       -c:v libx264 -pix_fmt yuv420p -crf 19 -movflags +faststart ep02.mp4
```

Un rendu de 21 s prend environ une minute.

## Décors disponibles

`cuisine` · `frigo` · `posteClient` · `posteAgent`

Chaque nouveau lieu demande deux décors : celui derrière Robin, celui derrière son interlocuteur.
C'est ce qui fait tenir le champ/contrechamp.

## Idées d'épisodes

*Robin chez le médecin* · *Robin à la salle de sport* · *Robin chez le coiffeur* ·
*Robin au service client* · *Robin à la banque* · *Robin chez le garagiste* ·
*Robin au supermarché* · *Robin chez le dentiste*

## Ce qui appartient à la chaîne

Robin, son design, les décors et tous les textes sont originaux.
Ce qui est repris de la vidéo de référence, ce sont des **mesures** (contour, proportions,
palette, rythme) et un **format** — ni personnages, ni dialogues, ni contenu.

## Chaîne de production des voix

Les voix sont générées localement avec **Chatterbox Multilingual** (licence MIT,
donc utilisable commercialement) — aucun service, aucun crédit.

Le modèle n'est pas fiable tel quel en français : il lui arrive de continuer à
parler après la phrase, et sa hauteur de voix varie fortement d'une génération à
l'autre. Trois garde-fous, dans cet ordre :

1. **Validation par les syllabes** (`tools/cb_generate.py`) — on compte les syllabes
   du texte, on en déduit une durée attendue, et on rejette toute prise dont la
   parole dépasse 180 % de cette durée ou qui contient du son après un blanc de
   0,5 s. À chaque nouvel essai, `cfg_weight` monte : le modèle colle davantage au
   texte, au prix d'un peu d'expressivité. On garde le premier essai propre, donc
   toujours le réglage le plus expressif qui passe.
2. **Normalisation de hauteur** — chaque prise est transposée vers la hauteur
   cible de son personnage (Robin 150 Hz, l'agent 115 Hz, soit 4,5 demi-tons
   d'écart). Sans ça, chaque réplique sonne comme quelqu'un de différent.
3. **Compression et normalisation de niveau** — passe-haut à 80 Hz, compresseur,
   `loudnorm` à −17 LUFS. C'est ce qui donne le grain sec et dense de la référence.

Relevés sur le pilote :

| Mesure | Référence | Piper | Chatterbox retenu |
| --- | --- | --- | --- |
| Intonation (écart-type de hauteur) | 3,8 à 3,9 dt | 2,5 dt | **4,5 à 5,4 dt** |
| Dispersion de hauteur par personnage | — | — | 0,7 dt après normalisation |
| Écart entre les deux voix | — | — | 4,5 dt |

**Limite connue** : la transposition par rééchantillonnage déplace les formants.
Au-delà de 4 ou 5 demi-tons, le timbre se dégrade. La boucle vise donc des prises
dont la hauteur naturelle est déjà proche de la cible, plutôt que de transposer fort.
