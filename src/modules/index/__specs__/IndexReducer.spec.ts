import * as nock from 'nock';
import { ActionsObservable } from 'redux-observable';
import * as HttpTest from '../../../utils/HttpTest';
import configureStore from '../../../redux/store';
import Todo from '../../../common/Todo';
import IndexReducer, {
    GET_WEATHER,
    getWeather,
    GetWeatherAction,
    GET_WEATHER_SUCCESS,
    getWeatherSuccess,
    GetWeatherSuccessAction,
    GET_WEATHER_FAIL,
    getWeatherFail,
    GetWeatherFailAction,
    getWeatherEpic,
    SET_TITLE,
    setTitle,
    SAVE_TODO,
    saveTodo,
    SaveTodoAction,
    saveTodoEpic,
    SAVE_TODO_SUCCESS,
    saveTodoSuccess,
    SET_DONE,
    setDone,
    SetDoneAction,
    setDoneEpic,
    SET_DONE_SUCCESS,
    setDoneSuccess,
    IndexState,
} from '../IndexReducer';

describe('IndexReducer', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should set the correct state on getWeather', () => {
        const lat = 123.34;
        const lon = 43.321;
        const action: GetWeatherAction = getWeather(lat, lon);
        expect(action).toEqual({ type: GET_WEATHER, payload: { lat, lon } });
        expect(IndexReducer(undefined, action).loading).toBeTruthy();
    });

    it('should set the correct state on getWeatherSuccess', () => {
        const payload = 'Cloudy';
        const action: GetWeatherSuccessAction = getWeatherSuccess(payload);
        expect(action).toEqual({ type: GET_WEATHER_SUCCESS, payload });
        const state: IndexState = IndexReducer(undefined, action);
        expect(state.weather).toEqual(payload);
        expect(state.loading).toBeFalsy();
    });

    it('should set the correct state on getWeatherFail', () => {
        const action: GetWeatherFailAction = getWeatherFail();
        expect(action).toEqual({ type: GET_WEATHER_FAIL });
        expect(IndexReducer(undefined, action).loading).toBeFalsy();
    });

    describe('getWeatherEpic', () => {
        beforeEach(() => HttpTest.beforeEachFunction('https://api.openweathermap.org/data/2.5'));
        /* tslint:disable:no-magic-numbers */
        it('should return the correct effects on success', async () => {
            const lat = 123.34;
            const lon = 43.321;
            const payload = 'Windy';
            HttpTest.nockTestApi('https://api.openweathermap.org/data/2.5')
                .get(`/weather?lat=${lat}&lon=${lon}`)
                .reply(200, { weather: [{ main: payload }] });
            return await getWeatherEpic(ActionsObservable.of(getWeather(lat, lon)), undefined)
                .forEach(actionReceived => expect(actionReceived).toEqual(getWeatherSuccess(payload)));
        });
        
        it('should return the correct effect on fail', async () => {
            const lat = 123.34;
            const lon = 43.321;
            HttpTest.nockTestApi('https://api.openweathermap.org/data/2.5')
                .get(`/weather?lat=${lat}&lon=${lon}`)
                .reply(500, undefined);
            return await getWeatherEpic(ActionsObservable.of(getWeather(lat, lon)), undefined)
                .forEach(actionReceived => expect(actionReceived).toEqual(getWeatherFail()));
        });
        /* tslint:enable:no-magic-numbers */
    });

    it('should set the correct title as payload on setTitle', () => {
        const payload = 'THIS_IS_A_TEST_TITLE';
        const setTitleAction = setTitle(payload);
        expect(setTitleAction).toEqual({ type: SET_TITLE, payload });
        const newState = IndexReducer(undefined, setTitleAction);
        expect(newState.title).toEqual(payload);
    });

    it('should set the correct values on saveTodo', () => {
        const saveTodoAction = saveTodo();
        expect(saveTodoAction).toEqual({ type: SAVE_TODO });
        const newState = IndexReducer(undefined, saveTodoAction);
        expect(newState.loading).toBeTruthy();
    });

    it('should trigger the correct action on saveTodoEpic', async () => {
        return await saveTodoEpic(ActionsObservable.of(saveTodo()), { getState: () => undefined, dispatch: () => {} })
            .forEach(actionReceived =>
                expect(actionReceived)
                    .toEqual(saveTodoSuccess()));
    });

    it('should set the correct values on saveTodoSuccess', () => {
        const initialState: IndexState = { title: 'TEST', todos: [], loading: true };
        const saveTodoSuccessAction = saveTodoSuccess();
        expect(saveTodoSuccessAction).toEqual({ type: SAVE_TODO_SUCCESS });
        const newState = IndexReducer(initialState, saveTodoSuccessAction);
        expect(newState.title).toEqual('');
        expect(newState.todos[0].done).toBeFalsy();
        expect(newState.todos[0].number).toEqual(1);
        expect(newState.todos[0].title).toEqual(initialState.title);
        expect(newState.loading).toBeFalsy();
    });

    it('should set the correct values on setDone', () => {
        const setDoneAction = setDone(0);
        expect(setDoneAction).toEqual({ type: SET_DONE, payload: 0 });
        const newState = IndexReducer(undefined, setDoneAction);
        expect(newState.loading).toBeTruthy();
    });

    it('should trigger the correct action on setDoneEpic', async () => {
        return await setDoneEpic(ActionsObservable.of(setDone(0)), { getState: () => undefined, dispatch: () => {} })
            .forEach(actionReceived =>
                expect(actionReceived)
                    .toEqual(setDoneSuccess(0)));
    });

    it('should set the correct values on setDoneSuccess', () => {
        const initialState = { title: '', todos: [new Todo(0, '')], loading: true };
        const setDoneSuccessAction = setDoneSuccess(0);
        expect(setDoneSuccessAction).toEqual({ type: SET_DONE_SUCCESS, payload: 0 });
        const newState = IndexReducer(initialState, setDoneSuccessAction);
        expect(newState.loading).toBeFalsy();
        expect(newState.todos[0].done).toBeTruthy();
        expect(newState.todos[0].number).toEqual(initialState.todos[0].number);
        expect(newState.todos[0].title).toEqual(initialState.todos[0].title);
    });
});
