import React from 'react';
import { WasteOrder, WasteOrderStatus } from '../WasteOrder';
import { Input, Row, Col, Button } from 'antd';
import styled from 'styled-components';

export class WasteOrderDetailComponent extends React.Component<{ wasteOrder: WasteOrder }, { wasteOrder: WasteOrder, editable: boolean }>{

    constructor(props: { wasteOrder: WasteOrder }) {
        super(props);

        this.state = {
            wasteOrder: props.wasteOrder,
            editable: false
        };
    }

    private toggle = () => {
        this.setState({ editable: !this.state.editable });
    }

    private handleWasteOrderChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.setState({
            ...this.state,
            wasteOrder: {
                ...change
            }
        });
    }

    render() {
        const { wasteOrder } = this.state;
        const { status } = wasteOrder;
        const { taskSite } = wasteOrder;
        const { service } = wasteOrder;

        return (
            <div>
                <Row>
                    <Col span={12}>
                        <h1>{wasteOrder.id}</h1>
                    </Col>
                    <Col span={6}>
                        <Button type="primary" onClick={this.toggle}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Button type="primary" onClick={this.toggle}>Show History</Button>
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <Label>Status:</Label>
                    </Col>
                    <Col span={8}>
                        <Label>{WasteOrderStatus[status!!]}</Label>
                    </Col>
                </Row>

                <h2>General</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Customer Name:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            id="success"
                            value={wasteOrder.customerName}
                            onChange={(e) => this.handleWasteOrderChange(e, 'customerName')}
                            disabled={!this.state.editable}
                            allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={wasteOrder.description}
                            onChange={(e) => this.handleWasteOrderChange(e, 'description')}
                            disabled={!this.state.editable}
                            allowClear={this.state.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Originator MSP:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={wasteOrder.originatorMSPID} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Subcontractor MSP:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={wasteOrder.subcontractorMSPID} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>

                <h2>Task Site</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Name:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.name} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Name 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.name2} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Address:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.address} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Address 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.address2} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Post Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.postCode} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>City:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.city} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Country Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.countryCode} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Area Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={taskSite.areaCode} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>

                <h2>Service</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={service.description} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Description 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={service.description2} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Material Description:</Label>
                    </Col>
                    <Col span={20}>
                        <Input value={service.materialDescription} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>


                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Equipment Type:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={service.equipmentType} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Equipment Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input value={service.equipmentDescription} disabled={!this.state.editable} allowClear={this.state.editable} />
                    </Col>
                </Row>
            </div >
        );
    }
}

const Label = styled.p`
    line-height: 32px;
`;