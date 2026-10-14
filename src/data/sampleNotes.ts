export interface QuizItem {
  id: string;
  text: string;
  question?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  answer?: string;
  explanation: string;
}

export interface SampleNote {
  id: string;
  title: string;
  course: string;
  content: string;
  keyPoints: string[];
  highYieldPoints: string[];
  quizQuestions: QuizItem[];
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
    highYieldPoints: [
      'Resting potential = -70 mV (K+ leak channels dominate)',
      'Threshold = -55 mV (All-or-none threshold for firing)',
      'Phase 0 = Voltage-gated Na+ channels open (Inward Na+)',
      'Peak = +30 mV, Na+ inactivation gates (h gates) close',
      'Phase 3 = Voltage-gated K+ channels open (Outward K+)',
      'Absolute refractory period = Inactivation of Na+ channels prevents second AP',
    ],
    quizQuestions: [
      {
        id: 'q_ap_1',
        text: 'What causes the rapid upstroke (Phase 0) of the neuronal action potential?',
        options: {
          A: 'Opening of voltage-gated Na+ channels and massive Na+ influx',
          B: 'Opening of delayed rectifier K+ channels',
          C: 'Inactivation of the 3Na+/2K+ ATPase',
          D: 'Inward flux of chloride ions',
        },
        correctAnswer: 'A',
        explanation: 'Rapid opening of activation (m) gates on voltage-sensitive Na+ channels permits explosive inward sodium current down its electrochemical gradient.',
      },
      {
        id: 'q_ap_2',
        text: 'Why does After-Hyperpolarization occur following action potential repolarization?',
        options: {
          A: 'Excessive intracellular sodium accumulation',
          B: 'Delayed-rectifier K+ channels close slowly, keeping K+ conductance high',
          C: 'Sudden failure of calcium clearance mechanisms',
          D: 'Active pumping of protons into extracellular fluid',
        },
        correctAnswer: 'B',
        explanation: 'Voltage-gated potassium channels close with a slight delay, continuing to drag membrane potential toward EK (-90 mV) before closing completely.',
      },
      {
        id: 'q_ap_3',
        text: 'What molecular mechanism defines the absolute refractory period?',
        options: {
          A: 'Hyperpolarization below -90 mV',
          B: 'Closure of inactivation (h) gates of voltage-gated Na+ channels',
          C: 'Complete exhaustion of intracellular ATP reserves',
          D: 'Depletion of extracellular magnesium ions',
        },
        correctAnswer: 'B',
        explanation: 'Once inactivation gates (h gates) swing shut at peak depolarization, the channel cannot conduct sodium again until repolarization resets the gates.',
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
    highYieldPoints: [
      'Rate-limiting enzyme: Isocitrate Dehydrogenase (stimulated by ADP, inhibited by ATP/NADH)',
      'Per 1 Acetyl-CoA yield: 3 NADH, 1 FADH2, 1 GTP, 2 CO2',
      'Complex II link: Succinate Dehydrogenase is embedded directly in the inner mitochondrial membrane',
      'Substrate-level phosphorylation step: Succinyl-CoA Synthetase produces GTP',
    ],
    quizQuestions: [
      {
        id: 'q_krebs_1',
        text: 'Which enzyme serves as the primary rate-limiting step of the Citric Acid Cycle?',
        options: {
          A: 'Citrate Synthase',
          B: 'Isocitrate Dehydrogenase',
          C: 'Malate Dehydrogenase',
          D: 'Fumarase',
        },
        correctAnswer: 'B',
        explanation: 'Isocitrate Dehydrogenase catalyses the oxidative decarboxylation of isocitrate to alpha-ketoglutarate, serving as the chief rate-limiting regulator.',
      },
      {
        id: 'q_krebs_2',
        text: 'Which Krebs cycle enzyme is embedded in the inner mitochondrial membrane as Complex II of the ETC?',
        options: {
          A: 'Pyruvate Dehydrogenase',
          B: 'Succinate Dehydrogenase',
          C: 'Aconitase',
          D: 'Alpha-Ketoglutarate Dehydrogenase',
        },
        correctAnswer: 'B',
        explanation: 'Succinate Dehydrogenase oxidizes succinate to fumarate while transferring electrons directly into the electron transport chain (Complex II).',
      },
      {
        id: 'q_krebs_3',
        text: 'What is the net yield of reduced coenzymes and high-energy phosphates per single turn of the cycle?',
        options: {
          A: '1 NADH, 1 FADH2, 3 GTP, 1 CO2',
          B: '3 NADH, 1 FADH2, 1 GTP, 2 CO2',
          C: '2 NADH, 2 FADH2, 2 ATP, 4 CO2',
          D: '4 NADH, 0 FADH2, 1 ATP, 3 CO2',
        },
        correctAnswer: 'B',
        explanation: 'Each molecule of Acetyl-CoA metabolized yields 3 NADH, 1 FADH2, 1 GTP, and 2 CO2.',
      },
    ],
  },
];

export const SAMPLE_STUDY_NOTES = SAMPLE_NOTES;
