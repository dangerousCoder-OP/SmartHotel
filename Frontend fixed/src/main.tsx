import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const prepare = async () => {
  // MSW and mocks removed: no longer importing or starting worker
};

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
