# Analyse de la vidéo de référence

Relevés faits sur le fichier fourni (720×1280, 50 fps, 1 min 09,8).

## Image

| Point | Relevé |
| --- | --- |
| Format | 9:16 vertical, 50 fps |
| Style | 2D vectoriel « flat » : aplats unis, contours noirs ~9 px, aucun dégradé ni ombre portée sur les objets |
| Palette | mur `#e8e39c`, bois `#755649`, table `#b27954`, peau `#edccb0`, t-shirt `#1ca597`, meuble `#c66843`, haut mamie `#c78cc5` |
| Personnages | tête ronde surdimensionnée, yeux = 2 points, bouche animée par substitution de formes, corps minuscule |
| Animation | pas de rig : bob rythmique, clignements, lip-sync par formes de bouche, légère poussée caméra |
| Détails de décor | mouchetures sur le papier peint, chaise à barreaux derrière les épaules, cartes posées sur la table |

## Son

Mesures sur la piste extraite (mono 22 kHz pour l'analyse, stéréo 44,1 kHz pour la largeur).

| Point | Relevé | Conséquence |
| --- | --- | --- |
| Nature | Dialogue, **pas une chanson** | l'animation suit la réplique, pas un beat |
| Répartition spectrale | sub 20-80 Hz : 1,6 % · basses : 7,4 % · médiums 250 Hz-2 kHz : 52,4 % · présence : 24,3 % | mix voix, pas de kick ni de 808 |
| Centroïde spectral | 2 100-2 700 Hz | voix très en avant, brillantes |
| Dynamique | RMS −14,1 dBFS, crête 0 dBFS, facteur de crête 14,1 dB | forte compression / limiteur |
| Silences numériques | 6,5-7,2 s · 9,2-10,7 s · 33,0-33,3 s · 66,4-66,8 s · 68,2-68,5 s | le blanc est un outil comique, pas un défaut |
| Nappe musicale | seulement par salves (stéréo large 0,27-0,47) : 14-30 s, 34-36 s, 52-56 s ; le reste est mono sec (largeur < 0,03) | la musique ponctue, elle ne porte pas |

## Écriture et sous-titres

Extraits relevés sur les sous-titres incrustés : « Kems ! » · « Ouiiiii ! » · « Vous avez vu le signe » ·
« Du coup / Faut qu'on change / de signe ? » · « Sauf le 22 du mois » · « Ca sent bon cette histoire » ·
« Mais je voulais juste montrer mon Choss » · « On va l'enterrer dans la cour » · « t'es pas content ».

- Répliques très courtes (1 à 5 mots), enchaînées en rafale, ton improvisé.
- Escalade absurde : on part d'une règle de jeu de cartes et on finit par enterrer quelqu'un dans la cour.
- Gag auto-référentiel sur la chaîne.
- Sous-titres : **une seule ligne**, sans-serif gras condensé, blanc, contour noir épais, légère ombre portée,
  bande vers y ≈ 160-210 (la position descend sur certains plans).
- **Chaque réplique apparaît avec un pop d'échelle** (~0,25 s, petit → grand). C'est ce qui donne le rythme visuel.
- Sous-titres présents environ 79 % du temps.

## Ce que la démo reprend

`scene.html` applique ces relevés : dialogue en répliques courtes avec vrais silences,
champ/contrechamp déclenché par le changement de locuteur, sous-titres une ligne avec pop
d'échelle, bouche fermée pendant les silences, palette et épaisseur de contour identiques.
