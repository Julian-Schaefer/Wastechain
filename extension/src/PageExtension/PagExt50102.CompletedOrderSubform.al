pageextension 50102 "Completed Order Subform Ext WC" extends "Completed Orders Subform"
{

    actions
    {
        addlast(processing)
        {
            group(Wastechain)
            {
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