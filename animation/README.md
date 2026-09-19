# Démo d'animation 2D « flat cartoon »

Reproduction du style de la vidéo de référence (format vertical 9:16, aplats de
couleur, contours noirs épais, personnage à grosse tête ronde, sous-titres
incrustés) avec une chaîne entièrement reproductible.

## Contenu

| Fichier | Rôle |
| --- | --- |
| `scene.html` | Toute l'animation : décor, chaise, personnage, lip-sync, sous-titres. `drawFrame(n)` est déterministe. |
| `render.js` | Capture image par image via Chromium (Playwright) puis séquence PNG. |
| `demo_animation.mp4` | Rendu : 720×1280, 25 fps, 15 s, muet. |
| `subtitles.srt` | Timeline du dialogue exportée depuis `scene.html`. |
| `ANALYSE.md` | Relevés image + son faits sur la vidéo de référence. |

## Rendu

```bash
npm i playwright            # ou NODE_PATH vers une install globale
node render.js out          # écrit out/frames/0000.png ...
ffmpeg -framerate 25 -i out/frames/%04d.png \
       -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart demo_animation.mp4
```

Ouvrir `scene.html` dans un navigateur donne la lecture temps réel, pratique
pour régler le timing avant de lancer un rendu.

## Où modifier quoi

- **Palette** : constante `COL` en haut de `scene.html`.
- **Décor** : `drawBackground()` (meubles, carrelage, mouchetures du papier peint).
- **Chaise** : `drawChair()` — montants + barreaux, dessinée derrière le personnage.
- **Personnage** : `drawCharacter()` — tête, yeux, sourcils, bouche.
- **Timeline** : tableau `BEATS` — `[début, fin, qui, texte|null, plan, émotion, accent]`.
  Une entrée sans texte est un silence tenu à l'image. C'est le seul endroit à
  éditer pour changer le contenu du sketch.
- **Échelles de plan** : objet `SHOTS` — `wide` / `med` / `cu` / `xcu`, chacun
  avec son échelle, son point de visée et son inclinaison.
- **Lip-sync** : `visemeTrack()` convertit le texte en suite de visèmes
  (voyelles ouvertes, `m/b/p` bouche fermée, consonnes mi-ouvertes) répartis sur
  la durée de la réplique ; `mouthShape()` les dessine par **substitution**, pas
  par morphing. Pour caler sur une vraie voix, remplacer la répartition régulière
  par les temps issus d'un alignement forcé sur l'audio.
- **Expressions** : `drawEyes()` / `drawBrows()` — `flat`, `happy`, `angry`,
  `shock`, `smug`. Les yeux changent de nature selon l'émotion (points, grands
  ronds blancs, paupières lourdes), comme dans la référence.
- **Mécanique d'animation** : le personnage est animé **sur 2** (12,5 i/s) via
  `STEP`, la caméra reste lisse. Respiration, appui corporel, hochement de tête
  par syllabe et anticipation en début de réplique sont calculés dans `draw()`.
- **Sous-titres** : `drawSubtitle()` — une ligne, condensée, contour noir, pop
  d'échelle à chaque réplique, mise à l'échelle automatique pour ne jamais déborder.
- **Durée / cadence** : `DURATION` et `FPS`.

## Ajouter le son

Le rendu est muet. Une fois la piste audio disponible :

```bash
ffmpeg -i demo_animation.mp4 -i voix.wav -c:v copy -c:a aac -shortest final.mp4
```
