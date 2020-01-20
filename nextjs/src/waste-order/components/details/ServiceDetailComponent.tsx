import React from "react";
import styled from "styled-components";
import { Input, Row, Col, Select } from 'antd';
import { Service } from '../../Service';

interface ServiceDetailComponentProps {
    service: Service;
    onServiceChanged: (service: Service) => void;
    editable: boolean;
}

export class ServiceDetailComponent extends React.Component<ServiceDetailComponentProps, { service: Service }> {

    constructor(props: ServiceDetailComponentProps) {
        super(props);

        this.state = {
            service: props.service
        };
    }

    private handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.setState({
            service: {
                ...this.state.service,
                ...change
            }
        }, () => this.props.onServiceChanged(this.state.service));
    }

    private handleEquipmentTypeChange = (type: number) => {
        this.setState({
            service: {
                ...this.state.service,
                equipmentType: type
            }
        }, () => this.props.onServiceChanged(this.state.service));
    }

    render() {
        const { service } = this.state;

        return (
            <Tab>
                <h2>Service</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.description}
                            onChange={(e) => this.handleServiceChange(e, 'description')}
                            allowClear={this.props.editable}
                            disabled={!this.props.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Description 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.description2}
                            onChange={(e) => this.handleServiceChange(e, 'description2')}
                            allowClear={this.props.editable}
                            disabled={!this.props.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Material Description:</Label>
                    </Col>
                    <Col span={20}>
                        <Input
                            value={service.materialDescription}
                            onChange={(e) => this.handleServiceChange(e, 'materialDescription')}
                            allowClear={this.props.editable}
                            disabled={!this.props.editable} />
                    </Col>
                </Row>

                <Row gutter={40}>
                    <Col span={4}>
                        <Label>Equipment Type:</Label>
                    </Col>
                    <Col span={8}>
                        <Select
                            defaultValue={service.equipmentType}
                            style={{ width: "100%" }}
                            onChange={this.handleEquipmentTypeChange}
                            disabled={!this.props.editable}>
                            <Select.Option value={0}>Submission</Select.Option>
                            <Select.Option value={1}>Pick-Up</Select.Option>
                            <Select.Option value={2}>Exchange</Select.Option>
                            <Select.Option value={3}>Clearance</Select.Option>
                        </Select>
                    </Col>

                    <Col span={4}>
                        <Label>Equipment Description:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={service.equipmentDescription}
                            onChange={(e) => this.handleServiceChange(e, 'equipmentDescription')}
                            allowClear={this.props.editable}
                            disabled={!this.props.editable} />
                    </Col>
                </Row>
            </Tab>
        );
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