import { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CircularProgress } from "@mui/material";

async function build_weather_data_url(): Promise<string> {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
    if (!("geolocation" in navigator)) {
        console.log("Geolocation service not available.");
        alert("Cannot find location automatically. Getting weather data for Chicago.");
        return `${BASE_URL}/weather_data?latitude=41.881832&longitude=-87.623177`;
    }
    
    const getCoords = async () => {
        const pos: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
            long: pos.coords.longitude,
            lat: pos.coords.latitude,
        };
    };

    try {
        const {lat, long} = await getCoords();
        return `${BASE_URL}/weather_data?latitude=${lat}&longitude=${long}`;
    } catch {
        console.log("Geolocation service not available.");
        alert("Cannot find location automatically. Getting weather data for Chicago.");
        return `${BASE_URL}/weather_data?latitude=41.881832&longitude=-87.623177`;
    }
}

function Forecast() {
    const [forecastData, setForecastData] = useState<any>(null);
    const [count, setCount] = useState(0);
    
    async function getData() {
        const url = await build_weather_data_url();
        console.log(url);
        axios.get(url).then((response) => {
            setForecastData(response.data);
        }).catch((reason) => {
            console.log(`Could not update forecast data. Reason: ${reason}`);
        });
    }

    useEffect(() => {
        // Initialize weather data on initial mount
        getData();
    }, []); 

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((count + 1) % 60);
        }, 1000);

        if (count === 0) {
            getData()
        }
        
        return () => clearInterval(interval);
    }, [count]);

    return (
        <>
            <Card>
            {
                forecastData ? (
                    <>
                    {forecastData?.properties?.periods[0]?.temperature}
                    </>
                ) : (
                    <CircularProgress />
                )
            }
            </Card>
        </>
    );
}

export default Forecast;