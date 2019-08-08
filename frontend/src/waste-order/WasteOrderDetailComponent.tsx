import React from 'react';
import { WasteOrder } from '../model/WasteOrder';

export class WasteOrderDetailComponent extends React.Component<{ wasteOrder: WasteOrder }, { wasteOrder: WasteOrder }>{

    constructor(props: { wasteOrder: WasteOrder }) {
        super(props);
        this.state = {
            wasteOrder: props.wasteOrder
        };
    }

    render() {
        const { key, customerName, description } = this.state.wasteOrder;
        return (
            <div>
                <h1>{key}</h1>
                <h2>{customerName}</h2>
                <h2>{description}</h2>
            </div>
        );
    }
} 