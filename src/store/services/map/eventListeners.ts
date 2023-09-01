import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Graphic from "@arcgis/core/Graphic";
import { AppDispatch, RootState } from "../../storeConfiguration";
import { addGraphic, view } from "./viewInit";
import { debounce, throttle } from "../../../utils/utils";
import { addDebounceData, addEventData, addPromiseData, addThrottledData } from "../recordingInfo";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import { queryLayer } from "./countriesLayer";

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
                dispatch(addEventData());
            }
        );

        listeners.push(listener);

        const listener2 = reactiveUtils.on(
            () => view,
            "pointer-move",
            throttle((evt: __esri.ViewPointerMoveEvent) => {
                const mapPoint = view.toMap(evt);
                addGraphic(mapPoint, "throttle");
                console.log("throttle", mapPoint.latitude, mapPoint.longitude, evt.x, evt.y);
                dispatch(addThrottledData())
            }, 500)
        );
        listeners.push(listener2);

        const listener3 = reactiveUtils.on(
            () => view,
            "pointer-move",
            debounce((evt: __esri.ViewPointerMoveEvent) => {
                const mapPoint = view.toMap(evt);
                addGraphic(mapPoint, "debounce");
                console.log("debounce", mapPoint.latitude, mapPoint.longitude);
                dispatch(addDebounceData())
            }, 100)
        );
        listeners.push(listener3);

        const queryFeature = promiseUtils.debounce((mapPoint: __esri.Point) => {
            return queryLayer(mapPoint);
        })

        const listener4 = reactiveUtils.on(
            () => view,
            "pointer-move",
            (evt) => {
                const mapPoint = view.toMap(evt);
                queryFeature(mapPoint).then(() => {
                    dispatch(addPromiseData(1));
                    addGraphic(mapPoint, "promiseSuccess");
                    console.log("promise", mapPoint.latitude, mapPoint.longitude);
                })
                    .catch(() => { dispatch(addPromiseData(2)) })
            }
        );
        listeners.push(listener4);

    }
}

export const removeEventListeners = () => {
    listeners.forEach(listener => listener.remove());
}

