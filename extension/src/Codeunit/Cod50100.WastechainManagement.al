codeunit 50100 "Wastechain Management"
{

    procedure CommissionWasteOrder(WasteLine: Record "Waste Management Line")
    var
        BusinessPartner: Record "Business Partner";
    begin
        if WasteLine."Wastechain Key" <> '' then
            Error('Waste Order %1 has already been commissioned.', WasteLine."Wastechain Key");

        BusinessPartner.Get(WasteLine."Post-with No.");
        BusinessPartner.TestField("Wastechain MSP ID");

        WastechainClientMgt.PostWasteOrder(WasteLine);
    end;

    procedure UpdateWasteOrder(OldWasteLine: Record "Waste Management Line"; NewWasteLine: Record "Waste Management Line")
    var
        WasteOrderJSON: JsonObject;
    begin
        if NewWasteLine."Wastechain Key" = '' then
            Error('Waste Order has not yet been commissioned. Please commission the Waste Order first. ', NewWasteLine."Wastechain Key");

        WasteOrderJSON := WastechainJSONMgt.GenerateUpdateWasteOrderJSON(OldWasteLine, NewWasteLine);
        WastechainClientMgt.UpdateWasteOrder(NewWasteLine."Wastechain Key", WasteOrderJSON);
    end;


    procedure FindOrCreateBusinessPartnerSite(WasteOrder: Record "Waste Order WC"; BusinessPartnerNo: Code[20]): Code[10]
    var
        BusinessPartnerSite: Record "Business Partner Site";
    begin
        with WasteOrder do begin
            BusinessPartnerSite.SetRange("Business Partner No.", BusinessPartnerNo);
            BusinessPartnerSite.SetRange(Address, "Task Site Address");
            BusinessPartnerSite.SetRange("Address 2", "Task Site Address 2");
            BusinessPartnerSite.SetRange("Post Code", "Task Site Post Code");
            BusinessPartnerSite.SetRange(City, "Task Site City");
            BusinessPartnerSite.SetRange("Country/Region Code", "Task Site Country Code");
            BusinessPartnerSite.SetRange("Area Code", "Task Site Area Code");
            if BusinessPartnerSite.FindFirst() then begin
                exit(BusinessPartnerSite.Code);
            end else begin
                BusinessPartnerSite.Init();
                BusinessPartnerSite.Validate("Business Partner No.", BusinessPartnerNo);
                BusinessPartnerSite.Insert(true);

                BusinessPartnerSite.Validate(Address, "Task Site Address");
                BusinessPartnerSite.Validate("Address 2", "Task Site Address 2");
                BusinessPartnerSite.Validate("Area Code", "Task Site Area Code");
                BusinessPartnerSite.Validate(City, "Task Site City");
                BusinessPartnerSite.Validate("Country/Region Code", "Task Site Country Code");
                BusinessPartnerSite.Validate("Post Code", "Task Site Post Code");
                BusinessPartnerSite.Validate("Name 2", 'Auto generated from Wastechain');
                BusinessPartnerSite.Modify();

                exit(BusinessPartnerSite.Code);
            end;
        end;
    end;


    procedure AcceptWasteOrder(WasteOrder: Record "Waste Order WC"; BusinessPartnerNo: Code[20]; BusinessPartnerSiteCode: Code[10]; ServiceNo: Code[20])
    var
        WasteMgtOrderHeader: Record "Waste Management Header";
        WasteMgtOrderLine: Record "Waste Management Line";
    begin
        WasteMgtOrderHeader.Init();
        WasteMgtOrderHeader.Validate("Document Type", WasteMgtOrderHeader."Document Type"::Order);
        WasteMgtOrderHeader.Validate("Business-with No.", BusinessPartnerNo);
        WasteMgtOrderHeader.Insert(true);

        with WasteOrder do begin
            WasteMgtOrderLine.Init();
            WasteMgtOrderLine.Validate("Document Type", WasteMgtOrderLine."Document Type"::Order);
            WasteMgtOrderLine.Validate("Document No.", WasteMgtOrderHeader."No.");
            WasteMgtOrderLine.Validate("Type", WasteMgtOrderLine.Type::Service);
            WasteMgtOrderLine.Validate("No.", ServiceNo);
            WasteMgtOrderLine.Validate(Quantity, Quantity);
            WasteMgtOrderLine.Validate("Unit Price", "Unit Price");
            WasteMgtOrderLine.Validate(Description, Description);
            WasteMgtOrderLine.Validate("Posting Type", WasteMgtOrderLine."Posting Type"::Sales);
            WasteMgtOrderLine.Validate("Post-with No.", BusinessPartnerNo);
            WasteMgtOrderLine.Validate("Invoice-with No.", BusinessPartnerNo);
            WasteMgtOrderLine.Validate("Task-at Code", BusinessPartnerSiteCode);
            WasteMgtOrderLine.Insert(true);
        end;

        WastechainClientMgt.UpdateWasteOrderStatus(WasteOrder, WasteOrder.Status::Accepted);
    end;

    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}