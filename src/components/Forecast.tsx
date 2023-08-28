import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Card, CircularProgress, Grid } from "@mui/material";

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
        axios.get(url).then((response) => {
            setForecastData(response.data);
        }).catch((reason) => {
            console.log(`Could not update forecast data. Reason: ${reason}`);
        });
    }

    function getIcon(weatherStatus: string) {
        switch(weatherStatus) {
            case "Sunny":
                return (
                    <svg style={{marginLeft: "auto", marginBottom: "4px"}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                        <radialGradient id="w~INujfpQanMh___D7Au2a_8EUmYhfLPTCF_gr1" cx="24" cy="24" r="22" gradientUnits="userSpaceOnUse"><stop offset=".724" stop-color="#ffed54"></stop><stop offset=".779" stop-color="#ffe649"></stop><stop offset=".877" stop-color="#ffd22d"></stop><stop offset="1" stop-color="#ffb300"></stop></radialGradient><path fill="url(#w~INujfpQanMh___D7Au2a_8EUmYhfLPTCF_gr1)" d="M24,2l1.421,1.474c0.93,0.965,2.388,1.196,3.571,0.566l1.807-0.963l0.896,1.841	c0.586,1.205,1.902,1.876,3.222,1.641l2.016-0.357l0.283,2.028c0.185,1.328,1.229,2.371,2.557,2.557l2.028,0.283l-0.357,2.016	c-0.234,1.32,0.436,2.635,1.641,3.222l1.841,0.896l-0.963,1.807c-0.631,1.183-0.4,2.641,0.566,3.571L46,24l-1.474,1.421	c-0.965,0.93-1.196,2.388-0.566,3.571l0.963,1.807l-1.841,0.896c-1.205,0.586-1.876,1.902-1.641,3.222l0.357,2.016l-2.028,0.283	c-1.328,0.185-2.371,1.229-2.557,2.557l-0.283,2.028l-2.016-0.357c-1.32-0.234-2.635,0.436-3.222,1.641l-0.896,1.841l-1.807-0.963	c-1.183-0.631-2.641-0.4-3.571,0.566L24,46l-1.421-1.474c-0.93-0.965-2.388-1.196-3.571-0.566l-1.807,0.963l-0.896-1.841	c-0.586-1.205-1.902-1.876-3.222-1.641l-2.016,0.357l-0.283-2.028c-0.185-1.328-1.229-2.371-2.557-2.557l-2.028-0.283l0.357-2.016	c0.234-1.32-0.436-2.635-1.641-3.222l-1.841-0.896l0.963-1.807c0.631-1.183,0.4-2.641-0.566-3.571L2,24l1.474-1.421	c0.965-0.93,1.196-2.388,0.566-3.571l-0.963-1.807l1.841-0.896c1.205-0.586,1.876-1.902,1.641-3.222l-0.357-2.016l2.028-0.283	c1.328-0.185,2.371-1.229,2.557-2.557l0.283-2.028l2.016,0.357c1.32,0.234,2.635-0.436,3.222-1.641l0.896-1.841l1.807,0.963	c1.183,0.631,2.641,0.4,3.571-0.566L24,2z"></path><linearGradient id="w~INujfpQanMh___D7Au2b_8EUmYhfLPTCF_gr2" x1="8.092" x2="35.996" y1="8.092" y2="35.996" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fed100"></stop><stop offset="1" stop-color="#e36001"></stop></linearGradient><path fill="url(#w~INujfpQanMh___D7Au2b_8EUmYhfLPTCF_gr2)" d="M24,7C14.611,7,7,14.611,7,24s7.611,17,17,17s17-7.611,17-17S33.389,7,24,7z"></path>
                    </svg>
                );
            case "Rainy":
                return (
                    <img width="30" height="30" src="https://img.icons8.com/fluency/48/rainy-weather.png" alt="rainy-weather"/>
                );
            default:
                return <></>;
        }
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
        <Box height="80%">
            <Grid
                container
                height={"100%"}
                direction={"column"}
                justifyContent={"flex-end"}
                alignItems={"center"}>
                <Card sx={{
                    padding: "20px"
                }}>
                {
                    forecastData ? (
                        <>
                            {forecastData?.properties?.periods[0]?.shortForecast ?
                               (
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px"
                                }}>
                                    <span>
                                        {forecastData?.properties?.periods[0]?.shortForecast}
                                    </span>
                                    {getIcon(forecastData?.properties?.periods[0]?.shortForecast)}
                                </Box>
                               ) : (<></>)
                            }
                            <span>
                                Current Temperature: {forecastData?.properties?.periods[0]?.temperature}&deg;{forecastData?.properties?.periods[0]?.temperatureUnit}
                            </span>
                            <br></br>
                            <span>
                                Wind Speed: {forecastData?.properties?.periods[0]?.windSpeed || "N/A"} {'('}{forecastData?.properties?.periods[0]?.windDirection || "Direction Unknown"}{')'}
                            </span>
                        </>
                    ) : (
                        <CircularProgress />
                    )
                }
                </Card>
            </Grid>
        </Box>
    );
}

export default Forecast;