import './App.css';
import NotificationCenter from './components/NotificationCenter';

const USER_ID = 1;

function App() {
  return (
    <div className="App">
      <NotificationCenter userId={USER_ID} />
    </div>
  );
}

export default App;
