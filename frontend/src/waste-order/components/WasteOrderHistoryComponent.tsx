import React from "react";
import { WasteOrder } from "../WasteOrder";
import { getWasteOrderHistory } from "../WasteOrderService";
import { WasteOrderTransaction } from "../WasteOrderTransaction";
import { Row, Col, Spin, Icon, Divider } from "antd";
import styled from "styled-components";

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
                                <div>
                                    <Row gutter={16}>
                                        <Col span={2}>
                                            <BoldLabel>Transaction ID</BoldLabel>
                                        </Col>

                                        <Col span={3}>
                                            <BoldLabel>Timestamp</BoldLabel>
                                        </Col>

                                        <Col span={1}>
                                            <BoldLabel>Is Delete</BoldLabel>
                                        </Col>

                                        <Col span={3}>
                                            <BoldLabel>Subcontractor MSP</BoldLabel>
                                        </Col>

                                        <Col span={3}>
                                            <BoldLabel>Customer Name</BoldLabel>
                                        </Col>

                                        <Col span={2}>
                                            <BoldLabel>Quantity</BoldLabel>
                                        </Col>

                                        <Col span={2}>
                                            <BoldLabel>Unit Price</BoldLabel>
                                        </Col>

                                        <Col span={2}>
                                            <BoldLabel>Unit of Measure</BoldLabel>
                                        </Col>

                                        <Col span={2}>
                                            <BoldLabel>Task Date</BoldLabel>
                                        </Col>

                                        <Col span={2}>
                                            <BoldLabel>Starting Time</BoldLabel>
                                        </Col>

                                        <Col span={2}>
                                            <BoldLabel>Finishing Time</BoldLabel>
                                        </Col>
                                    </Row>

                                    {this.state.wasteOrderTransactions.map((wasteOrderTransaction: WasteOrderTransaction) => {
                                        return (
                                            <div>
                                                <Row gutter={16}>
                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.txId}</Label>
                                                    </Col>

                                                    <Col span={3}>
                                                        <Label>{wasteOrderTransaction.timestamp}</Label>
                                                    </Col>

                                                    <Col span={1}>
                                                        <Label>{wasteOrderTransaction.isDelete}</Label>
                                                    </Col>

                                                    <Col span={3}>
                                                        <Label>{wasteOrderTransaction.value.subcontractorMSPID}</Label>
                                                    </Col>

                                                    <Col span={3}>
                                                        <Label>{wasteOrderTransaction.value.customerName}</Label>
                                                    </Col>

                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.value.quantity}</Label>
                                                    </Col>

                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.value.unitPrice}</Label>
                                                    </Col>

                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.value.unitOfMeasure}</Label>
                                                    </Col>

                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.value.taskDate}</Label>
                                                    </Col>

                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.value.startingTime}</Label>
                                                    </Col>

                                                    <Col span={2}>
                                                        <Label>{wasteOrderTransaction.value.finishingTime}</Label>
                                                    </Col>
                                                </Row>
                                                <Divider />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                    <Spin tip="Loading..." indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} style={{ margin: "0" }} />
                                )}

                        </div>
                    )}
            </div>
        );
    }
}

const Label = styled.p`
    overflow: hidden;
`;

const BoldLabel = styled.p`
    font-weight: bold;
`;

const ErrorLabel = styled.p`
    font-weight: bold;
    color: red;
`;