import React from 'react';
import { Input, Row, Col, Button, Select, DatePicker, Divider, TimePicker } from 'antd';
import styled from 'styled-components';
import { EquipmentType } from '../Service';
import { commissionWasteOrder } from '../WasteOrderService';
import { WasteOrder, WasteOrderCommissionSchema } from '../WasteOrder';
import moment from 'moment';

interface WasteOrderCommissionComponentProps {
    onCommissioned: (wasteOrder: WasteOrder) => void;
}

interface WasteOrderCommissionComponentState {
    wasteOrderId?: string;
    wasteOrder: WasteOrderCommissionSchema;
    errorMessage?: string;
    isLoading: boolean;
}

export class WasteOrderCommissionComponent extends React.Component<WasteOrderCommissionComponentProps, WasteOrderCommissionComponentState>{

    constructor(props: WasteOrderCommissionComponentProps) {
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
            },
            isLoading: false
        };
    }

    private updateWasteOrder = (wasteOrder: WasteOrderCommissionSchema) => {
        this.setState({
            ...this.state,
            wasteOrder: wasteOrder
        });
    }

    private handleWasteOrderChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            ...change
        });
    }

    private handleTaskSiteChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            taskSite: {
                ...this.state.wasteOrder.taskSite,
                ...change
            }
        });
    }

    private handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            service: {
                ...this.state.wasteOrder.service,
                ...change
            }
        });
    }

    private handleEquipmentTypeChange = (type: number) => {
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            service: {
                ...this.state.wasteOrder.service,
                equipmentType: type
            }
        })
    }

    private handleTaskDateChange = (date: moment.Moment | null) => {
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            taskDate: date ? date.format('DD/MM/YYYY') : undefined
        });
    }

    private handleTimeChange = (name: string, timeString: string) => {
        let change: any = {};
        change[name] = timeString;
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            ...change
        })
    }

    private commission = () => {
        this.setState({ isLoading: true });

        commissionWasteOrder(this.state.wasteOrderId!!, this.state.wasteOrder).then((wasteOrder) => {
            this.props.onCommissioned(wasteOrder);
        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message, isLoading: false });
        });
    }

    render() {
        const { wasteOrderId, wasteOrder } = this.state;
        const { taskSite } = wasteOrder;
        const { service } = wasteOrder;

        return (
            <div>
                <h1>Commission new Waste Order</h1>

                <Divider />

                <Tab>
                    <h2>General</h2>
                    <Row gutter={40} style={{ marginBottom: "20px" }}>
                        <Col span={4}>
                            <Label>ID:</Label>
                        </Col>
                        <Col span={8}>
                            <Input
                                value={wasteOrderId}
                                onChange={(e) => this.setState({ wasteOrderId: e.target.value })}
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

                    <Row gutter={40}>
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
                </Tab>

                <Tab>
                    <h2>Details</h2>
                    <Row gutter={40} style={{ marginBottom: "20px" }}>
                        <Col span={4}>
                            <Label>Quantity:</Label>
                        </Col>
                        <Col span={8}>
                            <Input
                                type="number"
                                value={wasteOrder.quantity}
                                onChange={(e) => this.handleWasteOrderChange(e, 'quantity')}
                                allowClear />
                        </Col>

                        <Col span={4}>
                            <Label>Task Date:</Label>
                        </Col>
                        <Col span={8}>
                            <DatePicker
                                onChange={this.handleTaskDateChange}
                                style={{ width: "100%" }} />
                        </Col>
                    </Row>

                    <Row gutter={40} style={{ marginBottom: "20px" }}>
                        <Col span={4}>
                            <Label>Unit Price:</Label>
                        </Col>
                        <Col span={8}>
                            <Input
                                type="number"
                                value={wasteOrder.unitPrice}
                                onChange={(e) => this.handleWasteOrderChange(e, 'unitPrice')}
                                allowClear />
                        </Col>

                        <Col span={4}>
                            <Label>Unit of Measure:</Label>
                        </Col>
                        <Col span={8}>
                            <Input
                                value={wasteOrder.unitOfMeasure}
                                onChange={(e) => this.handleWasteOrderChange(e, 'unitOfMeasure')}
                                allowClear />
                        </Col>
                    </Row>

                    <Row gutter={40} style={{ marginBottom: "20px" }}>
                        <Col span={4}>
                            <Label>Starting Time:</Label>
                        </Col>
                        <Col span={8}>
                            <TimePicker
                                onChange={(_: moment.Moment, timeString: string) => this.handleTimeChange('startingTime', timeString)}
                                style={{ width: "100%" }}
                            />
                        </Col>

                        <Col span={4}>
                            <Label>Finishing Time:</Label>
                        </Col>
                        <Col span={8}>
                            <TimePicker
                                onChange={(_: moment.Moment, timeString: string) => this.handleTimeChange('finishingTime', timeString)}
                                style={{ width: "100%" }}
                            />
                        </Col>
                    </Row>

                    <Row gutter={40}>
                        <Col span={4}>
                            <Label>Reference No.:</Label>
                        </Col>
                        <Col span={8}>
                            <Input
                                value={wasteOrder.referenceNo}
                                onChange={(e) => this.handleWasteOrderChange(e, 'referenceNo')}
                                allowClear />
                        </Col>
                    </Row>
                </Tab>

                <Tab>
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

                    <Row gutter={40}>
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
                </Tab>

                <Tab>
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

                    <Row gutter={40}>
                        <Col span={4}>
                            <Label>Equipment Type:</Label>
                        </Col>
                        <Col span={8}>
                            <Select defaultValue={0} style={{ width: "100%" }} onChange={this.handleEquipmentTypeChange}>
                                <Select.Option value={0}>Submission</Select.Option>
                                <Select.Option value={1}>Pick-Up</Select.Option>
                                <Select.Option value={2}>Exchange</Select.Option>
                                <Select.Option value={3}>Clearance</Select.Option>
                            </Select>
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
                </Tab>

                <Divider />

                <Row>
                    <Col span={4}>
                        <Button
                            type="primary"
                            onClick={this.commission}
                            loading={this.state.isLoading}
                            disabled={!this.state.wasteOrderId}>Commission</Button>
                    </Col>
                    <Col span={20}>
                        {this.state.errorMessage && <ErrorLabel>{this.state.errorMessage!!}</ErrorLabel>}
                    </Col>
                </Row>
            </div >
        );
    }
}

const Label = styled.p`
    line-height: 32px;
`;

const ErrorLabel = styled.p`
    font-size: 12pt;
    color: red;
`;

const Tab = styled.div`
    border: rgb(217, 217, 217) 1px solid;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.19), 0 1px 1px rgba(0,0,0,0.23);
`;