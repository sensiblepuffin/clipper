import './App.css';
import { Grid } from '@mui/material';
import Player from './Player';

function App() {

  return (
    <div className="App">
      <Grid container>
        <Grid size={12}>
          <Player />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
