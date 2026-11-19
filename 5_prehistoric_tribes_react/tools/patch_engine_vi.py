#!/usr/bin/env python3
"""One-shot patch of src/engine/ptCore.js for Vietnamese text. Already applied; kept for reference."""
import re,sys
p='src/engine/ptCore.js'
s=open(p,encoding='utf8').read()
if 'VI_OVER' in s: sys.exit('already patched')
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    assert n==cnt,(n,a[:70])
    s=s.replace(a,b)

rep("fo=30,po=21,","fo=30,po=31,")
rep("Ga=1674,","Ga=4096,")
rep("Ft=[`en`,`fr`,`it`,`de`,`es`]","Ft=[`en`,`fr`,`it`,`de`,`es`,`vi`]")
# accent predicate: row 0 col>=14, plus row 2 col>=20 (extra Vietnamese marks)
rep("(N(o,fo)!==0||o%fo<ho)&&(this.labelWidths[e]+=","!vcc(o)&&(this.labelWidths[e]+=")
rep("(N(t,fo)!==0||t%fo<ho)&&(te+=o,","!vcc(t)&&(te+=o,")
rep("u=n===0&&r>=ho;u&&(l-=this.data.value(S.ACCENT_OFFSETS,r-ho),","u=n===0&&r>=ho||n===2&&r>=20;u&&(l-=this.data.value(S.ACCENT_OFFSETS,n===0?r-ho:r-4),")
rep("this.previousGlyphWidth=s,u?i:i+s+t}","u||(this.previousGlyphWidth=s),u?i:i+s+t}")
# text encoder: Vietnamese combining marks
old_xa=s[s.index("function xa(e){"):s.index("var Sa=[[")]
new_xa='''var VI_OVER={breve:`"`,hook:`%`,dot:`(`,horn:`)`,stroke:`{`,"circ+acute":``,"circ+grave":``,"circ+hook":``,"circ+tilde":``,"breve+acute":``,"breve+grave":``,"breve+hook":``,"breve+tilde":``},VI_TONE={"\\u0301":`acute`,"\\u0300":`grave`,"\\u0309":`hook`,"\\u0303":`tilde`},VI_TONE_GLYPH={acute:`\\\\`,grave:`]`,tilde:`_`};
function vcc(c){return c>=14&&c<30||c>=80&&c<90}
function xa(e){let t=``;for(let n of e.replaceAll(_a,va)){let e=ga[n];if(e!==void 0){t+=e;continue}if(n===`\\u0111`||n===`\\u0110`){t+=`d`+VI_OVER.stroke;continue}let r=n.normalize(`NFD`);if(r.length===1){t+=n;continue}let i=r[0],a=[...r.slice(1)];if(a.length===1&&ha[a[0]]!==void 0){t+=i+ha[a[0]];continue}let o=null,s=!1,c=!1,l=!1,u=!1;for(let e of a)if(e===`\\u0302`)s=!0;else if(e===`\\u0306`)c=!0;else if(e===`\\u031b`)l=!0;else if(e===`\\u0323`)u=!0;else if(VI_TONE[e]!==void 0)o=VI_TONE[e];else throw Error(`The game font has no glyph for "${n}"`);let d=i;s||c?d+=o?VI_OVER[(s?`circ`:`breve`)+`+`+o]:s?ha[`\\u0302`]:VI_OVER.breve:o&&(d+=VI_TONE_GLYPH[o]??VI_OVER.hook);l&&(d+=VI_OVER.horn);u&&(d+=VI_OVER.dot);t+=d}return t}'''
# VI_OVER chars: real control chars written by the generator below
ctrl={'circ+acute':'\x11','circ+grave':'\x12','circ+hook':'\x13','circ+tilde':'\x14','breve+acute':'\x15','breve+grave':'\x16','breve+hook':'\x1d','breve+tilde':'\x1e'}
for k,v in ctrl.items():
    new_xa=new_xa.replace('"%s":``'%k,'"%s":`\\x%02x`'%(k,ord(v)))
s=s.replace(old_xa,new_xa)
# language menu: extra "tiếng việt" entry (id -50) appended to the language screen
rep("function Hh(e){return Vh.find(t=>t.entry===e)}","function Hh(e){return Vh.find(t=>t.entry===e)||(e===-50?{label:`vietnamese`,action:{kind:`language`}}:void 0)}")
rep("this.game.screen===this.game.mainMenuScreen?Wh(n,Gh(this.game.app)):n}","this.game.screen===this.game.mainMenuScreen?Wh(n,Gh(this.game.app)):this.game.screen===z.LANGUAGE_MENU?[...n,-50]:n}")
open(p,'w',encoding='utf8').write(s)
print('patched')
