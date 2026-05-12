import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { LessonStatus, UserProgress } from '../types';

interface ProgressMap {
  [lessonId: string]: LessonStatus;
}

interface ModuleProgress {
  completed: number;
  total: number;
}

export function useProgress(userId: string, totalLessonsCount: number = 0) {
  const queryClient = useQueryClient();

  const { data: progressList = [], isLoading, error } = useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!userId,
  });

  // BUG FIX: Memoize progress map to prevent infinite re-render loops in components
  const progressMap: ProgressMap = useMemo(() => {
    return progressList.reduce((acc, progress) => {
      acc[progress.lesson_id] = progress.status;
      return acc;
    }, {} as ProgressMap);
  }, [progressList]);

  // BUG FIX: Calculation now uses totalLessonsCount instead of progressList.length
  // to correctly show 2/50 lessons (4%) instead of 1/1 (100%)
  const overallPercent = useMemo(() => {
    if (totalLessonsCount === 0) return 0;
    const completedCount = progressList.filter(p => p.status === 'completed').length;
    return Math.round((completedCount / totalLessonsCount) * 100);
  }, [progressList, totalLessonsCount]);

  const calculateModuleProgress = (lessons: any[]): Record<string, ModuleProgress> => {
    const moduleProgress: Record<string, ModuleProgress> = {};
    lessons.forEach((lesson) => {
      const moduleId = lesson.module_id;
      if (!moduleProgress[moduleId]) {
        moduleProgress[moduleId] = { completed: 0, total: 0 };
      }
      moduleProgress[moduleId].total++;
      if (progressMap[lesson.id] === 'completed') {
        moduleProgress[moduleId].completed++;
      }
    });
    return moduleProgress;
  };

  const markComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: 'completed',
          completed_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    },
  });

  const markInProgress = useMutation({
    mutationFn: async (lessonId: string) => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: 'in_progress',
          last_accessed: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    },
  });

  return {
    progressMap,
    progressList,
    calculateModuleProgress,
    overallPercent,
    markComplete: markComplete.mutateAsync,
    markInProgress: markInProgress.mutateAsync,
    isLoading,
    error,
  };
}