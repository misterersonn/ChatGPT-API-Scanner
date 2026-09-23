# Test Higgsfield — prêt à lancer

## État

Bloqué. La soumission renvoie :

```
submission_failed — Requires basic plan or higher.
```

`balance` → `{"credits": 0, "subscription_plan_type": "free"}`.

Ce n'est pas un manque de crédits : la génération est fermée au plan gratuit.
Il faut un plan **Basic** ou supérieur sur higgsfield.ai. Une fois le plan actif,
l'appel ci-dessous part tel quel.

## Appel préparé

Modèle `recraft_v4_1` en mode vectoriel, palette relevée sur la vidéo de référence
et imposée au modèle (c'est ce paramètre qui empêche la dérive de couleur) :

```json
{
  "model": "recraft_v4_1",
  "aspect_ratio": "9:16",
  "model_type": "vector",
  "resolution": "1k",
  "background_color": "#e8e39c",
  "colors": ["#e8e39c","#c66843","#755649","#b27954","#edccb0",
             "#1ca597","#f3e5b0","#fdfdfd","#e8c34a","#000000"],
  "prompt": "Flat vector cartoon illustration, thick uniform black outlines, solid flat colour fills, absolutely no gradients and no shading. A bald man with an oversized perfectly round head and two tiny black dot eyes, sitting on a wooden ladder-back chair at a kitchen table, holding a fan of playing cards in front of him. He wears a plain teal green t-shirt. Behind him a pale yellow speckled wallpaper, a red-orange wall cupboard on the left, a brown wooden dresser with small round knobs on the right. Playing cards scattered on the brown table in the foreground. Vertical composition, character centred, naive childlike cartoon style."
}
```

`colors` accepte 10 couleurs maximum — d'où la sélection ci-dessus. `#c78cc5`
(haut de mamie) est à substituer à `#e8c34a` pour les plans côté mamie.

## Suite du pipeline, une fois le plan actif

| Étape | Outil Higgsfield |
| --- | --- |
| Persos et décors en aplat vectoriel | `recraft_v4_1` (`model_type: vector`) |
| Cohérence des personnages entre plans | workflow `character-sheet`, preset 2D |
| Voix françaises | `create_voice` / workflow `narrator` |
| Sous-titres calés sur la voix | workflow `subtitles` (timing Whisper) |
| Montage final | workflow `video-editing`, ou ffmpeg |

L'animation elle-même reste dans `scene.js` : c'est le seul maillon qui garantit
un lip-sync à l'image près et une épaisseur de trait constante.

`style_reference.png` est la planche à fournir comme référence de style à
`character-sheet`.
