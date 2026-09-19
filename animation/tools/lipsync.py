#!/usr/bin/env python3
"""Calcule une piste de bouche calee sur l'audio reel de chaque replique.

Avant : les visemes etaient repartis uniformement sur la duree de la replique.
Resultat : la bouche ne tombait jamais sur les syllabes. C'est ce qui donnait
l'impression de desynchronisation.

Ici on lit l'enveloppe d'energie du fichier voix, on y detecte les noyaux de
syllabes (les pics), et on place les voyelles dessus. Entre les pics, la bouche
se referme. Hors parole, elle est fermee.

Sortie : une chaine, un caractere par image a 25 i/s, rangee en 8e position
du beat. Le moteur la lit directement.
"""
import numpy as np, warnings
from scipy.io import wavfile
warnings.filterwarnings('ignore')

FPS = 25
VOW = 'aeiouyàâäéèêëîïôöùûü'

def viseme_sequence(text):
    """Texte -> suite de visemes, en distinguant voyelles et consonnes."""
    s = text.lower()
    seq, i = [], 0
    while i < len(s):
        ch = s[i]
        if ch == ' ':
            i += 1; continue
        if ch in VOW:
            j = i
            while j < len(s) and s[j] in VOW: j += 1
            h = s[i]
            v = ('A' if h in 'aàâä' else 'E' if h in 'eéèêë'
                 else 'I' if h in 'iîïy' else 'O' if h in 'oôö' else 'U')
            seq.append(('V', v)); i = j; continue
        if ch in 'mbp':   seq.append(('C', 'M'))
        elif ch in 'fv':  seq.append(('C', 'F'))
        elif ch.isalpha(): seq.append(('C', 'C'))
        i += 1
    return seq

def track(wav_path, text):
    sr, x = wavfile.read(wav_path)
    x = x.astype(np.float32)
    if np.max(np.abs(x)) > 2: x /= 32768.
    if x.ndim > 1: x = x.mean(axis=1)

    hop = max(1, sr // FPS)
    n = len(x) // hop
    env = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) for i in range(n)])
    if not len(env) or env.max() <= 0:
        return '.' * max(n, 1)
    e = env / env.max()
    voiced = e > 0.10

    # noyaux de syllabes : maxima locaux espaces d'au moins 3 images (120 ms)
    peaks = []
    for i in range(1, len(e) - 1):
        if e[i] >= e[i-1] and e[i] > e[i+1] and e[i] > 0.28:
            if not peaks or i - peaks[-1] >= 3: peaks.append(i)
    if not peaks:
        peaks = [int(np.argmax(e))]

    vowels = [v for kind, v in viseme_sequence(text) if kind == 'V'] or ['A']
    # une voyelle par pic ; si les comptes different, on etire la suite
    peak_vow = [vowels[min(len(vowels)-1, int(round(j*(len(vowels)-1)/max(1,len(peaks)-1))))]
                for j in range(len(peaks))]

    out = []
    for i in range(len(e)):
        if not voiced[i]:
            out.append('.'); continue
        d = [abs(i-p) for p in peaks]
        k = int(np.argmin(d))
        if d[k] <= 1:        out.append(peak_vow[k])   # sur la syllabe : voyelle ouverte
        elif e[i] > 0.35:    out.append('C')           # transition : mi-ouverte
        else:                out.append('M')           # fin de mot : presque fermee
    return ''.join(out)

if __name__ == '__main__':
    print(__doc__)
