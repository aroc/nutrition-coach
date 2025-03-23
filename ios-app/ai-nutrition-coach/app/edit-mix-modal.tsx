import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { mixes as mixesTable } from '@/db/schema';
import { Mix } from '../types/index';
import { stopPlayingMix } from '../lib/audio-manager-utils';
import { useAppStore } from '@/state/store';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import db from '@/db/db';
import { eq } from 'drizzle-orm';
import EditMixView from '@/components/EditMixView';

export default function EditMixModal() {
  const { setNowPlayingMix } = useAppStore.getState();
  const router = useRouter();

  const { mixid: mixId } = useLocalSearchParams<{ mixid: string }>();

  const { data } = useLiveQuery(
    db.select().from(mixesTable).where(eq(mixesTable.id, mixId ?? "")),
    [mixId]
  );
  const mix = data?.[0] != null ? data[0] as Mix : null;

  const handleCloseModal = useCallback(async () => {
    router.back();
  }, [router]);

  useEffect(() => {
    stopPlayingMix();
    setNowPlayingMix(mix);
  }, [mix]);

  if (mix == null) return null;

  return (
    <EditMixView
      mix={mix}
      onCloseModal={handleCloseModal}
    />
  );
}