import { layerConfig } from "../../../config";


export let countriesLayer: __esri.FeatureLayer | null = null;
export function initializeCountriesLayer(view: __esri.MapView) {
    countriesLayer = view.map.layers.find(layer => layer.title === layerConfig.title) as __esri.FeatureLayer;
    countriesLayer.outFields = [layerConfig.field];
}

export function queryLayer(mapPoint: __esri.Point) {
    return countriesLayer.queryFeatures({ where: "1=1", returnGeometry: true, geometry: mapPoint, spatialRelationship: "intersects" });
}