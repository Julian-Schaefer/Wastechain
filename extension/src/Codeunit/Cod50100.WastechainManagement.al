codeunit 50100 "Wastechain Management"
{

    procedure CommissionWasteOrder(WasteLine: Record "Waste Management Line")
    var
        BusinessPartner: Record "Business Partner";
    begin
        if WasteLine."Wastechain Key" <> '' then
            Error('Order %1 has already been commissioned.', WasteLine."Wastechain Key");

        BusinessPartner.Get(WasteLine."Post-with No.");
        BusinessPartner.TestField("Wastechain MSP ID");

        WastechainClientMgt.PostWasteOrder(WasteLine);
    end;

    var
        WastechainClientMgt: Codeunit "Wastechain Client Mgt. WC";
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}