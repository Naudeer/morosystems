// src/App.tsx or src/index.tsx
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import store from './store/index';
import TaskTable from './components/TaskTable';
import theme from './styles/theme';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <TaskTable />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;