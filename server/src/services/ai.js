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

  const chemical = {
    nitrogen: Number(rand(0.8, 1.6).toFixed(2)),
    phosphorus: Number(rand(15, 45).toFixed(0)),
    organic_matter: Number(rand(1.5, 4.5).toFixed(1)),
  };

  const recs = [
    'Optimize irrigation regime based on moisture levels',
    salinity > 2 ? 'Improve drainage to reduce salinity' : 'Maintain current drainage; monitor salinity',
    ph > 7.5 ? 'Consider sulfur-based amendments to lower pH' : 'Apply lime if pH continues to drop',
    'Incorporate organic matter to improve structure',
  ];

  return {
    ph_level: ph,
    salinity_level: salinity,
    moisture_percentage: moisture,
    soil_composition: { sand, clay, silt },
    chemical_properties: chemical,
    recommendations: recs,
  };
}
