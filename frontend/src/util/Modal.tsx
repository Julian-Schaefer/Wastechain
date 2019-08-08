import React from 'react';
import { Card } from 'antd';
import { WasteOrder } from '../model/WasteOrder';
import { Transition } from 'react-transition-group';

const duration = 300;

const backgroundDefaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
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
        opacity: 0.5
    },
    exited: {
        opacity: 0
    },
};

const cardDefaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    position: "fixed",
    top: "100%",
    left: "40%",
    width: "20%",
    height: "20%"
}

const cardTransitionStyles: any = {
    //   entering: { width: "10%", height: "10%" },
    entered: {
        top: "10%",
        left: "10%",
        width: "80%",
        height: "80%"
    },
    //  exiting: { opacity: 1, width: "80%", height: "80%" },
    exited: {
        top: "100%",
        left: "40%",
        width: "20%",
        height: "20%"
    },
};

export class MyModal extends React.Component<{ visible: boolean, onClose: () => void }, {}> {

    constructor(props: { visible: boolean, onClose: () => void }) {
        super(props);
    }

    render() {
        return (
            <Transition in={this.props.visible} timeout={duration} unmountOnExit>
                {state => (
                    <div>
                        <div
                            style={{
                                ...backgroundDefaultStyle,
                                ...backgroundTransitionStyles[state],
                            }}
                            onClick={this.props.onClose}>
                        </div >
                        <Card style={{ ...cardDefaultStyle, ...cardTransitionStyles[state] }}>
                            {this.props.children}
                        </Card>
                    </div>
                )}
            </Transition>
        );
    }
}