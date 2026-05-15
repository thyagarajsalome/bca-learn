export interface Course {
  id: string;
  code: string;
  emoji: string;
  title: string;
  desc: string;
  sem: string[];
  badge: 'blue' | 'green' | 'gold' | 'red';
  isLab: boolean;
  tags: string[];
  topics: string[];
  lessons: number;
  progress: number;
}

export interface Semester {
  num: number;
  color: string;
  bg: string;
  label: string;
  subjects: string[];
}

export interface FutureTopic {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  badge: string;
  color: string;
  tags: string[];
  topics: string[];
  lessons: number;
  progress: number;
}

export interface PopularTopic {
  icon: string;
  text: string;
  count: string;
  id: string;
  type: 'bca' | 'future';
}
