import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";

interface HeaderComponentState {
    organisationMSPID: string;
    username: string;
}

export class HeaderComponent extends React.Component<{}, HeaderComponentState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            organisationMSPID: 'OrderingOrgMSP',
            username: 'Admin@ordering-org.com'
        };
    }

    render() {
        return (
            <Container style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                    <div style={{float: "left"}}>
                        <Label>{this.state.organisationMSPID}</Label>
                    </div>
                    
                    <div style={{float: "right"}}>
                        <p>Logged in as: <Label>{this.state.username}</Label></p>
                    </div>

                    <div style={{clear: "both"}} />
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
    font-weight: bold;
`;