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

export function useProgress(userId: string) {
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

  // Create progress map
  const progressMap: ProgressMap = progressList.reduce((acc, progress) => {
    acc[progress.lesson_id] = progress.status;
    return acc;
  }, {} as ProgressMap);

  // Calculate module progress (requires lesson data)
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

  // Calculate overall progress
  const overallPercent = progressList.length > 0
    ? Math.round(
        (progressList.filter(p => p.status === 'completed').length / progressList.length) * 100
      )
    : 0;

  // Mark lesson as complete
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
        }, { onConflict: 'user_id,lesson_id' }) // <-- FIX APPLIED HERE
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    },
  });

  // Mark lesson as in progress
  const markInProgress = useMutation({
    mutationFn: async (lessonId: string) => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: 'in_progress',
          last_accessed: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' }) // <-- FIX APPLIED HERE
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