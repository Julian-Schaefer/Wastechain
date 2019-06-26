pageextension 50100 "Waste Mgt. Order Ext WC" extends "Waste Mgt. Order"
{
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
                    WastechainMgt.CreateWasteOrderOnBlockchain(Rec);
                end;
            }
        }
    }
}