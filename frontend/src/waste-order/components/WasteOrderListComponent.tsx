
import React from 'react';
import { WasteOrder } from '../WasteOrder';
import { getOutgoingWasteOrdersWithStatus } from '../WasteOrderService';
import { Spin, Icon, Button } from 'antd';
import { Modal } from '../../util/Modal';
import { WasteOrderListItemComponent } from './WasteOrderListItemComponent';
import { WasteOrderDetailComponent } from './WasteOrderDetailComponent';
import { WasteOrderCommissionComponent } from './WasteOrderCommissionComponent';

interface WasteOrderListComponentState {
    wasteOrders?: WasteOrder[];
    selectedWasteOrder?: WasteOrder;
    showWasteOrderDetails: boolean;
    showWasteOrderCommission: boolean;
}

class WasteOrderListComponent extends React.Component<{}, WasteOrderListComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            wasteOrders: undefined,
            selectedWasteOrder: undefined,
            showWasteOrderDetails: false,
            showWasteOrderCommission: false
        };
    }

    componentDidMount() {
        this.getOrders();
    }

    private getOrders() {
        this.setState({ wasteOrders: undefined });
        getOutgoingWasteOrdersWithStatus(0).then((orders: WasteOrder[]) => {
            this.setState({ wasteOrders: orders });
        });
    }

    private onSelectWasteOrder = (selectedWasteOrder: WasteOrder) => {
        this.setState({ selectedWasteOrder, showWasteOrderDetails: true });
    }

    private commissionWasteOrder = () => {
        this.setState({ showWasteOrderCommission: true })
    }

    render() {
        const { wasteOrders, selectedWasteOrder, showWasteOrderDetails, showWasteOrderCommission } = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.commissionWasteOrder}>Commission new Waste Order</Button>
                {!wasteOrders ?
                    (<Spin tip="loading" indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />)
                    :
                    (wasteOrders.length === 0 ?
                        (<p>No Waste Orders</p>)
                        :
                        (
                            <div style={{ padding: "20px" }}>

                                {
                                    wasteOrders.map((wasteOrder) => {
                                        return <WasteOrderListItemComponent key={wasteOrder.id} wasteOrder={wasteOrder} onClick={() => this.onSelectWasteOrder(wasteOrder)} />;
                                    })
                                }

                                <Modal visible={showWasteOrderDetails} onClose={() => this.setState({ showWasteOrderDetails: false })} onClosed={() => this.setState({ selectedWasteOrder: undefined })}>
                                    <WasteOrderDetailComponent wasteOrder={selectedWasteOrder!!} />
                                </Modal>

                                <Modal visible={showWasteOrderCommission} onClose={() => this.setState({ showWasteOrderCommission: false })} onClosed={() => this.getOrders}>
                                    <WasteOrderCommissionComponent />
                                </Modal>
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}

export default WasteOrderListComponent;