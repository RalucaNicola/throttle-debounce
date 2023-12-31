import PortalItem from '@arcgis/core/portal/PortalItem';
import WebMap from '@arcgis/core/WebMap';
import { mapConfig } from '../../../config';
import MapView from '@arcgis/core/views/MapView';
import { AppDispatch } from '../../storeConfiguration';
import { setViewLoaded } from '../app-loading/loadingSlice';
import { initializeCountriesLayer } from './countriesLayer';
import Graphic from '@arcgis/core/Graphic';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';

export let view: MapView | null = null;

export function destroyView() {
    if (view) {
        view.destroy();
        view = null;
    }
}

export const initializeMapView = (divRef: HTMLDivElement) => async (dispatch: AppDispatch) => {
    try {
        const portalItem = new PortalItem({
            id: mapConfig['web-map-id']
        });

        await portalItem.load();
        const webmap = new WebMap({
            portalItem: portalItem
        });
        await webmap.load();
        const mapView = new MapView({
            container: divRef,
            map: webmap,
            padding: {
                top: 50,
                bottom: 0
            },
            ui: {
                components: []
            },
            constraints: {
                minZoom: 1
            },
            popup: {
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false
                },
                highlightEnabled: false,
                defaultPopupTemplateEnabled: false,
                autoOpenEnabled: false
            }
        });

        await mapView.when(() => {
            view = mapView;
            dispatch(setViewLoaded(true));
            window.view = mapView;
            initializeCountriesLayer(view);

        });
    } catch (error) {
        console.log(error);
    }
};

const colors = {
    event: 'rgb(254, 173, 97)',
    throttle: 'rgb(184, 137, 255)',
    debounce: 'rgb(137, 255, 243)',
    promiseSuccess: 'rgb(137, 255, 147)'
}
type GraphicType = keyof typeof colors;

export const addGraphic = (mapPoint: __esri.Point, type: GraphicType): void => {
    const graphic = new Graphic({
        geometry: mapPoint,
        symbol: new SimpleMarkerSymbol({
            color: colors[type],
            size: "10px",
            outline: {
                color: "white",
                width: "2px"
            }
        })
    });
    view.graphics.add(graphic);
}