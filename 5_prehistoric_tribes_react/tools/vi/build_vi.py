# -*- coding: utf-8 -*-
import json, re, sys, os
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
root = os.path.join(here, '..', '..', 'public/res/text')
en = json.load(open(os.path.join(root, 'en.json')))
from part_ui import MENU, PAGES, LABELS, MESSAGES
D = {}
for m in ('part_d1', 'part_d2', 'part_d3'):
    D.update(__import__(m).D)
out = json.loads(json.dumps(en))
out['menu'] = MENU
out['pages'] = PAGES
for k, v in LABELS.items():
    assert len(v) == len(en['labels'][k]), (k, len(v), len(en['labels'][k]))
    out['labels'][k] = v
for k, v in MESSAGES.items():
    assert len(v) == len(en['messages'][k]), (k, len(v), len(en['messages'][k]))
    out['messages'][k] = v
dl = []
for i, e in enumerate(en['dialogue']):
    if e == '':
        dl.append('')
    else:
        assert i in D, f'missing dialogue {i}: {e[:50]}'
        dl.append(D[i])
extra = set(D) - {i for i, e in enumerate(en['dialogue']) if e}
assert not extra, extra
out['dialogue'] = dl
# token sanity
for i, (a, b) in enumerate(zip(en['dialogue'], dl)):
    assert re.findall(r'\{[^}]*\}', a) == re.findall(r'\{[^}]*\}', b), (i, a[:40], b[:40])
    assert a.count('\n') == b.count('\n'), (i, 'newlines')
json.dump(out, open(os.path.join(root, 'vi.json'), 'w'), ensure_ascii=False, indent=2)
print('vi.json written', len(dl))
