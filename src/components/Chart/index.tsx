import * as styles from './Chart.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeConfiguration';

const Chart = () => {
  const frameData = useSelector((state: RootState) => {
    return state.recordingInfo.frameData;
  });
  return (
    <>
      <p className={styles.eventTitle}>Event fires</p>
      <div className={styles.container}>
        {frameData.map((frame, index) => {
          return <div key={index} className={`${styles.itemEvent} ${frame.event ? styles.checked : ''}`}></div>;
        })}
      </div>
      <p className={styles.throttleTitle}>Throttled function runs (wait time of 500ms)</p>
      <div className={styles.container}>
        {frameData.map((frame, index) => {
          return <div key={index} className={`${styles.itemThrottle} ${frame.throttle ? styles.checked : ''}`}></div>;
        })}
      </div>
      <p className={styles.debounceTitle}>Debounced function runs (wait time of 100ms)</p>
      <div className={styles.container}>
        {frameData.map((frame, index) => {
          return <div key={index} className={`${styles.itemDebounce} ${frame.debounce ? styles.checked : ''}`}></div>;
        })}
      </div>
      <p className={styles.promiseTitle}>
        Debounced async function gets <span className={styles.aborted}>aborted</span> or is{' '}
        <span className={styles.successful}>successful</span>
      </p>
      <div className={styles.container}>
        {frameData.map((frame, index) => {
          return (
            <div
              key={index}
              className={`${styles.itemPromise} ${
                frame.promise === 2 ? styles.aborted : frame.promise === 1 ? styles.successful : ''
              }`}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export default Chart;
