codeunit 50100 "Wastechain Management"
{

    procedure CommissionWasteOrder(WasteMgtLine: Record "Waste Management Line")
    var
        BusinessPartner: Record "Business Partner";
    begin
        if WasteMgtLine."Waste Order Key WC" <> '' then
            Error('Waste Order %1 has already been commissioned.', WasteMgtLine."Waste Order Key WC");

        WasteMgtLine.TestField("Unit Price");
        WasteMgtLine.TestField("Unit of Measure");
        WasteMgtLine.TestField("Posting Type", WasteMgtLine."Posting Type"::Purchase);
        BusinessPartner.Get(WasteMgtLine."Post-with No.");
        BusinessPartner.TestField("Wastechain MSP ID");
        WasteMgtLine.TestField("Bal. Acc. Post-with No.");
        WasteMgtLine.TestField("Bal. Acc. Task-at Code");

        WastechainClientMgt.PostWasteOrder(WasteMgtLine);
    end;

    procedure AcceptWasteOrder(WasteOrder: Record "Waste Order WC"; BusinessPartnerNo: Code[20]; BusinessPartnerSiteCode: Code[10]; ServiceNo: Code[20])
    var
        WasteMgtHeader: Record "Waste Management Header";
        WasteMgtLine: Record "Waste Management Line";
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteMgtHeader.Init();
        WasteMgtHeader.Validate("Document Type", WasteMgtHeader."Document Type"::Order);
        WasteMgtHeader.Validate("Business-with No.", BusinessPartnerNo);
        WasteMgtHeader.Insert(true);

        with WasteOrder do begin
            WasteMgtLine.Init();
            WasteMgtLine.Validate("Document Type", WasteMgtLine."Document Type"::Order);
            WasteMgtLine.Validate("Document No.", WasteMgtHeader."No.");
            WasteMgtLine.Validate("Type", WasteMgtLine.Type::Service);
            WasteMgtLine.Validate("No.", ServiceNo);
            WasteMgtLine.Validate(Quantity, Quantity);
            WasteMgtLine.Validate("Unit Price", "Unit Price");
            WasteMgtLine.Validate(Description, Description);
            WasteMgtLine.Validate("Posting Type", WasteMgtLine."Posting Type"::Sales);
            WasteMgtLine.Validate("Post-with No.", BusinessPartnerNo);
            WasteMgtLine.Validate("Invoice-with No.", BusinessPartnerNo);
            WasteMgtLine.Validate("Task-at Code", BusinessPartnerSiteCode);
            WasteMgtLine.Validate("Waste Order Key WC", "Key");
            WasteMgtLine.Insert(true);
        end;

        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderStatusUpdateSchemaJSON(WasteOrderStatus::Accepted);
        UpdateWasteOrder(WasteOrder."Key", WasteOrderUpdateJSON);
    end;

    procedure CancelWasteOrder(WasteOrderKey: Text)
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderStatusUpdateSchemaJSON(WasteOrderStatus::Cancelled);
        UpdateWasteOrder(WasteOrderKey, WasteOrderUpdateJSON);
    end;

    procedure RejectWasteOrder(WasteOrder: Record "Waste Order WC"; RejectionMessage: Text[250])
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderRejectionSchemaJSON(WasteOrderStatus::Rejected, RejectionMessage);
        UpdateWasteOrder(WasteOrder."Key", WasteOrderUpdateJSON);
    end;

    procedure CompleteWasteOrder(WasteMgtLine: Record "Waste Management Line")
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderCompleteSchemaJSON(WasteMgtLine, WasteOrderStatus::Commissioned);
        UpdateWasteOrder(WasteMgtLine."Waste Order Key WC", WasteOrderUpdateJSON);
    end;

    procedure RecommissionWasteOrder(WasteMgtLine: Record "Waste Management Line")
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderRecommissionSchemaJSON(WasteMgtLine, WasteOrderStatus::Commissioned);
        UpdateWasteOrder(WasteMgtLine."Waste Order Key WC", WasteOrderUpdateJSON);
    end;

    local procedure UpdateWasteOrder(WasteOrderKey: Text; WasteOrderUpdateJSON: JsonObject)
    begin
        if WasteOrderKey = '' then
            Error('Waste Order has not yet been commissioned. Please commission the Waste Order first. ');

        WastechainClientMgt.UpdateWasteOrder(WasteOrderKey, WasteOrderUpdateJSON);
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

    procedure GetWasteOrder(WasteOrderKey: Text; var WasteOrder: Record "Waste Order WC")
    var
        WasteOrderText: Text;
    begin
        WasteOrderText := WastechainClientMgt.GetWasteOrderAsText(WasteOrderKey);
        WastechainJSONMgt.GetWasteOrderFromText(WasteOrderText, WasteOrder);
    end;

    procedure GetIncomingWasteOrdersWithStatus(var WasteOrder: Record "Waste Order WC"; status: enum "Waste Order Status WC")
    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
        IncomingWasteOrdersText: Text;
    begin
        IncomingWasteOrdersText := WastechainClientMgt.GetIncomingWasteOrdersWithStatusAsText(status);
        WastechainJSONMgt.GetWasteOrdersFromText(IncomingWasteOrdersText, WasteOrder);
    end;

    procedure GetOutgoingWasteOrdersWithStatus(var WasteOrder: Record "Waste Order WC"; status: enum "Waste Order Status WC")
    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
        OutgoingWasteOrdersText: Text;
    begin
        OutgoingWasteOrdersText := WastechainClientMgt.GetOutgoingWasteOrdersWithStatusAsText(status);
        WastechainJSONMgt.GetWasteOrdersFromText(OutgoingWasteOrdersText, WasteOrder);
    end;


    var
        WasteOrderStatus: Enum "Waste Order Status WC";
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}