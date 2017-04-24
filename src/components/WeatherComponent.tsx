import * as React from 'react';

export interface IWeatherComponentProps {
    readonly weather?: string;
    getWeather(lat: number, lon: number): void;
}

export default class WeatherComponent extends React.Component<IWeatherComponentProps, undefined> {
    componentDidMount() {
        const { weather, getWeather } = this.props;
        if (!weather) {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(position =>
                    getWeather(position.coords.latitude, position.coords.longitude));
            } else {
                // Client didn't give permission to use geolocation, using Helsinki coordinates
                const helLat = 60.1699;
                const helLon = 24.9384;
                getWeather(helLat, helLon);
            }
        }
    }

    render() {
        return (<div className="current-weather">Current weather: {this.props.weather}</div>);
    }
}
