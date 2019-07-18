pageextension 50100 "Waste Mgt Order Subform Ext WC" extends "Waste Mgt Order Subform"
{
    actions
    {
        addlast(processing)
        {
            group(Wastechain)
            {
                action("Commission Waste Order WC")
                {
                    Caption = 'Commission Waste Order';
                    Image = SendTo;

                    trigger OnAction()
                    var
                        WastechainMgt: Codeunit "Wastechain Management";
                        ConfirmCommisionLbl: Label 'Do you want to commission the selected Line as Waste Order?';
                    begin
                        if not Confirm(ConfirmCommisionLbl) then
                            exit;

                        WastechainMgt.CommissionWasteOrder(Rec);
                    end;
                }

                action("Show History WC")
                {
                    Caption = 'Show History';
                    Image = History;

                    trigger OnAction()
                    var
                        WasteOrderHistoryPage: Page "Waste Order Tx History WC";
                    begin
                        if "Wastechain Key" = '' then
                            Error('This line has not been commissioned.');

                        WasteOrderHistoryPage.SetWastechainKey("Wastechain Key");
                        WasteOrderHistoryPage.RunModal();
                    end;
                }

                action("Cancel Waste Order WC")
                {
                    Caption = 'Cancel Waste Order';
                    Image = Cancel;

                    trigger OnAction()
                    var
                        WastechainMgt: Codeunit "Wastechain Management";
                        ConfirmCancelLbl: Label 'Do you really want to cancel the commissioned Waste Order?';
                    begin
                        if "Wastechain Key" = '' then
                            Error('This line has not been commissioned.');

                        if not Confirm(ConfirmCancelLbl) then
                            exit;

                        WastechainMgt.CancelWasteOrder("Wastechain Key");
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