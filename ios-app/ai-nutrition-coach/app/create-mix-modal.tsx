import React, { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { createMix, deleteMix } from '@/lib/entity-actions';
import { useRouter } from 'expo-router';
import { mixes as mixesTable } from '@/db/schema';
import { Mix } from '../types/index';
import { stopPlayingMix } from '../lib/audio-manager-utils';
import { useAppStore } from '@/state/store';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import db from '@/db/db';
import { eq } from 'drizzle-orm';
import EditMixView from '@/components/EditMixView';


const getDefaultMixName = () => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  return `${dayName}'s new mix`;
};


export default function CreateMixModal() {
  const { setNowPlayingMix } = useAppStore.getState();
  const router = useRouter();

  const [draftMixId, setDraftMixId] = useState<Mix['id'] | null>(null);

  const { data } = useLiveQuery(
    db.select().from(mixesTable).where(eq(mixesTable.id, draftMixId ?? "")),
    [draftMixId]
  );
  const draftMix = data?.[0] != null ? data[0] as Mix : null;

  useEffect(() => {
    const init = async () => {
      const newMix = await createMix({
        name: getDefaultMixName(),
        audioFiles: [],
        isTemporary: true,
        setMixAsNowPlayingAfterCreate: true,
      });

      if (newMix) {
        setDraftMixId(newMix.id);
      }
    }

    init();
  }, []);

  const handleCloseModal = useCallback(async () => {
    if (draftMix == null) {
      router.back();
      return;
    }

    if (draftMix.audioFiles.length > 0) {
      Alert.alert(
        'Discard mix?',
        'Are you sure you want to throw away this mix?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: async () => {
              await stopPlayingMix();
              await deleteMix(draftMix.id);
              setNowPlayingMix(null);
              router.back();
            }
          }
        ]
      );
      return;
    } else {
      stopPlayingMix();
      deleteMix(draftMix.id);
      setNowPlayingMix(null);
      router.back();
    }
  }, [router, draftMix, setNowPlayingMix]);

  useEffect(() => {
    setNowPlayingMix(draftMix);
  }, [draftMix]);

  if (draftMix == null) return null;

  return (
    <EditMixView
      mix={draftMix}
      onCloseModal={handleCloseModal}
    />
  );
}