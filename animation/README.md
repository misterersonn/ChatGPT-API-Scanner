# Démo d'animation 2D « flat cartoon »

Reproduction du style de la vidéo de référence (format vertical 9:16, aplats de
couleur, contours noirs épais, personnage à grosse tête ronde, sous-titres
incrustés) avec une chaîne entièrement reproductible.

## Contenu

| Fichier | Rôle |
| --- | --- |
| `scene.html` | Toute l'animation : décor, chaise, personnage, lip-sync, sous-titres. `drawFrame(n)` est déterministe. |
| `render.js` | Capture image par image via Chromium (Playwright) puis séquence PNG. |
| `demo_animation.mp4` | Rendu : 720×1280, 25 fps, 10 s, muet. |

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
- **Lip-sync** : l'ouverture de bouche est calculée dans `draw()`. Pour un vrai
  calage sur une voix, remplacer la salve pseudo-aléatoire par une liste
  `[temps, ouverture]` issue de l'analyse de la piste audio.
- **Sous-titres** : tableau `SUBS` — `[début, fin, texte]`, mise à l'échelle
  automatique pour ne jamais déborder du cadre.
- **Durée / cadence** : `DURATION` et `FPS`.

## Ajouter le son

Le rendu est muet. Une fois la piste audio disponible :

```bash
ffmpeg -i demo_animation.mp4 -i voix.wav -c:v copy -c:a aac -shortest final.mp4
```
