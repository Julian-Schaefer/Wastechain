page 50103 "Accept Waste Order Wizard WC"
{
    PageType = NavigatePage;
    Caption = 'Accept Waste Order';

    layout
    {
        area(Content)
        {
            group("Step 1")
            {
                Visible = Step = 1;

                field(BusinessPartnerNo; BusinessPartnerNo)
                {
                    Caption = 'Business Partner No.';
                    TableRelation = "Business Partner";
                    ApplicationArea = All;
                }
            }
        }
    }

    actions
    {
        area(Navigation)
        {
            action(Back)
            {
                Caption = 'Back';
                Enabled = BackEnabled;
                ApplicationArea = All;

                trigger OnAction()
                begin

                end;
            }

            action(Next)
            {
                Caption = 'Next';
                Enabled = NextEnabled;
                ApplicationArea = All;

                trigger OnAction()
                begin

                end;
            }

            action(Finish)
            {
                Caption = 'Finish';
                Enabled = FinishEnabled;
                ApplicationArea = All;

                trigger OnAction()
                begin

                end;
            }
        }
    }

    trigger OnInit()
    begin
        Step := 1;
        BackEnabled := false;
        NextEnabled := false;
        FinishEnabled := false;
    end;

    var
        Step: Integer;
        BackEnabled: Boolean;
        NextEnabled: Boolean;
        FinishEnabled: Boolean;
        BusinessPartnerNo: Code[20];
}