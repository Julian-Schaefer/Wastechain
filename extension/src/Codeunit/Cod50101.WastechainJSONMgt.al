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

    procedure GenerateUpdateWasteOrderJSON(OldWasteLine: Record "Waste Management Line"; NewWasteLine: Record "Waste Management Line"): JsonObject
    var
        Service: Record Service;
        WasteOrderJSON: JsonObject;
    begin
        if OldWasteLine.Quantity <> NewWasteLine.Quantity then
            WasteOrderJSON.Add('quantity', NewWasteLine.Quantity);

        if OldWasteLine."Unit Price" <> NewWasteLine."Unit Price" then
            WasteOrderJSON.Add('unitPrice', NewWasteLine."Unit Price");

        exit(WasteOrderJSON);
    end;

    procedure GetWasteOrderKey(WasteLine: Record "Waste Management Line"): Text
    begin
        exit(WasteLine."Document No." + '-' + Format(WasteLine."Line No."));
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

    procedure GetWasteOrderTransactionHistoryFromText(TransactionHistoryText: Text; var WasteOrder: Record "Waste Order WC" temporary)
    var
        TransactionHistoryJSONArray: JsonArray;
        TransactionJSONToken: JsonToken;
        ValueJSONToken: JsonToken;
        WasteOrderJSONToken: JsonToken;
        WasteOrderJSONObject: JsonObject;
    begin
        TransactionHistoryJSONArray.ReadFrom(TransactionHistoryText);
        foreach TransactionJSONToken in TransactionHistoryJSONArray do begin
            with WasteOrder do begin
                Init();
                TransactionJSONToken.AsObject().Get('txId', ValueJSONToken);
                "Transaction ID" := ValueJSONToken.AsValue().AsText();

                TransactionJSONToken.AsObject().Get('timestamp', ValueJSONToken);
                "Transaction Timestamp" := ValueJSONToken.AsValue().AsText();

                // Waste Order
                TransactionJSONToken.AsObject().Get('value', WasteOrderJSONToken);
                WasteOrderJSONObject := WasteOrderJSONToken.AsObject();

                WasteOrderJSONObject.Get('status', ValueJSONToken);
                Status := ValueJSONToken.AsValue().AsOption();

                WasteOrderJSONObject.Get('quantity', ValueJSONToken);
                Quantity := ValueJSONToken.AsValue().AsDecimal();

                WasteOrderJSONObject.Get('unitPrice', ValueJSONToken);
                "Unit Price" := ValueJSONToken.AsValue().AsDecimal();

                Insert();
            end;
        end;
    end;
}