import * as React from 'react';
import { mount } from 'enzyme';
import WeatherComponent from '../WeatherComponent';

describe('WeatherComponent', () => {
    const latitude = 60.1699;
    const longitude = 24.9384;
    const weather = 'cloudy';
    const getWeather = jest.fn();
    const notCalled = jest.fn();
    const wrapperCall = mount(<WeatherComponent getWeather={getWeather} />);
    const wrapperNoCall = mount(<WeatherComponent weather={weather} getWeather={notCalled} />);

    it('should render correctly', () => {
        expect(wrapperCall).toMatchSnapshot();
        expect(wrapperNoCall).toMatchSnapshot();
    });

    it('should have called getWeather on mount', () => {
        expect(getWeather).toBeCalledWith(latitude, longitude);
    });

    it('should not have called getWeather', () => {
        expect(notCalled).toHaveBeenCalledTimes(0);
    });
});
