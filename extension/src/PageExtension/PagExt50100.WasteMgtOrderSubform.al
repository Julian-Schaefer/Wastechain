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
                        if "Waste Order Key WC" = '' then
                            Error('This line has not been commissioned.');

                        WasteOrderHistoryPage.SetWasteOrderKey("Waste Order Key WC");
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
                        if "Waste Order Key WC" = '' then
                            Error('This line has not been commissioned.');

                        if not Confirm(ConfirmCancelLbl) then
                            exit;

                        WastechainMgt.CancelWasteOrder("Waste Order Key WC");
                    end;
                }
            }
        }
    }
}