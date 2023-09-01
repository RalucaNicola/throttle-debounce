import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Graphic from "@arcgis/core/Graphic";
import { AppDispatch, RootState } from "../../storeConfiguration";
import { view } from "./viewInit";
import { debounce, throttle } from "../../../utils/utils";
import { addDebounceData, addEventData, addPromiseData, addThrottledData } from "../recordingInfo";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";

interface GraphicHit {
    graphic: Graphic;
}

const listeners: IHandle[] = [];
export const initializeEventListeners = () => (dispatch: AppDispatch) => {
    if (view) {
        const listener = reactiveUtils.on(
            () => view,
            "pointer-move",
            () => {
                dispatch(addEventData())
            }
        );

        listeners.push(listener);

        const listener2 = reactiveUtils.on(
            () => view,
            "pointer-move",
            throttle(() => {
                dispatch(addThrottledData())
            }, 500)
        );
        listeners.push(listener2);

        const listener3 = reactiveUtils.on(
            () => view,
            "pointer-move",
            debounce(() => {
                dispatch(addDebounceData())
            }, 100)
        );
        listeners.push(listener3);

        const queryName = promiseUtils.debounce((evt: __esri.ViewPointerMoveEvent) => {
            console.log("Debounced async function")
            return view.hitTest(evt);
        })

        const listener4 = reactiveUtils.on(
            () => view,
            "pointer-move",
            (evt) => {
                queryName(evt).then((results) => { dispatch(addPromiseData(1)); console.log(results) })
                    .catch(error => { dispatch(addPromiseData(2)); console.log(error) })
            }
        );
        listeners.push(listener4);

    }
}

export const removeEventListeners = () => {
    listeners.forEach(listener => listener.remove());
}

