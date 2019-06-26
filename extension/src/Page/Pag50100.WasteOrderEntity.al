page 50100 "Waste Order Entity WC"
{
    PageType = API;
    Caption = 'wasteOrder';
    APIPublisher = 'JulianSchaefer';
    APIGroup = 'wastechain';
    APIVersion = 'beta';
    EntityName = 'wasteOrder';
    EntitySetName = 'wasteOrders';
    SourceTable = "Waste Order WC";
    DelayedInsert = true;

    layout
    {
        area(Content)
        {
            repeater("Group")
            {
                field(id; Id)
                {
                    Caption = 'Id';
                    ApplicationArea = All;
                }

                field(description; Description)
                {
                    Caption = 'Id';
                    ApplicationArea = All;
                }

                field(address; Address)
                {
                    Caption = 'Id';
                    ApplicationArea = All;
                }
            }
        }
    }

    trigger OnInsertRecord(BelowxRec: Boolean): Boolean
    begin
        Insert(true);
    end;
}