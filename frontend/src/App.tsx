import React from 'react';
import { WasteOrderListComponent } from './waste-order/components/WasteOrderListComponent';
import { HeaderComponent } from './HeaderComponent';

class App extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <HeaderComponent />
        <WasteOrderListComponent />
      </div>
    );
  }

}

export default App;
