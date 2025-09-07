// Mock AI analysis service

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runAIAnalysis(data, images) {
  // Simulate 45–60s random delay for processing
  const delay = 45000 + Math.floor(Math.random() * 15000);
  await sleep(delay);

  // Produce consistent but varied mock results based on a hash of location/crop
  const base = (data.location || 'loc') + (data.crop_type || 'crop');
  const seed = [...base].reduce((a, c) => a + c.charCodeAt(0), 0) % 100;
  const rand = (min, max) => min + ((seed % 50) / 50) * (max - min);

  const ph = Number((6.0 + (seed % 30) / 10).toFixed(1)); // ~6.0-9.0
  const salinity = Number(rand(0.1, 3.5).toFixed(2));
  const moisture = Math.min(60, Math.max(10, Math.round(rand(15, 45))));

  // Composition totals ~100
  const sand = Math.min(70, Math.max(20, Math.round(rand(30, 60))));
  const clay = Math.min(60, Math.max(10, Math.round(rand(15, 40))));
  const silt = Math.max(5, 100 - sand - clay);

  // Build detailed chemical properties as ordered array with status
  const organicMatter = Number(rand(1.5, 4.5).toFixed(1));
  const nitrogenPct = Number(rand(0.08, 0.2).toFixed(2)); // %
  const phosphorusPct = Number(rand(0.05, 0.12).toFixed(2)); // %

  const phStatus = ph >= 6.5 && ph <= 7.5 ? "Yaxshi" : ph >= 5.8 && ph <= 8.2 ? "O'rtacha" : 'Past';
  const omStatus = organicMatter >= 3.0 ? 'Yaxshi' : organicMatter >= 2.0 ? "O'rtacha" : 'Past';
  const nStatus = nitrogenPct >= 0.12 ? 'Yaxshi' : nitrogenPct >= 0.1 ? "O'rtacha" : 'Past';
  const pStatus = phosphorusPct >= 0.1 ? 'Yaxshi' : phosphorusPct >= 0.07 ? "O'rtacha" : 'Past';

  const chemical = [
    { name: 'pH darajasi', value: ph.toFixed(1), status: phStatus },
    { name: 'Organik modda', value: `${organicMatter}%`, status: omStatus },
    { name: 'Azot (N)', value: `${(nitrogenPct * 100).toFixed(2)}%`, status: nStatus },
    { name: 'Fosfor (P)', value: `${(phosphorusPct * 100).toFixed(2)}%`, status: pStatus },
  ];

  const recs = [
    'Sug\'orish rejimini optimallashtiring',
    salinity > 2 ? 'Drenaj tizimini yaxshilang' : 'Drenaj holatini saqlang va kuzating',
    organicMatter < 3 ? 'Organik o\'g\'it qo\'shing' : 'Organik modda miqdorini barqaror saqlang',
    ph > 7.5 ? 'pH ni pasaytirish uchun oltingugurt qo\'llang' : 'pH barqaror, kuzatishda davom eting',
  ];

  // New fields for detailed report
  const ai_confidence = Number(rand(82, 98).toFixed(1));
  let risk_level = 'Past xavf';
  if (salinity >= 2.5) risk_level = "Yuqori xavf";
  else if (salinity >= 1.5) risk_level = "O'rtacha xavf";
  const affected_area_percentage = Number(rand(25, 75).toFixed(1));

  return {
    ph_level: ph,
    salinity_level: salinity,
    moisture_percentage: moisture,
    soil_composition: { sand, clay, silt },
    chemical_properties: chemical,
    recommendations: recs,
    ai_confidence,
    risk_level,
    affected_area_percentage,
  };
}
