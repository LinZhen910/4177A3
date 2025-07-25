import type { DeleteAccountSuccessPayload, UpdateAccountInfo, UpdateAccountSuccessPayload} from "~/features/users/types";
import { AccountActionTypes, type AccountActions } from "./Account-actionTypes";
import type { ThunkAction } from 'redux-thunk';
import { type AppState } from "~/redux/store";
import * as accountApi from '~/features/users/services/accountApi';

// add new
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// add new
const getCachedData = (key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedData = (key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
};

export const updateAccount = (
    updateData: UpdateAccountInfo
): ThunkAction<Promise<UpdateAccountSuccessPayload>, AppState, unknown, AccountActions> => {
    return async (dispatch) => {
        dispatch({
            type: AccountActionTypes.UPDATE_ACCOUNT_REQUEST,
            payload: updateData,
        });
        try {
            const updated = await accountApi.updateUserInfo(updateData);
            
            // add new
            setCachedData(`user_${updateData.id}`, updated);
            
            dispatch({
                type: AccountActionTypes.UPDATE_ACCOUNT_SUCCESS,
                payload: updated 
            })
            console.log("updated user is: ", updated);
            return updated;
        } catch (error: any) {
            dispatch({
                type: AccountActionTypes.UPDATE_ACCOUNT_FAILURE,
                payload: { error: error.message || "Update failed."}
            })
            throw error;
        }
    }
}

export const deleteAccount =  (
    deleteId: string
): ThunkAction<Promise<DeleteAccountSuccessPayload>, AppState, unknown, AccountActions> => {
    return async (dispatch) => {
        dispatch({
            type: AccountActionTypes.DELETE_ACCOUNT_REQUEST,
            payload: {id: deleteId}
        });
        try {
            const deletedAccount = await accountApi.deleteAccount(deleteId);
            
            // add new
            cache.delete(`user_${deleteId}`);
            
            dispatch({
                type: AccountActionTypes.DELETE_ACCOUNT_SUCCESS,
                payload: deletedAccount
            })
            return deletedAccount;
        } catch (error: any) {
            dispatch({
                type: AccountActionTypes.DELETE_ACCOUNT_FAILURE,
                payload: {error: error.message || "Delete account failed."}
            })
        }
    }
}