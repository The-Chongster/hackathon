// HTF Tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bodyFont": "Inter",
  "displayFont": "Bebas Neue",
  "accent": "default",
  "density": "regular",
  "hoodEyes": true,
  "mutedBrightness": 154
}/*EDITMODE-END*/;

const FONT_STACKS = {
  "Inter": "'Inter',system-ui,sans-serif",
  "DM Sans": "'DM Sans',system-ui,sans-serif",
  "System": "system-ui,-apple-system,sans-serif"
};
const DISPLAY_STACKS = {
  "Bebas Neue": "'Bebas Neue',sans-serif",
  "Anton": "'Anton',sans-serif",
  "Oswald": "'Oswald',sans-serif"
};
const DENSITY_PAD = { compact: "80px", regular: "120px", spacious: "160px" };

function applyTweaks(t) {
  const r = document.documentElement;
  r.style.setProperty('--font-body', FONT_STACKS[t.bodyFont] || FONT_STACKS.Inter);
  r.style.setProperty('--font-display', DISPLAY_STACKS[t.displayFont] || DISPLAY_STACKS["Bebas Neue"]);
  r.style.setProperty('--section-pad', DENSITY_PAD[t.density] || DENSITY_PAD.regular);
  // Muted-text brightness: 60..170 (lightness on a neutral cool grey)
  const mb = Math.max(60, Math.min(220, Number(t.mutedBrightness) || 154));
  const hex = mb.toString(16).padStart(2,'0');
  r.style.setProperty('--muted', `#${hex}${hex}b0`);
  if (t.accent && t.accent !== 'default') r.setAttribute('data-accent', t.accent);
  else r.removeAttribute('data-accent');
  document.body.classList.toggle('no-hood-eyes', !t.hoodEyes);
}

// Apply display-font to all .display / hero-title / sec-title / etc by adding a stylesheet
const __twkExtra = document.createElement('style');
__twkExtra.textContent = `
  h1.hero-title, h2.sec-title, .display, .rule-num,
  .ch-title, .fmt-row .v-title, .demo-card .big, .demo-card .meta .v,
  .prize-headline, .share .pct, .join-h, .stat .v,
  section{}
  h1.hero-title, h2.sec-title, .rule-num, .ch-title,
  .fmt-row .v-title, .demo-card .big, .demo-card .meta .v,
  .prize-headline, .share .pct, .join-h, .stat .v {
    font-family: var(--font-display) !important;
  }
  section { padding: var(--section-pad) 0; }
  body.no-hood-eyes svg ellipse[data-eye]{display:none}
`;
document.head.appendChild(__twkExtra);

function HTFTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Type">
        <TweakRadio label="Body" value={t.bodyFont}
          options={["Inter","DM Sans","System"]}
          onChange={(v)=>setTweak('bodyFont',v)} />
        <TweakSelect label="Display" value={t.displayFont}
          options={["Bebas Neue","Anton","Oswald"]}
          onChange={(v)=>setTweak('displayFont',v)} />
      </TweakSection>
      <TweakSection label="Accent">
        <TweakColor label="Palette" value={t.accent}
          options={[
            {value:'default', label:'Cornflower'},
            {value:'violet', label:'Violet'},
            {value:'emerald', label:'Emerald'},
            {value:'crimson', label:'Crimson'},
            {value:'amber', label:'Amber'}
          ].map(o=>o.value)}
          onChange={(v)=>setTweak('accent',v)} />
        <TweakRadio label="Hue" value={t.accent}
          options={[
            {value:'default',label:'Blue'},
            {value:'violet',label:'Violet'},
            {value:'emerald',label:'Green'}
          ]}
          onChange={(v)=>setTweak('accent',v)} />
      </TweakSection>
      <TweakSection label="Layout">
        <TweakRadio label="Density" value={t.density}
          options={['compact','regular','spacious']}
          onChange={(v)=>setTweak('density',v)} />
        <TweakSlider label="Muted text" value={t.mutedBrightness}
          min={60} max={220} step={2}
          onChange={(v)=>setTweak('mutedBrightness',v)} />
      </TweakSection>
      <TweakSection label="Illustration">
        <TweakToggle label="Hood eye glow" value={t.hoodEyes}
          onChange={(v)=>setTweak('hoodEyes',v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// Render
const __mount = document.createElement('div');
__mount.id = '__tweaks_mount';
document.body.appendChild(__mount);
ReactDOM.createRoot(__mount).render(<HTFTweaks />);

// Apply defaults at boot so values match before panel opens
applyTweaks(TWEAK_DEFAULTS);
