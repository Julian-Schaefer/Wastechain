import React from 'react';
import { WasteOrder } from '../WasteOrder';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';

let wasteOrderListComponentStyle: any = {};

wasteOrderListComponentStyle.normal = {
  marginBottom: "20px",
  border: "2px solid lightgray"
};

wasteOrderListComponentStyle.hovered = {
  borderColor: "#63b4ff"
};

export class WasteOrderListItemComponent extends React.Component<{ wasteOrder: WasteOrder, onClick: () => void }, { hovered: boolean }> {

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
    const { wasteOrder } = this.props;

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
      <h3>{wasteOrder.id}</h3>
      <Row gutter={16}>
        <Col span={6}>
          Customer Name: <BoldLabel>{wasteOrder.customerName}</BoldLabel>
        </Col>

        <Col span={6}>
          Description: <BoldLabel>{wasteOrder.description}</BoldLabel>
        </Col>

        <Col span={4}>
          Task Date: <BoldLabel>{wasteOrder.taskDate}</BoldLabel>
        </Col>

        <Col span={4}>
          Originator MSP: <BoldLabel>{wasteOrder.originatorMSPID}</BoldLabel>
        </Col>

        <Col span={4}>
          Subcontractor MSP: <BoldLabel>{wasteOrder.subcontractorMSPID}</BoldLabel>
        </Col>
      </Row>
    </Card>;
  }
}

const BoldLabel = styled.span`
  font-weight: bold;
`;