import React from 'react';
import { WasteOrder, WasteOrderStatus } from '../WasteOrder';
import { Input, Row, Col, Button, Divider, TimePicker, DatePicker } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { cancelWasteOrder, acceptWasteOrder } from '../WasteOrderService';
import { TaskSiteDetailComponent } from './details/TaskSiteDetailComponent';
import { ServiceDetailComponent } from './details/ServiceDetailComponent';
import { TaskSite } from '../TaskSite';
import { Service } from '../Service';

interface WasteOrderDetailComponentState {
    wasteOrder: WasteOrder;
    editable: boolean;
    errorMessage?: string;
}

export class WasteOrderDetailComponent extends React.Component<{ wasteOrder: WasteOrder }, WasteOrderDetailComponentState>{

    constructor(props: { wasteOrder: WasteOrder }) {
        super(props);

        this.state = {
            wasteOrder: props.wasteOrder,
            editable: false
        };
    }

    private toggleEditable = () => {
        this.setState({ editable: !this.state.editable });
    }

    private updateWasteOrder = (wasteOrder: WasteOrder) => {
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

    private handleTaskSiteChanged = (taskSite: TaskSite) => {
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            taskSite
        });
    }

    private handleServiceChanged = (service: Service) => {
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            service
        });
    }

    private handleTaskDateChange = (date: moment.Moment | null) => {
        this.updateWasteOrder({
            ...this.state.wasteOrder,
            taskDate: date ? date.format('DD/MM/YYYY') : ''
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

    private handleCancelClick = () => {
        cancelWasteOrder(this.state.wasteOrder.id).then((wasteOrder: WasteOrder) => {
            this.setState({ wasteOrder });
        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message });
        });
    }

    private handleAcceptClick = () => {
        acceptWasteOrder(this.state.wasteOrder.id).then((wasteOrder: WasteOrder) => {
            this.setState({ wasteOrder });
        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message });
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
                    <Col span={18}>
                        <h1>{wasteOrder.id}</h1>
                    </Col>

                    <Col span={2}>
                        <Button onClick={this.toggleEditable}>Edit</Button>
                    </Col>
                    <Col span={4}>
                        <Button>Show History</Button>
                    </Col>
                </Row>

                <div>
                    <Tab>
                        <h2>General</h2>
                        <Row gutter={40} style={{ marginBottom: "20px" }}>
                            <Col span={4}>
                                <Label>Status:</Label>
                            </Col>
                            <Col span={8}>
                                <Label>{WasteOrderStatus[status]}</Label>
                            </Col>
                        </Row>

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
                                <Label>Subcontractor MSP:</Label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={wasteOrder.subcontractorMSPID}
                                    onChange={(e) => this.handleWasteOrderChange(e, 'subcontractorMSPID')}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>

                            <Col span={4}>
                                <Label>Originator MSP:</Label>
                            </Col>
                            <Col span={8}>
                                <Input value={wasteOrder.originatorMSPID} disabled={true} />
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
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>

                            <Col span={4}>
                                <Label>Task Date:</Label>
                            </Col>
                            <Col span={8}>
                                <DatePicker
                                    value={moment(wasteOrder.taskDate, 'DD/MM/YYYY')}
                                    onChange={this.handleTaskDateChange}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable}
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
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>

                            <Col span={4}>
                                <Label>Unit of Measure:</Label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={wasteOrder.unitOfMeasure}
                                    onChange={(e) => this.handleWasteOrderChange(e, 'unitOfMeasure')}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>
                        </Row>

                        <Row gutter={40} style={{ marginBottom: "20px" }}>
                            <Col span={4}>
                                <Label>Starting Time:</Label>
                            </Col>
                            <Col span={8}>
                                <TimePicker
                                    value={moment(wasteOrder.startingTime, 'HH:mm:ss')}
                                    onChange={(_: moment.Moment, timeString: string) => this.handleTimeChange('startingTime', timeString)}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable}
                                    style={{ width: "100%" }}
                                />
                            </Col>

                            <Col span={4}>
                                <Label>Finishing Time:</Label>
                            </Col>
                            <Col span={8}>
                                <TimePicker
                                    value={moment(wasteOrder.finishingTime, 'HH:mm:ss')}
                                    onChange={(_: moment.Moment, timeString: string) => this.handleTimeChange('finishingTime', timeString)}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable}
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
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>
                        </Row>
                    </Tab>

                    <TaskSiteDetailComponent taskSite={taskSite} onTaskSiteChanged={this.handleTaskSiteChanged} editable={this.state.editable} />

                    <ServiceDetailComponent service={service} onServiceChanged={this.handleServiceChanged} editable={this.state.editable} />
                </div>

                {status !== WasteOrderStatus.CANCELLED && <Divider />}

                {status === WasteOrderStatus.COMMISSIONED &&
                    <div>
                        <Button type="primary">Correct</Button>
                        <Button type="primary" onClick={this.handleAcceptClick} style={{ marginLeft: "20px" }}>Accept</Button>
                        <Button type="primary" onClick={this.handleCancelClick} style={{ marginLeft: "20px" }}>Cancel</Button>
                    </div>
                }

                {status === WasteOrderStatus.REJECTED && <Button type="primary">Correct</Button>}

                {status === WasteOrderStatus.ACCEPTED &&
                    <div>
                        <Button type="primary">Complete</Button>
                        <Button type="primary" onClick={this.handleCancelClick} style={{ marginLeft: "20px" }}>Cancel</Button>
                    </div>
                }

                {this.state.errorMessage && <ErrorLabel>{this.state.errorMessage!!}</ErrorLabel>}
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
    margin-top: 10px;
`;

const Tab = styled.div`
    border: rgb(217, 217, 217) 1px solid;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.19), 0 1px 1px rgba(0,0,0,0.23);
`;