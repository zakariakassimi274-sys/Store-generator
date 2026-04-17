import { useState } from "react";

const storeTypes = [
  { id: "fashion", label: "👗 أزياء وملابس", color: "#ec4899" },
  { id: "electronics", label: "📱 إلكترونيات", color: "#3b82f6" },
  { id: "food", label: "🍕 طعام ومشروبات", color: "#f59e0b" },
  { id: "beauty", label: "💄 عناية وجمال", color: "#a855f7" },
  { id: "home", label: "🏠 ديكور ومنزل", color: "#10b981" },
  { id: "sports", label: "⚽ رياضة ولياقة", color: "#ef4444" },
];

const themes = [
  { id: "dark", label: "🌑 داكن فاخر", bg: "#0a0a0a", accent: "#c8a96e", text: "#f0ece4" },
  { id: "light", label: "☀️ فاتح نظيف", bg: "#ffffff", accent: "#2563eb", text: "#1a1a1a" },
  { id: "warm", label: "🍊 دافئ عصري", bg: "#fff8f0", accent: "#c8813a", text: "#1a0f05" },
  { id: "bold", label: "⚡ جريء ملون", bg: "#0f0a1e", accent: "#7c3aed", text: "#f5f3ff" },
];

const sampleProducts = {
  fashion: [
    { name: "فستان سهرة فاخر", price: "299", emoji: "👗" },
    { name: "حقيبة جلد إيطالي", price: "449", emoji: "👜" },
    { name: "حذاء كعب عالي", price: "199", emoji: "👠" },
    { name: "عباءة مطرزة", price: "349", emoji: "🧣" },
  ],
  electronics: [
    { name: "سماعة لاسلكية Pro", price: "399", emoji: "🎧" },
    { name: "ساعة ذكية X2", price: "599", emoji: "⌚" },
    { name: "مكبر صوت بلوتوث", price: "249", emoji: "🔊" },
    { name: "شاحن لاسلكي سريع", price: "149", emoji: "⚡" },
  ],
  food: [
    { name: "قهوة أرابيكا فاخرة", price: "89", emoji: "☕" },
    { name: "شوكولاتة بلجيكية", price: "129", emoji: "🍫" },
    { name: "عسل سدر طبيعي", price: "199", emoji: "🍯" },
    { name: "تمر مجدول ممتاز", price: "159", emoji: "🌴" },
  ],
  beauty: [
    { name: "كريم ترطيب فاخر", price: "189", emoji: "✨" },
    { name: "عطر عود أصيل", price: "499", emoji: "🌸" },
    { name: "زيت أرغان طبيعي", price: "149", emoji: "💆" },
    { name: "مجموعة العناية", price: "299", emoji: "💄" },
  ],
  home: [
    { name: "إضاءة ذكية LED", price: "199", emoji: "💡" },
    { name: "كنبة مخمل فاخر", price: "1299", emoji: "🛋️" },
    { name: "لوحة فنية عصرية", price: "349", emoji: "🖼️" },
    { name: "طقم شاي ذهبي", price: "249", emoji: "🫖" },
  ],
  sports: [
    { name: "حذاء رياضي Pro", price: "349", emoji: "👟" },
    { name: "حقيبة جيم احترافية", price: "199", emoji: "🎒" },
    { name: "ساعة لياقة GPS", price: "599", emoji: "🏃" },
    { name: "مقاومة تمرين Set", price: "149", emoji: "💪" },
  ],
};

export default function StoreGenerator() {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState(null);
  const [theme, setTheme] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [aiDesc, setAiDesc] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [previewPage, setPreviewPage] = useState("home");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const generateStore = async () => {
    setGenerating(true);
    setLoadingDesc(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `اكتب وصفاً تسويقياً احترافياً لمتجر إلكتروني باسم "${storeName}" في مجال ${storeTypes.find(s => s.id === storeType)?.label}. اكتب: 1) شعار المتجر في جملة واحدة جذابة. 2) وصف المتجر في 2-3 جمل. 3) 3 مميزات رئيسية. اكتب بالعربية فقط.`
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "";
      setAiDesc(text);
    } catch (e) {
      setAiDesc("متجرك الاحترافي جاهز! تصميم عصري وتجربة تسوق لا مثيل لها.");
    }
    setLoadingDesc(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); setStep(4); }, 2000);
  };

  const selectedTheme = themes.find(t => t.id === theme) || themes[0];
  const products = sampleProducts[storeType] || sampleProducts.electronics;
  const typeInfo = storeTypes.find(s => s.id === storeType);

  if (generated && step === 4) {
    return (
      <div style={{ fontFamily: "Cairo, sans-serif", minHeight: "100vh", background: selectedTheme.bg, direction: "rtl" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .pc { border-radius: 12px; overflow: hidden; transition: all 0.3s; cursor: pointer; } .pc:hover { transform: translateY(-4px); box-shadow: 0 20px 40px #00000033; }`}</style>
        {toast && <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: selectedTheme.accent, color: "#fff", padding: "10px 24px", borderRadius: 20, zIndex: 200, fontFamily: "Cairo", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{toast}</div>}
        <nav style={{ background: selectedTheme.bg, borderBottom: `1px solid ${selectedTheme.accent}22`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: selectedTheme.accent }}>{storeName}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: selectedTheme.text + "88" }}>
            <span onClick={() => setPreviewPage("home")} style={{ cursor: "pointer", color: previewPage === "home" ? selectedTheme.accent : undefined }}>الرئيسية</span>
            <span onClick={() => setPreviewPage("products")} style={{ cursor: "pointer", color: previewPage === "products" ? selectedTheme.accent : undefined }}>المنتجات</span>
          </div>
          <span style={{ cursor: "pointer" }} onClick={() => showToast("🛒 السلة")}>🛒 <span style={{ background: selectedTheme.accent, color: "#fff", borderRadius: "50%", fontSize: 9, padding: "1px 4px", fontWeight: 700 }}>{cart.length}</span></span>
        </nav>
        {previewPage === "home" && (
          <>
            <div style={{ padding: "80px 32px", textAlign: "center", background: `linear-gradient(135deg, ${selectedTheme.bg}, ${selectedTheme.accent}11)` }}>
              <div style={{ fontSize: 12, letterSpacing: 4, color: selectedTheme.accent, marginBottom: 16 }}>{typeInfo?.label}</div>
              <h1 style={{ fontSize: "clamp(36px,7vw,70px)", fontWeight: 900, color: selectedTheme.text, lineHeight: 1.1, marginBottom: 20 }}>{storeName}<br /><span style={{ color: selectedTheme.accent }}>الوجهة الأولى</span></h1>
              <p style={{ color: selectedTheme.text + "88", fontSize: 16, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.8 }}>{loadingDesc ? "يكتب الذكاء الاصطناعي وصفك..." : aiDesc.split('\n')[0]}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => setPreviewPage("products")} style={{ background: selectedTheme.accent, color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontFamily: "Cairo", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>تسوّق الآن</button>
              </div>
            </div>
            <div style={{ padding: "48px 24px", background: selectedTheme.bg }}>
              <h2 style={{ fontSize: 28, color: selectedTheme.text, textAlign: "center", marginBottom: 28 }}>⭐ المنتجات <span style={{ color: selectedTheme.accent }}>المميزة</span></h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, maxWidth: 900, margin: "0 auto" }}>
                {products.map((p, i) => (
                  <div key={i} className="pc" style={{ background: selectedTheme.accent + "11", border: `1px solid ${selectedTheme.accent}22` }}>
                    <div style={{ padding: "28px", textAlign: "center", fontSize: 56 }}>{p.emoji}</div>
                    <div style={{ padding: "12px 16px 18px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: selectedTheme.text, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ fontSize: 20, color: selectedTheme.accent, fontWeight: 700, marginBottom: 10 }}>{p.price} ر.س</div>
                      <button onClick={() => { setCart(c => [...c, p]); showToast(`✅ أضيف!`); }} style={{ background: selectedTheme.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px", width: "100%", fontFamily: "Cairo", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>أضف للسلة</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {previewPage === "products" && (
          <div style={{ padding: "32px 24px", background: selectedTheme.bg, minHeight: "80vh" }}>
            <h2 style={{ fontSize: 26, color: selectedTheme.text, textAlign: "center", marginBottom: 24 }}>جميع <span style={{ color: selectedTheme.accent }}>المنتجات</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
              {[...products, ...products].map((p, i) => (
                <div key={i} className="pc" style={{ background: selectedTheme.accent + "11", border: `1px solid ${selectedTheme.accent}22` }}>
                  <div style={{ padding: "20px", textAlign: "center", fontSize: 48 }}>{p.emoji}</div>
                  <div style={{ padding: "10px 14px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedTheme.text, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 18, color: selectedTheme.accent, fontWeight: 700, marginBottom: 8 }}>{p.price} ر.س</div>
                    <button onClick={() => { setCart(c => [...c, p]); showToast(`✅ أضيف!`); }} style={{ background: selectedTheme.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px", width: "100%", fontFamily: "Cairo", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>أضف للسلة</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderTop: "1px solid #222", padding: "12px 16px", display: "flex", gap: 8, justifyContent: "center", zIndex: 100 }}>
          <button onClick={() => { setGenerated(false); setStep(1); setCart([]); setAiDesc(""); }} style={{ background: "#1f2937", color: "#9ca3af", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "Cairo", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🔄 متجر جديد</button>
          <button onClick={() => showToast("💾 تم الحفظ!")} style={{ background: selectedTheme.accent, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "Cairo", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>💾 حفظ</button>
          <button onClick={() => showToast("🚀 جاهز للبيع!")} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "Cairo", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🚀 بيع على Flippa</button>
        </div>
        <div style={{ height: 70 }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Cairo, sans-serif", background: "#080b12", minHeight: "100vh", direction: "rtl", color: "#e8eaf0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .oc { background: #0f1520; border: 1.5px solid #1e2535; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; text-align: center; font-family: Cairo; } .oc:hover { transform: translateY(-2px); } .nb { background: linear-gradient(135deg,#c8813a,#e8a55a); color: #fff; border: none; border-radius: 12px; padding: 14px; width: 100%; font-family: Cairo; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 20px; } .nb:disabled { background: #333; cursor: not-allowed; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ background: "#0f1520", borderBottom: "1px solid #1a2035", padding: "20px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>🏪 منشئ المتاجر بالذكاء الاصطناعي</h1>
        <p style={{ fontSize: 13, color: "#556" }}>ابنِ متجراً احترافياً في دقيقتين</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
          {[1,2,3].map(s => <div key={s} style={{ height: 10, borderRadius: 5, background: step >= s ? "#c8813a" : "#1e2535", width: step === s ? 24 : 10, transition: "all 0.3s" }} />)}
        </div>
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px" }}>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>✏️ اسم متجرك</div>
            <div style={{ fontSize: 14, color: "#556", marginBottom: 24 }}>اختر اسماً مميزاً</div>
            <input style={{ width: "100%", background: "#0f1520", border: "1.5px solid #1e2535", borderRadius: 12, padding: "14px 16px", color: "#fff", fontFamily: "Cairo", fontSize: 16, outline: "none" }} placeholder="مثال: نجمة، لوكس، ستايل..." value={storeName} onChange={e => setStoreName(e.target.value)} />
            <button className="nb" disabled={!storeName.trim()} onClick={() => setStep(2)}>التالي ← اختر نوع المتجر</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 20 }}>🏪 نوع المتجر</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {storeTypes.map(t => (
                <div key={t.id} className="oc" style={{ borderColor: storeType === t.id ? t.color : "#1e2535", background: storeType === t.id ? "#141d2b" : "#0f1520" }} onClick={() => setStoreType(t.id)}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{t.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 12, color: storeType === t.id ? t.color : "#888", fontWeight: 700 }}>{t.label.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 14 }}>🎨 الثيم</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {themes.map(t => (
                <div key={t.id} className="oc" style={{ borderColor: theme === t.id ? t.accent : "#1e2535", display: "flex", alignItems: "center", gap: 10, textAlign: "right" }} onClick={() => setTheme(t.id)}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.bg, border: `3px solid ${t.accent}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: theme === t.id ? t.accent : "#888", fontWeight: 600 }}>{t.label}</span>
                </div>
              ))}
            </div>
            <button className="nb" disabled={!storeType || !theme} onClick={() => setStep(3)}>التالي ← توليد المتجر</button>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 12 }}>متجرك جاهز للبناء!</div>
            <div style={{ background: "#0f1520", border: "1px solid #1e2535", borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "right" }}>
              {[["🏪", storeName], ["📦", storeTypes.find(s => s.id === storeType)?.label], ["🎨", themes.find(t => t.id === theme)?.label]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: "#556" }}>{k}</span>
                  <span style={{ color: "#c8813a", fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
            {generating ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, border: "4px solid #1e2535", borderTopColor: "#c8813a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ color: "#c8813a", fontSize: 15, fontWeight: 700 }}>🤖 يبني متجرك...</div>
              </div>
            ) : (
              <button className="nb" onClick={generateStore}>✨ ابنِ المتجر بالذكاء الاصطناعي</button>
            )}
            <button onClick={() => setStep(2)} style={{ background: "transparent", border: "none", color: "#556", fontFamily: "Cairo", fontSize: 14, cursor: "pointer", marginTop: 12 }}>← رجوع</button>
          </div>
        )}
      </div>
    </div>
  );
}
