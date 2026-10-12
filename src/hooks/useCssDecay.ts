import { useEffect } from 'react';
import { CssDecayStage } from '../lib/types';
import { soundEngine } from '../lib/soundEngine';

export function useCssDecay(stage: CssDecayStage) {
  useEffect(() => {
    // Remove all previous stage classes
    document.body.classList.remove(
      'decay-stage-1',
      'decay-stage-2',
      'decay-stage-3',
      'decay-stage-4',
      'decay-stage-5'
    );

    if (stage > 0) {
      document.body.classList.add(`decay-stage-${stage}`);
      soundEngine.playGlitch();
    }
  }, [stage]);
}

