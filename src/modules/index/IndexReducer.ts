import { MiddlewareAPI } from 'redux';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';
import { DefaultAction } from '../../redux/utils';
import Todo from '../../common/Todo';

const testDelay = 1000;

export class IndexState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
    readonly weather?: string;
}

export type GET_WEATHER = 'boilerplate/Index/GET_WEATHER';
export const GET_WEATHER: GET_WEATHER = 'boilerplate/Index/GET_WEATHER';
export type GET_WEATHER_SUCCESS = 'boilerplate/Index/GET_WEATHER_SUCCESS';
export const GET_WEATHER_SUCCESS: GET_WEATHER_SUCCESS = 'boilerplate/Index/GET_WEATHER_SUCCESS';
export type GET_WEATHER_FAIL = 'boilerplate/Index/GET_WEATHER_FAIL';
export const GET_WEATHER_FAIL: GET_WEATHER_FAIL = 'boilerplate/Index/GET_WEATHER_FAIL';
export type SET_TITLE = 'boilerplate/Index/SET_TITLE';
export const SET_TITLE: SET_TITLE = 'boilerplate/Index/SET_TITLE';
export type SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
export const SAVE_TODO: SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
export type SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
export const SAVE_TODO_SUCCESS: SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
export type SET_DONE = 'boilerplate/Index/SET_DONE';
export const SET_DONE: SET_DONE = 'boilerplate/Index/SET_DONE';
export type SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';
export const SET_DONE_SUCCESS: SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';

export type GetWeatherAction = { type: GET_WEATHER, payload: { lat: number, lon: number } };
export const getWeather = (lat: number, lon: number): GetWeatherAction => ({ type: GET_WEATHER, payload: { lat, lon } });
export type GetWeatherSuccessAction = { type: GET_WEATHER_SUCCESS, payload: string };
export const getWeatherSuccess = (weather: string): GetWeatherSuccessAction => ({ type: GET_WEATHER_SUCCESS, payload: weather });
export type GetWeatherFailAction = { type: GET_WEATHER_FAIL };
export const getWeatherFail = (): GetWeatherFailAction => ({ type: GET_WEATHER_FAIL });
export type SetTitleAction = { type: SET_TITLE, payload: string };
export const setTitle = (title: string): SetTitleAction => ({ type: SET_TITLE, payload: title });
export type SaveTodoAction = { type: SAVE_TODO };
export const saveTodo = (): SaveTodoAction => ({ type: SAVE_TODO });
export type SaveTodoSuccessAction = { type: SAVE_TODO_SUCCESS };
export const saveTodoSuccess = (): SaveTodoSuccessAction => ({ type: SAVE_TODO_SUCCESS });
export type SetDoneAction = { type: SET_DONE, payload: number };
export const setDone = (i: number) => ({ type: SET_DONE, payload: i });
export type SetDoneSuccessAction = { type: SET_DONE_SUCCESS, payload: number };
export const setDoneSuccess = (i: number): SetDoneSuccessAction => ({ type: SET_DONE_SUCCESS, payload: i });

export type IndexActions = GetWeatherAction
    | GetWeatherSuccessAction
    | GetWeatherFailAction
    | SetTitleAction
    | SaveTodoAction
    | SaveTodoSuccessAction
    | SetDoneAction
    | SetDoneSuccessAction
    | DefaultAction;

interface IWeatherResponse {
    weather: [{
        main: string,
    }];
}

export const getWeatherEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(GET_WEATHER).mergeMap((action: GetWeatherAction) =>
        ajax.getJSON<IWeatherResponse>(`https://api.openweathermap.org/data/2.5/weather?lat=${action.payload.lat}&lon=${action.payload.lon}`)
            .map(response => getWeatherSuccess(response.weather[0].main))
            .catch(() => ActionsObservable.of(getWeatherFail())));

export const saveTodoEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SAVE_TODO)
        .delay(testDelay)
        .mapTo(saveTodoSuccess());

export const setDoneEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SET_DONE)
        .delay(testDelay)
        .map((action: SetDoneAction) => setDoneSuccess(action.payload));

const IndexReducer = (state: IndexState = new IndexState(), action: IndexActions = DefaultAction): IndexState => {
    switch (action.type) {
        case GET_WEATHER:
            return { ...state, loading: true };
        case GET_WEATHER_SUCCESS:
            return { ...state, loading: false, weather: action.payload };
        case GET_WEATHER_FAIL:
            return { ...state, loading: false };
        case SET_TITLE:
            return { ...state, title: action.payload };
        case SAVE_TODO:
            return { ...state, loading: true };
        case SAVE_TODO_SUCCESS:
            return {
                ...state,
                title: '',
                todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
                loading: false,
            };
        case SET_DONE:
            return { ...state, loading: true };
        case SET_DONE_SUCCESS:
            return {
                ...state,
                todos: state.todos.map(t => t.number === action.payload ? t.setDone() : t),
                loading: false,
            };
        default:
            return state;
    }
};

export const IndexEpics = combineEpics(getWeatherEpic, saveTodoEpic, setDoneEpic);

export default IndexReducer;
