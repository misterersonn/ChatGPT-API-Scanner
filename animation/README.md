# Les vidéos de Robin — chaîne d'animation 2D

Chaîne de sketchs animés au format vertical. Un moteur de rendu déterministe,
des décors, et un fichier par épisode.

**Lire d'abord : [`CONCEPT.md`](CONCEPT.md)** — le format, les règles d'écriture
et la marche à suivre pour produire un épisode.

| Fichier | Rôle |
| --- | --- |
| `engine.js` | Le moteur : personnages, visèmes, expressions, décors, caméra, sous-titres. `drawFrame(n)` est déterministe. |
| `player.html` | Lecture temps réel. `player.html?ep=ep01-la-poste`. |
| `episodes/*.js` | Un épisode = un fichier de données. |
| `render.js` | Capture image par image via Chromium. `node render.js <episode> <dossier>`. |
| `ep01-la-poste.mp4` | Le pilote : 720×1280, 25 i/s, 21 s, muet. |
| `sheet.html` + `render_sheet.js` | Planche de référence → `style_reference.png`. |
| `robin.html` + `render_robin.js` | Pistes de design pour Robin → `robin_pistes.png`. |
| `ANALYSE.md` | Relevés image et son faits sur la vidéo de référence. |
| `HIGGSFIELD.md` | Appel Recraft préparé, et état du blocage côté plan. |
| `scene.html`, `demo_animation.mp4` | Le prototype d'origine, conservé. |

## Rendre le pilote

```bash
npm i playwright
node render.js ep01-la-poste out/ep01
ffmpeg -framerate 25 -i out/ep01/frames/%04d.png \
       -c:v libx264 -pix_fmt yuv420p -crf 19 -movflags +faststart ep01-la-poste.mp4
```

## Ajouter le son

Le rendu est muet. Une fois les voix enregistrées :

```bash
ffmpeg -i ep01-la-poste.mp4 -i voix.wav -c:v copy -c:a aac -shortest final.mp4
```
