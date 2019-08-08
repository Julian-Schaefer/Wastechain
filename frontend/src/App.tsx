import React from 'react';
import './App.css';
import { get } from './HttpClient';
import { WasteOrder } from './model/WasteOrder';
import { Spin, Icon, Button } from 'antd';
import { Modal } from './util/Modal';
import { WasteOrderListComponent } from './waste-order/WasteOrderListComponent';
import { WasteOrderDetailComponent } from './waste-order/WasteOrderDetailComponent';

interface AppState {
  wasteOrders?: WasteOrder[];
  selectedWasteOrder?: WasteOrder;
  showWasteOrderDetails: boolean;
}

class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      wasteOrders: undefined,
      selectedWasteOrder: undefined,
      showWasteOrderDetails: false
    };
  }

  componentDidMount() {
    this.getOrders();
  }

  private getOrders() {
    this.setState({ wasteOrders: undefined });
    get('/order/outgoing/status/0').then((orders: WasteOrder[]) => {
      this.setState({ wasteOrders: orders });
    });
  }

  private onSelectWasteOrder = (selectedWasteOrder: WasteOrder) => {
    this.setState({ selectedWasteOrder, showWasteOrderDetails: true });
  }

  render() {
    const { wasteOrders, selectedWasteOrder, showWasteOrderDetails } = this.state;

    return (
      <div>
        {!wasteOrders ?
          (<Spin tip="loading" indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />)
          :
          (wasteOrders.length === 0 ?
            (<p>No Waste Orders</p>)
            :
            (
              <div style={{ padding: "20px" }}>
                <Button type="primary">New Waste Order</Button>

                {
                  wasteOrders.map((wasteOrder) => {
                    return <WasteOrderListComponent key={wasteOrder.key} wasteOrder={wasteOrder} onClick={() => this.onSelectWasteOrder(wasteOrder)} />;
                  })
                }

                <Modal visible={showWasteOrderDetails} onClose={() => this.setState({ showWasteOrderDetails: false })} onClosed={() => this.setState({ selectedWasteOrder: undefined })}>
                  {selectedWasteOrder && <WasteOrderDetailComponent wasteOrder={selectedWasteOrder} />}
                </Modal>
              </div>
            )
          )
        }
      </div>
    );
  }
}

export default App;
