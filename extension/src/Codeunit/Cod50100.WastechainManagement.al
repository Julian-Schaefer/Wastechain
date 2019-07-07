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

    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}