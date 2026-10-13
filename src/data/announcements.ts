export interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'urgent' | 'exam' | 'info';
  content: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Pre-Clinical MBBS & BDS CBT Mock Examination Series Scheduled',
    date: 'Official Notice',
    type: 'urgent',
    content: 'All candidates enrolled in Human Anatomy (ANA 101), Physiology (PHS 101), and Medical Sciences (MED 101) are advised to sit the timed proctored mocks before the professional board cut-off date.',
  },
  {
    id: 'ann_02',
    title: 'Offline Question Bank Synchronized & Ready for Mobile Use',
    date: 'Version 1.0 Release',
    type: 'info',
    content: 'Full question banks with verified clinical rationales and anatomical diagrams are now cached for offline practice without requiring active data connections.',
  },
  {
    id: 'ann_03',
    title: 'Scientific Calculator & Text-to-Speech Accessibility Enabled',
    date: 'Examination Tool Update',
    type: 'exam',
    content: 'The on-screen scientific calculator and voice read-aloud question synthesizer have been enabled across all quantitative and physics assessment papers.',
  },
];
