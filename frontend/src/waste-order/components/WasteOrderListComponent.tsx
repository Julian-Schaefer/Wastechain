
import React from 'react';
import { WasteOrder, WasteOrderStatus } from '../WasteOrder';
import { getWasteOrdersWithTypeAndStatus } from '../WasteOrderService';
import { Row, Col, Spin, Icon, Button, Divider } from 'antd';
import { Modal } from '../../util/Modal';
import { WasteOrderListItemComponent } from './WasteOrderListItemComponent';
import { WasteOrderDetailComponent } from './WasteOrderDetailComponent';
import { WasteOrderCommissionComponent } from './WasteOrderCommissionComponent';
import { WasteOrderFilterComponent, WasteOrderFilterType } from './WasteOrderFilterComponent';
import styled from 'styled-components';

interface WasteOrderListComponentState {
    wasteOrders?: WasteOrder[];
    selectedWasteOrder?: WasteOrder;
    showWasteOrderDetails: boolean;
    showWasteOrderCommission: boolean;
    errorMessage?: string;
    filter: {
        type: WasteOrderFilterType;
        status: WasteOrderStatus
    };
}

export class WasteOrderListComponent extends React.Component<{}, WasteOrderListComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            wasteOrders: undefined,
            selectedWasteOrder: undefined,
            showWasteOrderDetails: false,
            showWasteOrderCommission: false,
            filter: {
                type: WasteOrderFilterType.INCOMING,
                status: WasteOrderStatus.COMMISSIONED
            }
        };
    }

    componentDidMount() {
        this.getOrders();
    }

    private getOrders() {
        const { filter } = this.state;
        getWasteOrdersWithTypeAndStatus(filter.type, filter.status).then((orders: WasteOrder[]) => {
            this.setState({ wasteOrders: orders });
        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message })
        });
    }

    private onSelectWasteOrder = (selectedWasteOrder: WasteOrder) => {
        this.setState({ selectedWasteOrder, showWasteOrderDetails: true });
    }

    private commissionWasteOrder = () => {
        this.setState({ showWasteOrderCommission: true })
    }

    private reload = () => {
        this.setState({
            wasteOrders: undefined,
            selectedWasteOrder: undefined,
            errorMessage: undefined
        });
        this.getOrders();
    }

    private handleTypeSelected = (type: WasteOrderFilterType) => {
        this.setState({
            filter: {
                ...this.state.filter,
                type
            }
        }, () => this.reload());
    }

    private handleStatusSelected = (status: WasteOrderStatus) => {
        this.setState({
            filter: {
                ...this.state.filter,
                status
            }
        }, () => this.reload());
    }

    render() {
        const { wasteOrders, selectedWasteOrder, showWasteOrderDetails, showWasteOrderCommission, errorMessage } = this.state;

        return (
            <div style={{ padding: "20px" }}>

                <Row style={{ marginBottom: "20px" }}>
                    <Col span={12}>
                        <Button type="primary" onClick={this.commissionWasteOrder}>Commission new Waste Order</Button>
                    </Col>

                    <Col span={12}>
                        <WasteOrderFilterComponent onTypeSelected={this.handleTypeSelected} onStatusSelected={this.handleStatusSelected} />
                    </Col>
                </Row>

                <Divider />

                {!wasteOrders ?
                    (
                        errorMessage ? (
                            <ErrorLabel>{errorMessage}</ErrorLabel>
                        ) : (
                                <Spin tip="Loading..." indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />
                            )
                    )
                    :
                    (wasteOrders.length === 0 ?
                        (<p>No Waste Orders have been found.</p>)
                        :
                        (
                            <div>
                                <div>
                                    {
                                        wasteOrders.map((wasteOrder) => {
                                            return <WasteOrderListItemComponent key={wasteOrder.id} wasteOrder={wasteOrder} onClick={() => this.onSelectWasteOrder(wasteOrder)} />;
                                        })
                                    }
                                </div>

                                <Modal visible={showWasteOrderDetails} zIndex={1} onClose={() => this.setState({ showWasteOrderDetails: false })} onClosed={this.reload}>
                                    <WasteOrderDetailComponent wasteOrder={selectedWasteOrder!!} type={this.state.filter.type} />
                                </Modal>
                            </div>
                        )


                    )
                }

                <Modal visible={showWasteOrderCommission} zIndex={1} onClose={() => this.setState({ showWasteOrderCommission: false })} onClosed={this.reload}>
                    <WasteOrderCommissionComponent onCommissioned={() => this.setState({ showWasteOrderCommission: false })} />
                </Modal>
            </div>
        );
    }
}

const ErrorLabel = styled.p`
    color: red;
    font-size: 12pt;
`;