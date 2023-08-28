import './App.css';
import { Container } from '@mui/material';
import Forecast from './components/Forecast';

function App() {
  return (
    <div className="App">
      <Container sx={{ maxWidth: '80%' }}>
        <Forecast />
      </Container>
    </div>
  );
}

export default App;
