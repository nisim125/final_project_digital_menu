import './App.css';
import OrderOnline from './components/OrderOnline'
import { ItemsProvider } from './components/itemsContext';
import { EditedItemProvider } from './components/EditedItemContext';

function App() {
  return (
    <div>
      <ItemsProvider>
        <EditedItemProvider>
          <OrderOnline />
        </EditedItemProvider>
      </ItemsProvider>
    </div>
  );
}

export default App;
