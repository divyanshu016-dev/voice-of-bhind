import React from 'react';

// Original vector illustrations inspired by traditional Indian visual languages.
// They are contemporary interpretations, not reproductions of specific artists' work.

function WarliPerson({ x, y, scale = 1, turn = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale * turn} ${scale})`} stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="0" cy="-33" r="8" fill="none"/>
    <path d="M0 -24 -15 -5 15 -5 Z M-15 -3 0 17 15 -3 Z"/>
    <path d="M-11 0 -29 -12 M11 0 29 -13 M0 17 -14 43 M0 17 14 43"/>
  </g>;
}

export function WarliArtwork() {
  return <svg viewBox="0 0 320 280" role="img" aria-label="Original artwork inspired by Warli painting, showing people coming together" xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="280" fill="#bd563f"/>
    <g color="#fff0d2" stroke="currentColor" fill="none">
      <rect x="13" y="13" width="294" height="254" strokeWidth="2"/>
      <rect x="19" y="19" width="282" height="242" strokeWidth=".8"/>
      <circle cx="159" cy="100" r="43" strokeWidth="2" strokeDasharray="3 6"/>
      <circle cx="159" cy="100" r="26" fill="#e8ad62" strokeWidth="2"/>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M159 44v-10" strokeWidth="2" transform={`rotate(${i * 30} 159 100)`}/>)}
      <path d="M20 220 Q77 199 130 222 T302 222" strokeWidth="2"/>
      <path d="M24 237 Q80 216 129 240 T298 239" strokeWidth="1"/>
      <path d="M52 194V91 M52 122 31 106 M52 142 74 121 M52 104 74 84 M52 167 33 153" strokeWidth="3" strokeLinecap="round"/>
      <path d="M47 91q-18-22-26 0M54 87q6-31 26-25M50 112q-25-4-31 14M58 119q21-27 37-15" strokeWidth="2"/>
      <path d="M267 192V80 M267 116 245 97 M267 131 291 108 M267 93 288 74" strokeWidth="3" strokeLinecap="round"/>
      <path d="M263 82q-15-26-28-8M270 80q15-27 30-12M264 112q-25-9-31 8M270 118q19-20 30-9" strokeWidth="2"/>
      <g strokeWidth="2"><path d="M42 252h237"/></g>
    </g>
    <g color="#fff2d8"><WarliPerson x={105} y={168} scale={.86} turn={1}/><WarliPerson x={167} y={187} scale={1.04} turn={-1}/><WarliPerson x={222} y={162} scale={.86}/></g>
    <g fill="#fff0d2">{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={37+i*31} cy="34" r="2.3"/>)}</g>
  </svg>;
}

export function GondArtwork() {
  return <svg viewBox="0 0 320 280" role="img" aria-label="Original bird and tree artwork inspired by Gond dot-work" xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="280" fill="#203d62"/>
    <g fill="none" stroke="#eab55e" strokeWidth="2">
      <rect x="13" y="13" width="294" height="254" rx="110"/>
      <path d="M34 226Q100 192 155 234T288 224"/>
    </g>
    <g transform="translate(28 22)">
      <path d="M196 202q23-57 12-111M209 138q-32-30-44-66M212 163q30-37 53-52M204 104q-26-21-28-43" fill="none" stroke="#e8a962" strokeWidth="6" strokeLinecap="round"/>
      {[[168,74,-30],[189,60,40],[160,112,-42],[237,121,35],[251,102,-36],[167,151,-15],[255,152,36],[184,35,20]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><ellipse rx="13" ry="27" fill={i%2?'#e9a66a':'#75b69d'} stroke="#f5d29a" strokeWidth="2"/><path d="M0-21V21M-8-10 7 2M-8 4 7 13" stroke="#193b61" strokeWidth="1.7" fill="none"/>{[-12,0,12].map(j=><circle key={j} cx="-6" cy={j} r="2" fill="#f9dfa8"/>)}</g>)}
    </g>
    <g transform="translate(102 157)">
      <path d="M-40 47Q-25-24 29-39Q74-48 70 1Q62 43 13 51Z" fill="#e5aa59" stroke="#fff0b9" strokeWidth="3"/>
      <path d="M-20 37Q-10-10 29-21Q53-21 55 0Q48 30 3 35Z" fill="#da6651"/>
      <path d="M-22 35q39-10 65-45M-7 43q36-17 53-25" stroke="#213e61" strokeWidth="2" fill="none"/>
      {Array.from({length:7},(_,i)=><g key={i}><circle cx={-16+i*11} cy={20-i*4} r="3.2" fill="#ffe3aa"/><circle cx={-2+i*7} cy={37-i*2} r="2.2" fill="#75b69d"/></g>)}
      <path d="M39-33Q43-65 76-65Q100-61 101-42L84-36Q72-53 60-31" fill="#e5aa59" stroke="#fff0b9" strokeWidth="3"/>
      <circle cx="83" cy="-49" r="4" fill="#213e61"/>
      <path d="M99-42 120-35 97-29Z" fill="#e8af70"/>
      <path d="M-38 44-55 87M-14 49-12 87" fill="none" stroke="#eab55e" strokeWidth="4"/>
      <path d="M-44 86h-21M-4 86h-20" fill="none" stroke="#eab55e" strokeWidth="3"/>
    </g>
    <g fill="#f3d090">{Array.from({length:24},(_,i)=><circle key={i} cx={28+(i%8)*9} cy={35+Math.floor(i/8)*9} r={i%3===0?2:1.4}/>)}</g>
    <circle cx="274" cy="42" r="17" fill="#d96c54" stroke="#f4d5a0" strokeWidth="2"/>
    {Array.from({length:12},(_,i)=><circle key={i} cx={274+26*Math.cos(i*Math.PI/6)} cy={42+26*Math.sin(i*Math.PI/6)} r="2.4" fill="#e4a96a"/>)}
  </svg>;
}

export function MadhubaniArtwork() {
  return <svg viewBox="0 0 320 280" role="img" aria-label="Original lotus and fish artwork inspired by Madhubani painting" xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="280" fill="#e9aaa2"/>
    <g stroke="#7f303c" fill="none" strokeWidth="2.1">
      <rect x="10" y="10" width="300" height="260"/>
      <rect x="18" y="18" width="284" height="244"/>
      {Array.from({length:12},(_,i)=><path key={i} d={`M${28+i*22} 20l10 12-10 12-10-12Z`}/>)}
      <path d="M24 243h272M24 235h272"/>
      {Array.from({length:12},(_,i)=><circle key={i} cx={39+i*22} cy="251" r="4"/>)}
    </g>
    <g transform="translate(162 124)">
      {Array.from({length:8},(_,i)=><g key={i} transform={`rotate(${i*45})`}><path d="M0 6Q-36-27 0-72Q36-27 0 6Z" fill={i%2?'#f6cf88':'#a84b55'} stroke="#7b3041" strokeWidth="3"/><path d="M0-4v-56" stroke="#f5dbb0" strokeWidth="1.5" fill="none"/>{[-43,-30,-17].map(v=><path key={v} d={`M0 ${v}l-10-8M0 ${v}l10-8`} stroke="#f5dbb0" strokeWidth="1.3"/>)}</g>)}
      <circle r="22" fill="#efba64" stroke="#7b3041" strokeWidth="3"/><circle r="12" fill="#f7e0a5" stroke="#7b3041" strokeWidth="2"/>
      {Array.from({length:8},(_,i)=><circle key={i} cx={8*Math.cos(i*Math.PI/4)} cy={8*Math.sin(i*Math.PI/4)} r="2" fill="#7b3041"/>)}
    </g>
    <g transform="translate(38 190)" stroke="#753240" strokeWidth="2.5" fill="none"><path d="M0 0Q24-24 50 0Q25 24 0 0ZM50 0l22-18v36Z" fill="#f8d48c"/><circle cx="14" cy="-2" r="3" fill="#753240"/>{[22,32,42].map(x=><path key={x} d={`M${x} -12q-12 12 0 24`}/>)}</g>
    <g transform="translate(287 193) scale(-1 1)" stroke="#753240" strokeWidth="2.5" fill="none"><path d="M0 0Q24-24 50 0Q25 24 0 0ZM50 0l22-18v36Z" fill="#f8d48c"/><circle cx="14" cy="-2" r="3" fill="#753240"/>{[22,32,42].map(x=><path key={x} d={`M${x} -12q-12 12 0 24`}/>)}</g>
  </svg>;
}

export function ArtGallery() {
  return <div className="art-gallery" aria-label="Illustrations inspired by Indian folk art traditions">
    <div className="art-tile art-tile-warli"><WarliArtwork/><span>WARLI <small>togetherness</small></span></div>
    <div className="art-tile art-tile-gond"><GondArtwork/><span>GOND <small>the living world</small></span></div>
    <div className="art-tile art-tile-madhubani"><MadhubaniArtwork/><span>MADHUBANI <small>shared stories</small></span></div>
  </div>;
}
