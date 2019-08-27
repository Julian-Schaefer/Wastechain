import React from "react";
import styled from "styled-components";
import { get } from "./HttpClient";

interface Information {
    organisationMSPID: string;
    username: string;
}

interface HeaderComponentState {
    organisationMSPID?: string;
    username?: string;
}

export class HeaderComponent extends React.Component<{}, HeaderComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            organisationMSPID: undefined,
            username: undefined
        };
    }

    componentDidMount() {
        get('/settings/info').then((info: Information) => {
            this.setState({
                organisationMSPID: info.organisationMSPID,
                username: info.username
            })
        });
    }

    render() {
        return (
            <Container style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                <div style={{ float: "left" }}>
                    <Label>{this.state.organisationMSPID}</Label>
                </div>

                <div style={{ float: "right" }}>
                    <Label>Logged in as: <Bold>{this.state.username}</Bold></Label>
                </div>

                <div style={{ clear: "both" }} />
            </Container>
        )
    }
}

const Container = styled.div`
    background-color: #1890ff;
    width: 100%;
    height: 40px;
    color: white;
`;

const Label = styled.span`
    line-height: 40px;
`;

const Bold = styled.span`
    font-weight: bold;
`;