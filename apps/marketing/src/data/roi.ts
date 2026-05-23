export type RoiInputs = {
  workers: number;
  dailyRides: number;
  ocrUploadsPerDay: number;
  walletAdoption: number;
  creditPenetration: number;
  insuranceAdoption: number;
  avgEarnings: number;
  states: number;
};

export const defaultRoiInputs: RoiInputs = {
  workers: 500_000,
  dailyRides: 8,
  ocrUploadsPerDay: 2,
  walletAdoption: 42,
  creditPenetration: 28,
  insuranceAdoption: 35,
  avgEarnings: 850,
  states: 6,
};

export type RoiOutputs = {
  projectedGmvCr: number;
  annualTransactionsCr: number;
  lendingOpportunityCr: number;
  insuranceRevenueCr: number;
  aiUnderwritingCr: number;
  identityScore: number;
  revenueYear5Cr: number;
  valuationCr: number;
  networkMultiplier: number;
  ocrVolumeM: number;
  dataMoatStrength: number;
  walletUsers: number;
};

export function computeRoi(i: RoiInputs): RoiOutputs {
  const walletUsers = Math.round(i.workers * (i.walletAdoption / 100));
  const annualRides = i.workers * i.dailyRides * 365;
  const projectedGmv = annualRides * i.avgEarnings;
  const ocrVolume = i.workers * i.ocrUploadsPerDay * 365;
  const lendingPool = walletUsers * i.avgEarnings * 30 * (i.creditPenetration / 100);
  const insuranceRev = i.workers * (i.insuranceAdoption / 100) * 1_200;
  const aiUnderwriting = ocrVolume * 0.8 * (i.creditPenetration / 100);
  const networkMultiplier = 1 + i.states * 0.12 + i.walletAdoption / 200;
  const identityScore = Math.min(
    99,
    Math.round(40 + i.walletAdoption * 0.35 + i.ocrUploadsPerDay * 8 + i.states * 2),
  );
  const baseRev = projectedGmv * 0.018 + lendingPool * 0.12 + insuranceRev + aiUnderwriting * 0.05;
  const revenueYear5 = baseRev * Math.pow(networkMultiplier, 4) * 0.001;
  const valuation = revenueYear5 * 12 * networkMultiplier;

  return {
    projectedGmvCr: projectedGmv / 1e7,
    annualTransactionsCr: annualRides / 1e7,
    lendingOpportunityCr: lendingPool / 1e7,
    insuranceRevenueCr: insuranceRev / 1e7,
    aiUnderwritingCr: aiUnderwriting / 1e7,
    identityScore,
    revenueYear5Cr: revenueYear5,
    valuationCr: valuation,
    networkMultiplier,
    ocrVolumeM: ocrVolume / 1e6,
    walletUsers,
    dataMoatStrength: Math.min(99, Math.round(identityScore * 0.6 + i.walletAdoption * 0.35 + i.states * 1.2)),
  };
}

export function roiGrowthSeries(i: RoiInputs) {
  const base = computeRoi(i);
  return [1, 2, 3, 4, 5].map((year) => ({
    year: `Y${year}`,
    gmv: Math.round(base.projectedGmvCr * Math.pow(base.networkMultiplier, year - 1)),
    revenue: Math.round(base.revenueYear5Cr * (year / 5) * 10) / 10,
    valuation: Math.round(base.valuationCr * (year / 5) * (0.6 + year * 0.1)),
  }));
}
