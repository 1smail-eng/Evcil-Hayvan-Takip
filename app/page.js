"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// BURAYA KENDİ BİLGİLERİNİ YAPIŞTIR!
const supabase = createClient("URL_BURAYA", "ANON_KEY_BURAYA");

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 7/24 Canlı Veri Takibi Başlat (Supabase Realtime)
    const kanal = supabase
      .channel('pet_takip')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pet_care_kullanici' }, (payload) => {
        setData(payload.new);
      })
      .subscribe();

    // İlk açılışta verileri çek
    async function ilkYukleme() {
      const { data: petVeri } = await supabase.from('pet_care_kullanici').select('*').single();
      setData(petVeri);
      setLoading(false);
    }
    ilkYukleme();

    return () => { supabase.removeChannel(kanal); };
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>📡 SİSTEM BAŞLATILIYOR...</div>;

  // 💳 HAFTALIK 50 TL KONTROLÜ
  if (data && data.abonelik_aktif === false) {
    return (
      <div style={{height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#300', color:'red'}}>
        <h1 style={{fontSize:'3rem'}}>⛔ ERİŞİM KISITLANDI</h1>
        <p style={{fontSize:'1.5rem'}}>Haftalık 50 TL ödeme vadesi geçmiş.</p>
        <button style={{padding:'20px 40px', fontSize:'20px', backgroundColor:'red', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold'}}>💳 ŞİMDİ ÖDE (50 TL)</button>
      </div>
    );
  }

  return (
    <div style={{padding:'20px'}}>
      <h1 style={{textAlign:'center', textShadow:'0 0 20px #00ff00'}}>🐾 PET TRACKER PRO CONTROL PANEL</h1>
      <hr style={{borderColor:'#00ff00'}} />

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'20px'}}>
        
        {/* SOL TARAF: GPS VERİLERİ */}
        <div style={{border:'2px solid #00ff00', padding:'20px', borderRadius:'15px', background:'#050505'}}>
          <h2 style={{marginTop:0}}>📍 CANLI GPS (UYDU)</h2>
          <p>📡 Durum: <span style={{color:'white'}}>BAĞLI</span></p>
          <p>🌍 Enlem: <span style={{color:'white'}}>{data?.gps_lat || "0.000"}</span></p>
          <p>🌍 Boylam: <span style={{color:'white'}}>{data?.gps_lng || "0.000"}</span></p>
          <div style={{width:'100%', height:'150px', border:'1px dashed #00ff00', display:'flex', alignItems:'center', justifyContent:'center'}}>
            🗺️ HARİTA AKTİF (Google Maps API Bekleniyor)
          </div>
        </div>

        {/* SAĞ TARAF: KAYIP BİLDİRİMİ */}
        <div style={{border:'2px solid #00ff00', padding:'20px', borderRadius:'15px', background:'#050505'}}>
          <h2 style={{marginTop:0}}>📸 KAYIP BİLDİRİM FORMU</h2>
          <label>Hayvan Fotoğrafı:</label>
          <input type="file" style={{display:'block', margin:'10px 0', color:'#00ff00'}} />
          <label>Son Görülen Yer:</label>
          <input type="text" placeholder="Örn: Tarsus Şelale civarı" style={{width:'90%', padding:'10px', background:'black', border:'1px solid #00ff00', color:'white', marginTop:'10px'}} />
          <button style={{width:'100%', marginTop:'20px', padding:'15px', backgroundColor:'#00ff00', color:'black', fontWeight:'bold', border:'none', cursor:'pointer'}}>SİSTEME KAYDET</button>
        </div>

      </div>

      <p style={{textAlign:'center', marginTop:'40px', opacity:0.5}}>© 2026 Pet Tracker Pro - Güvenli Sunucu Erişimi Aktif</p>
    </div>
  );
}