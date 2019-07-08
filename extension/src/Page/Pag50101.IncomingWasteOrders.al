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
}