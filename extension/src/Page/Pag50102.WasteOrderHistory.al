page 50102 "Waste Order History WC"
{
    PageType = List;
    SourceTable = "Waste Order WC";
    SourceTableTemporary = true;
    Editable = false;

    layout
    {
        area(Content)
        {
            repeater(GroupName)
            {
                field("Transaction ID"; "Transaction ID")
                {
                    ApplicationArea = All;
                }

                field("Transaction Timestamp"; "Transaction Timestamp")
                {
                    ApplicationArea = All;
                }

                field(Quantity; Quantity)
                {
                    ApplicationArea = All;
                }

                field("Unit Price"; "Unit Price")
                {
                    ApplicationArea = All;
                }
            }
        }
    }

    trigger OnOpenPage()
    var
        WasteOrderHistoryPage: Page "Waste Order History WC";
        HistoryText: Text;
    begin
        if WasteLine."Wastechain Key" = '' then
            Error('This line has not been commissioned.');

        HistoryText := WastechainClientMgt.GetWasteOrderHistoryAsText(WasteLine."Wastechain Key");
        Message(HistoryText);
        WastechainJSONMgt.GetWasteOrderHistoryFromText(HistoryText, Rec);
    end;

    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
        WasteLine: Record "Waste Management Line";

    procedure SetWasteLine(WasteLine2: Record "Waste Management Line")
    begin
        WasteLine := WasteLine2;
    end;
}