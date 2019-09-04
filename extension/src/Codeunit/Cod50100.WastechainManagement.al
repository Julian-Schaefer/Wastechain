codeunit 50100 "Wastechain Management"
{

    procedure CommissionWasteOrder(WasteMgtLine: Record "Waste Management Line")
    begin
        if WasteMgtLine."Waste Order ID WC" <> '' then
            Error('Waste Order %1 has already been commissioned.', WasteMgtLine."Waste Order ID WC");

        CheckWasteMgtLine(WasteMgtLine, true);
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
            WasteMgtLine.Validate("Posting Type", WasteMgtLine."Posting Type"::Sales);
            WasteMgtLine.Validate("Post-with No.", BusinessPartnerNo);
            WasteMgtLine.Validate("Invoice-with No.", BusinessPartnerNo);
            WasteMgtLine.Validate("Task-at Code", BusinessPartnerSiteCode);
            WasteMgtLine.Validate("Price Fixed", true);
            WasteMgtLine.Validate(Quantity, Quantity);
            WasteMgtLine.Validate("Unit Price", "Unit Price");
            WasteMgtLine.Validate("Waste Order ID WC", "ID");
            WasteMgtLine.Insert(true);
        end;

        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderStatusUpdateSchemaJSON(WasteOrderStatus::Accepted);
        UpdateWasteOrder(WasteOrder."ID", WasteOrderUpdateJSON);
    end;

    procedure CancelWasteOrder(WasteOrderID: Text)
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderStatusUpdateSchemaJSON(WasteOrderStatus::Cancelled);
        UpdateWasteOrder(WasteOrderID, WasteOrderUpdateJSON);
    end;

    procedure RejectWasteOrder(WasteOrder: Record "Waste Order WC"; RejectionMessage: Text[250])
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderRejectionSchemaJSON(RejectionMessage);
        UpdateWasteOrder(WasteOrder."ID", WasteOrderUpdateJSON);
    end;

    procedure CompleteWasteOrder(WasteMgtLine: Record "Waste Management Line")
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        CheckWasteMgtLine(WasteMgtLine, false);

        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderCompleteSchemaJSON(WasteMgtLine);
        UpdateWasteOrder(WasteMgtLine."Waste Order ID WC", WasteOrderUpdateJSON);
    end;

    procedure CorrectWasteOrder(WasteMgtLine: Record "Waste Management Line")
    var
        WasteOrderUpdateJSON: JsonObject;
    begin
        CheckWasteMgtLine(WasteMgtLine, true);

        WasteOrderUpdateJSON := WastechainJSONMgt.CreateWasteOrderCorrectionSchemaJSON(WasteMgtLine);
        UpdateWasteOrder(WasteMgtLine."Waste Order ID WC", WasteOrderUpdateJSON);
    end;

    local procedure CheckWasteMgtLine(WasteMgtLine: Record "Waste Management Line"; Purchase: Boolean)
    var
        BusinessPartner: Record "Business Partner";
    begin

        WasteMgtLine.TestField("Unit Price");
        WasteMgtLine.TestField("Unit of Measure");
        if Purchase then
            WasteMgtLine.TestField("Posting Type", WasteMgtLine."Posting Type"::Purchase)
        else
            WasteMgtLine.TestField("Posting Type", WasteMgtLine."Posting Type"::Sales);
        BusinessPartner.Get(WasteMgtLine."Post-with No.");
        BusinessPartner.TestField("Wastechain MSP ID");

        if Purchase then begin
            WasteMgtLine.TestField("Bal. Acc. Post-with No.");
            WasteMgtLine.TestField("Bal. Acc. Task-at Code");
        end;
    end;

    local procedure UpdateWasteOrder(WasteOrderID: Text; WasteOrderUpdateJSON: JsonObject)
    begin
        if WasteOrderID = '' then
            Error('Waste Order has not yet been commissioned. Please commission the Waste Order first. ');

        WastechainClientMgt.UpdateWasteOrder(WasteOrderID, WasteOrderUpdateJSON);
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

    procedure GetWasteOrder(WasteOrderID: Text; var WasteOrder: Record "Waste Order WC")
    var
        WasteOrderText: Text;
    begin
        WasteOrderText := WastechainClientMgt.GetWasteOrderAsText(WasteOrderID);
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