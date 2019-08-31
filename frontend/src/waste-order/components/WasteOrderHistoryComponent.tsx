import React from "react";
import { WasteOrder } from "../WasteOrder";
import { getWasteOrderHistory } from "../WasteOrderService";
import { WasteOrderTransaction } from "../WasteOrderTransaction";
import { Table, Spin, Icon } from "antd";
import styled from "styled-components";
import { ColumnProps } from "antd/lib/table";

const columns: ColumnProps<any>[] = [
    {
        title: 'Transaction ID',
        dataIndex: 'txId',
        key: 'txId',
    },
    {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        key: 'timestamp',
    },
    {
        title: 'Is Delete',
        dataIndex: 'isDelete',
        key: 'isDelete',
    },
    {
        title: 'Status',
        dataIndex: 'value.status',
        key: 'status',
    },
    {
        title: 'Subcontractor MSP ID',
        dataIndex: 'value.subcontractorMSPID',
        key: 'subcontractorMSPID',
    },
    {
        title: 'Customer Name',
        dataIndex: 'value.customerName',
        key: 'customerName',
    },
    {
        title: 'Quantity',
        dataIndex: 'value.quantity',
        key: 'quantity',
    },
    {
        title: 'Unit Price',
        dataIndex: 'value.unitPrice',
        key: 'unitPrice',
    },
    {
        title: 'Unit of Measure',
        dataIndex: 'value.unitOfMeasure',
        key: 'unitOfMeasure',
    },
    {
        title: 'Task Date',
        dataIndex: 'value.taskDate',
        key: 'taskDate',
    },
    {
        title: 'Starting Time',
        dataIndex: 'value.startingTime',
        key: 'startingTime',
    },
    {
        title: 'Finishing Time',
        dataIndex: 'value.finishingTime',
        key: 'finishingTime',
    }
];

export class WasteOrderHistoryComponent extends React.Component<{ wasteOrder: WasteOrder }, { wasteOrderTransactions?: WasteOrderTransaction[], errorMessage?: string }> {

    constructor(props: { wasteOrder: WasteOrder }) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        getWasteOrderHistory(this.props.wasteOrder).then((transactions: WasteOrderTransaction[]) => {
            this.setState({ wasteOrderTransactions: transactions });
        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message });
        });
    }

    render() {
        return (
            <div>
                <h1>History of {this.props.wasteOrder.id}</h1>

                {this.state.errorMessage ? (
                    <ErrorLabel>{this.state.errorMessage!!}</ErrorLabel>
                ) : (
                        <div>
                            {this.state.wasteOrderTransactions ? (
                                <Table dataSource={this.state.wasteOrderTransactions} columns={columns} bodyStyle={{ overflowX: "scroll" }} />
                            ) : (
                                    <Spin tip="Loading..." indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />
                                )}

                        </div>
                    )}
            </div>
        );
    }
}

const ErrorLabel = styled.p`
    font-weight: bold;
    color: red;
`;