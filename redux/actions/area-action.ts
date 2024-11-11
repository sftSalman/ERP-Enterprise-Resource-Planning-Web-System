import { Dispatch } from '@reduxjs/toolkit';

import axios from "@/utils/axios";
import * as Types from "@/redux/types/area-type";
import { ISelect2Item } from '@/redux/interfaces';

export const getAreasDropdownListAction = () => (dispatch: Dispatch) => {
    dispatch({
        type: Types.GET_AREA_DROPDOWN,
        payload: {
            data: [],
            loading: true
        }
    });

    axios.get(`/areas/dropdown/list?all_areas=1`)
        .then((res) => {
            dispatch({
                type: Types.GET_AREA_DROPDOWN,
                payload: {
                    data: res.data,
                    loading: false
                }
            });
        });
}

export const setNomineeDefaultAreaListAction = (areas: Array<ISelect2Item>) => (dispatch: Dispatch) => {
    dispatch({
        type: Types.SET_NOMINEE_DEFAULT_AREA_DROPDOWN,
        payload: areas ?? []
    });
}

export function getAreasByCity(cityId: number, areas: Array<ISelect2Item>) {
    if (areas?.length > 0) {
        return areas.filter(area => parseInt(area.city_id ?? '0') === parseInt(cityId + ''));
    }

    return [];
}