import React from 'react';
import './App.css';
import { get } from './HttpClient';
import { WasteOrder } from './model/WasteOrder';
import { Card, Spin, Icon } from 'antd';
import { MyModal } from './util/Modal';


const WasteOrderComponentStyle = {
  margin: "20px",
  border: "2px solid lightgray"
};

const WasteOrderComponentHoverStyle = {
  borderColor: "lightblue"
};

interface AppState {
  wasteOrders?: WasteOrder[];
  selectedWasteOrder?: WasteOrder;
}

class WasteOrderComponent extends React.Component<{ wasteOrder: WasteOrder, onClick: () => void }, { hovered: boolean }> {

  constructor(props: { wasteOrder: WasteOrder, onClick: () => void }) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  private toggleHover = () => {
    this.setState({ hovered: !this.state.hovered });
  }

  render() {
    let { key, customerName } = this.props.wasteOrder;

    let style = WasteOrderComponentStyle;
    if (this.state.hovered) {
      style = {
        ...WasteOrderComponentStyle,
        ...WasteOrderComponentHoverStyle
      }
    }

    return <Card onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.props.onClick} style={style}>{key + ', ' + customerName}</Card>;
  }
}

class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      wasteOrders: undefined,
      selectedWasteOrder: undefined
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
    this.setState({ selectedWasteOrder });
  }

  render() {

    return (
      <div>
        {!this.state.wasteOrders ?
          (<Spin tip="loading" indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />)
          :
          (this.state.wasteOrders.length === 0 ?
            (<p>No Waste Orders</p>)
            :
            (
              <div>
                {
                  this.state.wasteOrders.map((wasteOrder) => {
                    return <WasteOrderComponent key={wasteOrder.key} wasteOrder={wasteOrder} onClick={() => this.onSelectWasteOrder(wasteOrder)} />;
                  })
                }

                <MyModal visible={this.state.selectedWasteOrder !== undefined} onClose={() => this.setState({ selectedWasteOrder: undefined })}>
                  {this.state.selectedWasteOrder && <p>{this.state.selectedWasteOrder!.key}</p>}
                </MyModal>
              </div>
            )
          )
        }
      </div>
    );
  }
}

export default App;
