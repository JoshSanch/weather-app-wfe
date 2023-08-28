import './App.css';
import { AppBar, Button, Container, Divider, Toolbar, Typography } from '@mui/material';
import Forecast from './components/Forecast';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography marginRight={"16px"}>Weather Monitor Service</Typography>
          <Divider orientation='vertical' flexItem color='black' sx={{ width: "4px" }}/>
          <Button sx={{ marginLeft: "10px" }} color="inherit">Home</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ maxWidth: '80%', marginTop: "40px"}}>
        <Forecast />
      </Container>

      <footer style={{marginTop: "20px"}}>
        Icons by <a target="_blank" href="https://icons8.com">Icons8</a>
      </footer>
    </div>
  );
}

export default App;
