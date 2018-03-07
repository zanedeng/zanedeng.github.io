import { handleActions, Action } from 'redux-actions';
import IUser from '../interfaces/IUser';
import IUserActPayload from '../interfaces/IUserActPayload';

const initalState = {

};

export const userKey: string = 'userInfo';

export const userReducer = handleActions<IUser, IUserActPayload>(
    {

    },
    initalState);