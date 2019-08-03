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
                        WasteOrder: Record "Waste Order WC";
                        WastechainMgt: Codeunit "Wastechain Management";
                        ConfirmCommisionLbl: Label 'Do you want to commission the selected Line as Waste Order?';
                        RejectionCommissionLbl: Label 'This Waste Order has been rejected by the Subcontractor. Do you want to recommission it?';
                        PublishChangesLbl: Label 'This Waste Order has not been accepted or rejected by the Subcontractor yet. Do you want to publish the Changes?';
                        CantMakeChangesErr: Label 'You cannot make changes to a Waste Order with Status: %1';
                    begin
                        if "Waste Order Key WC" = '' then begin
                            if not Confirm(ConfirmCommisionLbl) then
                                exit;

                            WastechainMgt.CommissionWasteOrder(Rec);
                        end else begin
                            WastechainMgt.GetWasteOrder("Waste Order Key WC", WasteOrder);
                            if WasteOrder.Status = WasteOrder.Status::Rejected then begin
                                if not Confirm(RejectionCommissionLbl) then
                                    exit;
                            end else
                                if WasteOrder.Status = WasteOrder.Status::Commissioned then begin
                                    if not Confirm(PublishChangesLbl) then
                                        exit;
                                end else
                                    Error(CantMakeChangesErr, Format(WasteOrder.Status));

                            WastechainMgt.RecommissionWasteOrder(Rec);
                        end;
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