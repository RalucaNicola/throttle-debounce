import * as styles from './Chart.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeConfiguration';

const Chart = () => {
  const frameData = useSelector((state: RootState) => {
    return state.recordingInfo.frameData;
  });
  return (
    <>
      <p>Events</p>
      <div className={styles.container}>
        {frameData.map((frame, index) => {
          return (
            <div
              key={index}
              className={styles.item}
              style={{ backgroundColor: frame.event ? 'white' : 'transparent' }}
            ></div>
          );
        })}
      </div>
      <p>Throttled function call</p>
      <div className={styles.container}>
        {frameData.map((frame, index) => {
          return (
            <div
              key={index}
              className={styles.item}
              style={{ backgroundColor: frame.throttle ? 'white' : 'transparent' }}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export default Chart;
