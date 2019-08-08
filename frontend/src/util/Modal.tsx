import React from 'react';
import { Card } from 'antd';
import { Transition } from 'react-transition-group';

const duration = 300;

const backgroundDefaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    position: "fixed",
    backgroundColor: "lightgray",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    opacity: 0
}

const backgroundTransitionStyles: any = {
    entered: {
        opacity: 0.6
    },
    exited: {
        opacity: 0
    }
};

const cardDefaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    position: "fixed",
    top: "100%",
    left: "40%",
    width: "20%",
    height: "20%",
    border: "lightblue 2px solid",
    borderRadius: "8px"
}

const cardTransitionStyles: any = {
    entered: {
        top: "10%",
        left: "10%",
        width: "80%",
        height: "80%"
    },
    exited: {
        top: "100%",
        left: "40%",
        width: "20%",
        height: "20%"
    },
};

export class Modal extends React.Component<{ visible: boolean, onClose: () => void, onClosed: () => void }, { visible: boolean }> {

    constructor(props: { visible: boolean, onClose: () => void, onClosed: () => void }) {
        super(props);
        this.state = {
            visible: this.props.visible
        };
    }

    render() {
        return (
            <Transition in={this.props.visible} timeout={duration} onExited={this.props.onClosed} unmountOnExit>
                {state => (
                    <div>
                        <div
                            style={{
                                ...backgroundDefaultStyle,
                                ...backgroundTransitionStyles[state],
                            }}
                            onClick={this.props.onClose}>
                        </div >
                        <Card style={{
                            ...cardDefaultStyle,
                            ...cardTransitionStyles[state]
                        }}>
                            {this.props.children}
                        </Card>
                    </div>
                )}
            </Transition>
        );
    }
}