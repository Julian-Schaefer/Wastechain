pageextension 50102 "Waste Mgt Order Subform Ext WC" extends "Waste Mgt Order Subform"
{
    actions
    {
        addlast(processing)
        {
            group(Wastechain)
            {
                action("Commission Order")
                {
                    Caption = 'Commission Order';

                    trigger OnAction()
                    var
                        WastechainMgt: Codeunit "Wastechain Management";
                    begin
                        WastechainMgt.CommissionWasteOrder(Rec);
                    end;
                }

                action("Show History")
                {
                    Caption = 'Show History';

                    trigger OnAction()
                    var
                        WasteOrderHistoryPage: Page "Waste Order Tx History WC";
                    begin
                        WasteOrderHistoryPage.SetWasteLine(Rec);
                        WasteOrderHistoryPage.RunModal();
                    end;
                }
            }
        }
    }

    trigger OnModifyRecord(): Boolean
    var
        WastechainMgt: Codeunit "Wastechain Management";
    begin
        if "Wastechain Key" = '' then
            exit;

        if (Rec.Quantity <> xRec.Quantity) or
           (Rec."Unit Price" <> xRec."Unit Price") then begin
            if Confirm('Do you also want to update the Waste Order on the Wastechain?') then
                WastechainMgt.UpdateWasteOrder(xRec, Rec);
        end;
    end;
}