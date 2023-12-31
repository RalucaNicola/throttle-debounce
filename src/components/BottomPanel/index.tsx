import * as styles from './BottomPanel.module.css';
import '@esri/calcite-components/dist/components/calcite-action';
import '@esri/calcite-components/dist/components/calcite-button';
import { CalciteAction, CalciteButton } from '@esri/calcite-components-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Chart from '../Chart';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { initializeEventListeners, removeEventListeners } from '../../store/services/map/eventListeners';
import { addFrameData } from '../../store/services/recordingInfo';

let animationId: number = null;

const BottomPanel = () => {
  const [visible, setVisible] = useState(true);
  const [recording, setRecording] = useState(false);
  const dispatch = useAppDispatch();
  const togglePanel = () => {
    setVisible(!visible);
  };

  function startRecording() {
    animationId = setTimeout(startRecording, 100);
    dispatch(addFrameData());
  }

  const getHeader = () => {
    return (
      <div className={styles.actionsContainer}>
        <div className={styles.leftActionsContainer}>Start recording and then hover over the map</div>
        <div className={styles.rightActionsContainer}>
          <CalciteAction
            icon={visible ? 'chevronDown' : 'chevronUp'}
            scale='s'
            appearance='transparent'
            onClick={togglePanel}
            text=''
          ></CalciteAction>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {getHeader()}
      <motion.div layout='size' animate={{ height: visible ? 'auto' : 0 }} style={{ overflow: 'hidden' }}>
        <Chart></Chart>
        <div className={styles.buttonContainer}>
          {recording ? (
            <CalciteButton
              appearance='outline'
              icon-start='pause'
              round
              scale='l'
              onClick={() => {
                setRecording(false);
                clearTimeout(animationId);
                animationId = null;
                removeEventListeners();
              }}
            >
              Stop recording
            </CalciteButton>
          ) : (
            <CalciteButton
              appearance='outline'
              icon-start='play'
              round
              scale='l'
              onClick={() => {
                setRecording(true);
                startRecording();
                dispatch(initializeEventListeners());
              }}
            >
              Start recording
            </CalciteButton>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BottomPanel;
