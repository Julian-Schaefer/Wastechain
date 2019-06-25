pageextension 50100 "Waste Mgt. Order Ext WC" extends "Waste Mgt. Order"
{
    layout
    {
        // Add changes to page layout here
    }

    actions
    {
        addlast(Create)
        {
            action("Create on Blockchain")
            {
                ApplicationArea = All;

                trigger OnAction()
                var
                    WastechainMgt: Codeunit "Wastechain Management";
                begin
                    WastechainMgt.CreateWasteOrderOnBlockchain();
                end;
            }
        }
    }

    var
        myInt: Integer;
}