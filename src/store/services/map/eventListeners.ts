import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Graphic from "@arcgis/core/Graphic";
import { AppDispatch, RootState } from "../../storeConfiguration";
import { view } from "./viewInit";
import { throttle } from "../../../utils/utils";
import { addEventData, addThrottledData } from "../recordingInfo";

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

    }
}

export const removeEventListeners = () => {
    listeners.forEach(listener => listener.remove());
}

