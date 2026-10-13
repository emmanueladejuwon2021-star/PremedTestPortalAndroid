export interface SampleNote {
  id: string;
  title: string;
  course: string;
  content: string;
  keyPoints: string[];
  quizQuestions: Array<{
    question: string;
    answer: string;
  }>;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'note_action_potentials',
    title: 'Neuronal Action Potentials & Hodgkin-Huxley Cycle',
    course: 'PHS 101 / Human Physiology',
    content: `Resting membrane potential is maintained near -70 mV primarily by high resting K+ permeability through leak channels and the 3Na+/2K+ electrogenic pump.
Threshold is typically around -55 mV. Once reached, activation gates (m gates) of voltage-gated Na+ channels rapidly open, resulting in rapid inward Na+ flux (Phase 0 Depolarization).
At +30 mV, Na+ channel inactivation gates (h gates) close rapidly, terminating inward Na+ current. Concurrently, delayed-rectifier voltage-gated K+ channels (n gates) open, triggering rapid K+ efflux (Phase 3 Repolarization).
Because K+ channels close slowly, the membrane briefly dips below resting potential (-80 mV), termed After-Hyperpolarization (Phase 4).
Absolute refractory period occurs when Na+ inactivation gates are closed (no stimulus can fire). Relative refractory period occurs during elevated K+ conductance (only supranormal stimuli can fire).`,
    keyPoints: [
      'Resting potential = -70 mV (K+ leak channels dominate)',
      'Threshold = -55 mV',
      'Phase 0 = Voltage-gated Na+ channels open (Inward Na+)',
      'Peak = +30 mV, Na+ inactivation gates (h gates) close',
      'Phase 3 = Voltage-gated K+ channels open (Outward K+)',
      'Absolute refractory period = Inactivation of Na+ channels prevents second AP',
    ],
    quizQuestions: [
      {
        question: 'What causes the rapid upstroke (Phase 0) of the neuronal action potential?',
        answer: 'Opening of voltage-gated Na+ channels causing a massive influx of Na+ into the cell.',
      },
      {
        question: 'Why does After-Hyperpolarization occur following repolarization?',
        answer: 'Voltage-gated K+ channels close slowly, allowing continued outward K+ efflux toward EK (-90 mV).',
      },
      {
        question: 'What molecular mechanism defines the absolute refractory period?',
        answer: 'Closure of the inactivation (h) gates of voltage-gated Na+ channels, rendering them unresponsive to any stimulus.',
      },
    ],
  },
  {
    id: 'note_krebs_cycle',
    title: 'Citric Acid Cycle (Krebs) & Mitochondrial Bioenergetics',
    course: 'CHM 101 / Biochemistry',
    content: `Pyruvate enters mitochondrial matrix and is converted to Acetyl-CoA by Pyruvate Dehydrogenase complex (generating 1 NADH and 1 CO2).
Acetyl-CoA (2C) condenses with Oxaloacetate (4C) catalyzed by Citrate Synthase to form Citrate (6C).
Rate-limiting step: Isocitrate Dehydrogenase oxidizes Isocitrate to Alpha-Ketoglutarate (producing first NADH and CO2).
Alpha-Ketoglutarate Dehydrogenase oxidizes to Succinyl-CoA (producing second NADH and CO2).
Substrate-level phosphorylation: Succinyl-CoA Synthetase converts Succinyl-CoA to Succinate, generating 1 GTP (equivalent to 1 ATP).
Succinate Dehydrogenase (Complex II of ETC) oxidizes Succinate to Fumarate, reducing FAD to FADH2.
Malate Dehydrogenase regenerates Oxaloacetate from Malate, generating the third NADH.
Per turn of cycle (per Acetyl-CoA): 3 NADH, 1 FADH2, 1 GTP, 2 CO2.`,
    keyPoints: [
      'Rate-limiting enzyme: Isocitrate Dehydrogenase',
      'Per 1 Acetyl-CoA yield: 3 NADH, 1 FADH2, 1 GTP, 2 CO2',
      'Complex II link: Succinate Dehydrogenase is embedded directly in the inner mitochondrial membrane',
      'Substrate-level phosphorylation step: Succinyl-CoA Synthetase produces GTP',
    ],
    quizQuestions: [
      {
        question: 'Which enzyme serves as the primary rate-limiting step of the Citric Acid Cycle?',
        answer: 'Isocitrate Dehydrogenase (allosterically stimulated by ADP, inhibited by ATP and NADH).',
      },
      {
        question: 'Which Krebs cycle enzyme is also an integral component of the Electron Transport Chain?',
        answer: 'Succinate Dehydrogenase, which functions as Complex II of the ETC.',
      },
      {
        question: 'What is the net yield of reduced coenzymes and high-energy phosphates per single turn of the cycle?',
        answer: '3 NADH, 1 FADH2, 1 GTP, and 2 molecules of CO2.',
      },
    ],
  },
];
