codeunit 50101 "Wastechain JSON Mgt. WC"
{
    procedure GenerateCreateWasteOrderJSON(WasteLine: Record "Waste Management Line"): JsonObject
    var
        BusinessPartner: Record "Business Partner";
        BusinessPartnerSite: Record "Business Partner Site";
        Service: Record Service;
        WasteOrderJSON: JsonObject;
        TaskSiteJSON: JsonObject;
        ServiceJSON: JsonObject;
    begin
        with WasteLine do begin
            WasteOrderJSON.Add('description', Description);
            WasteOrderJSON.Add('quantity', Quantity);
            WasteOrderJSON.Add('unitPrice', "Unit Price");

            BusinessPartner.Get("Business-with No.");
            WasteOrderJSON.Add('contractorMSPID', BusinessPartner."Wastechain MSP ID");

            BusinessPartnerSite.Get("Post-with No.", "Task-at Code");
            TaskSiteJSON.Add('address', BusinessPartnerSite.Address);
            TaskSiteJSON.Add('address2', BusinessPartnerSite."Address 2");
            TaskSiteJSON.Add('postCode', BusinessPartnerSite."Post Code");
            TaskSiteJSON.Add('city', BusinessPartnerSite.City);
            TaskSiteJSON.Add('countryCode', BusinessPartnerSite."Country/Region Code");
            TaskSiteJSON.Add('areaCode', BusinessPartnerSite."Area Code");

            WasteOrderJSON.Add('taskSite', TaskSiteJSON);

            Service.Get("No.");
            ServiceJSON.Add('description', Service.Description);
            ServiceJSON.Add('description2', Service."Description 2");

            WasteOrderJSON.Add('service', ServiceJSON);
        end;

        exit(WasteOrderJSON);
    end;

    procedure GetWasteOrderKeyFromJSONText(JSONText: Text): Text
    var
        JSON: JsonObject;
        Token: JsonToken;
        TokenText: Text;
    begin
        JSON.ReadFrom(JSONText);
        JSON.Get('key', Token);
        exit(Token.AsValue().AsText());
    end;

    procedure GetWasteOrderHistoryFromText(HistoryText: Text; var WasteOrder: Record "Waste Order WC" temporary)
    var
        HistoryJSON: JsonArray;
        HistoryJSONToken: JsonToken;
    begin
        HistoryJSON.ReadFrom(HistoryText);
        foreach HistoryJSONToken in HistoryJSON do begin
            WasteOrder.Init();
            WasteOrder."Transaction ID" := HistoryJSONToken.Path;
            WasteOrder.Quantity := 12;
            WasteOrder.Insert();
        end;
    end;
}