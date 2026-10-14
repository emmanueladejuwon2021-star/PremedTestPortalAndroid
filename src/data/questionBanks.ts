import { Question } from '../types/question';

export const QUESTION_BANK: Question[] = [
  // -------------------------------------------------------------
  // MED 101: Comprehensive Medical Sciences
  // -------------------------------------------------------------
  {
    id: 'q_med_01',
    courseId: 'med_cbt_101',
    topicId: 'top_med_1',
    text: 'During an acute inflammatory response, which cell-derived mediator is primarily responsible for inducing initial arteriolar vasodilation and increased vascular permeability in post-capillary venules?',
    options: {
      A: 'Thromboxane A2 released by platelets',
      B: 'Histamine released by preformed mast cell granules',
      C: 'Interleukin-12 secreted by activated macrophages',
      D: 'Transforming growth factor-beta (TGF-β) from fibroblasts'
    },
    correctOption: 'B',
    explanation: 'Histamine is stored preformed within cytoplasmic granules of tissue mast cells and basophils. Upon mast cell degranulation, histamine acts on H1 endothelial receptors causing immediate arteriolar dilation and endothelial contraction, leading to inter-endothelial gaps and edema.',
    highYield: true,
  },
  {
    id: 'q_med_02',
    courseId: 'med_cbt_101',
    topicId: 'top_med_2',
    text: 'A competitive antagonist is administered concurrently with an agonist. What characteristic effect will this have on the concentration-response curve of the agonist?',
    options: {
      A: 'Shifts the curve to the right with no change in maximal efficacy (Emax)',
      B: 'Decreases the maximal efficacy (Emax) without shifting the EC50',
      C: 'Shifts the curve to the left and increases potency',
      D: 'Flattens the slope and reduces irreversible binding affinity'
    },
    correctOption: 'A',
    explanation: 'Competitive antagonists bind reversibly to the same receptor active site as the agonist. Because higher concentrations of the agonist can overcome this blockade, maximal efficacy (Emax) is preserved, producing a parallel rightward shift in the log concentration-response curve with an increased EC50 (decreased apparent potency).',
    highYield: true,
  },
  {
    id: 'q_med_03',
    courseId: 'med_cbt_101',
    topicId: 'top_med_3',
    text: 'A male newborn presents with hypotonia, upslanting palpebral fissures, prominent epicanthal folds, a single transverse palmar crease, and a complete atrioventricular septal defect. Which cytogenetic abnormality is most frequently responsible?',
    options: {
      A: 'Maternal meiotic non-disjunction leading to free Trisomy 21 (47, XY, +21)',
      B: 'Robertsonian translocation between chromosomes 14 and 21',
      C: 'Microdeletion of chromosome 22q11.2',
      D: 'Paternal genomic imprinting of chromosome 15q11-q13'
    },
    correctOption: 'A',
    explanation: 'Classic Down syndrome (Trisomy 21) accounts for approximately 95% of cases via maternal meiotic non-disjunction, predominantly occurring during Meiosis I and strongly correlating with advanced maternal age. Robertsonian translocation accounts for approximately 4% of cases.',
    highYield: true,
  },
  {
    id: 'q_med_04',
    courseId: 'med_cbt_101',
    topicId: 'top_med_4',
    text: 'A patient with an open wound develops a skin infection. Laboratory microscopy reveals Gram-positive cocci in clusters that are catalase-positive and coagulase-positive. What is the most likely pathogen?',
    options: {
      A: 'Streptococcus pyogenes (Group A Strep)',
      B: 'Staphylococcus aureus',
      C: 'Staphylococcus epidermidis',
      D: 'Enterococcus faecalis'
    },
    correctOption: 'B',
    explanation: 'Staphylococcus aureus is a Gram-positive coccus arranged in grape-like clusters. It is distinguished from Streptococci by being catalase-positive (converts H2O2 to H2O + O2 bubbles) and distinguished from other staphylococci (such as S. epidermidis and S. saprophyticus) by producing coagulase, which clots rabbit plasma.',
    highYield: true,
  },

  // -------------------------------------------------------------
  // ANA 101: Human Gross Anatomy & Histology
  // -------------------------------------------------------------
  {
    id: 'q_ana_01',
    courseId: 'ana_cbt_101',
    topicId: 'top_ana_1',
    text: 'A medical student experiences a mid-shaft fracture of the humerus. Which neurovascular bundle running in the spiral (radial) groove is at highest risk of mechanical transection, resulting in "wrist drop"?',
    options: {
      A: 'Ulnar nerve and superior ulnar collateral artery',
      B: 'Median nerve and brachial artery',
      C: 'Radial nerve and profunda brachii (deep brachial) artery',
      D: 'Axillary nerve and posterior circumflex humeral artery'
    },
    correctOption: 'C',
    explanation: 'The radial nerve accompanied by the profunda brachii artery courses obliquely along the posterior aspect of the humerus in the radial (spiral) groove. Fractures of the humeral shaft commonly damage the radial nerve, paralyzing the wrist and finger extensors and presenting clinically as wrist drop with sensory loss over the dorsal first web space.',
    highYield: true,
  },
  {
    id: 'q_ana_02',
    courseId: 'ana_cbt_101',
    topicId: 'top_ana_2',
    text: 'Which anatomical landmark marks the transverse plane separating the superior mediastinum from the inferior mediastinum, corresponding to the articulation of the second costal cartilage anteriorly and the T4/T5 vertebral disk posteriorly?',
    options: {
      A: 'Sternal angle (Angle of Louis)',
      B: 'Xiphisternal joint',
      C: 'Jugular (suprasternal) notch',
      D: 'Costal margin'
    },
    correctOption: 'A',
    explanation: 'The sternal angle (Angle of Louis) lies at the junction of the manubrium and body of the sternum. An imaginary horizontal plane drawn from the sternal angle back to the T4/T5 intervertebral disc demarcates the boundary between superior and inferior mediastinum, aligns with the bifurcation of the trachea (carina), and marks the beginning and end of the aortic arch.',
    highYield: true,
  },
  {
    id: 'q_ana_03',
    courseId: 'ana_cbt_101',
    topicId: 'top_ana_3',
    text: 'Occlusion of the cerebral aqueduct of Sylvius disrupts the normal circulation of cerebrospinal fluid (CSF), directly causing non-communicating hydrocephalus. Between which two ventricular cavities is this conduit situated?',
    options: {
      A: 'Between the two Lateral Ventricles',
      B: 'Between the Third Ventricle and the Fourth Ventricle',
      C: 'Between the Lateral Ventricle and the Third Ventricle',
      D: 'Between the Fourth Ventricle and the Subarachnoid Space'
    },
    correctOption: 'B',
    explanation: 'CSF synthesized by choroid plexuses flows from the lateral ventricles into the third ventricle via the interventricular foramina of Monro. It then traverses the midbrain via the cerebral aqueduct of Sylvius to reach the fourth ventricle before entering the cisterna magna via the foramina of Luschka and Magendie.',
    highYield: true,
  },
  {
    id: 'q_ana_04',
    courseId: 'ana_cbt_101',
    topicId: 'top_ana_4',
    text: 'Which type of epithelial tissue lines the luminal surface of the urinary bladder and ureters, characterized by domed "umbrella" cells that flatten when the lumen expands?',
    options: {
      A: 'Simple columnar ciliated epithelium',
      B: 'Transitional epithelium (Urothelium)',
      C: 'Stratified squamous non-keratinized epithelium',
      D: 'Pseudostratified columnar ciliated epithelium'
    },
    correctOption: 'B',
    explanation: 'Transitional epithelium (urothelium) is specialized stratified epithelium designed to withstand osmotic stress from hypertonic urine and accommodate cyclic volume fluctuations. The apical layer contains umbrella cells with specialized plaques (uroplakins) that unfold during bladder distension.',
    highYield: true,
  },

  // -------------------------------------------------------------
  // PHS 101: Systemic Human Physiology
  // -------------------------------------------------------------
  {
    id: 'q_phs_01',
    courseId: 'phs_cbt_101',
    topicId: 'top_phs_1',
    text: 'During the rapid depolarization phase (Phase 0) of a neuronal action potential, which ionic conductance change is responsible for the explosive shift in membrane potential from -70 mV to +30 mV?',
    options: {
      A: 'Rapid opening of voltage-gated Na+ channels and inward Na+ current',
      B: 'Opening of voltage-gated K+ channels and outward K+ current',
      C: 'Inactivation of the 3Na+/2K+ ATPase electrogenic pump',
      D: 'Inward flux of extracellular Cl- ions through GABA-A channels'
    },
    correctOption: 'A',
    explanation: 'When the axonal membrane depolarizes past threshold (approx -55 mV), activation gates (m gates) of voltage-sensitive sodium channels rapidly open. This causes an inward sodium current driven by both the electrical gradient and concentration gradient, driving the membrane potential toward the sodium equilibrium potential (+60 mV).',
    highYield: true,
  },
  {
    id: 'q_phs_02',
    courseId: 'phs_cbt_101',
    topicId: 'top_phs_2',
    text: 'In the cardiac cycle, during which phase do the cardiac ventricles generate peak intracavitary pressure while both the atrioventricular (AV) and semilunar valves remain closed with no change in ventricular blood volume?',
    options: {
      A: 'Isovolumetric ventricular contraction',
      B: 'Rapid ventricular ejection phase',
      C: 'Isovolumetric ventricular relaxation',
      D: 'Diastasis / Reduced ventricular filling'
    },
    correctOption: 'A',
    explanation: 'Isovolumetric contraction begins when ventricular excitation (QRS complex) triggers myocyte shortening. Ventricular pressure rises above atrial pressure, snapping the mitral/tricuspid valves shut (First Heart Sound, S1). Because ventricular pressure has not yet exceeded aortic/pulmonary pressure, the semilunar valves remain closed, resulting in steep pressure generation without change in volume.',
    highYield: true,
  },
  {
    id: 'q_phs_03',
    courseId: 'phs_cbt_101',
    topicId: 'top_phs_3',
    text: 'Which nephron segment possesses the highest density of apical Na+/K+/2Cl- cotransporters (NKCC2), establishing the hypertonic medullary interstitial gradient required for urine concentration?',
    options: {
      A: 'Proximal convoluted tubule',
      B: 'Thick ascending limb of the loop of Henle',
      C: 'Thin descending limb of the loop of Henle',
      D: 'Cortical collecting duct'
    },
    correctOption: 'B',
    explanation: 'The thick ascending limb of Henle actively reabsorbs solutes (via NKCC2) without permitting water reabsorption due to low water permeability. This active salt pump creates a hyperosmotic renal medullary gradient, which is the pharmacological target of loop diuretics such as furosemide.',
    highYield: true,
  },
  {
    id: 'q_phs_04',
    courseId: 'phs_cbt_101',
    topicId: 'top_phs_4',
    text: 'A decrease in extracellular ionized calcium (Ca2+) concentration triggers the rapid secretion of parathyroid hormone (PTH). What are the three primary physiological actions of PTH to restore serum calcium?',
    options: {
      A: 'Stimulates osteoclast bone resorption, increases renal distal tubule Ca2+ reabsorption, and activates renal 1α-hydroxylase to form calcitriol',
      B: 'Inhibits osteocytic osteolysis, increases renal excretion of phosphate, and decreases calcitonin release',
      C: 'Increases intestinal sodium uptake, stimulates thyroid hormone secretion, and inhibits hepatic glycogenolysis',
      D: 'Promotes renal proximal tubular phosphate retention, decreases calcium-sensing receptor expression, and inhibits bone remodeling'
    },
    correctOption: 'A',
    explanation: 'PTH acts via PTH1 receptors in bone (stimulating RANKL expression on osteoblasts to activate osteoclasts) and in renal distal tubules (increasing apical TRPV5 calcium channels). Additionally, PTH stimulates renal 1-alpha-hydroxylase, synthesizing active 1,25-dihydroxyvitamin D3 (calcitriol) to boost intestinal calcium absorption.',
    highYield: true,
  },

  // -------------------------------------------------------------
  // CHM 101: General & Organic Chemistry for Premeds
  // -------------------------------------------------------------
  {
    id: 'q_chm_01',
    courseId: 'chm_cbt_101',
    topicId: 'top_chm_1',
    text: 'A buffer solution contains 0.20 M ethanoic acid (CH3COOH, Ka = 1.8 × 10^-5, pKa = 4.74) and 0.20 M sodium ethanoate (CH3COONa). According to the Henderson-Hasselbalch equation, what is the pH of this buffer?',
    options: {
      A: '7.00',
      B: '4.74',
      C: '3.74',
      D: '5.74'
    },
    correctOption: 'B',
    explanation: 'By the Henderson-Hasselbalch equation: pH = pKa + log([Conjugate Base] / [Acid]). When [CH3COO-] = [CH3COOH] = 0.20 M, [Base]/[Acid] = 1. Since log(1) = 0, pH = pKa = 4.74.',
    highYield: true,
  },
  {
    id: 'q_chm_02',
    courseId: 'chm_cbt_101',
    topicId: 'top_chm_2',
    text: 'In nucleophilic substitution reactions, which condition strongly favors a bimolecular SN2 pathway over an unimolecular SN1 pathway?',
    options: {
      A: 'A primary (1°) alkyl halide substrate, a strong nucleophile, and a polar aprotic solvent (e.g., acetone, DMSO)',
      B: 'A tertiary (3°) alkyl halide, a weak nucleophile, and a polar protic solvent (e.g., water, methanol)',
      C: 'A bulky sterically hindered substrate in the presence of heat',
      D: 'The formation of a stable resonance-stabilized planar carbocation intermediate'
    },
    correctOption: 'A',
    explanation: 'SN2 reactions proceed via a concerted, single-step backside attack. Unhindered primary alkyl halides minimize steric clash for the incoming nucleophile. Strong nucleophiles accelerate bimolecular kinetics, and polar aprotic solvents do not form hydrogen bonds around the nucleophile, maximizing its nucleophilic reactivity.',
    highYield: true,
  },
  {
    id: 'q_chm_03',
    courseId: 'chm_cbt_101',
    topicId: 'top_chm_3',
    text: 'According to the Gibbs free energy equation (ΔG = ΔH - TΔS), under what thermodynamic conditions will a biochemical reaction ALWAYS be spontaneous (ΔG < 0) at all temperatures?',
    options: {
      A: 'Exothermic (ΔH < 0) with an increase in entropy (ΔS > 0)',
      B: 'Endothermic (ΔH > 0) with a decrease in entropy (ΔS < 0)',
      C: 'Exothermic (ΔH < 0) with a decrease in entropy (ΔS < 0)',
      D: 'Endothermic (ΔH > 0) with zero change in entropy (ΔS = 0)'
    },
    correctOption: 'A',
    explanation: 'When ΔH is negative and ΔS is positive, the term -TΔS is negative for any absolute temperature T (in Kelvin). Therefore, ΔG = (negative) - (positive × positive) = negative, guaranteeing spontaneous feasibility under all temperature conditions.',
    highYield: true,
  },
  {
    id: 'q_chm_04',
    courseId: 'chm_cbt_101',
    topicId: 'top_chm_4',
    text: 'Which amino acid is classified as achiral due to having a hydrogen atom as its side chain (R group), preventing the formation of four unique groups on its alpha-carbon?',
    options: {
      A: 'Alanine',
      B: 'Glycine',
      C: 'Proline',
      D: 'Cysteine'
    },
    correctOption: 'B',
    explanation: 'Glycine is the simplest amino acid. Its alpha-carbon is bonded to an amino group (-NH2), a carboxyl group (-COOH), and two identical hydrogen atoms (-H). Because it lacks four distinct substituents, it is optically inactive (achiral).',
    highYield: true,
  },

  // -------------------------------------------------------------
  // PHY 101: Physics for Medical & Biological Sciences
  // -------------------------------------------------------------
  {
    id: 'q_phy_01',
    courseId: 'phy_cbt_101',
    topicId: 'top_phy_1',
    text: 'According to Poiseuille\'s Law of laminar fluid flow (Q = π·ΔP·r^4 / 8ηL), if the radius (r) of an arteriole is reduced by 50% due to acute vasoconstriction, what happens to the volumetric blood flow rate (Q), assuming constant perfusion pressure?',
    options: {
      A: 'Flow is reduced to 1/2 of its initial value',
      B: 'Flow is reduced to 1/4 of its initial value',
      C: 'Flow is reduced to 1/16 of its initial value',
      D: 'Flow remains constant due to autoregulatory capacitance'
    },
    correctOption: 'C',
    explanation: 'In Poiseuille\'s formula, flow rate Q is directly proportional to the fourth power of the radius (r^4). If the radius becomes 1/2 of r, (1/2)^4 = 1/16 of the original flow rate. This highlights the extraordinary impact small changes in vascular caliber have on vascular resistance and perfusion.',
    highYield: true,
  },
  {
    id: 'q_phy_02',
    courseId: 'phy_cbt_101',
    topicId: 'top_phy_2',
    text: 'A pre-medical student diagnosed with myopia (nearsightedness) has an elongated eyeball, causing parallel light rays from distant objects to converge anterior to the retina. Which type of ophthalmic lens is required for optical correction?',
    options: {
      A: 'Diverging (concave) lens',
      B: 'Converging (convex) lens',
      C: 'Cylindrical lens with oblique axis',
      D: 'Bifocal prism lens'
    },
    correctOption: 'A',
    explanation: 'In myopia, the focal power of the refractive elements is too high relative to the axial length of the globe. A diverging (concave, negative diopter) lens spreads incoming parallel rays prior to entering the eye, shifting the focal plane posterior onto the retinal fovea.',
    highYield: true,
  },
  {
    id: 'q_phy_03',
    courseId: 'phy_cbt_101',
    topicId: 'top_phy_3',
    text: 'What primary physical mechanism accounts for human body cooling in high ambient environmental temperatures (exceeding 37°C), when radiative and convective heat gains from the surrounding environment are positive?',
    options: {
      A: 'Vasoconstriction of superficial cutaneous capillaries',
      B: 'Evaporative heat dissipation via cutaneous sweating (latent heat of vaporization)',
      C: 'Increased conductive cooling through clothing',
      D: 'Downregulation of pulmonary alveolar ventilation'
    },
    correctOption: 'B',
    explanation: 'When ambient temperature exceeds core temperature (37°C), radiation, conduction, and convection transfer heat into the body rather than out. Evaporation of sweat is the sole remaining mechanism for heat dissipation, relying on the latent heat of vaporization of water (approx. 2.43 kJ/g at skin temperature).',
    highYield: true,
  },
  {
    id: 'q_phy_04',
    courseId: 'phy_cbt_101',
    topicId: 'top_phy_4',
    text: 'In diagnostic medical radiography, which physical interaction between incident X-ray photons and tissue atoms contributes most significantly to contrast differentiation between dense cortical bone and surrounding soft tissue at standard diagnostic energies (40–80 keV)?',
    options: {
      A: 'Photoelectric absorption (proportional to Z^3)',
      B: 'Compton scattering',
      C: 'Pair production',
      D: 'Coherent Rayleigh scattering'
    },
    correctOption: 'A',
    explanation: 'The photoelectric effect occurs when an incoming photon ejects an inner-shell electron and is completely absorbed. Its probability is directly proportional to the atomic number cubed (Z^3) and inversely proportional to energy cubed (1/E^3). Because bone contains calcium (Z=20) and soft tissue is mostly water/carbon (effective Z approx 7.4), bone absorbs vastly more photons, creating distinct radiographic white shadows.',
    highYield: true,
  },

  // -------------------------------------------------------------
  // DEN 101: Dental Sciences & Oral Anatomy
  // -------------------------------------------------------------
  {
    id: 'q_den_01',
    courseId: 'den_cbt_101',
    topicId: 'top_den_1',
    text: 'Which anatomical tissue layer constitutes the hardest calcified substance in the human body, composed of approximately 96% inorganic hydroxyapatite crystals arranged in hexagonal prisms?',
    options: {
      A: 'Dental Enamel',
      B: 'Coronal Dentin',
      C: 'Radicular Cementum',
      D: 'Alveolar Bone'
    },
    correctOption: 'A',
    explanation: 'Enamel is formed by ameloblasts during odontogenesis and is the most mineralized and hardest tissue in the human body (approx. 96% inorganic hydroxyapatite, 4% organic matrix and water). Once formed, ameloblasts are lost during tooth eruption, meaning enamel cannot regenerate cellularly.',
    highYield: true,
  },

  // -------------------------------------------------------------
  // PTH 101: Physiotherapy & Musculoskeletal Systems
  // -------------------------------------------------------------
  {
    id: 'q_pth_01',
    courseId: 'pt_cbt_101',
    topicId: 'top_pth_1',
    text: 'During normal human gait kinematics, which muscular group contracts eccentrically during the "heel strike" (initial contact) to "loading response" phase to prevent the foot from slapping violently against the floor?',
    options: {
      A: 'Anterior leg compartment dorsiflexors (Tibialis anterior, Extensor digitorum longus)',
      B: 'Posterior superficial compartment plantarflexors (Gastrocnemius, Soleus)',
      C: 'Quadriceps femoris group',
      D: 'Hamstrings group'
    },
    correctOption: 'A',
    explanation: 'At initial contact (heel strike), the tibialis anterior and other ankle dorsiflexors undergo controlled eccentric contraction (elongating under tension). This smoothly decelerates plantarflexion, preventing foot slap and ensuring smooth transition to flat foot posture.',
    highYield: true,
  },
].map((q) => ({
  ...q,
  correctOption: q.correctOption as any,
  correctAnswer: q.correctOption as any,
  topic: q.topicId,
  clinicalCorrelate: q.explanation,
  difficulty: (q as any).difficulty || 'medium',
})) as Question[];

export const QUESTION_BANKS = QUESTION_BANK;
