page 50101 "Incoming Waste Orders WC"
{
    Caption = 'Incoming Waste Orders';
    PageType = List;
    ApplicationArea = All;
    UsageCategory = Lists;
    SourceTable = "Waste Order WC";
    SourceTableTemporary = true;
    Editable = false;

    layout
    {
        area(Content)
        {
            repeater(GroupName)
            {
                field("Key"; "Key")
                {
                    ApplicationArea = All;
                }

                field(Status; Status)
                {
                    ApplicationArea = All;
                }

                field(Description; Description)
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

                field("Originator MSP ID"; "Originator MSP ID")
                {
                    ApplicationArea = All;
                }

                field("Contractor MSP ID"; "Contractor MSP ID")
                {
                    ApplicationArea = All;
                }

                field("Service Description"; "Service Description")
                {
                    ApplicationArea = All;
                }

                field("Service Description 2"; "Service Description 2")
                {
                    ApplicationArea = All;
                }

                field("Task Site Address"; "Task Site Address")
                {
                    ApplicationArea = All;
                }

                field("Task Site Address 2"; "Task Site Address 2")
                {
                    ApplicationArea = All;
                }

                field("Task Site Post Code"; "Task Site Post Code")
                {
                    ApplicationArea = All;
                }

                field("Task Site City"; "Task Site City")
                {
                    ApplicationArea = All;
                }

                field("Task Site Country Code"; "Task Site Country Code")
                {
                    ApplicationArea = All;
                }

                field("Task Site Area Code"; "Task Site Area Code")
                {
                    ApplicationArea = All;
                }
            }
        }
    }

    actions
    {
        area(Processing)
        {

            action("Accept WC")
            {
                Caption = 'Accept';
                Image = Approve;

                trigger OnAction()
                var
                    AcceptWasteOrderWizard: Page "Accept Waste Order Wizard WC";
                begin
                    if Rec.Count = 0 then
                        Error('Please select a Waste Order.')
                    else
                        if Rec.Count > 1 then
                            Error('Please select only one Waste Order.');

                    AcceptWasteOrderWizard.SetWasteOrder(Rec);
                    AcceptWasteOrderWizard.RunModal();
                    Rec.DeleteAll();
                    RefreshPage();
                    CurrPage.Update(false);
                end;
            }

            action("Reject WC")
            {
                Caption = 'Reject';
                Image = Reject;

                trigger OnAction()
                var
                    ConfirmRejectionLbl: Label 'Do you really want to reject the selected Waste Order?';
                begin
                    if Rec.Count = 0 then
                        Error('Please select a Waste Order.')
                    else
                        if Rec.Count > 1 then
                            Error('Please select only one Waste Order.');

                    if not Confirm(ConfirmRejectionLbl) then
                        exit;

                    WastechainMgt.RejectWasteOrder(Rec);
                    RefreshPage();
                    CurrPage.Update(false);
                end;
            }
        }

        area(Navigation)
        {

            action("Show History WC")
            {
                Caption = 'Show History';
                Image = History;

                trigger OnAction()
                var
                    WasteOrderHistoryPage: Page "Waste Order Tx History WC";
                begin
                    WasteOrderHistoryPage.SetWasteOrderKey("Key");
                    WasteOrderHistoryPage.RunModal();
                end;
            }
        }
    }

    trigger OnOpenPage()
    begin
        RefreshPage();
    end;

    var
        WastechainMgt: Codeunit "Wastechain Management";
        WasteLine: Record "Waste Management Line";

    local procedure RefreshPage()
    begin
        Rec.DeleteAll();
        WastechainMgt.GetIncomingWasteOrders(Rec);
    end;

    procedure SetWasteLine(WasteLine2: Record "Waste Management Line")
    begin
        WasteLine := WasteLine2;
    end;
}