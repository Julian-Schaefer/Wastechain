page 50106 "Reject Waste Order Wizard WC"
{
    PageType = NavigatePage;
    Caption = 'Reject Waste Order';

    layout
    {
        area(Content)
        {
            group(Rejection)
            {
                ShowCaption = false;

                field("Rejection Message"; RejectionMessage)
                {
                    Caption = 'Rejection Message';
                    ApplicationArea = All;

                    trigger OnValidate()
                    begin
                        if RejectionMessage <> '' then
                            RejectEnabled := true
                        else
                            RejectEnabled := false;
                    end;
                }
            }
        }
    }

    actions
    {
        area(Processing)
        {
            action(Cancel)
            {
                Caption = 'Cancel';
                ApplicationArea = All;
                InFooterBar = true;

                trigger OnAction()
                begin
                    CurrPage.Close();
                end;
            }

            action(Reject)
            {
                Caption = 'Reject';
                Enabled = RejectEnabled;
                ApplicationArea = All;
                InFooterBar = true;

                trigger OnAction()
                var
                    WastechainMgt: Codeunit "Wastechain Management";
                begin
                    WastechainMgt.RejectWasteOrder(WasteOrder, RejectionMessage);
                    CurrPage.Close();
                end;
            }
        }
    }

    var
        WasteOrder: Record "Waste Order WC";
        RejectionMessage: Text[250];
        RejectEnabled: Boolean;

    procedure SetWasteOrder(WasteOrder2: Record "Waste Order WC")
    begin
        WasteOrder := WasteOrder2;
    end;
}