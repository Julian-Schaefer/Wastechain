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

                field("Last Changed"; "Last Changed")
                {
                    ApplicationArea = All;
                }

                field("Last Changed by MSPID"; "Last Changed by MSPID")
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
        if WasteOrderKey = '' then
            Error('Please specify a Waste Order Key.');

        TransactionHistoryText := WastechainClientMgt.GetWasteOrderHistoryAsText(WasteOrderKey);
        WastechainJSONMgt.GetWasteOrderTransactionHistoryFromText(TransactionHistoryText, Rec);
    end;

    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
        WasteOrderKey: Text[250];

    procedure SetWasteOrderKey(WasteOrderKey2: Text)
    begin
        WasteOrderKey := WasteOrderKey2;
    end;
}