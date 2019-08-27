import React from 'react';
import { Input, Row, Col, Button, Divider, Modal } from 'antd';
import styled from 'styled-components';
import { EquipmentType, Service } from '../Service';
import { commissionWasteOrder } from '../WasteOrderService';
import { WasteOrder, WasteOrderCommissionSchema } from '../WasteOrder';
import { TaskSiteDetailComponent } from './details/TaskSiteDetailComponent';
import { TaskSite } from '../TaskSite';
import { ServiceDetailComponent } from './details/ServiceDetailComponent';
import { WasteOrderDetailsComponent } from './details/WasteOrderDetailsComponent';

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
                    equipmentType: EquipmentType.SUBMISSION,
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

    private commission = () => {
        this.setState({ isLoading: true });

        commissionWasteOrder(this.state.wasteOrderId!!, this.state.wasteOrder).then((wasteOrder) => {
            Modal.success({
                title: 'Success',
                content: 'Successfully commissioned Waste Order to the Wastechain!'
            });
            this.props.onCommissioned(wasteOrder);
        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message, isLoading: false });
        });
    }

    private showConfirm(onConfirmation: () => void) {
        Modal.confirm({
            content: <Label>Are you sure?</Label>,
            onOk() {
                onConfirmation();
            }
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
                                onChange={(e) => this.handleWasteOrderChanged('description', e.target.value)}
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
                                onChange={(e) => this.handleWasteOrderChanged('customerName', e.target.value)}
                                allowClear />
                        </Col>

                        <Col span={4}>
                            <Label>Subcontractor MSP:</Label>
                        </Col>
                        <Col span={8}>
                            <Input
                                value={wasteOrder.subcontractorMSPID}
                                onChange={(e) => this.handleWasteOrderChanged('subcontractorMSPID', e.target.value)}
                                allowClear />
                        </Col>
                    </Row>
                </Tab>

                <WasteOrderDetailsComponent wasteOrder={wasteOrder as WasteOrder} onWasteOrderChanged={this.handleWasteOrderChanged} editable={true} />

                <TaskSiteDetailComponent taskSite={taskSite} onTaskSiteChanged={this.handleTaskSiteChanged} editable={true} />

                <ServiceDetailComponent service={service} onServiceChanged={this.handleServiceChanged} editable={true} />

                <Divider />

                <Row>
                    <Col span={4}>
                        <Button
                            type="primary"
                            onClick={() => this.showConfirm(this.commission)}
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