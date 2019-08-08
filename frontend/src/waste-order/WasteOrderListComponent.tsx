import React from 'react';
import { WasteOrder } from '../model/WasteOrder';
import { Card } from 'antd';

let wasteOrderListComponentStyle: any = {};

wasteOrderListComponentStyle.normal = {
  marginBottom: "20px",
  border: "2px solid lightgray"
};

wasteOrderListComponentStyle.hovered = {
  borderColor: "lightblue"
};

export class WasteOrderListComponent extends React.Component<{ wasteOrder: WasteOrder, onClick: () => void }, { hovered: boolean }> {

  constructor(props: { wasteOrder: WasteOrder, onClick: () => void }) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  private hover = () => {
    this.setState({ hovered: true });
  }

  private unhover = () => {
    this.setState({ hovered: false });
  }

  render() {
    let { key, customerName } = this.props.wasteOrder;

    let style = wasteOrderListComponentStyle.normal;
    if (this.state.hovered) {
      style = {
        ...wasteOrderListComponentStyle.normal,
        ...wasteOrderListComponentStyle.hovered
      }
    }

    return <Card
      onMouseEnter={this.hover}
      onMouseLeave={this.unhover}
      onClick={this.props.onClick} style={style}>
      {key + ', ' + customerName}
    </Card>;
  }
}