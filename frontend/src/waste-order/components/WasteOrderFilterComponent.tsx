import React from "react";
import { Row, Col, Select } from 'antd';
import styled from 'styled-components';
import { WasteOrderStatus } from '../WasteOrder';

export enum WasteOrderFilterType {
    INCOMING,
    OUTGOING
}

interface WasteOrderFilterComponentProps {
    onTypeSelected: (type: WasteOrderFilterType) => void;
    onStatusSelected: (status: WasteOrderStatus) => void;
}

export class WasteOrderFilterComponent extends React.Component<WasteOrderFilterComponentProps, {}> {

    render() {
        return (
            <Row gutter={16}>
                <Col span={2}>
                    <Label>Type:</Label>
                </Col>

                <Col span={10}>
                    <Select
                        defaultValue={WasteOrderFilterType.INCOMING}
                        style={{ width: "100%" }}
                        onChange={(value: WasteOrderFilterType) => this.props.onTypeSelected(value)}>
                        <Select.Option value={WasteOrderFilterType.INCOMING}>Incoming</Select.Option>
                        <Select.Option value={WasteOrderFilterType.OUTGOING}>Outgoing</Select.Option>
                    </Select>
                </Col>

                <Col span={2}>
                    <Label>Status:</Label>
                </Col>

                <Col span={10}>
                    <Select
                        defaultValue={WasteOrderStatus.COMMISSIONED}
                        style={{ width: "100%" }}
                        onChange={(value: WasteOrderStatus) => this.props.onStatusSelected(value)}>
                        <Select.Option value={WasteOrderStatus.COMMISSIONED}>Commissioned</Select.Option>
                        <Select.Option value={WasteOrderStatus.ACCEPTED}>Accepted</Select.Option>
                        <Select.Option value={WasteOrderStatus.REJECTED}>Rejected</Select.Option>
                        <Select.Option value={WasteOrderStatus.CANCELLED}>Cancelled</Select.Option>
                        <Select.Option value={WasteOrderStatus.COMPLETED}>Completed</Select.Option>
                    </Select>
                </Col>
            </Row>
        );
    }
}

const Label = styled.p`
    line-height: 32px;
`;