page 50102 "Waste Order Tx History WC"
{
    Caption = 'Waste Order Transaction History';
    PageType = List;
    SourceTable = "Waste Order Transaction WC";
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

                field(Status; Status)
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
        TransactionHistoryText: Text;
    begin
        if WasteLine."Wastechain Key" = '' then
            Error('This line has not been commissioned.');

        TransactionHistoryText := WastechainClientMgt.GetWasteOrderHistoryAsText(WasteLine."Wastechain Key");
        WastechainJSONMgt.GetWasteOrderTransactionHistoryFromText(TransactionHistoryText, Rec);
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