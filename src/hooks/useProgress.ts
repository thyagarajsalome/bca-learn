import { useMemo, useCallback } from 'react';
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

  const progressMap: ProgressMap = useMemo(() => {
    return progressList.reduce((acc, progress) => {
      acc[progress.lesson_id] = progress.status;
      return acc;
    }, {} as ProgressMap);
  }, [progressList]);

  const calculateModuleProgress = useCallback((lessons: any[]): Record<string, ModuleProgress> => {
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
  }, [progressMap]);

  const overallPercent = useMemo(() => {
    if (totalLessonsCount === 0) return 0;
    const completedCount = progressList.filter(p => p.status === 'completed').length;
    return Math.round((completedCount / totalLessonsCount) * 100);
  }, [progressList, totalLessonsCount]);

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
    // OPTIMISTIC UPDATE LOGIC START
    onMutate: async (lessonId: string) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['progress', userId] });

      // 2. Snapshot the previous value so we can roll back if needed
      const previousProgress = queryClient.getQueryData<UserProgress[]>(['progress', userId]);

      // 3. Optimistically update the cache
      queryClient.setQueryData<UserProgress[]>(['progress', userId], (old = []) => {
        const existingIndex = old.findIndex(p => p.lesson_id === lessonId);
        const optimisticRecord: UserProgress = {
          id: existingIndex >= 0 ? old[existingIndex].id : 'temp-id', 
          user_id: userId,
          lesson_id: lessonId,
          status: 'completed',
          completed_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const newData = [...old];
          newData[existingIndex] = optimisticRecord;
          return newData;
        } else {
          return [...old, optimisticRecord];
        }
      });

      // 4. Return context object with the snapshotted value
      return { previousProgress };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context?.previousProgress) {
        queryClient.setQueryData(['progress', userId], context.previousProgress);
      }
    },
    // Always refetch after error or success to sync up completely with the server
    onSettled: () => {
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
    // OPTIMISTIC UPDATE LOGIC START
    onMutate: async (lessonId: string) => {
      await queryClient.cancelQueries({ queryKey: ['progress', userId] });
      const previousProgress = queryClient.getQueryData<UserProgress[]>(['progress', userId]);

      queryClient.setQueryData<UserProgress[]>(['progress', userId], (old = []) => {
        const existingIndex = old.findIndex(p => p.lesson_id === lessonId);
        const optimisticRecord: UserProgress = {
          id: existingIndex >= 0 ? old[existingIndex].id : 'temp-id',
          user_id: userId,
          lesson_id: lessonId,
          status: 'in_progress',
          last_accessed: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const newData = [...old];
          newData[existingIndex] = optimisticRecord;
          return newData;
        } else {
          return [...old, optimisticRecord];
        }
      });

      return { previousProgress };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousProgress) {
        queryClient.setQueryData(['progress', userId], context.previousProgress);
      }
    },
    onSettled: () => {
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