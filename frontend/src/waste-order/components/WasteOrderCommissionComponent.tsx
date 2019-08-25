import React from 'react';
import { Input, Row, Col, Button } from 'antd';
import styled from 'styled-components';
import { TaskSite } from '../TaskSite';
import { Service, EquipmentType } from '../Service';
import { commissionWasteOrder } from '../WasteOrderService';
import { WasteOrder } from '../WasteOrder';


interface WasteOrderCommissionSchema {
    id?: string;
    subcontractorMSPID?: string;
    customerName?: string;
    taskSite: TaskSite;
    service: Service;
    description?: string;
    quantity?: number;
    unitPrice?: number;
    unitOfMeasure?: string;
    taskDate?: string;
    startingTime?: string;
    finishingTime?: string;
    referenceNo?: string;
}


export class WasteOrderCommissionComponent extends React.Component<{}, { wasteOrder: WasteOrderCommissionSchema }>{

    constructor(props: {}) {
        super(props);

        this.state = {
            wasteOrder: {
                taskSite: {
                    name: '',
                    name2: '',
                    address: '',
                    address2: '',
                    areaCode: '',
                    city: '',
                    countryCode: '',
                    postCode: ''
                },
                service: {
                    description: '',
                    description2: '',
                    equipmentDescription: '',
                    equipmentType: EquipmentType.CLEARANCE,
                    materialDescription: ''
                }
            }
        };
    }

    private handleWasteOrderChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.setState({
            ...this.state,
            wasteOrder: {
                ...this.state.wasteOrder,
                ...change
            }
        });
    }

    private handleTaskSiteChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.setState({
            ...this.state,
            wasteOrder: {
                ...this.state.wasteOrder,
                taskSite: {
                    ...this.state.wasteOrder.taskSite,
                    ...change
                }
            }
        });
    }

    private handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.setState({
            ...this.state,
            wasteOrder: {
                ...this.state.wasteOrder,
                service: {
                    ...this.state.wasteOrder.service,
                    ...change
                }
            }
        });
    }

    private commission = () => {
        commissionWasteOrder(this.state.wasteOrder as WasteOrder);
    }

    render() {
        const { wasteOrder } = this.state;
        const { taskSite } = wasteOrder;
        const { service } = wasteOrder;

        return (
            <div>
                <h1>Commission new Waste Order</h1>
                <h2>General</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>ID:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={wasteOrder.id}
                            onChange={(e) => this.handleWasteOrderChange(e, 'id')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={wasteOrder.description}
                            onChange={(e) => this.handleWasteOrderChange(e, 'description')}
                            allowClear />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Customer Name:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={wasteOrder.customerName}
                            onChange={(e) => this.handleWasteOrderChange(e, 'customerName')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Subcontractor MSP:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={wasteOrder.subcontractorMSPID}
                            onChange={(e) => this.handleWasteOrderChange(e, 'subcontractorMSPID')}
                            allowClear />
                    </Col>
                </Row>

                <h2>Task Site</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Name:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.name}
                            onChange={(e) => this.handleTaskSiteChange(e, 'name')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Name 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.name2}
                            onChange={(e) => this.handleTaskSiteChange(e, 'name2')}
                            allowClear />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Address:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.address}
                            onChange={(e) => this.handleTaskSiteChange(e, 'address')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Address 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.address2}
                            onChange={(e) => this.handleTaskSiteChange(e, 'address2')}
                            allowClear />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Post Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.postCode}
                            onChange={(e) => this.handleTaskSiteChange(e, 'postCode')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>City:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.city}
                            onChange={(e) => this.handleTaskSiteChange(e, 'city')}
                            allowClear />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Country Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.countryCode}
                            onChange={(e) => this.handleTaskSiteChange(e, 'countryCode')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Area Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.areaCode}
                            onChange={(e) => this.handleTaskSiteChange(e, 'areaCode')}
                            allowClear />
                    </Col>
                </Row>

                <h2>Service</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.description}
                            onChange={(e) => this.handleServiceChange(e, 'description')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Description 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.description2}
                            onChange={(e) => this.handleServiceChange(e, 'description2')}
                            allowClear />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Material Description:</Label>
                    </Col>
                    <Col span={20}>
                        <Input
                            value={service.materialDescription}
                            onChange={(e) => this.handleServiceChange(e, 'materialDescription')}
                            allowClear />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Equipment Type:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.equipmentType}
                            onChange={(e) => this.handleServiceChange(e, 'equipmentType')}
                            allowClear />
                    </Col>

                    <Col span={4}>
                        <Label>Equipment Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.equipmentDescription}
                            onChange={(e) => this.handleServiceChange(e, 'equipmentDescription')}
                            allowClear />
                    </Col>
                </Row>

                <Row>
                    <Button type="primary" onClick={this.commission}>Commission</Button>
                </Row>
            </div >
        );
    }
}

const Label = styled.p`
    line-height: 32px;
`;