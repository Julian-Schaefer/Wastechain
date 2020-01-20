import React from "react";
import { Input, Row, Col, DatePicker, TimePicker } from 'antd';
import styled from "styled-components";
import { WasteOrder } from "../../WasteOrder";
import moment from 'moment';

interface WasteOrderDetailsComponentProps {
    wasteOrder: WasteOrder;
    onWasteOrderChanged: (property: string, value: string) => void;
    editable: boolean;
}

export class WasteOrderDetailsComponent extends React.Component<WasteOrderDetailsComponentProps, {}> {

    private handleTaskDateChange = (date: moment.Moment | null) => {
        this.props.onWasteOrderChanged('taskDate', date ? date.format('DD/MM/YYYY') : '');
    }

    private handleTimeChange = (name: string, timeString: string) => {
        this.props.onWasteOrderChanged(name, timeString);
    }

    render() {
        const { wasteOrder, editable, onWasteOrderChanged } = this.props;

        return (
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
                            onChange={(e) => onWasteOrderChanged('quantity', e.target.value)}
                            disabled={!editable}
                            allowClear={editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Task Date:</Label>
                    </Col>
                    <Col span={8}>
                        <DatePicker
                            value={wasteOrder.taskDate ? moment(wasteOrder.taskDate, 'DD/MM/YYYY') : undefined}
                            onChange={this.handleTaskDateChange}
                            disabled={!editable}
                            allowClear={editable}
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
                            onChange={(e) => onWasteOrderChanged('unitPrice', e.target.value)}
                            disabled={!editable}
                            allowClear={editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Unit of Measure:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={wasteOrder.unitOfMeasure}
                            onChange={(e) => onWasteOrderChanged('unitOfMeasure', e.target.value)}
                            disabled={!editable}
                            allowClear={editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Starting Time:</Label>
                    </Col>
                    <Col span={8}>
                        <TimePicker
                            value={wasteOrder.startingTime ? moment(wasteOrder.startingTime, 'HH:mm:ss') : undefined}
                            onChange={(_: moment.Moment, timeString: string) => this.handleTimeChange('startingTime', timeString)}
                            disabled={!editable}
                            allowClear={editable}
                            style={{ width: "100%" }}
                        />
                    </Col>

                    <Col span={4}>
                        <Label>Finishing Time:</Label>
                    </Col>
                    <Col span={8}>
                        <TimePicker
                            value={wasteOrder.finishingTime ? moment(wasteOrder.finishingTime, 'HH:mm:ss') : undefined}
                            onChange={(_: moment.Moment, timeString: string) => this.handleTimeChange('finishingTime', timeString)}
                            disabled={!editable}
                            allowClear={editable}
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
                            onChange={(e) => onWasteOrderChanged('referenceNo', e.target.value)}
                            disabled={!editable}
                            allowClear={editable} />
                    </Col>
                </Row>
            </Tab>
        )
    }
}

const Label = styled.p`
    line-height: 32px;
`;

const Tab = styled.div`
    border: rgb(217, 217, 217) 1px solid;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.19), 0 1px 1px rgba(0,0,0,0.23);
`;