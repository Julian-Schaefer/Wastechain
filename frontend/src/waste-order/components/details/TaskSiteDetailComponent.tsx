import React from "react";
import { Input, Row, Col } from 'antd';
import styled from "styled-components";
import { TaskSite } from "../../TaskSite";

interface TaskSiteDetailComponentProps {
    taskSite: TaskSite;
    onTaskSiteChanged: (taskSite: TaskSite) => void;
    editable: boolean;
}

export class TaskSiteDetailComponent extends React.Component<TaskSiteDetailComponentProps, { taskSite: TaskSite }> {

    constructor(props: TaskSiteDetailComponentProps) {
        super(props);

        this.state = {
            taskSite: props.taskSite
        };
    }

    private handleTaskSiteChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let change: any = {};
        change[name] = e.target.value;
        this.setState({
            taskSite: {
                ...this.state.taskSite,
                ...change
            }
        }, () => this.props.onTaskSiteChanged(this.state.taskSite));
    }

    render() {
        const { taskSite } = this.state;

        return (
            <Tab>
                <h2>Task Site</h2>
                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Name:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.name}
                            onChange={(e) => this.handleTaskSiteChange(e, 'name')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Name 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.name2}
                            onChange={(e) => this.handleTaskSiteChange(e, 'name2')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Address:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.address}
                            onChange={(e) => this.handleTaskSiteChange(e, 'address')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Address 2:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.address2}
                            onChange={(e) => this.handleTaskSiteChange(e, 'address2')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>
                </Row>

                <Row gutter={40} style={{ marginBottom: "20px" }}>
                    <Col span={4}>
                        <Label>Post Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.postCode}
                            onChange={(e) => this.handleTaskSiteChange(e, 'postCode')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>City:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.city}
                            onChange={(e) => this.handleTaskSiteChange(e, 'city')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>
                </Row>

                <Row gutter={40}>
                    <Col span={4}>
                        <Label>Country Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.countryCode}
                            onChange={(e) => this.handleTaskSiteChange(e, 'countryCode')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
                    </Col>

                    <Col span={4}>
                        <Label>Area Code:</Label>
                    </Col>
                    <Col span={8}>
                        <Input
                            value={taskSite.areaCode}
                            onChange={(e) => this.handleTaskSiteChange(e, 'areaCode')}
                            disabled={!this.props.editable}
                            allowClear={this.props.editable} />
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