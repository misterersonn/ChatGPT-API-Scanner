#!/usr/bin/env python3
"""Recale un episode sur les durees reelles de ses fichiers voix.

Entree  : un dossier de wav numerotes (01.wav, 02.wav, ...) + la liste LINES ci-dessous.
Sortie  : episodes/<id>.js avec des temps exacts, et <id>_voix.wav (piste mixee).

Pourquoi : les temps ecrits a la main sont des estimations. Une fois les voix
enregistrees ou generees, c'est la voix qui doit commander la timeline, pas l'inverse.
"""
import wave, numpy as np, json, sys, os

SR = 44100

def load(f):
    w = wave.open(f); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.
    if w.getnchannels() == 2:
        x = x.reshape(-1, 2).mean(axis=1)
    if sr != SR:
        n = int(len(x) * SR / sr)
        x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)
    peak = np.max(np.abs(x)) or 1.0
    return x / peak * 0.82                 # niveau homogene d'une replique a l'autre

def build(lines, voice_dir, start=0.4):
    t = start; beats = []; placed = []
    for num, who, txt, shot, emo, emph, gap in lines:
        x = load(os.path.join(voice_dir, f'{num}.wav'))
        d = len(x) / SR
        beats.append([round(t, 2), round(t + d, 2), who, txt, shot, emo, emph])
        placed.append((t, x)); t += d
        if gap >= 0.8:                      # un vrai blanc devient un plan de reaction
            beats.append([round(t, 2), round(t + gap, 2), 'R', None, 'xcu', 'shock', False])
        t += gap
    return beats, placed, round(t, 2)

def write_track(placed, duration, out):
    track = np.zeros(int(duration * SR) + SR // 2, dtype=np.float32)
    for start, x in placed:
        i = int(start * SR); track[i:i + len(x)] += x
    track = np.clip(track, -1, 1)
    w = wave.open(out, 'w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((track * 32767).astype(np.int16).tobytes()); w.close()

if __name__ == '__main__':
    print(__doc__)
