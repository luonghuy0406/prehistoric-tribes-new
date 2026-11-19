import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import './skin.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing');
// No StrictMode: it double-mounts effects, which would boot two copies of the original engine.
createRoot(root).render(<App />);
