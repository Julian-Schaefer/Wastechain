pageextension 50102 "Completed Order Subform Ext WC" extends "Completed Orders Subform WMR"
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
                        if "Waste Order ID WC" = '' then
                            Error('This line has not been commissioned.');

                        WasteOrderHistoryPage.SetWasteOrderID("Waste Order ID WC");
                        WasteOrderHistoryPage.RunModal();
                    end;
                }
            }
        }
    }
}