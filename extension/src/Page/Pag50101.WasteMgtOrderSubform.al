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
                    Enabled = ActionEnabled;

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
                        WasteOrderHistoryPage: Page "Waste Order History WC";
                    begin
                        WasteOrderHistoryPage.SetWasteLine(Rec);
                        WasteOrderHistoryPage.RunModal();
                    end;
                }
            }
        }
    }

    var
        ActionEnabled: Boolean;

    trigger OnAfterGetCurrRecord()
    begin
        if Description <> '' then
            ActionEnabled := true
        else
            ActionEnabled := false;
    end;
}