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
            }
        }
    }
}