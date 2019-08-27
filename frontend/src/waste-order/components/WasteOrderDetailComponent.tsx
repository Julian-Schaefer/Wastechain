import React from 'react';
import { WasteOrder, WasteOrderStatus } from '../WasteOrder';
import { Input, Row, Col, Button, Divider, Modal, Spin, Icon } from 'antd';
import styled from 'styled-components';
import { cancelWasteOrder, acceptWasteOrder, correctWasteOrder, rejectWasteOrder, completeWasteOrder } from '../WasteOrderService';
import { TaskSiteDetailComponent } from './details/TaskSiteDetailComponent';
import { ServiceDetailComponent } from './details/ServiceDetailComponent';
import { TaskSite } from '../TaskSite';
import { Service } from '../Service';
import { WasteOrderFilterType } from './WasteOrderFilterComponent';
import { WasteOrderDetailsComponent } from './details/WasteOrderDetailsComponent';

interface WasteOrderDetailComponentState {
    wasteOrder: WasteOrder;
    editable: boolean;
    errorMessage?: string;
    type: WasteOrderFilterType;
    isLoading: boolean;
    rejectionMessage?: string;
}

interface WasteOrderDetailComponentProps {
    wasteOrder: WasteOrder;
    type: WasteOrderFilterType;
}

export class WasteOrderDetailComponent extends React.Component<WasteOrderDetailComponentProps, WasteOrderDetailComponentState>{

    constructor(props: WasteOrderDetailComponentProps) {
        super(props);

        this.state = {
            wasteOrder: props.wasteOrder,
            editable: false,
            type: props.type,
            isLoading: false
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

    private handleWasteOrderChanged = (property: string, value: string) => {
        let change: any = {};
        change[property] = value;
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

    private onSuccess = (wasteOrder: WasteOrder) => {
        this.setState({ wasteOrder, isLoading: false, editable: false });
        Modal.success({
            title: 'Success',
            content: 'Successfully updated Waste Order!'
        });
    }

    private onError = (error: Error) => {
        this.setState({ errorMessage: error.message, isLoading: false });
    }

    private setLoading = () => {
        this.setState({ isLoading: true, errorMessage: undefined });
    }

    private accept = () => {
        acceptWasteOrder(this.state.wasteOrder.id).then((wasteOrder: WasteOrder) => {
            this.onSuccess(wasteOrder);
        }).catch((error: Error) => {
            this.onError(error);
        });
    }

    private cancel = () => {
        cancelWasteOrder(this.state.wasteOrder.id).then((wasteOrder: WasteOrder) => {
            this.onSuccess(wasteOrder);
        }).catch((error: Error) => {
            this.onError(error);
        });
    }

    private correct = () => {
        correctWasteOrder(this.state.wasteOrder.id, this.state.wasteOrder).then((wasteOrder: WasteOrder) => {
            this.onSuccess(wasteOrder);
        }).catch((error: Error) => {
            this.onError(error);
        });
    }

    private complete = () => {
        completeWasteOrder(this.state.wasteOrder.id, this.state.wasteOrder).then((wasteOrder: WasteOrder) => {
            this.onSuccess(wasteOrder);
        }).catch((error: Error) => {
            this.onError(error);
        });
    }

    private reject = () => {
        const content = <div>
            <Label>Rejection Message:</Label>
            <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ rejectionMessage: e.target.value })} />
        </div>;

        this.setState({
            rejectionMessage: undefined
        }, () => {
            Modal.confirm({
                content,
                onOk: () => {
                    this.setLoading();
                    rejectWasteOrder(this.state.wasteOrder.id, this.state.rejectionMessage!!).then((wasteOrder: WasteOrder) => {
                        this.onSuccess(wasteOrder);
                    }).catch((error: Error) => {
                        this.onError(error);
                    });
                }
            });
        });
    }

    private showConfirm(onConfirmation: () => void) {
        Modal.confirm({
            content: <Label>Are you sure?</Label>,
            onOk: () => {
                this.setLoading();
                onConfirmation();
            }
        });
    }

    render() {
        const { wasteOrder, type, isLoading } = this.state;
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

                            <Col span={4}>
                                <Label>Type:</Label>
                            </Col>
                            <Col span={8}>
                                <Label>{WasteOrderFilterType[type]}</Label>
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
                                    onChange={(e) => this.handleWasteOrderChanged('customerName', e.target.value)}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>

                            <Col span={4}>
                                <Label>Description:</Label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={wasteOrder.description}
                                    onChange={(e) => this.handleWasteOrderChanged('description', e.target.value)}
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
                                    onChange={(e) => this.handleWasteOrderChanged('subcontractorMSPID', e.target.value)}
                                    disabled={!this.state.editable}
                                    allowClear={this.state.editable} />
                            </Col>

                            <Col span={4}>
                                <Label>Originator MSP:</Label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={wasteOrder.originatorMSPID}
                                    disabled={true} />
                            </Col>
                        </Row>

                        <Row gutter={40} style={{ marginBottom: "20px" }}>
                            <Col span={4}>
                                <Label>Rejection Message:</Label>
                            </Col>
                            <Col span={20}>
                                <Input
                                    value={wasteOrder.rejectionMessage}
                                    disabled={true} />
                            </Col>
                        </Row>

                        <Row gutter={40} style={{ marginBottom: "20px" }}>
                            <Col span={4}>
                                <Label>Last Changed:</Label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={wasteOrder.lastChanged.toString()}
                                    disabled={true} />
                            </Col>

                            <Col span={4}>
                                <Label>Last Changed by MSP:</Label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={wasteOrder.lastChangedByMSPID}
                                    disabled={true} />
                            </Col>
                        </Row>
                    </Tab>

                    <WasteOrderDetailsComponent wasteOrder={wasteOrder} onWasteOrderChanged={this.handleWasteOrderChanged} editable={this.state.editable} />

                    <TaskSiteDetailComponent taskSite={taskSite} onTaskSiteChanged={this.handleTaskSiteChanged} editable={this.state.editable} />

                    <ServiceDetailComponent service={service} onServiceChanged={this.handleServiceChanged} editable={this.state.editable} />
                </div>

                {status !== WasteOrderStatus.CANCELLED && status !== WasteOrderStatus.COMPLETED && <Divider />}

                {!isLoading ?
                    (
                        <div>
                            {status === WasteOrderStatus.COMMISSIONED &&
                                <div>
                                    {type === WasteOrderFilterType.INCOMING ? (
                                        <div>
                                            <Button type="danger" onClick={this.reject}>Reject</Button>
                                            <Button type="primary" onClick={() => this.showConfirm(this.accept)} style={{ marginLeft: "20px" }}>Accept</Button>
                                        </div>
                                    ) : (
                                            < div >
                                                <Button type="danger" onClick={() => this.showConfirm(this.cancel)}>Cancel</Button>
                                                <Button type="primary" onClick={() => this.showConfirm(this.correct)} style={{ marginLeft: "20px" }}>Correct</Button>
                                            </div>
                                        )}
                                </div>
                            }

                            {status === WasteOrderStatus.REJECTED &&
                                type === WasteOrderFilterType.OUTGOING &&
                                < Button type="primary" onClick={() => this.showConfirm(this.correct)}>Correct</Button>}

                            {
                                status === WasteOrderStatus.ACCEPTED &&
                                <div>
                                    <Button type="danger" onClick={() => this.showConfirm(this.cancel)}>Cancel</Button>

                                    {type === WasteOrderFilterType.INCOMING &&
                                        <Button type="primary" onClick={() => this.showConfirm(this.complete)} style={{ marginLeft: "20px" }}>Complete</Button>}
                                </div>
                            }
                        </div>
                    ) :
                    (
                        <Spin tip="Loading..." indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />
                    )
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