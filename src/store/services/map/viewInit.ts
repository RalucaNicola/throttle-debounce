import PortalItem from '@arcgis/core/portal/PortalItem';
import WebMap from '@arcgis/core/WebMap';
import { mapConfig } from '../../../config';
import MapView from '@arcgis/core/views/MapView';
import { AppDispatch } from '../../storeConfiguration';
import { setViewLoaded } from '../app-loading/loadingSlice';


export let view: MapView | null = null;

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
            //window.view = mapView;
        });
    } catch (error) {
        console.log(error);
    }
};