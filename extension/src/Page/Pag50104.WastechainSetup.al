page 50104 "Wastechain Setup WC"
{
    Caption = 'Wastechain Setup';
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = Administration;
    SourceTable = "Wastechain Setup WC";

    layout
    {
        area(Content)
        {
            group(General)
            {
                Caption = 'General';

                field("API URL"; "API URL")
                {
                    ApplicationArea = All;
                }
            }
        }
    }

    trigger OnOpenPage()
    begin
        Reset();

        if not Get() then begin
            Init();
            Insert();
        end;
    end;
}