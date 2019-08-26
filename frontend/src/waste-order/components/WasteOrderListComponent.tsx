
import React from 'react';
import { WasteOrder, WasteOrderStatus } from '../WasteOrder';
import { getWasteOrdersWithTypeAndStatus } from '../WasteOrderService';
import { Row, Col, Spin, Icon, Button, Divider } from 'antd';
import { Modal } from '../../util/Modal';
import { WasteOrderListItemComponent } from './WasteOrderListItemComponent';
import { WasteOrderDetailComponent } from './WasteOrderDetailComponent';
import { WasteOrderCommissionComponent } from './WasteOrderCommissionComponent';
import { WasteOrderFilterComponent } from './WasteOrderFilterComponent';

interface WasteOrderListComponentState {
    wasteOrders?: WasteOrder[];
    selectedWasteOrder?: WasteOrder;
    showWasteOrderDetails: boolean;
    showWasteOrderCommission: boolean;
    filter: {
        type: string;
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
                type: "incoming",
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
        });
    }

    private onSelectWasteOrder = (selectedWasteOrder: WasteOrder) => {
        this.setState({ selectedWasteOrder, showWasteOrderDetails: true });
    }

    private commissionWasteOrder = () => {
        this.setState({ showWasteOrderCommission: true })
    }

    private reload = () => {
        this.setState({ wasteOrders: undefined, selectedWasteOrder: undefined });
        this.getOrders();
    }

    private handleTypeSelected = (type: string) => {
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
        const { wasteOrders, selectedWasteOrder, showWasteOrderDetails, showWasteOrderCommission } = this.state;

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
                    (<Spin tip="loading" indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />)
                    :
                    (wasteOrders.length === 0 ?
                        (<p>No Waste Orders</p>)
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

                                <Modal visible={showWasteOrderDetails} onClose={() => this.setState({ showWasteOrderDetails: false })} onClosed={this.reload}>
                                    <WasteOrderDetailComponent wasteOrder={selectedWasteOrder!!} />
                                </Modal>
                            </div>
                        )


                    )
                }

                <Modal visible={showWasteOrderCommission} onClose={() => this.setState({ showWasteOrderCommission: false })} onClosed={this.reload}>
                    <WasteOrderCommissionComponent onCommissioned={() => this.setState({ showWasteOrderCommission: false })} />
                </Modal>
            </div>
        );
    }
}