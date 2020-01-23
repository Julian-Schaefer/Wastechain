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
                ShowCaption = false;
                InstructionalText = 'Please select the corresponding Business Partner for the MSP ID of the Originator.';

                Caption = 'MSP';

                field("Originator MSP ID"; WasteOrder."Originator MSP ID")
                {
                    Caption = 'Originator MSP ID';
                    Editable = false;
                    ApplicationArea = All;
                }

                group("MSP ID")
                {
                    Caption = 'Select Business Partner';

                    field("Business Partner No."; BusinessPartnerNo)
                    {
                        Caption = 'Business Partner No.';
                        TableRelation = "Business Partner WMR";
                        ApplicationArea = All;

                        trigger OnValidate()
                        var
                            BusinessPartner: Record "Business Partner WMR";
                            MSPIDNotMatchingErr: Label 'The Wastechain MSP ID of the selected Business Partner does not match the MSP ID of the Originator.';
                        begin
                            BusinessPartner.Get(BusinessPartnerNo);
                            if BusinessPartner."Wastechain MSP ID" <> WasteOrder."Originator MSP ID" then
                                Error(MSPIDNotMatchingErr);

                            EnableControls();
                        end;
                    }
                }
            }

            group("Step 2")
            {
                Visible = Step = 2;
                ShowCaption = false;
                InstructionalText = 'Please select the corresponding Service for the following Values.';

                field("Service Description"; WasteOrder."Service Description")
                {
                    Caption = 'Description';
                    Editable = false;
                    ApplicationArea = All;
                }

                field("Service Description 2"; WasteOrder."Service Description 2")
                {
                    Caption = 'Description 2';
                    Editable = false;
                    ApplicationArea = All;
                }

                field("Service Equipment Description"; WasteOrder."Service Equipment Description")
                {
                    Caption = 'Equipment Description';
                    Editable = false;
                    ApplicationArea = All;
                }

                field("Service Equipment Type"; WasteOrder."Service Equipment Type")
                {
                    Caption = 'Equipment Type';
                    OptionCaption = ' ,Submission,Pick-up,Exchange,Clearance,Purchase (Stock),Sales (Stock)';
                    Editable = false;
                    ApplicationArea = All;
                }

                field("Service Material Description"; WasteOrder."Service Material Description")
                {
                    Caption = 'Material Description';
                    Editable = false;
                    ApplicationArea = All;
                }

                field("Unit of Measure"; WasteOrder."Unit of Measure")
                {
                    Caption = 'Unit of Measure';
                    Editable = false;
                    ApplicationArea = All;
                }

                group("Select Service")
                {
                    Caption = 'Select Service';

                    field("Service No."; ServiceNo)
                    {
                        Caption = 'Service No.';
                        TableRelation = "Service WMR";
                        ApplicationArea = All;

                        trigger OnValidate()
                        begin
                            EnableControls();
                        end;
                    }
                }
            }

            group("Step 3")
            {
                Visible = Step = 3;
                ShowCaption = false;
                Editable = false;

                field("Business Partner No Overview"; BusinessPartnerNo)
                {
                    Caption = 'Business Partner No.';
                    TableRelation = "Business Partner WMR";
                    ApplicationArea = All;

                    trigger OnDrillDown()
                    var
                        BusinessPartner: Record "Business Partner WMR";
                    begin
                        BusinessPartner.Get(BusinessPartnerNo);
                        Page.RunModal(Page::"Business Partner Card WMR", BusinessPartner);
                    end;
                }

                field("Task Site No."; TaskSiteNo)
                {
                    Caption = 'Task Site No.';
                    TableRelation = "Task Site WMR";
                    ApplicationArea = All;

                    trigger OnDrillDown()
                    var
                        TaskSite: Record "Task Site WMR";
                    begin
                        TaskSite.Get(TaskSiteNo);
                        Page.RunModal(Page::"Task Site Card WMR", TaskSite);
                    end;
                }

                field("Service No Overview"; ServiceNo)
                {
                    Caption = 'Service No.';
                    TableRelation = "Service WMR";
                    ApplicationArea = All;

                    trigger OnDrillDown()
                    var
                        Service: Record "Service WMR";
                    begin
                        Service.Get(ServiceNo);
                        Page.RunModal(Page::"Service Card WMR", Service);
                    end;
                }
            }
        }
    }

    actions
    {
        area(Processing)
        {
            action(Back)
            {
                Caption = 'Back';
                Enabled = BackEnabled;
                ApplicationArea = All;
                InFooterBar = true;

                trigger OnAction()
                begin
                    Step -= 1;
                    EnableControls();
                end;
            }

            action(Next)
            {
                Caption = 'Next';
                Enabled = NextEnabled;
                ApplicationArea = All;
                InFooterBar = true;

                trigger OnAction()
                begin
                    Step += 1;
                    EnableControls();
                end;
            }

            action(Accept)
            {
                Caption = 'Accept';
                Enabled = AcceptEnabled;
                ApplicationArea = All;
                InFooterBar = true;

                trigger OnAction()
                var
                    WastechainMgt: Codeunit "Wastechain Management";
                begin
                    WastechainMgt.AcceptWasteOrder(WasteOrder, BusinessPartnerNo, TaskSiteNo, ServiceNo);
                    CurrPage.Close();
                end;
            }
        }
    }

    trigger OnInit()
    begin
        Step := 1;
    end;

    trigger OnOpenPage()
    var
        BusinessPartner: Record "Business Partner WMR";
    begin
        BusinessPartner.SetRange("Wastechain MSP ID", WasteOrder."Originator MSP ID");
        if BusinessPartner.FindFirst() then begin
            Step := 2;
            BusinessPartnerNo := BusinessPartner."No.";
        end;

        EnableControls();
    end;

    var
        Step: Integer;
        BackEnabled: Boolean;
        NextEnabled: Boolean;
        AcceptEnabled: Boolean;
        WasteOrder: Record "Waste Order WC";
        BusinessPartnerNo: Code[20];
        TaskSiteNo: Code[20];
        ServiceNo: Code[20];

    local procedure EnableControls()
    begin
        BackEnabled := false;
        NextEnabled := false;
        AcceptEnabled := false;

        case Step of
            1:
                ShowFirstStep();
            2:
                ShowSecondStep();
            3:
                ShowThirdStep();

        end;
    end;

    local procedure ShowFirstStep()
    begin
        if BusinessPartnerNo <> '' then
            NextEnabled := true;
    end;

    local procedure ShowSecondStep()
    var
        WastechainMgt: Codeunit "Wastechain Management";
    begin
        TaskSiteNo := WastechainMgt.FindOrCreateTaskSite(WasteOrder, BusinessPartnerNo);

        if ServiceNo <> '' then
            NextEnabled := true;

        BackEnabled := true;
    end;

    local procedure ShowThirdStep()
    begin
        if (ServiceNo <> '') and (BusinessPartnerNo <> '') and (TaskSiteNo <> '') then
            AcceptEnabled := true;

        BackEnabled := true;
    end;

    procedure SetWasteOrder(WasteOrder2: Record "Waste Order WC")
    begin
        WasteOrder := WasteOrder2;
    end;
}