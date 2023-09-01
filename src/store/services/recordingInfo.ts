import { PayloadAction, createSlice } from '@reduxjs/toolkit';
const frames = 60;
interface FrameData {
    debounce: number | null
    throttle: number | null
    event: number | null
    promise: number | null
}
const defaultFrameData: FrameData = { event: null, throttle: null, debounce: null, promise: null }

export interface ChartData {
    frameData: Array<FrameData>
}

const initialState = {
    frameData: Array(frames).fill({ ...defaultFrameData })
} as ChartData;

const recordingSlice = createSlice({
    name: 'recording',
    initialState,
    reducers: {
        addFrameData(state) {
            state.frameData.shift();
            state.frameData.push({ ...defaultFrameData });
        },
        addEventData(state) {
            state.frameData[frames - 1] = { ...state.frameData[frames - 1], event: 1 }
        },
        addThrottledData(state) {
            state.frameData[frames - 1] = { ...state.frameData[frames - 1], throttle: 1 }
        },
        addDebounceData(state) {
            state.frameData[frames - 1] = { ...state.frameData[frames - 1], debounce: 1 }
        },
        addPromiseData(state, param: PayloadAction<number | null>) {
            state.frameData[frames - 1] = { ...state.frameData[frames - 1], promise: param.payload }
        }
    }
});

export const { addFrameData, addEventData, addThrottledData, addDebounceData, addPromiseData } = recordingSlice.actions;
export default recordingSlice.reducer;
