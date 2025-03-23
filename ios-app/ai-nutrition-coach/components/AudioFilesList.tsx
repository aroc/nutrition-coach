import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import db from '../db/db';
import AudioFileItem from './AudioFileItem';
import { ThemedText } from '@/components/ThemedText';
import { audioFiles as audioFilesTable } from '@/db/schema';
import { AudioFile } from '../types';

type AudioFilesListProps = {
  onAudioFilePress: (audioFile: AudioFile) => void;
  activeIds?: string[];
};

export default function AudioFilesList({ onAudioFilePress, activeIds }: AudioFilesListProps) {
  const { data } = useLiveQuery(
    db.select().from(audioFilesTable)
  );
  const audioFiles = data || [];

  return (
    <View style={styles.container}>
      {audioFiles.map((item) => (
        <View key={item.id.toString()} style={styles.itemWrapper}>
          <AudioFileItem
            audioFile={item as AudioFile}
            onPress={onAudioFilePress}
            isActive={activeIds?.includes(item.id)}
            containerStyle={{
              height: 78,
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemWrapper: {
    width: '47%',
  },
});
