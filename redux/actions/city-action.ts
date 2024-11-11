import { Dispatch } from '@reduxjs/toolkit';

import axios from "@/utils/axios";
import * as Types from "@/redux/types/city-type";
import { ISelect2Item } from '@/redux/interfaces';

export const getCitiesDropdownListAction = () => (dispatch: Dispatch) => {
    dispatch({
        type: Types.GET_CITY_DROPDOWN,
        payload: {
            data: [],
            loading: true
        }
    });

    axios.get(`/cities/dropdown/list?all_city=1`)
        .then((res) => {
            dispatch({
                type: Types.GET_CITY_DROPDOWN,
                payload: {
                    data: res.data,
                    loading: false
                }
            });
        });
}

export const setNomineeDefaultCityListAction = (cities: Array<ISelect2Item>) => (dispatch: Dispatch) => {
    dispatch({
        type: Types.SET_NOMINEE_DEFAULT_CITY_DROPDOWN,
        payload: cities ?? []
    });
}

export function getCitiesByDivision(divisionId: number, cities: Array<ISelect2Item>) {
    if (cities?.length > 0) {
        return cities.filter(city => parseInt(city.division_id ?? '0') === parseInt(divisionId + ''));
    }

    return [];
}