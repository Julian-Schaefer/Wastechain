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

                field("Unit of Measure"; "Unit of Measure")
                {
                    ApplicationArea = All;
                }

                field("Task Date"; "Task Date")
                {
                    ApplicationArea = All;
                }

                field("Starting Time"; "Starting Time")
                {
                    ApplicationArea = All;
                }

                field("Finishing Time"; "Finishing Time")
                {
                    ApplicationArea = All;
                }

                field("Rejection Message"; "Rejection Message")
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
        if WasteOrderID = '' then
            Error('Please specify a Waste Order ID.');

        TransactionHistoryText := WastechainClientMgt.GetWasteOrderHistoryAsText(WasteOrderID);
        WastechainJSONMgt.GetWasteOrderTransactionHistoryFromText(TransactionHistoryText, Rec);
    end;

    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
        WasteOrderID: Text[250];

    procedure SetWasteOrderID(WasteOrderID2: Text)
    begin
        WasteOrderID := WasteOrderID2;
    end;
}