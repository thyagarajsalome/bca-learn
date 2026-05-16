import type { Semester, PopularTopic } from './types';

export const SEMESTERS: Semester[] = [
  { num:1, color:'#6366f1', bg:'rgba(99,102,241,.15)', label:'Year 1 • Sem 1', subjects:['BCS11','BCS12','BCSL13','ECO1','FEG2'] },
  { num:2, color:'#10b981', bg:'rgba(16,185,129,.15)', label:'Year 1 • Sem 2', subjects:['MCS11','MCS12','MCS13','MCS15','ECO2','BCSL21','BCSL22'] },
  { num:3, color:'#f59e0b', bg:'rgba(245,158,11,.15)', label:'Year 2 • Sem 3', subjects:['MCS14','MCS21','MCS23','BCS31','BCSL32','BCSL33','BCSL34'] },
  { num:4, color:'#ef4444', bg:'rgba(239,68,68,.15)',  label:'Year 2 • Sem 4', subjects:['MCSL16','MCS24','BCS40','BCS41','BCS42','BCSL43','BCSL44','BCSL45'] },
];

export const POPULAR_TOPICS: PopularTopic[] = [
  { icon:'🔗', text:'Linked Lists',       count:'12 lessons', id:'MCS21',         type:'bca' },
  { icon:'🗃️', text:'SQL Queries',        count:'10 lessons', id:'MCS23',         type:'bca' },
  { icon:'🌲', text:'Binary Trees',        count:'8 lessons',  id:'MCS21',         type:'bca' },
  { icon:'🎨', text:'React Basics',        count:'8 lessons',  id:'frontend',      type:'future' },
  { icon:'🚀', text:'Vercel Deploy',       count:'5 lessons',  id:'deployment',    type:'future' },
  { icon:'🏗️', text:'System Architecture', count:'7 lessons',  id:'system-design', type:'future' },
];