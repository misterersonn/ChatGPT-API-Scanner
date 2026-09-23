"""Genere chaque replique et la VALIDE. Recommence tant qu'elle est ratee.

Chatterbox derape souvent en francais : il continue a parler apres la phrase.
On mesure donc la duree de parole reelle et on la compare au nombre de syllabes.
Une prise n'est gardee que si elle tient dans l'enveloppe attendue.
cfg_weight monte a chaque essai : plus il est haut, plus le modele colle au texte
(au prix d'un peu d'expressivite). On s'arrete au premier essai propre.
"""
import time, numpy as np, torch, torchaudio as ta, os
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

LINES = [
 ('01',"Je viens chercher un colis.",     0.60),
 ('02',"Vous avez l'avis de passage ?",   0.50),
 ('03',"On m'a rien laissé.",             0.60),
 ('04',"Alors il est pas arrivé.",        0.55),
 ('05',"Le suivi dit livré.",             0.90),
 ('06',"Le suivi se trompe jamais.",      0.80),
 ('07',"Donc il est arrivé.",             0.75),
 ('08',"Je viens de vous dire que non.",  1.00),
 ('09',"Vous avez dit les deux.",         0.70),
 ('10',"Guichet suivant.",                0.85),
]
VOW='aeiouyàâäéèêëîïôöùûü'
def syllables(t):
    n=0; prev=False
    for c in t.lower():
        cur = c in VOW
        if cur and not prev: n+=1
        prev=cur
    return n

def inspect(wav, sr):
    x = wav.squeeze().numpy().astype(np.float32)
    H = int(0.02*sr)
    env = np.array([np.sqrt(np.mean(x[i:i+H]**2)) for i in range(0, len(x)-H, H)])
    if not len(env): return 0.0, 0.0
    thr = max(env.max()*0.06, 0.006)
    voiced = env > thr
    idx = np.flatnonzero(voiced)
    if not len(idx): return 0.0, 0.0
    start = idx[0]; end = start; gap = 0; GAPMAX = int(0.5/0.02)
    for i in range(start, len(voiced)):
        if voiced[i]: end = i; gap = 0
        else:
            gap += 1
            if gap > GAPMAX: break
    speech = (end-start+1)*0.02
    after  = voiced[end+GAPMAX:].sum()*0.02
    return speech, after

def trim(wav, sr, pad=0.10):
    x = wav.squeeze().numpy().astype(np.float32)
    H = int(0.02*sr)
    env = np.array([np.sqrt(np.mean(x[i:i+H]**2)) for i in range(0, len(x)-H, H)])
    thr = max(env.max()*0.06, 0.006)
    idx = np.flatnonzero(env > thr)
    a = max(0, int((idx[0]*0.02 - pad)*sr))
    b = min(len(x), int(((idx[-1]+1)*0.02 + pad)*sr))
    return torch.from_numpy(x[a:b]).unsqueeze(0)

m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
os.makedirs('cb_ok', exist_ok=True)
ATTEMPTS = [(0.30, 0), (0.40, 1), (0.50, 2), (0.50, 3), (0.60, 4), (0.60, 5)]
report = []
for num, txt, ex in LINES:
    ns = syllables(txt); target = ns*0.20
    best = None
    for k,(cfg, seed) in enumerate(ATTEMPTS):
        torch.manual_seed(1000+seed)
        wav = m.generate(txt, language_id="fr", exaggeration=ex, cfg_weight=cfg)
        sp, af = inspect(wav, m.sr)
        ok = (0.5*target <= sp <= 1.8*target) and af < 0.15
        print(f"{num} essai{k+1} cfg={cfg} -> parole {sp:.2f}s (cible {target:.2f}s) residu {af:.2f}s {'OK' if ok else 'rate'}", flush=True)
        if ok:
            best = (wav, cfg, k+1, sp); break
        if best is None or sp < best[3]: best = (wav, cfg, k+1, sp)
    wav, cfg, k, sp = best
    ta.save(f"cb_ok/{num}.wav", trim(wav, m.sr), m.sr)
    report.append((num, k, cfg, round(sp,2), round(target,2)))
print("RAPPORT", report, flush=True)
print("FINI", flush=True)
