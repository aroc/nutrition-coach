import { AudioManager } from "../types";
import iOSAudioManager from "./iOSAudioManager";

let audioManager: AudioManager | null = null;

const getAudioManagerClass = (): typeof iOSAudioManager => {
  // todo: support Android
  return iOSAudioManager;
};

const getAudioManagerInstance = (): AudioManager => {
  if (!audioManager) {
    const AudioManagerClass = getAudioManagerClass();
    audioManager = new AudioManagerClass({});
  }
  return audioManager;
}

export default getAudioManagerInstance;