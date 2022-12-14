page 50105 "Outgoing Waste Orders WC"
{
    Caption = 'Outgoing Waste Orders';
    PageType = List;
    ApplicationArea = All;
    UsageCategory = Lists;
    SourceTable = "Waste Order WC";
    SourceTableTemporary = true;
    PromotedActionCategories = 'New,Process,Report,Manage,Navigate,Request Approval,Customer,Page';
    ModifyAllowed = false;
    InsertAllowed = false;
    DeleteAllowed = false;

    layout
    {
        area(Content)
        {
            group("Filter")
            {
                Caption = 'Filter';

                field("Status Filter"; StatusFilter)
                {
                    Caption = 'Status';

                    trigger OnValidate()
                    begin
                        RefreshPage();
                    end;
                }
            }

            repeater(GroupName)
            {
                Editable = false;

                field("ID"; "ID")
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

                field("Subcontractor MSP ID"; "Subcontractor MSP ID")
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

                field("Service Material Description"; "Service Material Description")
                {
                    ApplicationArea = All;
                }

                field("Service Equipment Type"; "Service Equipment Type")
                {
                    ApplicationArea = All;
                }

                field("Service Equipment Description"; "Service Equipment Description")
                {
                    ApplicationArea = All;
                }

                field("Task Site Name"; "Task Site Name")
                {
                    ApplicationArea = All;
                }

                field("Task Site Name 2"; "Task Site Name 2")
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

                field("Task Site Country Code"; "Task Site Country")
                {
                    ApplicationArea = All;
                }

                field("Task Site Area Code"; "Task Site Area")
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
            action("Cancel")
            {
                Caption = 'Cancel';
                Image = Cancel;
                Promoted = true;
                PromotedCategory = Category4;
                PromotedIsBig = true;
                PromotedOnly = true;
                Visible = (StatusFilter = StatusFilter::Commissioned) OR (StatusFilter = StatusFilter::Accepted);
                Enabled = ID <> '';
                ApplicationArea = All;

                trigger OnAction()
                var
                    ConfirmRejectionLbl: Label 'Do you really want to cancel the selected Waste Order?';
                begin
                    if not Confirm(ConfirmRejectionLbl) then
                        exit;

                    WastechainMgt.CancelWasteOrder("ID");
                    RefreshPage();
                end;
            }
        }

        area(Navigation)
        {
            action("Show History WC")
            {
                Caption = 'Show History';
                Image = History;
                Promoted = true;
                PromotedCategory = Category5;
                PromotedOnly = true;
                Enabled = "ID" <> '';
                ApplicationArea = All;

                trigger OnAction()
                var
                    WasteOrderHistoryPage: Page "Waste Order Tx History WC";
                begin
                    WasteOrderHistoryPage.SetWasteOrderID("ID");
                    WasteOrderHistoryPage.RunModal();
                end;
            }

            action("Show Waste Management Order")
            {
                Caption = 'Show Waste Management Order';
                Image = Document;
                Promoted = true;
                PromotedCategory = Category5;
                PromotedOnly = true;
                Enabled = "ID" <> '';
                ApplicationArea = All;

                trigger OnAction()
                var
                    WasteMgtLine: Record "Waste Management Line WMR";
                    WasteMgtHeader: Record "Waste Management Header WMR";
                    MultipleWasteOrdersFoundErr: Label 'Multiple Waste Management Orders have been found.';
                    NoWasteOrderFoundErr: Label 'No corresponding Waste Management Order has been found.';
                begin
                    WasteMgtLine.SetRange("Waste Order ID WC", "ID");
                    if WasteMgtLine.Count() = 1 then begin
                        WasteMgtLine.FindFirst();
                        WasteMgtHeader.SetRange("No.", WasteMgtLine."Document No.");
                        WasteMgtHeader.FindFirst();
                        Page.RunModal(0, WasteMgtHeader);
                    end else begin
                        if (WasteMgtLine.Count() > 1) then
                            Error(MultipleWasteOrdersFoundErr)
                        else
                            Error(NoWasteOrderFoundErr);
                    end;
                end;
            }
        }
    }

    trigger OnOpenPage()
    begin
        StatusFilter := StatusFilter::Commissioned;
        RefreshPage();
    end;

    var
        WastechainMgt: Codeunit "Wastechain Management";
        WasteLine: Record "Waste Management Line WMR";
        StatusFilter: enum "Waste Order Status WC";

    local procedure RefreshPage()
    begin
        DeleteAll();
        WastechainMgt.GetOutgoingWasteOrdersWithStatus(Rec, StatusFilter);
    end;

    procedure SetWasteLine(WasteLine2: Record "Waste Management Line WMR")
    begin
        WasteLine := WasteLine2;
    end;
}